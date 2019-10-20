import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContactEmailsModel, ContactsModel, UserModel } from 'proton-shared/lib/models';
import { useEventManager, useCache } from 'react-components';
import { STATUS } from 'proton-shared/lib/models/cache';
import { SubscriptionModel } from 'proton-shared/lib/models/subscriptionModel';
import { OrganizationModel } from 'proton-shared/lib/models/organizationModel';
import { MembersModel } from 'proton-shared/lib/models/membersModel';
import { EVENT_ERRORS } from 'proton-shared/lib/errors';
import { hasBit } from 'proton-shared/lib/helpers/bitset';
import { AddressesModel } from 'proton-shared/lib/models/addressesModel';

const EventModelListener = ({ models }) => {
    const { subscribe } = useEventManager();
    const cache = useCache();

    useEffect(() => {
        const modelsMap = models.reduce((acc, model) => {
            return {
                ...acc,
                [model.key]: model
            };
        }, {});

        return subscribe((data) => {
            for (const key of Object.keys(data)) {
                const model = modelsMap[key];
                if (!model) {
                    continue;
                }

                const { value: oldValue, status } = cache.get(key) || {};

                if (status === STATUS.PENDING) {
                    throw new Error('Event manager tried to update a pending model');
                }

                if (status === STATUS.RESOLVED) {
                    cache.set(key, {
                        status: STATUS.RESOLVED,
                        value: model.update(oldValue, data[key])
                    });
                }
            }

            if (hasBit(data.Refresh, EVENT_ERRORS.CONTACTS)) {
                cache.delete(ContactsModel.key);
                cache.delete(ContactEmailsModel.key);
            }

            // If user model was changed.
            if (data[UserModel.key]) {
                const { value: user } = cache.get(UserModel.key);
                // Do not get any events for these models, so delete them.
                if (user.isFree) {
                    cache.delete(SubscriptionModel.key);
                    cache.delete(OrganizationModel.key);
                    cache.delete(MembersModel.key);
                }
                // Since the keys could have changed, clear the cached keys.
                cache.delete('userKeys');
            }

            if (data[AddressesModel.key]) {
                // Since the keys could have changed, clear the cached keys.
                cache.delete('addressesKeys');
            }

            if (data.CalendarKeys && cache.get('calendarBootstrap')) {
                const calendarBootstrapCache = cache.get('calendarBootstrap');
                const calendarKeysCache = cache.get('calendarKeys');

                const deleteCalendarFromCache = (calendarID) => {
                    if (calendarBootstrapCache) {
                        cache.delete(calendarID);
                    }
                    if (calendarKeysCache) {
                        cache.delete(calendarID);
                    }
                };

                data.CalendarKeys.forEach(({ ID: KeyID, Key }) => {
                    // When a new calendar key is received, the entire calendar cache is invalidated.
                    // TODO: Fix this by merging the bootstrapped version with the result.
                    if (Key && Key.CalendarID) {
                        deleteCalendarFromCache(Key.CalendarID);
                        return;
                    }
                    // For delete events, the calendar ID is not received, so find if this calendar exists.
                    for (const [calendarID, record] of calendarBootstrapCache) {
                        // The old bootstrapped result
                        if (
                            record &&
                            record.value &&
                            Array.isArray(record.value.Keys) &&
                            record.value.Keys.find(({ ID: otherID }) => otherID === KeyID)
                        ) {
                            deleteCalendarFromCache(calendarID);
                            break;
                        }
                    }
                });
            }
        });
    }, []);

    return null;
};

EventModelListener.propTypes = {
    models: PropTypes.array.isRequired
};

export default EventModelListener;
