import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ObserverSection } from 'react-components';

const ObserverSections = ({ list }) => {
    const [intersectionRatios, setIntersectionRatios] = useState(Array(list.length).fill(0));

    useEffect(() => {
        // find id corresponding to biggest intersection ratio
        const indexOfMax = (arr) => arr.findIndex((elm) => elm === Math.max(...arr));
        const idOfMax = list[indexOfMax(intersectionRatios)].id;

        // replace URL
        const currentURL = document.URL;
        const newURL = /#/.test(currentURL) ? currentURL.replace(/#(.*)/, `#${idOfMax}`) : currentURL + `#${idOfMax}`;
        history.replaceState('', '', newURL);
    });

    return (
        <>
            {list.map(({ id, rootElement, threshold, children }, index) => {
                return (
                    <ObserverSection
                        key={id}
                        id={id}
                        rootElement={rootElement}
                        threshold={threshold}
                        intersectionRatios={intersectionRatios}
                        index={index}
                        setIntersectionRatios={setIntersectionRatios}
                    >
                        {children}
                    </ObserverSection>
                );
            })}
        </>
    );
};

ObserverSections.propTypes = {
    list: PropTypes.array.isRequired
};

ObserverSections.defaultProps = {
    list: []
};

export default ObserverSections;
