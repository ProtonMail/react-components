import React from 'react';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { FEATURE_FLAGS } from 'proton-shared/lib/constants';
import humanSize from 'proton-shared/lib/helpers/humanSize';

import './AppsDropdown.scss';

import { useUser } from '../../hooks/useUser';
import useConfig from '../config/useConfig';
import Link from '../../components/link/Link';
import Icon from '../../components/icon/Icon';
import SimpleDropdown from '../../components/dropdown/SimpleDropdown';
import Meter from '../../components/progress/Meter';

const { PROTONMAIL, PROTONCONTACTS, PROTONMAIL_SETTINGS, PROTONCALENDAR, PROTONDRIVE } = APPS;

const AppsDropdown = () => {
    const [user] = useUser();
    const { APP_NAME } = useConfig();
    const { UsedSpace, MaxSpace } = user;
    const spacePercentage = Math.round((UsedSpace * 100) / MaxSpace);
    const spaceHuman = `${humanSize(UsedSpace)} / ${humanSize(MaxSpace)}`;

    const apps = [
        { appNames: [PROTONMAIL, PROTONMAIL_SETTINGS], icon: 'protonmail', title: 'ProtonMail', link: '/inbox' },
        { appNames: [PROTONCONTACTS], icon: 'protoncontacts', title: 'ProtonContacts', link: '/contacts' },
        {
            appNames: [PROTONCALENDAR],
            icon: 'protoncalendar',
            title: 'ProtonCalendar',
            link: '/calendar'
        },
        FEATURE_FLAGS.includes('drive') && {
            appNames: [PROTONDRIVE],
            icon: 'protondrive',
            title: 'ProtonDrive',
            link: '/drive'
        }
    ].filter(isTruthy);

    return (
        <SimpleDropdown
            hasCaret={false}
            content={<Icon name="more" className="appsDropdown-button-icon" />}
            className="appsDropdown-button"
            dropdownClassName="appsDropdown-container"
            originalPlacement="bottom-right"
        >
            <ul className="appsDropdown-list unstyled m0 scroll-if-needed">
                {apps.map(({ appNames = [], icon, title, link }, index) => {
                    const isCurrent = appNames.includes(APP_NAME);
                    const key = `${index}`;
                    return (
                        <li className="dropDown-item appsDropdown-item" key={key}>
                            <Link
                                to={link}
                                className="appsDropdown-link p1 pt0-75 pb0-75 flex flex-nowrap flex-items-center"
                                external={!isCurrent}
                                target="_blank"
                                aria-current={isCurrent}
                                title={title}
                            >
                                <Icon name={icon} className="mr0-5" />
                                <span>{title}</span>
                            </Link>
                        </li>
                    );
                })}
                <li className="dropDown-item appsDropdown-item">
                    <Link
                        to="/account"
                        target="_blank"
                        external={true}
                        className="appsDropdown-link bl p1 pt0-75 pb0-75"
                        title={c('Apps dropdown').t`Your account`}
                    >
                        <span className="flex flex-nowrap flex-items-center">
                            <Icon name="account" className="mr0-5" />
                            <span>{c('Apps dropdown').t`Account`}</span>
                        </span>
                        <div className="ml1-5">
                            <Meter className="meterbar is-thin mt0-25" value={spacePercentage} />
                            <div className="smaller m0 opacity-50">{spaceHuman}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </SimpleDropdown>
    );
};

export default AppsDropdown;
