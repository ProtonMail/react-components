import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ObserverSection = ({ id, rootElement, rootMargin, granularity, index, setIntersectionRatios, children }) => {
    // the granularity prop should be an integer and is meant to mark how many divisions we make to
    // an area in order to observe it with an intersectionObserver.
    //
    // E.g. granularity = 2 will mean that intersectionObserver will emit events when
    // the 0%, 50% or 100% of the area overlaps with a given target area.
    //
    // In general, the higher the granularity, the more sensitive we will be to changes in overlapping areas.
    // Probably granularity = 20 will suffice for the purpose of updating URL in function of the dislpay area

    const buildThresholds = (granularity) => {
        const steps = parseInt(granularity, 10);
        const thresholds = [];

        for (let i = 0; i <= steps; i++) {
            thresholds.push(i / steps);
        }
        return thresholds;
    };

    const handleIntersect = (entries) => {
        entries.forEach(function(entry) {
            setIntersectionRatios((intersectionRatios) => {
                let newIntersectionRatios = intersectionRatios.slice();
                newIntersectionRatios[index] = Math.min(entry.intersectionRatio, 1); // manual fix for bug IntersectionObserverEntry.intersectionRatio > 1
                return newIntersectionRatios;
            });
        });
    };

    useEffect(() => {
        // Create an observer that triggers when intersectionRatio changes 1/granularity
        const options = {
            root: rootElement,
            rootMargin: rootMargin,
            threshold: buildThresholds(granularity)
        };
        const target = document.getElementById(id);

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(target);

        return () => {
            // Destroy the observer
            observer.disconnect();
        };
    }, []);

    return <section id={id}>{children}</section>;
};

ObserverSection.propTypes = {
    id: PropTypes.string.isRequired,
    rootElement: PropTypes.node,
    rootMargin: PropTypes.string,
    granularity: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    setIntersectionRatios: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

ObserverSection.defaultProps = {
    rootElement: null,
    rootMargin: '0px'
};

export default ObserverSection;
