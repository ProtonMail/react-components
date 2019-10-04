import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { SearchInput, Icon } from 'react-components';

import { classnames } from '../../helpers/component';

const Searchbox = ({ className = '', placeholder = '', value = '', onSearch }) => {
    return (
        <div className={classnames(['searchbox-container relative flex-item-centered-vert', className])}>
            <label htmlFor="global_search">
                <span className="sr-only">{placeholder}</span>
                <SearchInput
                    value={value}
                    onChange={onSearch}
                    id="global_search"
                    placeholder={placeholder}
                    className="searchbox-field"
                />
            </label>
            <button type="button" className="searchbox-search-button flex">
                <Icon name="search" className="fill-white mauto searchbox-search-button-icon" />
                <span className="sr-only">{c('Action').t`Search`}</span>
            </button>
        </div>
    );
};

Searchbox.propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onSearch: PropTypes.func
};

export default Searchbox;
