import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers/component';
import Icon from '../icon/Icon';

const SuperDropdownCaret = ({ isOpen }) => {
    return <Icon className={classnames(['expand-caret', isOpen && 'rotateX-180'])} size={12} name="caret" />;
};

SuperDropdownCaret.propTypes = {
    isOpen: PropTypes.bool
};

export default SuperDropdownCaret;
