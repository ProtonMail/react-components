import React from 'react';
import { GenericError } from 'react-components';
import { PropTypes } from 'prop-types';
import { traceError } from 'proton-shared/lib/helpers/sentry';
import { c } from 'ttag';

import FormModal from './FormModal';

class ModalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        this.props.onError && this.props.onError(error, info);
        traceError(error);
        console.error(error);
    }

    render() {
        const { children, ...rest } = this.props;
        if (!this.state.hasError) {
            return children;
        }
        return (
            <FormModal close={c('Action').t`Close`} title={c('Title').t`Error`} hasSubmit={false} {...rest}>
                <GenericError className="pt2" />
            </FormModal>
        );
    }
}

ModalErrorBoundary.propTypes = {
    children: PropTypes.node,
    onError: PropTypes.func
};

export default ModalErrorBoundary;
