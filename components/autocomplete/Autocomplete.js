import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Awesomplete from 'awesomplete';
import SelectedItem from './SelectedItem';
import './Autocomplete.scss';
import { noop } from 'proton-shared/lib/helpers/function';

const Autocomplete = ({
    list,
    selectedItems,
    inputValue,
    onRemove,
    onSubmit,
    onSelect,
    onInputValueChange,
    onOpen,
    onClose,
    onHighlight,
    ...rest
}) => {
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const handleInputValueChange = ({ target }) => {
        onInputValueChange(target.value);
    };

    const handleSubmit = (item = { label: inputValue, value: inputValue, invalid: true }) => {
        if (item.value) {
            onSubmit(item);
        }
    };

    const handleSelect = ({ text }) => {
        handleSubmit(text);
        onSelect(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && !inputValue) {
            onRemove(selectedItems.length - 1);
        }
    };

    useEffect(() => {
        const awesomplete = new Awesomplete(inputRef.current, {
            list,
            container: () => containerRef.current,
            ...rest
        });

        inputRef.current.addEventListener('awesomplete-selectcomplete', handleSelect);
        inputRef.current.addEventListener('awesomplete-close', onClose);
        inputRef.current.addEventListener('awesomplete-highlight', onHighlight);
        inputRef.current.addEventListener('awesomplete-open', onOpen);

        return () => {
            awesomplete.destroy();
            awesomplete.close();
            inputRef.current.removeEventListener('awesomplete-selectcomplete', handleSelect);
            inputRef.current.removeEventListener('awesomplete-close', onClose);
            inputRef.current.removeEventListener('awesomplete-highlight', onHighlight);
            inputRef.current.removeEventListener('awesomplete-open', onOpen);
        };
    }, [list]);

    return (
        <form
            className="autocomplete awesomplete"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className="autocomplete-container" ref={containerRef}>
                <div className="flex pm-field">
                    {selectedItems.map((item, i) => (
                        <SelectedItem key={i} item={item} onRemove={() => onRemove(i)} />
                    ))}

                    <input
                        value={inputValue}
                        className="w100 autocomplete-input"
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        onChange={handleInputValueChange}
                        ref={inputRef}
                        onBlur={() => handleSubmit()}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {/* <ul> injected here by awesomplete */}
            </div>
        </form>
    );
};

Autocomplete.propTypes = {
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            invalid: PropTypes.bool
        })
    ),
    list: PropTypes.arrayOf(PropTypes.any),
    inputValue: PropTypes.string,
    onInputValueChange: PropTypes.func,
    autoFirst: PropTypes.bool,
    onRemove: PropTypes.func,
    onSubmit: PropTypes.func,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onHighlight: PropTypes.func,
    minChars: PropTypes.number,
    maxItems: PropTypes.number,
    filter: PropTypes.func,
    data: PropTypes.func
};

Autocomplete.defaultProps = {
    selectedItems: [],
    list: [],
    inputValue: '',
    onInputValueChange: noop,
    onRemove: noop,
    onSubmit: noop,
    onSelect: noop,
    onOpen: noop,
    onClose: noop,
    onHighlight: noop
};

export default Autocomplete;
