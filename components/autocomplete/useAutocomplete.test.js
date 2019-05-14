import useAutocomplete from './useAutocomplete';
import { renderHook } from 'react-hooks-testing-library';

describe('useAutocomplete hook', () => {
    it('should be able to change input value', () => {
        const { result } = renderHook(() => useAutocomplete({ multiple: true }));
        result.current.changeInputValue('test');
        expect(result.current.inputValue).toBe('test');
    });

    it('should be able to set initial input value', () => {
        const { result } = renderHook(() => useAutocomplete({ multiple: true, initialInputValue: 'test' }));
        expect(result.current.inputValue).toBe('test');
    });

    it('should add to a list of selected items and clear input value on select for multi-select input', () => {
        const newItem = { label: 'test2', value: 'T2' };
        const { result } = renderHook(() =>
            useAutocomplete({ multiple: true, initialSelectedItems: [{ label: 'test', value: 'T' }] })
        );
        result.current.select(newItem);
        expect(result.current.selectedItems).toContain(newItem);
        expect(result.current.inputValue).toBe('');
    });

    it('should remove a selected item on remove', () => {
        const items = [
            { label: 'test1', value: 'T1' },
            { label: 'test2', value: 'T2' },
            { label: 'test3', value: 'T3' }
        ];
        const { result } = renderHook(() => useAutocomplete({ multiple: true, initialSelectedItems: items }));
        result.current.deselect(1);
        expect(result.current.selectedItems).toEqual([items[0], items[2]]);
    });

    it('should set selected item and input value on select for single select', () => {
        const newItem = { label: 'test2', value: 'T2' };
        const { result } = renderHook(() =>
            useAutocomplete({ multiple: false, initialSelectedItems: [{ label: 'test', value: 'T' }] })
        );
        result.current.select(newItem, newItem.label);
        expect(result.current.selectedItems).toEqual([newItem]);
        expect(result.current.inputValue).toBe(newItem.label);
    });
});
