import React from 'react';
import PropTypes from 'prop-types';
import { Button, Group, ButtonGroup, Icon } from 'react-components';
import { c } from 'ttag';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownButton from './DropdownButton';

const DropdownActions = ({ list, className }) => {
    if (!list.length) {
        return null;
    }

    const [{ text, ...restProps }, ...restList] = list;

    if (list.length === 1) {
        return (
            <Button className={className} {...restProps}>
                {text}
            </Button>
        );
    }

    return (
        <Group>
            <ButtonGroup className={className} {...restProps}>
                {text}
            </ButtonGroup>
            <Dropdown
                align="right"
                className={`relative pm-button pm-group-button pm-button--for-icon pagination-expand ${className}`}
                button={
                    <button
                        className="increase-surface-click pagination-expand-button"
                        title={c('Title').t`Open actions dropdown`}
                        type="button"
                    >
                        <Icon className="pagination-expand-caret" size={12} name="caret" />
                    </button>
                }
                title={c('Action').t`More`}
            >
                <DropdownMenu>
                    {restList.map(({ text, ...restProps }) => {
                        return (
                            <DropdownButton className="alignleft" key={text} {...restProps}>
                                {text}
                            </DropdownButton>
                        );
                    })}
                </DropdownMenu>
            </Dropdown>
        </Group>
    );
};

DropdownActions.propTypes = {
    list: PropTypes.array.isRequired,
    className: PropTypes.string
};

DropdownActions.defaultProps = {
    list: [],
    className: ''
};

export default DropdownActions;
