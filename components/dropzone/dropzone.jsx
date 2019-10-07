import React from 'react';
import PropTypes from 'prop-types';
import './dropzone.sass';

const CLASSNAMES = {
    default: 'dropBorder-default',
    error: 'dropBorder-error',
    success: 'dropBorder-success'
};

class DropZone extends React.Component {
    state = {
        status: 'default'
    };

    handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
            if (e.dataTransfer.items.length === 1 && this.props.validTypes.includes(e.dataTransfer.items[0].type)) {
                this.setState({ status: 'success' });
            } else {
                this.setState({ status: 'error' });
            }
        }
    };

    handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ status: 'default' });
    };

    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ status: 'default' });
        if (
            e.dataTransfer.files &&
            e.dataTransfer.files.length === 1 &&
            this.props.validTypes.includes(e.dataTransfer.items[0].type)
        ) {
            this.props.handleDrop(e.dataTransfer.files[0]);
        }
    };

    render() {
        return (
            <div
                className={`dropBorder ${CLASSNAMES[this.state.status]}`}
                onDrag={this.handleDrag}
                onDrop={this.handleDrop}
                onDragOver={this.handleDragIn}
                onDragLeave={this.handleDragOut}
            >
                {this.props.children}
            </div>
        );
    }
}

DropZone.propTypes = {
    children: PropTypes.node.isRequired,
    handleDrop: PropTypes.func,
    validTypes: PropTypes.array
};

export default DropZone;
