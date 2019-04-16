import { c } from 'ttag';
import React from 'react';
import { SubTitle, Info, Row, Label } from 'react-components';

import ExactMatchToggle from './ExactMatchToggle';
import EncryptedSearchToggle from './EncryptedSearchToggle';

const SearchSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Search`}</SubTitle>
            <Row>
                <Label htmlFor="exactMatch">
                    {c('Label').t`Require exact match`} <Info url="TODO" />
                </Label>
                <ExactMatchToggle id="exactMatch" />
            </Row>
            <Row>
                <Label htmlFor="encryptedSearch">
                    {c('Label').t`Encrypted search`} <Info url="TODO" />
                </Label>
                <EncryptedSearchToggle id="encryptedSearch" />
            </Row>
        </>
    );
};

export default SearchSection;
