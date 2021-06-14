import React, { useEffect, useState, RefObject } from 'react';
import { c } from 'ttag';
import { getSecondLevelDomain } from 'proton-shared/lib/helpers/url';
import { MailSettings } from 'proton-shared/lib/interfaces';
import { isIE11, isEdge } from 'proton-shared/lib/helpers/browser';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { PROTON_DOMAINS } from 'proton-shared/lib/constants';

import { isExternal, isSubDomain, getHostname } from '../helpers/url';
import { useModals, useNotifications, useMailSettings, useHandler } from './index';
import LinkConfirmationModal from '../components/notifications/LinkConfirmationModal';

// Reference : Angular/src/app/utils/directives/linkHandler.js

interface LinkSource {
    raw: string;
    encoded?: string;
}

export const useLinkHandler = (wrapperRef: RefObject<HTMLDivElement>, onMailTo?: (src: string) => void) => {
    const [mailSettings] = useMailSettings() as [MailSettings | undefined, boolean, Error];
    const { createModal } = useModals();
    const { createNotification } = useNotifications();

    const [confirmationModalID, setConfirmationModalID] = useState<number>();

    const getSrc = (target: Element): LinkSource => {
        const extract = () => {
            try {
                return { encoded: target.toString() || '', raw: target.getAttribute('href') || '' };
            } catch (e) {
                /*
                    Because for Edge/IE11
                    <a href="http://xn--rotonmail-4sg.com" rel="noreferrer nofollow noopener">Protonmail.com</a>
                    will crash --> Unspecified error. ¯\_(ツ)_/¯
                    Don't worry, target.href/getAttribute will crash too ¯\_(ツ)_/¯
                    Ivre, ...
                 */
                const attr = Array.from(target.attributes).find((attr) => (attr || {}).name === 'href');
                return { raw: attr?.nodeValue || '' };
            }
        };

        // Because even the fallback canq crash on IE11/Edge. (Now it's a matter of random env issue...)
        try {
            return extract();
        } catch (e) {
            createNotification({
                text: c('Error')
                    .t`This message may contain some link's URL that cannot be properly opened by your current browser`,
                type: 'error',
            });
            return { raw: '' };
        }
    };

    /**
     * Encode the URL to Remove the punycode from it
     * @param  {String} options.raw     getAttribute('href') -> browser won't encode it
     * @param  {String} options.encoded toString() -> encoded value  USVString
     * @return {String}
     */
    const encoder = async ({ raw = '', encoded }: LinkSource) => {
        // https://en.wikipedia.org/wiki/Punycode#Internationalized_domain_names
        const noEncoding = isIE11() || isEdge() || !/:\/\/xn--/.test(encoded || raw);

        /*
            Fallback, Some browsers don't support USVString at all (IE11, Edge)
            Or when the support is "random".
            Ex: PaleMoon (FF ESR 52) works well BUT for one case, where it's broken cf https://github.com/MoonchildProductions/UXP/issues/1125
            Then when we detect there is no encoding done, we use the lib.
         */
        if (noEncoding) {
            const { punycode } = await import(/* webpackChunkName: "vendorEncoder.module" */ './helpers/vendorEncoder');

            // Sometimes there is a queryParam with https:// inside so, we need to add them too :/
            const [protocol, url = '', ...tracking] = raw.split('://');

            const parser = (input: string) => {
                // Sometimes Blink is enable to decode the URL to convert it again
                const uri = !input.startsWith('%') ? input : decodeURIComponent(input);
                return uri.split('/').map(punycode.toASCII).join('/');
            };

            const newUrl = [url, ...tracking].map(parser).join('://');
            return `${protocol}://${newUrl}`;
        }
        return encoded;
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const handleClick = useHandler(async (event: Event) => {
        const originalTarget = event.target as Element;
        const target = originalTarget.closest('a');

        if (!target) {
            return;
        }

        const src = getSrc(target);

        // IE11 and Edge random env bug... (╯°□°）╯︵ ┻━┻
        if (!src) {
            event.preventDefault();
            return false;
        }

        // We only handle anchor that begins with `mailto:`
        if (src.raw.toLowerCase().startsWith('mailto:') && onMailTo) {
            event.preventDefault();
            event.stopPropagation(); // Required for Safari

            /*
             * Open the composer with the given mailto address
             * position isAfter true as the user can choose to set a body
             */
            onMailTo(src.raw);
        }

        const askForConfirmation = mailSettings?.ConfirmLink === undefined ? 1 : mailSettings?.ConfirmLink;
        const hostname = getHostname(src.raw);
        const currentDomain = getSecondLevelDomain();

        /*
         * If the modal is already active --- do nothing
         * ex: click on a link, open the modal, inside the contnue button is an anchor with the same link.
         * Don't change anchors behavior
         */
        if (confirmationModalID !== undefined || src.raw.startsWith('#')) {
            return;
        }

        if (
            askForConfirmation &&
            isExternal(src.raw) &&
            ![...PROTON_DOMAINS, currentDomain]
                .filter(isTruthy) // currentDomain can be null
                .some((domain) => isSubDomain(hostname, domain))
        ) {
            event.preventDefault();
            event.stopPropagation(); // Required for Safari

            const link = await encoder(src);

            const modalId = createModal(
                <LinkConfirmationModal link={link} onClose={() => setConfirmationModalID(undefined)} />
            );

            setConfirmationModalID(modalId);
        }
    });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        wrapperRef.current?.addEventListener('click', handleClick, false);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return () => wrapperRef.current?.removeEventListener('click', handleClick, false);
    }, []);
};
