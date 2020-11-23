import React from 'react';
import { render } from '@testing-library/react';

import Mark from './Mark';

describe('Mark component', () => {
    const input = `Eh, toi, l'ours mal léché`;
    let container: HTMLElement;
    let nodes: NodeListOf<HTMLElement>;

    beforeEach(() => {
        const result = render(<Mark value="e">{input}</Mark>);
        container = result.container;
        nodes = container.querySelectorAll('mark');
    });

    it('should highlight several matches', () => {
        expect(nodes?.length).toBe(3);
    });

    it('should highlight accent and capitalized matches', () => {
        const [first, second, third] = nodes;
        expect(first?.textContent).toBe('E');
        expect(second?.textContent).toBe('é');
        expect(third?.textContent).toBe('é');
    });

    it('should highlight print result properly', () => {
        expect(container?.innerHTML).toBe(`<mark>E</mark>h, toi, l'ours mal l<mark>é</mark>ch<mark>é</mark>`);
    });
});
