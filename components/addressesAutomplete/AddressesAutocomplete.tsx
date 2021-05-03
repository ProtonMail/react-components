import { canonizeEmail } from 'proton-shared/lib/helpers/email';
import React, { useCallback, useMemo, useState } from 'react';
import { ContactEmail, ContactGroup } from 'proton-shared/lib/interfaces/contacts';
import { Recipient } from 'proton-shared/lib/interfaces';
import { inputToRecipient } from 'proton-shared/lib/mail/recipient';
import { SimpleMap } from 'proton-shared/lib/interfaces/utils';
import { noop } from 'proton-shared/lib/helpers/function';
import { c, msgid } from 'ttag';

import Input, { Props as InputProps } from '../input/Input';
import { Option } from '../option';
import { Marks } from '../text';
import { useAutocomplete, useAutocompleteFilter, AutocompleteList } from '../autocomplete';
import {
    getRecipientFromAutocompleteItem,
    AddressesAutocompleteItem,
    getContactsAutocompleteItems,
    getContactGroupsAutocompleteItems,
    getMajorListAutocompleteItems,
} from './helper';
import Icon from '../icon/Icon';

interface Props extends Omit<InputProps, 'value'> {
    id: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onAddRecipients: (recipients: Recipient[]) => void;
    recipients: Recipient[];
    anchorRef: React.RefObject<HTMLElement>;
    contactEmails?: ContactEmail[];
    contactGroups?: ContactGroup[];
    contactEmailsMap?: SimpleMap<ContactEmail>;
    groupsWithContactsMap?: any;
    hasEmailPasting?: boolean;
    hasAddOnBlur?: boolean;
    limit?: number;
    onAddInvalidEmail?: () => void;
    validate?: (email: string) => string | void;
}

const AddressesAutocomplete = React.forwardRef<HTMLInputElement, Props>(
    (
        {
            contactEmails,
            contactEmailsMap,
            contactGroups,
            groupsWithContactsMap,
            id,
            onKeyDown,
            recipients,
            onAddRecipients,
            anchorRef,
            hasEmailPasting = false,
            hasAddOnBlur = false,
            limit = 20,
            onAddInvalidEmail,
            onChange,
            validate = noop,
            ...rest
        }: Props,
        ref
    ) => {
        const [input, setInput] = useState('');
        const [emailError, setEmailError] = useState('');

        const [recipientsByAddress, recipientsByGroup] = useMemo(() => {
            return recipients.reduce<[Set<string>, Set<string>]>(
                (acc, { Address, Group }) => {
                    if (Address) {
                        acc[0].add(canonizeEmail(Address));
                    }
                    if (Group) {
                        acc[1].add(Group);
                    }
                    return acc;
                },
                [new Set(), new Set()]
            );
        }, [recipients]);

        const contactsAutocompleteItems = useMemo(() => {
            return [
                ...getContactsAutocompleteItems(
                    contactEmails,
                    ({ Email }) => !recipientsByAddress.has(canonizeEmail(Email)) && !validate(Email)
                ),
                ...getContactGroupsAutocompleteItems(contactGroups, ({ Path }) => !recipientsByGroup.has(Path)),
            ];
        }, [contactEmails, contactGroups, recipientsByAddress, recipientsByGroup]);

        const majorList = useMemo(() => {
            return getMajorListAutocompleteItems(input, (email) => {
                const canonicalEmail = canonizeEmail(email);
                return (
                    !recipientsByAddress.has(canonicalEmail) &&
                    !contactEmailsMap?.[canonicalEmail] &&
                    !validate(canonicalEmail)
                );
            });
        }, [input, contactEmailsMap, recipientsByAddress]);

        const options = [...contactsAutocompleteItems, ...majorList];

        const safeAddRecipients = (newRecipients: Recipient[]) => {
            const uniqueNewRecipients = newRecipients.filter(({ Address }) => {
                return !validate(Address || '');
            });
            if (!uniqueNewRecipients.length) {
                return;
            }
            onAddRecipients(uniqueNewRecipients);
        };

        const handleAddRecipient = (newRecipients: Recipient[]) => {
            setInput('');
            setEmailError('');
            safeAddRecipients(newRecipients);
        };

        const handleAddRecipientFromInput = (input: string) => {
            const trimmedInput = input.trim();
            if (!trimmedInput.length) {
                setInput('');
                return;
            }
            const newRecipient = inputToRecipient(trimmedInput);
            const error = validate(newRecipient.Address || '');

            if (!error) {
                handleAddRecipient([newRecipient]);
            } else {
                onAddInvalidEmail?.();
                setEmailError(error);
            }
        };

        const handleSelect = (item: AddressesAutocompleteItem) => {
            handleAddRecipient(getRecipientFromAutocompleteItem(contactEmails, item));
        };

        const getData = useCallback((value) => {
            return value.label;
        }, []);

        const filteredOptions = useAutocompleteFilter(input, options, getData, limit, 1);

        // If a group name is equal to the search input, we want to display it as the first option
        const exactNameGroup = filteredOptions.find(
            (option) => option.option.label === input && option.option.type === 'group'
        );

        // Put the group at the first place if found
        const filteredAndSortedOptions = exactNameGroup
            ? [exactNameGroup, ...filteredOptions.filter((option) => option.option.label !== input)]
            : filteredOptions;

        const { getOptionID, inputProps, suggestionProps } = useAutocomplete<AddressesAutocompleteItem>({
            id,
            options: filteredOptions,
            onSelect: handleSelect,
            input,
        });

        const handleInputChange = (newValue: string) => {
            if (newValue === ';' || newValue === ',') {
                return;
            }

            if (!hasEmailPasting) {
                setInput(newValue);
                return;
            }

            const values = newValue.split(/[,;]/).map((value) => value.trim());
            if (values.length > 1) {
                safeAddRecipients(values.slice(0, -1).map(inputToRecipient));
                setInput(values[values.length - 1]);
                return;
            }

            setInput(newValue);
        };

        const getNumberOfMembersText = (groupID: string) => {
            const memberCount = groupsWithContactsMap ? groupsWithContactsMap[groupID]?.contacts.length || 0 : 0;

            // translator: the variable is a positive integer (written in digits) always greater or equal to 0
            return c('Info').ngettext(msgid`(${memberCount} member)`, `(${memberCount} members)`, memberCount);
        };

        return (
            <>
                <Input
                    {...rest}
                    {...inputProps}
                    ref={ref}
                    value={input}
                    onChange={(event) => {
                        handleInputChange(event.currentTarget.value.trimStart());
                        onChange?.(event);
                    }}
                    onKeyDown={(event) => {
                        setEmailError('');
                        // If the default key down handler did not take care of this, add another layer
                        if (!inputProps.onKeyDown(event)) {
                            if (event.key === 'Enter') {
                                handleAddRecipientFromInput(input);
                                event.preventDefault();
                            }
                        }
                        onKeyDown?.(event);
                    }}
                    onBlur={() => {
                        inputProps.onBlur();
                        if (hasAddOnBlur) {
                            handleAddRecipientFromInput(input);
                        }
                    }}
                    error={emailError}
                />
                <AutocompleteList anchorRef={anchorRef} {...suggestionProps}>
                    {filteredAndSortedOptions.map(({ chunks, text, option }, index) => {
                        return (
                            <Option
                                key={option.key}
                                id={getOptionID(index)}
                                title={option.label}
                                value={option}
                                focusOnActive={false}
                                onChange={handleSelect}
                            >
                                {option.type === 'group' ? (
                                    <>
                                        <Icon name="circle" color={option.value.Color} size={12} className="mr0-5" />
                                        <span className="mr0-5">
                                            <Marks chunks={chunks}>{text}</Marks>
                                        </span>
                                        {getNumberOfMembersText(option.value.ID)}
                                    </>
                                ) : (
                                    <Marks chunks={chunks}>{text}</Marks>
                                )}
                            </Option>
                        );
                    })}
                </AutocompleteList>
            </>
        );
    }
);

export default AddressesAutocomplete;
