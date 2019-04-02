import React from 'react';
import { render } from 'react-testing-library';

import Button from '../button/Button';
import SubSidebar from './SubSidebar';

describe('SubSidebar component', () => {
    const list = [{ text: 'panda', id: 'panda' }, { text: 'tiger', id: 'tiger' }, { text: 'turtle', id: 'turtle' }];

    it('should render the sub sidebar properly', () => {
        const { container } = render(
            <SubSidebar list={list}>
                <Button>test</Button>
            </SubSidebar>
        );

        const anchors = [].slice.call(container.querySelectorAll('a'));
        const buttonNode = container.querySelector('button');

        expect(anchors.length).toBe(3);
        expect(buttonNode).not.toBe(null);

        anchors.forEach((anchor, index) => {
            expect(anchor.getAttribute('href')).toBe(`#${list[index].id}`);
            expect(anchor.textContent).toBe(list[index].text);
        });
    });
});
