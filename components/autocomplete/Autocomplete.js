import React, { useEffect, useRef, useState } from 'react';
import Input from '../input/Input';
import PropTypes from 'prop-types';
import Awesomplete from 'awesomplete';

const createInputEventListener = (inputRef) => (event, callback, deps = []) =>
    useEffect(() => {
        inputRef.current.addEventListener(event, callback);

        return () => {
            inputRef.current.removeEventListener(event, callback);
        };
    }, deps);

const Autocomplete = ({
    value = '',
    multiple,
    autoFirst,
    minChars,
    maxItems,
    onChange = () => {},
    onSelect = () => {},
    onOpen = () => {},
    onClose = () => {},
    onHighlight = () => {},
    ...rest
}) => {
    const inputEl = useRef(null);
    const withInputEventListener = createInputEventListener(inputEl);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        new Awesomplete(
            inputEl.current,
            multiple
                ? {
                      filter: (text, input) => Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]),
                      item: (text, input) => Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]),
                      replace: (text) => setInputValue(inputValue.match(/^.+,\s*|/)[0] + text + ', '),
                      ...rest
                  }
                : rest
        );
    }, []);

    // TODO: fix multiple values thingy

    withInputEventListener('awesomplete-selectcomplete', ({ text }) => onSelect(text));
    withInputEventListener('awesomplete-close', ({ reason }) => onClose(reason));
    withInputEventListener('awesomplete-highlight', onHighlight);
    withInputEventListener('awesomplete-open', onOpen);

    const handleInputValueChange = (e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <Input
            value={inputValue}
            onChange={handleInputValueChange}
            className="pm-field"
            inputRef={inputEl}
            data-multiple={multiple}
            data-autofirst={autoFirst}
            data-minchars={minChars}
            data-maxitems={maxItems}
        />
    );
};

Autocomplete.propTypes = {
    value: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
    multiple: PropTypes.bool,
    autoFirst: PropTypes.bool,
    minChars: PropTypes.number,
    maxItems: PropTypes.number,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onHighlight: PropTypes.func,
    filter: PropTypes.func,
    data: PropTypes.func
};

export default Autocomplete;
