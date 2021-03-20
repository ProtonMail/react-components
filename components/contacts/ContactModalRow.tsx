import React, { forwardRef, Ref } from 'react';
import { c } from 'ttag';
import { clearType, getType } from 'proton-shared/lib/contacts/property';
import { ContactProperty, ContactPropertyChange } from 'proton-shared/lib/interfaces/contacts';
import { classnames } from '../../helpers';
import ContactFieldProperty from './ContactFieldProperty';
import ContactModalLabel from './ContactModalLabel';
import Icon from '../icon/Icon';
import { OrderableHandle } from '../orderable';
import DropdownActions from '../dropdown/DropdownActions';

interface Props {
    property: ContactProperty;
    onChange: (payload: ContactPropertyChange) => void;
    onRemove: (value: string) => void;
    isOrderable?: boolean;
    isSubmitted?: boolean;
    actionRow?: boolean;
    mainItem?: boolean;
    fixedType?: boolean;
    labelWidthClassName?: string;
}

const ContactModalRow = (
    {
        property,
        onChange,
        onRemove,
        isOrderable = false,
        isSubmitted = false,
        actionRow = true,
        mainItem = false,
        labelWidthClassName,
        fixedType,
    }: Props,
    ref: Ref<HTMLInputElement>
) => {
    const { field, value } = property;
    const type = clearType(getType(property.type));
    const canDelete = !(field === 'photo' && !value);

    const list = [];

    // Delete is always available (except when primary and no image). Primary name has action row disabled.
    if (canDelete) {
        list.push({
            color: 'danger',
            shape: 'outline',
            text: <Icon name="trash" className="mauto" alt={c('Action').t`Delete`} />,
            onClick: () => {
                if (property.uid) {
                    onRemove(property.uid);
                }
            },
        });
    }

    return (
        <div className="flex flex-nowrap flex-item-noshrink">
            {isOrderable ? (
                <OrderableHandle key="icon">
                    <div className="cursor-row-resize mr0-5 flex flex-item-noshrink mb1">
                        <Icon name="text-justify" className="mt0-75 " />
                    </div>
                </OrderableHandle>
            ) : (
                <div className="mr0-5 flex flex-align-items-center flex-item-noshrink">
                    <Icon name="text-justify" className="visibility-hidden" />
                </div>
            )}
            <div className="contact-modal-field relative flex flex-nowrap on-mobile-flex-column w100 flex-align-items-start">
                <span
                    className={classnames([
                        'contact-modal-select flex flex-nowrap mb1 flex-align-items-start on-mobile-mb0-5 on-mobile-flex-align-self-start',
                        mainItem && 'text-semibold',
                        labelWidthClassName || 'w30',
                    ])}
                >
                    <ContactModalLabel
                        field={field}
                        type={type}
                        uid={property.uid}
                        onChange={onChange}
                        fixedType={fixedType}
                    />
                </span>

                <div className="flex flex-nowrap flex-align-items-startoupas flex-item-fluid flex-item-noshrink">
                    <span className="flex-item-fluid mb1">
                        <ContactFieldProperty
                            ref={ref}
                            field={field}
                            value={property.value}
                            uid={property.uid}
                            onChange={onChange}
                            isSubmitted={isSubmitted}
                        />
                    </span>
                    {actionRow && (
                        <span className="mb1 flex ml1">
                            {list.length > 0 && (
                                <div
                                    className={classnames([
                                        'flex flex-item-noshrink',
                                        field,
                                        Array.isArray(property.value) ? property.value.join(' ') : property.value,
                                        (field === 'photo' ||
                                            field === 'note' ||
                                            field === 'logo' ||
                                            field === 'adr') &&
                                            'flex-align-items-start',
                                    ])}
                                >
                                    <DropdownActions icon list={list} />
                                </div>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default forwardRef(ContactModalRow);
