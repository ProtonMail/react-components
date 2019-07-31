import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';

import IllustrationPlaceholder from './IllustrationPlaceholder';

import errorImg from 'design-system/assets/img/shared/generic-error.svg';

/*
    https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries
    Hooks not supported yet for this sort of component
    https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
*/
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }
        return (
            <>
                <IllustrationPlaceholder
                    title={c('Error message').t`Aaah! Something went wrong`}
                    text={
                        <>
                            <span>{c('Error message').t`Brace yourself till we get the error fixed.`}</span>
                            <span>{c('Error message').t`You may also refresh the page or try again later.`}</span>
                        </>
                    }
                    url={errorImg}
                />
            </>
        );
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node
};

export default ErrorBoundary;
