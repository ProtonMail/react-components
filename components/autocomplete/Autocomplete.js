import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Awesomplete from 'awesomplete';
import SelectedItem from './SelectedItem';
import './Autocomplete.scss';
import { noop } from 'proton-shared/lib/helpers/function';

const Autocomplete = ({
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

    const handleSubmit = (item = { label: inputValue, value: inputValue }) => {
        if (item.value) {
            onSubmit(item);
        }
    };

    const handleSelect = ({ text }) => {
        handleSubmit(text);
        onSelect(text);
    };

    useEffect(() => {
        const awesomplete = new Awesomplete(inputRef.current, {
            container: () => containerRef.current,
            ...rest
        });

        inputRef.current.addEventListener('awesomplete-selectcomplete', handleSelect);
        inputRef.current.addEventListener('awesomplete-close', onClose);
        inputRef.current.addEventListener('awesomplete-highlight', onHighlight);
        inputRef.current.addEventListener('awesomplete-open', onOpen);

        return () => {
            awesomplete.destroy();
            inputRef.current.removeEventListener('awesomplete-selectcomplete', handleSelect);
            inputRef.current.removeEventListener('awesomplete-close', onClose);
            inputRef.current.removeEventListener('awesomplete-highlight', onHighlight);
            inputRef.current.removeEventListener('awesomplete-open', onOpen);
        };
    }, []);

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
                        className="w100"
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        onChange={handleInputValueChange}
                        ref={inputRef}
                        onBlur={() => handleSubmit()}
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
            value: PropTypes.any
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
