import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer';
import { buildThresholds } from 'react-components';
import { debounce } from '../../../proton-shared/lib/helpers/function';

const ObserverSection = ({ id, rootElement, rootMargin, granularity, index, setIntersectionRatios, children }) => {
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
        const options = {
            root: rootElement,
            rootMargin: rootMargin,
            threshold: buildThresholds(granularity)
        };
        const target = document.getElementById(id);

        const wait = 500;
        const observer = new IntersectionObserver(debounce(handleIntersect, wait), options);
        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, []);

    return <section id={id}>{children}</section>;
};

ObserverSection.propTypes = {
    id: PropTypes.string.isRequired,
    rootElement: PropTypes.node,
    rootMargin: PropTypes.string,
    granularity: PropTypes.number,
    index: PropTypes.number.isRequired,
    setIntersectionRatios: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

ObserverSection.defaultProps = {
    rootElement: null,
    rootMargin: '0px',
    granularity: 20
};

export default ObserverSection;
