import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import { Icon } from 'react-components';
import usePopper from '../tooltip/usePopper';
import { classnames } from '../../helpers/component';

const ALIGN_CLASSES = {
    right: 'dropDown--rightArrow',
    left: 'dropDown--leftArrow'
};

const Dropdown = ({
    isOpen,
    content,
    title,
    children,
    className,
    autoClose,
    autoCloseOutside,
    align,
    narrow,
    loading,
    disabled,
    caret
}) => {
    const { position, visible, show, hide, wrapperRef, tooltipRef } = usePopper({
        scrollContainerClass: 'main',
        visible: isOpen,
        offset: 20,
        placement: {
            left: 'bottom-left',
            right: 'bottom-right',
            center: 'bottom'
        }[align]
    });

    const handleClick = () => (visible ? hide() : show());

    const handleKeydown = (event) => {
        const key = keycode(event);

        if (key === 'escape' && event.target === document.activeElement) {
            hide();
        }
    };

    const handleClickOutside = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
            !autoCloseOutside ||
            (tooltipRef.current && tooltipRef.current.contains(event.target)) ||
            (wrapperRef.current && wrapperRef.current.contains(event.target))
        ) {
            return;
        }
        hide();
    };

    const handleClickContent = () => {
        if (autoClose) {
            hide();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const { top, left, placement } = position;
    const alignClass = ALIGN_CLASSES[align];
    const dropdownClassName = classnames(['pm-button', (loading || disabled) && 'is-disabled', className]);
    const contentClassName = classnames(['dropDown', alignClass, narrow && 'dropDown--narrow']);
    const placementClassName = placement.startsWith('top') ? 'dropDown--above' : '';
    const caretContent = caret && <Icon className="expand-caret" size={12} name="caret" />;
    return (
        <>
            <button
                title={title}
                ref={wrapperRef}
                className={classnames([dropdownClassName, className])}
                aria-expanded={visible}
                aria-busy={loading}
                onClick={handleClick}
                type="button"
                disabled={loading || disabled}
            >
                <span className="mauto">
                    {content} {caretContent}
                </span>
            </button>
            {ReactDOM.createPortal(
                <div
                    style={{ top, left }}
                    aria-hidden={!visible}
                    ref={tooltipRef}
                    className={classnames([contentClassName, placementClassName])}
                    onClick={handleClickContent}
                    hidden={!visible}
                >
                    {children}
                </div>,
                document.body
            )}
        </>
    );
};

Dropdown.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    align: PropTypes.string,
    title: PropTypes.string,
    caret: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    narrow: PropTypes.bool,
    autoClose: PropTypes.bool,
    autoCloseOutside: PropTypes.bool
};

Dropdown.defaultProps = {
    isOpen: false,
    autoClose: true,
    align: 'center',
    narrow: false,
    caret: false,
    disabled: false,
    loading: false,
    autoCloseOutside: true,
    className: ''
};

export default Dropdown;
