import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ObserverSection } from 'react-components';
import { indexOfMax } from 'react-components';
import useDebounceInput from '../input/useDebounceInput';

const ObserverSections = ({ granularity, wait, children }) => {
    // throw error if any children does not have id
    React.Children.forEach(children, (child) => {
        if (!child.props.id) throw new Error('All sections to be observed need an id');
    });

    // eslint-disable-next-line no-unused-vars
    const [intersectionRatios, setIntersectionRatios] = useState(
        Array(React.Children.count(children))
            .fill(1)
            .fill(0, 1)
    );
    const listOfIds = React.Children.map(children, (child) => child.props.id);
    const [idToDisplay, setIdToDisplay] = useState(listOfIds[0]);
    const debouncedIdToDisplay = useDebounceInput(idToDisplay, wait);

    const updateIdToDisplay = (intersectionRatios) => {
        setIdToDisplay(listOfIds[indexOfMax(intersectionRatios)]);
    };

    useEffect(() => {
        const currentURL = document.URL;
        const newURL = /#/.test(currentURL)
            ? currentURL.replace(/#(.*)/, `#${debouncedIdToDisplay}`)
            : currentURL + `#${debouncedIdToDisplay}`;
        history.replaceState({ section: `${debouncedIdToDisplay}` }, '', newURL);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    }, [debouncedIdToDisplay]);

    return React.Children.map(children, (child, index) => {
        return (
            <ObserverSection
                id={child.props.id}
                granularity={granularity}
                index={index}
                setIntersectionRatios={setIntersectionRatios}
                updateIdToDisplay={updateIdToDisplay}
                wait={wait}
            >
                {child}
            </ObserverSection>
        );
    });
};

ObserverSections.propTypes = {
    children: PropTypes.node.isRequired,
    granularity: PropTypes.number,
    wait: PropTypes.number
};

ObserverSections.defaultProps = {
    granularity: 20,
    wait: 500
};

export default ObserverSections;
