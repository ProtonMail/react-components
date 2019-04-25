import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Awesomplete from 'awesomplete';
import SelectedItems from './SelectedItems';
import './Autocomplete.scss';

const createInputEventListener = (inputRef) => (event, callback, deps) => {
    useEffect(() => {
        inputRef.current.addEventListener(event, callback);

        return () => {
            inputRef.current.removeEventListener(event, callback);
        };
    }, deps);
};

// TODO: move state to parent (hook?)
const Autocomplete = ({
    value,
    multiple,
    onSelect = () => {},
    onOpen = () => {},
    onClose = () => {},
    onHighlight = () => {},
    ...rest
}) => {
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const awesompleteEventListener = createInputEventListener(inputRef);
    const [inputValue, setInputValue] = useState(multiple ? '' : value);
    const [selected, setSelected] = useState(value ? [].concat(value) : []);

    useEffect(() => {
        new Awesomplete(inputRef.current, {
            ...rest,
            container: () => containerRef.current
        });
    }, []);

    const handleInputValueChange = (e) => {
        setInputValue(e.target.value);
        // onChange(e.target.value);
    };

    const handleUnselect = (item, remaining) => setSelected(remaining);

    // TODO: cleanup this part
    const onSelectItem = (item) => {
        const newSelected = multiple ? [...selected, item] : [item];
        setInputValue(multiple ? '' : item.label);
        setSelected(newSelected);
        onSelect(item, newSelected);
    };

    awesompleteEventListener('awesomplete-selectcomplete', ({ text }) => onSelectItem(text), [selected]);
    awesompleteEventListener('awesomplete-close', ({ reason }) => onClose(reason));
    awesompleteEventListener('awesomplete-highlight', onHighlight);
    awesompleteEventListener('awesomplete-open', onOpen);

    return (
        <div className="autocomplete awesomplete">
            <div className="autocomplete-container" ref={containerRef}>
                <div className="flex pm-field">
                    {multiple && <SelectedItems selected={selected} onRemove={handleUnselect} />}
                    <input
                        value={inputValue}
                        className="w100"
                        autoComplete="off"
                        spellCheck={false}
                        autoCapitalize="off"
                        onChange={handleInputValueChange}
                        ref={inputRef}
                    />
                </div>
                {/* <ul> injected here by awesomplete */}
            </div>
        </div>
    );
};

Autocomplete.propTypes = {
    value: PropTypes.oneOf([
        PropTypes.string,
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.any
            })
        )
    ]),
    list: PropTypes.arrayOf(PropTypes.string),
    multiple: PropTypes.bool,
    autoFirst: PropTypes.bool,
    minChars: PropTypes.number,
    maxItems: PropTypes.number,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onHighlight: PropTypes.func,
    filter: PropTypes.func,
    data: PropTypes.func
};

export default Autocomplete;
