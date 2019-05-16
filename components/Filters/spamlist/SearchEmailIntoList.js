import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SearchInput, useApiWithoutResult } from 'react-components';
import { getIncomingDefaults } from 'proton-shared/lib/api/incomingDefaults';
import { noop, debounce } from 'proton-shared/lib/helpers/function';

function SearchEmailIntoList({ className, onBeforeRequest, onAfterRequest }) {
    const { request } = useApiWithoutResult(getIncomingDefaults);

    const handleSeachChange = async (Keyword) => {
        onBeforeRequest(Keyword);
        const { IncomingDefaults = [] } = await request({ Keyword, PageSize: 200 });
        onAfterRequest(Keyword, IncomingDefaults);
    };

    return (
        <SearchInput
            className={'w100 '.concat(className)}
            onChange={debounce(handleSeachChange, 300)}
            placeholder={c('FilterSettings').t('Search Whitelist and Blacklist')}
        />
    );
}

SearchEmailIntoList.propTypes = {
    className: PropTypes.string,
    onBeforeRequest: PropTypes.func,
    onAfterRequest: PropTypes.func
};

SearchEmailIntoList.defaultProps = {
    className: '',
    onBeforeRequest: noop,
    onAfterRequest: noop
};

export default SearchEmailIntoList;
