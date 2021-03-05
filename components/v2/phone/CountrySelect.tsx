import React, { forwardRef, Ref, useRef, useState } from 'react';
import { normalize } from 'proton-shared/lib/helpers/string';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { CountryOptionData } from './helper';
import { Dropdown, DropdownButton, DropdownMenuButton } from '../../dropdown';
import InputTwo from '../input/Input';
import { classnames } from '../../../helpers';
import { Icon } from '../../icon';

interface RowProps {
    data: CountryOptionData;
    style: any;
    value?: CountryOptionData;
    onChange: (data: CountryOptionData) => void;
}

const Row = ({ data, style, value, onChange }: RowProps, ref?: Ref<HTMLLIElement>) => {
    return (
        <li className="dropdown-item" style={style} ref={ref}>
            <DropdownMenuButton
                isSelected={false}
                className={classnames(['block w100 text-ellipsis text-left no-outline', data === value && 'active'])}
                title={data.countryName}
                onClick={() => {
                    onChange(data);
                }}
            >
                <div className="flex">
                    <img
                        role="presentation"
                        className="flex-item-noshrink"
                        alt={data.countryName}
                        src={data.countryFlag}
                        width="30"
                        height="20"
                    />
                    <span className="flex-item-fluid pl0-5 text-ellipsis">{data.countryName}</span>
                    <span className="flex-item-noshrink text-bold">+{data.countryCallingCode}</span>
                </div>
            </DropdownMenuButton>
        </li>
    );
};

const ForwardRow = forwardRef<HTMLLIElement, RowProps>(Row);

interface Props {
    options: CountryOptionData[];
    value?: CountryOptionData;
    onChange: (newValue: CountryOptionData) => void;
    onClosed?: (isFromSelection: boolean) => void;
}

const cache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
    keyMapper: () => 0,
});

const CountrySelect = ({ value, options, onChange, onClosed }: Props) => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const normalizedSearch = normalize(search, true);
    const filteredOptions = options.filter(({ countryName }) => {
        return normalize(countryName, true).includes(normalizedSearch);
    });

    const selectedIndex = !value ? 0 : filteredOptions.indexOf(value);

    const pickRef = useRef(false);

    const handleChange = (value: CountryOptionData) => {
        onChange(value);
        setIsOpen(false);
        pickRef.current = true;
    };

    return (
        <>
            <DropdownButton
                isOpen={isOpen}
                hasCaret
                onClick={() => {
                    pickRef.current = false;
                    setIsOpen(!isOpen);
                }}
                className="ml0-5 unstyled"
                buttonRef={anchorRef}
                caretClassName="mtauto mbauto"
                aria-live="assertive"
                aria-atomic="true"
                aria-label={value?.countryName}
            >
                <span className="mr0-5">
                    {!value ? (
                        <Icon name="globe" />
                    ) : (
                        <img
                            role="presentation"
                            alt={value.countryName}
                            src={value.countryFlag}
                            width="30"
                            height="30"
                        />
                    )}
                </span>
                <span>+{value ? value.countryCallingCode : '00'}</span>
            </DropdownButton>

            <Dropdown
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={() => {
                    pickRef.current = false;
                    setIsOpen(false);
                }}
                onClosed={() => {
                    setSearch('');
                    onClosed?.(pickRef.current);
                }}
                offset={4}
                autoClose={false}
                noCaret
                noMaxSize
                onKeyDown={(e) => {
                    const { key } = e;
                    switch (key) {
                        case 'Enter': {
                            e.preventDefault();
                            pickRef.current = true;
                            setIsOpen(false);
                            break;
                        }
                        case 'ArrowUp': {
                            e.preventDefault();
                            const newIndex = selectedIndex - 1;
                            onChange(filteredOptions[Math.max(newIndex, 0)]);
                            break;
                        }
                        case 'ArrowDown': {
                            e.preventDefault();
                            const newIndex = selectedIndex + 1;
                            onChange(filteredOptions[Math.min(newIndex, filteredOptions.length - 1)]);
                            break;
                        }
                        default:
                            break;
                    }
                }}
            >
                <form name="search" className="p1">
                    <InputTwo
                        id="search-keyword"
                        value={search}
                        onValue={setSearch}
                        autoFocus
                        placeholder="Country"
                        icon={<Icon name="search" />}
                    />
                </form>

                <div style={{ height: '20em', minWidth: '18em' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                width={width}
                                rowHeight={cache.rowHeight}
                                className="unstyled m0 p0 scroll-if-needed"
                                scrollToIndex={selectedIndex < 0 ? 0 : selectedIndex}
                                rowCount={filteredOptions.length}
                                rowRenderer={({ index, key, parent, style }) => {
                                    return (
                                        <CellMeasurer
                                            cache={cache}
                                            columnIndex={0}
                                            key={key}
                                            rowIndex={index}
                                            parent={parent}
                                        >
                                            {({ registerChild }) => (
                                                <ForwardRow
                                                    ref={registerChild as Ref<HTMLLIElement>}
                                                    data={filteredOptions[index]}
                                                    value={value}
                                                    key={key}
                                                    style={style}
                                                    onChange={handleChange}
                                                />
                                            )}
                                        </CellMeasurer>
                                    );
                                }}
                            />
                        )}
                    </AutoSizer>
                </div>
            </Dropdown>
        </>
    );
};

export default CountrySelect;
