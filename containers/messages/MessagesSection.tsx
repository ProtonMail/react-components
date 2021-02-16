import React, { useState } from 'react';
import { c } from 'ttag';

import { SHOW_IMAGES } from 'proton-shared/lib/constants';

import { Row, Field, Label, Info } from '../../components';
import { useMailSettings } from '../../hooks';

import RemoteToggle from './RemoteToggle';
import EmbeddedToggle from './EmbeddedToggle';
import ShowMovedToggle from './ShowMovedToggle';
import RequestLinkConfirmationToggle from './RequestLinkConfirmationToggle';
import DelaySendSecondsSelect from './DelaySendSecondsSelect';

const { EMBEDDED } = SHOW_IMAGES;

const MessagesSection = () => {
    const [{ ShowImages = EMBEDDED, ConfirmLink = 1, DelaySendSeconds = 10 } = {}] = useMailSettings();
    const [showImages, setShowImages] = useState(ShowImages);
    const handleChange = (newValue: number) => setShowImages(newValue);

    return (
        <>
            <Row>
                <Label htmlFor="remoteToggle" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Auto-load remote content`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/images-by-default/"
                        title={c('Info')
                            .t`When disabled, this prevents all files from loading on your device without your knowledge.	`}
                    />
                </Label>
                <Field className="pt0-5">
                    <RemoteToggle id="remoteToggle" showImages={showImages} onChange={handleChange} />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="embeddedToggle" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Auto-load embedded images`}</span>
                    <Info
                        url="https://protonmail.com/support/knowledge-base/images-by-default/"
                        title={c('Info')
                            .t`When disabled, this prevents image files from loading on your device without your knowledge.`}
                    />
                </Label>
                <Field className="pt0-5">
                    <EmbeddedToggle id="embeddedToggle" showImages={showImages} onChange={handleChange} />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="showMovedToggle" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Keep messsages in Sent/Drafts`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Messages in the Sent or Drafts folder will continue to appear in that folder, even if you move them to another folder.`}
                    />
                </Label>
                <Field className="pt0-5">
                    <ShowMovedToggle id="showMovedToggle" />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="requestLinkConfirmationToggle" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Link confirmation`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`When you click on a link, this anti-phishing feature will ask you to confirm the URL of the web page.`}
                    />
                </Label>
                <Field className="pt0-5">
                    <RequestLinkConfirmationToggle confirmLink={ConfirmLink} id="requestLinkConfirmationToggle" />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="delaySendSecondsSelect" className="text-semibold">
                    <span className="mr0-5">{c('Label').t`Undo send`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`This feature delays sending your emails, giving you the opportunity to undo send during the selected time frame.`}
                    />
                </Label>
                <Field>
                    <DelaySendSecondsSelect id="delaySendSecondsSelect" delaySendSeconds={DelaySendSeconds} />
                </Field>
            </Row>
        </>
    );
};

export default MessagesSection;
