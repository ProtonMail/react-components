import React from 'react';
import PropTypes from 'prop-types';
import { Button, Group, ButtonGroup, Icon } from 'react-components';
import { c } from 'ttag';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';

const DropdownActions = ({ list, buttonClassName }) => {
    if (!list.length) {
        return null;
    }

    const [{ text, ...restProps }, ...restList] = list;

    if (list.length === 1) {
        return (
            <Button className={buttonClassName} {...restProps}>
                {text}
            </Button>
        );
    }

    return (
        <Group>
            <ButtonGroup className={buttonClassName} {...restProps}>
                {text}
            </ButtonGroup>
            <Dropdown
                content={<Icon name="caret" />}
                title={c('Action').t`More`}
                buttonClassName={`pm-group-button pm-button--for-icon ${buttonClassName}`}
            >
                <DropdownMenu list={restList} />
            </Dropdown>
        </Group>
    );
};

DropdownActions.propTypes = {
    list: PropTypes.array.isRequired,
    buttonClassName: PropTypes.string
};

DropdownActions.defaultProps = {
    list: [],
    className: ''
};

export default DropdownActions;
