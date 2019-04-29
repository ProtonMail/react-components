import useAutocomplete from './useAutocomplete';
import { renderHook } from 'react-hooks-testing-library';

describe('useAutocomplete hook', () => {
    describe('multi-select input', () => {
        it('should be able to change input value', () => {
            const { result } = renderHook(() => useAutocomplete(true));
            result.current.changeInputValue('test');
            expect(result.current.inputValue).toBe('test');
        });

        it('should set not set input value based on selected items', () => {
            const { result } = renderHook(() => useAutocomplete(true, [{ label: 'test', value: 'T' }]));
            expect(result.current.inputValue).toBe('');
        });

        it('should add to a list of selected items and clear input on submit', () => {
            const newItem = { label: 'test2', value: 'T2' };
            const { result } = renderHook(() => useAutocomplete(true, [{ label: 'test', value: 'T' }]));
            result.current.submit(newItem);
            expect(result.current.selectedItems).toContain(newItem);
            expect(result.current.inputValue).toBe('');
        });

        it('should remove a selected item on remove', () => {
            const items = [
                { label: 'test1', value: 'T1' },
                { label: 'test2', value: 'T2' },
                { label: 'test3', value: 'T3' }
            ];
            const { result } = renderHook(() => useAutocomplete(true, items));
            result.current.remove(1);
            expect(result.current.selectedItems).toEqual([items[0], items[2]]);
        });
    });

    describe('single-select input', () => {
        it('should be able to change input value', () => {
            const { result } = renderHook(() => useAutocomplete());
            result.current.changeInputValue('test');
            expect(result.current.inputValue).toBe('test');
        });

        it('should set initial input value based on selected item', () => {
            const { result } = renderHook(() => useAutocomplete(false, [{ label: 'test', value: 'T' }]));
            expect(result.current.inputValue).toBe('test');
        });

        it('should set selected item on submit', () => {
            const newItem = { label: 'test2', value: 'T2' };
            const { result } = renderHook(() => useAutocomplete(false, [{ label: 'test', value: 'T' }]));
            result.current.submit(newItem);
            expect(result.current.selectedItems).toEqual([newItem]);
            expect(result.current.inputValue).toBe(newItem.label);
        });
    });
});
