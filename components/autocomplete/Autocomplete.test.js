import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Autocomplete from './Autocomplete';

const rawText = (item) => (_, node) => node.textContent === item;

describe('Autocomplete component', () => {
    it('should not render a list when input is less than minChars', () => {
        const list = ['test1', 'test2', 'test3'];
        const { queryByText } = render(<Autocomplete minChars={1} list={list} />);
        const listItems = list.map((item) => queryByText(rawText(item)));

        listItems.map((item) => expect(item).toBe(null));
    });

    it('should render a list of string values', () => {
        const list = ['test1', 'test2', 'test3'];
        const { getByText } = render(<Autocomplete minChars={1} list={list} inputValue="t" />);
        const listItems = list.map((item) => getByText(rawText(item)));

        expect(listItems).toHaveLength(list.length);
    });

    it('should render a list of object values', () => {
        const list = [{ l: 'test1', v: 'T1' }, { l: 'test2', v: 'T2' }];
        const dataMapper = ({ l, v }) => ({ label: l, value: v });
        const { getByText } = render(<Autocomplete minChars={1} list={list} inputValue="t" data={dataMapper} />);
        const listItems = list.map((item) => getByText(rawText(item.l)));

        expect(listItems).toHaveLength(list.length);
    });

    it('should call onSubmit and onSelect when item is selected from the list', () => {
        const onSubmitMock = jest.fn();
        const onSelectMock = jest.fn();
        const list = ['test1', 'test2', 'test3'];
        const { getByText } = render(
            <Autocomplete minChars={1} list={list} inputValue="t" onSubmit={onSubmitMock} onSelect={onSelectMock} />
        );
        const listItem = getByText(rawText(list[1]));
        fireEvent.click(listItem);

        expect(onSelectMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('should call only onSubmit when item custom item is added', async () => {
        const onSubmitMock = jest.fn();
        const onSelectMock = jest.fn();
        const list = ['test1', 'test2', 'test3'];
        const customItem = 'not-in-list';
        const { getByDisplayValue } = render(
            <Autocomplete
                minChars={1}
                list={list}
                inputValue={customItem}
                onSubmit={onSubmitMock}
                onSelect={onSelectMock}
            />
        );
        const inputEl = getByDisplayValue(customItem);
        fireEvent.blur(inputEl);

        expect(onSelectMock).toHaveBeenCalledTimes(0);
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('should render selected items', () => {
        const list = ['test1', 'test2', 'test3'];
        const selected = [{ label: list[0], value: list[0] }, { label: list[1], value: list[1] }];
        const { getByText } = render(<Autocomplete selectedItems={selected} list={list} />);

        const selectedItems = selected.map((item) => getByText(item.label));
        expect(selectedItems).toHaveLength(selected.length);
    });

    it('should render invalid selected values', () => {
        const list = ['test1', 'test2', 'test3'];
        const invalid = 'invalid-item';
        const selected = [{ label: invalid, value: invalid, invalid: true }, { label: list[1], value: list[1] }];
        const { getByText } = render(<Autocomplete selectedItems={selected} list={list} />);

        const selectedItems = selected.map((item) => getByText(item.label));
        expect(selectedItems).toHaveLength(selected.length);
        expect(selectedItems[0].className).toContain('autocomplete-selectedItem-invalid');
    });
});
