import { useEffect } from 'react';
import { useUserSettings } from 'react-components';
import { DENSITY } from 'proton-shared/lib/constants';

const { COMPACT, COMFORTABLE } = DENSITY;

const CLASSES = {
    [COMPACT]: 'is-compact',
    [COMFORTABLE]: 'is-comfortable'
};

const removeAllClasses = () =>
    Object.entries(CLASSES).forEach(([, className]) => {
        document.body.classList.remove(className);
    });

const DensityInjector = () => {
    const [{ Density }] = useUserSettings();

    useEffect(() => {
        removeAllClasses();
        document.body.classList.add(CLASSES[Density]);
    }, [Density]);

    return null;
};

export default DensityInjector;
