import React from 'react';
import { c } from 'ttag';

import { OrderableHandle, Icon, DropdownActions, useModals } from 'react-components';
import { clearType, getType } from 'proton-shared/lib/contacts/property';
import { ContactProperty } from 'proton-shared/lib/interfaces/contacts';

import ContactFieldProperty from './ContactFieldProperty';
import ContactModalLabel from './ContactModalLabel';
import ContactImageModal from '../../containers/contacts/modals/ContactImageModal';

interface Props {
    property: ContactProperty;
    onChange: Function;
    onRemove: Function;
    isOrderable?: boolean;
}

const ContactModalRow = ({ property, onChange, onRemove, isOrderable = false }: Props) => {
    const { createModal } = useModals();
    const { field, uid, value } = property;
    const type = clearType(getType(property.type));
    const canDelete = !['fn'].includes(field);
    const canClear = ['photo', 'logo'].includes(field) && property.value;
    const canEdit = ['photo', 'logo'].includes(field) && !!value;

    const handleChangeImage = () => {
        const handleSubmit = (value: string) => onChange({ uid, value });
        createModal(<ContactImageModal url={property.value} onSubmit={handleSubmit} />);
    };

    const list = [
        canEdit && {
            text: c('Action').t`Edit`,
            onClick: handleChangeImage
        },
        canClear && {
            text: c('Action').t`Clear`,
            onClick() {
                onChange({ uid, value: '' });
            }
        },
        canDelete && {
            text: c('Action').t`Delete`,
            onClick() {
                onRemove(property.uid);
            }
        }
    ].filter(Boolean);

    return (
        <div className="flex flex-nowrap flex-item-noshrink">
            {isOrderable ? (
                <OrderableHandle key="icon">
                    <div className="cursor-row-resize mr0-5 flex flex-item-noshrink mb1">
                        <Icon name="text-justify" className="mtauto mbauto" />
                    </div>
                </OrderableHandle>
            ) : (
                <div className="mr0-5 flex flex-items-center flex-item-noshrink">
                    <Icon name="text-justify nonvisible" />
                </div>
            )}
            <div className="flex flex-nowrap flex-items-center onmobile-flex-column w95">
                <span className="w30 flex flex-nowrap mb1">
                    <ContactModalLabel field={field} type={type} uid={property.uid} onChange={onChange} />
                </span>
                <span className="w50 mb1">
                    <div className="mr1">
                        <ContactFieldProperty
                            field={field}
                            value={property.value}
                            uid={property.uid}
                            onChange={onChange}
                        />
                    </div>
                </span>
                <span className="w20 mb1">
                    {list.length > 0 && (
                        <div className="flex flex-item-noshrink flex-items-start">
                            <DropdownActions list={list} />
                        </div>
                    )}
                </span>
            </div>
        </div>
    );
};

export default ContactModalRow;
