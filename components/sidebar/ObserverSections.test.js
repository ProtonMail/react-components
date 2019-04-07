import React from 'react';
import { render } from 'react-testing-library';

import ObserverSections from './ObserverSections';

describe('ObserverSections component', () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';
    const repeatText = (text, n) => {
        return Array(n)
            .fill(text)
            .reduce((acc, cur) => cur + acc, '');
    };
    const list = [
        { id: 'section1', granularity: 20, children: <div id="text-1">{repeatText(dummyText, 1)}</div> },
        { id: 'section2', granularity: 20, children: <div id="text-2">{repeatText(dummyText, 2)}</div> },
        { id: 'section3', granularity: 20, children: <div id="text-3">{repeatText(dummyText, 3)}</div> },
        { id: 'section4', granularity: 20, children: <div id="text-4">{repeatText(dummyText, 4)}</div> },
        { id: 'section5', granularity: 20, children: <div id="text-5">{repeatText(dummyText, 5)}</div> }
    ];

    it('should render the observer section properly', () => {
        const { container } = render(<ObserverSections list={list} />);

        const observerSections = [].slice.call(container.querySelectorAll('ObserverSection'));

        expect(observerSections.length).toBe(5);

        observerSections.forEach((observerSection, index) => {
            expect(observerSection.getAttribute('granularity')).toBe(20);
            expect(observerSection.textContent).toBe(repeatText(dummyText, index + 1));
        });
    });
});
