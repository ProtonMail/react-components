import { useEffect, useRef, useState } from 'react';

const useFormErrors = () => {
    const [, rerender] = useState<any>();
    const errorsMapRef = useRef<{ [key: string]: string | undefined }>({});
    const isSubmittedRef = useRef(false);

    const errors: { [key: string]: string | undefined } = {};

    useEffect(() => {
        errorsMapRef.current = {
            ...errorsMapRef.current,
            ...errors,
        };
    });

    useEffect(() => {
        return () => {
            errorsMapRef.current = {};
        };
    }, []);

    return {
        setError: (key: string, error: string) => {
            errorsMapRef.current[key] = error;
        },
        clearError: (key: string) => {
            delete errorsMapRef.current[key];
        },
        onFormSubmit: () => {
            isSubmittedRef.current = true;
            rerender({});
            const errorsMap = errorsMapRef.current;
            const hasError = Object.keys(errorsMap).some((key) => !!errorsMap[key]);
            return !hasError;
        },
        validator: (id: string, validations: string[]) => {
            errors[id] = validations.reduce((acc, x) => acc || x, '');
            return isSubmittedRef.current ? errors[id] : '';
        },
    };
};

export default useFormErrors;
