import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ObserverSection = ({ id, rootElement, threshold, index, setIntersectionRatios, children }) => {
    const handleIntersect = (entries) => {
        entries.forEach(function(entry) {
            setIntersectionRatios((intersectionRatios) => {
                let newIntersectionRatios = intersectionRatios.slice();
                newIntersectionRatios[index] = entry.intersectionRatio;
                return newIntersectionRatios;
            });
        });
    };

    useEffect(() => {
        // Create an observer that triggers when intersectionRatio crosses 50%
        const options = {
            rootMargin: '0px',
            root: rootElement,
            threshold: parseFloat(threshold)
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
    threshold: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    setIntersectionRatios: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

ObserverSection.defaultProps = {
    rootElement: null
};

export default ObserverSection;
