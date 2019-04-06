import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ObserverSection } from 'react-components';

const ObserverSections = ({ list }) => {
    const [intersectionRatios, setIntersectionRatios] = useState(
        Array(list.length)
            .fill(1)
            .fill(0, 1)
    );

    useEffect(() => {
        // find id corresponding to biggest intersection ratio
        const indexOfMax = (arr) => arr.findIndex((elm) => elm === Math.max(...arr));
        const idOfMax = list[indexOfMax(intersectionRatios)].id;

        // replace URL
        const currentURL = document.URL;
        const newURL = /#/.test(currentURL) ? currentURL.replace(/#(.*)/, `#${idOfMax}`) : currentURL + `#${idOfMax}`;
        // const newURL =  `#${idOfMax}`;   // This should work instead of the previous two lines, but local testing seems to miss relative URLs
        if (newURL !== currentURL) {
            history.replaceState({ section: `${idOfMax}` }, '', newURL);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
    });

    return (
        <>
            {list.map(({ id, rootElement, rootMargin, granularity, children }, index) => {
                return (
                    <ObserverSection
                        key={id}
                        id={id}
                        rootElement={rootElement}
                        rootMargin={rootMargin}
                        granularity={granularity}
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
