import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-testing-library';
import ObserverSections from './ObserverSections';

const dummyText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';
const repeatText = (text, n) => {
    return Array(n)
        .fill(text)
        .reduce((acc, cur) => cur + acc, '');
};

const MyDummyComponent = ({ index, text }) => {
    return <div>{repeatText(text, index)}</div>;
};
MyDummyComponent.propTypes = {
    index: PropTypes.number,
    text: PropTypes.string,
    id: PropTypes.string
};

describe('ObserverSections component', () => {
    it('should render the observer sections properly', () => {
        const { container } = render(
            <ObserverSections granularity={20} wait={500}>
                <MyDummyComponent index={1} text={dummyText} id="section1" />
                <MyDummyComponent index={2} text={dummyText} id="section2" />
                <MyDummyComponent index={3} text={dummyText} id="section3" />
                <MyDummyComponent index={4} text={dummyText} id="section4" />
                <MyDummyComponent index={5} text={dummyText} id="section5" />
            </ObserverSections>
        );

        const sections = [].slice.call(container.querySelectorAll('section'));

        expect(sections.length).toBe(5);

        sections.forEach((section, index) => {
            expect(section.getAttribute('id')).toBe(`section${index + 1}`);
            expect(section.textContent).toBe(repeatText(dummyText, index + 1));
        });
    });
});
