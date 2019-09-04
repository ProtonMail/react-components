import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer';
import { debounce } from 'proton-shared/lib/helpers/function';
import { withDecimalPrecision } from 'proton-shared/lib/helpers/math';

import { buildThresholds, indexOfMax } from '../../helpers/intersectionObserver';

const ObserverSection = ({
    id,
    className = 'container-section-sticky-section',
    rootElement = null,
    rootMargin = '0px',
    granularity = 20,
    index,
    setIntersectionData,
    wait = 500,
    children
}) => {
    const ref = useRef();
    const unmounted = useRef();

    useEffect(() => {
        return () => (unmounted.current = true);
    }, []);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const handleIntersect = (entries) => {
            // Needed due to the debounce
            if (unmounted.current) {
                return;
            }
            entries.forEach((entry) => {
                setIntersectionData(({ intersectionRatios, listOfIds }) => {
                    const newIntersectionRatios = intersectionRatios.slice();
                    newIntersectionRatios[index] = withDecimalPrecision(entry.intersectionRatio, 2);
                    const idToDisplay = listOfIds[indexOfMax(newIntersectionRatios)];
                    return {
                        intersectionRatios: newIntersectionRatios,
                        hashToDisplay: `#${idToDisplay}`,
                        listOfIds
                    };
                });
            });
        };

        const options = {
            root: rootElement,
            rootMargin,
            threshold: buildThresholds(granularity)
        };

        const observer = new IntersectionObserver(debounce(handleIntersect, wait), options);
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref.current]);

    return (
        <>
            <div className="relative">
                <div id={id} className="header-height-anchor" />
            </div>
            <section className={className} ref={ref}>
                {children}
            </section>
        </>
    );
};

ObserverSection.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    rootElement: PropTypes.node,
    rootMargin: PropTypes.string,
    granularity: PropTypes.number,
    index: PropTypes.number.isRequired,
    setIntersectionData: PropTypes.func.isRequired,
    wait: PropTypes.number,
    children: PropTypes.node.isRequired
};

export default ObserverSection;
