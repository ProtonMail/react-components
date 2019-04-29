import React from 'react';
import { render } from 'react-testing-library';
import Autocomplete from './Autocomplete';

describe('Autocomplete component', () => {
    it('should render list of string values', async () => {
        const list = ['test1', 'test2', 'test3'];
        const { findByText } = render(<Autocomplete minChars={1} list={list} inputValue="t" />);
        const listItems = await Promise.all(list.map((item) => findByText((_, node) => node.textContent === item)));

        expect(listItems).toHaveLength(list.length);
        listItems.map((item) => expect(item).toBeVisible());
    });

    it('should render list of object values', async () => {
        const list = [{ l: 'test1', v: 'T1' }, { l: 'test2', v: 'T2' }];
        const dataMapper = ({ l, v }) => ({ label: l, value: v });
        const { findByText } = render(<Autocomplete minChars={1} list={list} inputValue="t" data={dataMapper} />);
        const listItems = await Promise.all(list.map((item) => findByText((_, node) => node.textContent === item.l)));

        expect(listItems).toHaveLength(list.length);
        listItems.map((item) => expect(item).toBeVisible());
    });

    // it('should call onSubmit and onSelect when item is selected from the list', () => {});

    // it('should render selected items', () => {});

    // it('should render invalid selected values', () => {});
});
