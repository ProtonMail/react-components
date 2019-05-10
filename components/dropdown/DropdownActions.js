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
                content={<Icon name="caret" />}
                title={c('Action').t`More`}
                className={`pm-group-button pm-button--for-icon ${className}`}
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
