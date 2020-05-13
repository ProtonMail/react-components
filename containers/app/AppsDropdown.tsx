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
import Progress from '../../components/progress/Progress';

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
        >
            <ul className="appsDropdown-list unstyled m0 border-bottom scroll-if-needed">
                {apps.map(({ appNames = [], icon, title, link }, index) => {
                    const isCurrent = appNames.includes(APP_NAME);
                    const key = `${index}`;
                    return (
                        <li className="dropDown-item appsDropdown-item" key={key} title={title}>
                            <Link
                                to={link}
                                className="appsDropdown-link w100 p1 bl nodecoration flex flex-nowrap flex-items-center"
                                external={!isCurrent}
                                target="_blank"
                                aria-current={isCurrent}
                            >
                                <Icon name={icon} className="mr0-5" />
                                <span>{title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="pr1 pl1 pt0-5 pb0-5">
                <Link
                    to="/account"
                    target="_blank"
                    external={true}
                    className="flex flex-nowrap flex-items-center nodecoration"
                >
                    <Icon name="account" className="mr0-5" />
                    <span>Account</span>
                </Link>
                <div>
                    <Progress value={spacePercentage} />
                    <div className="small m0">
                        <span className="opacity-50 mr0-5">{spaceHuman}</span>
                        <Link to="/settings/dashboard" target="_blank" external={true}>{c('Link').t`Add storage`}</Link>
                    </div>
                </div>
            </div>
        </SimpleDropdown>
    );
};

export default AppsDropdown;
