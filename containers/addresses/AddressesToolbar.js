import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Row, Field, Label, Select } from 'react-components';
import { ALL_MEMBERS_ID } from 'proton-shared/lib/constants';

import AddAddressButton from './AddAddressButton';

const getOptions = (members) => {
    return members.reduce(
        (acc, { ID: value, Name }) => {
            acc.push({
                text: Name,
                value
            });
            return acc;
        },
        members.length > 1
            ? [
                  {
                      text: c('Option').t`All users`,
                      value: ALL_MEMBERS_ID
                  }
              ]
            : []
    );
};

const AddressesToolbar = ({ onChangeMember, member, members, loading }) => {
    const options = getOptions(members);

    const handleChange = ({ target }) => {
        const newID = target.value;
        onChangeMember(newID === ALL_MEMBERS_ID ? { ID: ALL_MEMBERS_ID } : members.find(({ ID }) => newID === ID));
    };

    return (
        <Row>
            <Label htmlFor="memberSelect">{c('Label').t`User`}</Label>
            <Field>
                <Select
                    disabled={loading}
                    id="memberSelect"
                    value={member.ID}
                    options={options}
                    className="mr1"
                    onChange={handleChange}
                />
                {member.ID === ALL_MEMBERS_ID ? null : <AddAddressButton loading={loading} member={member} />}
            </Field>
        </Row>
    );
};

AddressesToolbar.propTypes = {
    member: PropTypes.object,
    members: PropTypes.array,
    onChangeMember: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default AddressesToolbar;
