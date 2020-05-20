import React from 'react';
import { c } from 'ttag';
import { Bordered, Loader, Alert, classnames, DropdownActions, PrimaryButton } from 'react-components';
import { IncomingDefault } from 'proton-shared/lib/interfaces/IncomingDefault';
import { WHITELIST_LOCATION, BLACKLIST_LOCATION } from 'proton-shared/lib/constants';

import './SpamListItem.scss';

type WHITE_BLACK_LOCATION = WHITELIST_LOCATION | BLACKLIST_LOCATION;

interface Props {
    list: IncomingDefault[];
    type: WHITE_BLACK_LOCATION;
    loading: boolean;
    className?: string;
    onCreate: (type: WHITE_BLACK_LOCATION) => void;
    onEdit: (type: WHITE_BLACK_LOCATION, incomingDefault: IncomingDefault) => void;
    onMove: (incomingDefault: IncomingDefault) => void;
    onRemove: (incomingDefault: IncomingDefault) => void;
}

function SpamListItem({ list, type, onCreate, onEdit, onMove, onRemove, className, loading }: Props) {
    const I18N = {
        [WHITELIST_LOCATION]: c('Title').t`Whitelist`,
        [BLACKLIST_LOCATION]: c('Title').t`Blacklist`,
        empty(mode: WHITE_BLACK_LOCATION) {
            const type = this[mode];
            return c('Info').t`No emails in the ${type}, click Add to add addresses to the ${type}`;
        }
    };

    return (
        <Bordered className={classnames(['flex-item-fluid', className])}>
            <header className="flex flex-spacebetween flex-items-center">
                <h3 className="mb0">{I18N[type]}</h3>
                <div>
                    <PrimaryButton type={type} onClick={() => onCreate(type)}>{c('Action').t`Add`}</PrimaryButton>
                </div>
            </header>

            {loading ? (
                <Loader />
            ) : (
                <ul className="unstyled scroll-if-needed SpamListItem-list m0 mt1">
                    {list.map((item) => {
                        return (
                            <li className="flex flex-nowrap flex-spacebetween mb0-5" key={item.ID}>
                                <span className="ellipsis">{item.Email}</span>
                                <DropdownActions
                                    className="pm-button--small mlauto"
                                    list={[
                                        {
                                            text: c('Action').t`Edit`,
                                            onClick() {
                                                onEdit(type, item);
                                            }
                                        },
                                        {
                                            text: c('Action').t`Move`,
                                            onClick() {
                                                onMove(item);
                                            }
                                        },
                                        {
                                            text: c('Action').t`Delete`,
                                            onClick() {
                                                onRemove(item);
                                            }
                                        }
                                    ]}
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
            {!list.length && !loading && <Alert>{I18N.empty(type)}</Alert>}
        </Bordered>
    );
}

export default SpamListItem;
