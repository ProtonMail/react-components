import React from 'react';
import {
    FooterModal,
    DialogModal,
    DialogModalProps,
    HeaderModal,
    ContentModal,
    InnerModal,
    ResetButton,
    PrimaryButton
} from 'react-components';
import { c } from 'ttag';

interface Props extends DialogModalProps {
    modalTitleID?: string;
    footer?: React.ReactNode;
    onClose: () => void;
    onSubmit?: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    loading?: boolean;
    submit?: React.ReactNode;
    close?: React.ReactNode;
    noValidate?: boolean;
    background?: boolean;
    hasSubmit?: boolean;
    hasClose?: boolean;
    disableCloseOnLocation?: boolean;
    disableCloseOnOnEscape?: boolean;
}

const Modal = ({
    onClose,
    onSubmit,
    title,
    close = c('Action').t`Cancel`,
    submit = c('Action').t`Submit`,
    loading = false,
    children,
    modalTitleID = 'modalTitle',
    footer,
    hasSubmit = true,
    hasClose = true,
    noValidate = false,
    // Destructure these options so they are not passed to the DOM.
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    disableCloseOnLocation,
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    disableCloseOnOnEscape,
    ...rest
}: Props) => {
    // Because we will forget
    if (!['isClosing', 'isBehind', 'onExit'].every((key) => rest.hasOwnProperty(key))) {
        console.warn(`You must pass props to <FormModal ...rest>,
These props contains mandatory keys from the hook.
Ex: onClose

function DemoModal({ onAdd, ...rest }) {

    const handleSubmit = () => {
        // XXX
        onAdd('XXX');
        rest.onClose();
    };

    return (<FormModal onSubmit={handleSubmit} ...rest />);
}
`);
    }

    const getFooter = () => {
        if (footer === null) {
            return null;
        }

        if (footer) {
            return <FooterModal>{footer}</FooterModal>;
        }

        const nodeSubmit =
            typeof submit === 'string' ? (
                <PrimaryButton loading={loading} type="submit">
                    {submit}
                </PrimaryButton>
            ) : (
                submit
            );
        const submitBtn = hasSubmit ? nodeSubmit : null;

        return (
            <FooterModal>
                {typeof close === 'string' ? <ResetButton disabled={loading}>{close}</ResetButton> : close}
                {submitBtn}
            </FooterModal>
        );
    };

    return (
        <DialogModal modalTitleID={modalTitleID} onClose={onClose} {...rest}>
            {title ? (
                <HeaderModal hasClose={hasClose} modalTitleID={modalTitleID} onClose={onClose}>
                    {title}
                </HeaderModal>
            ) : null}
            <ContentModal onSubmit={onSubmit} onReset={onClose} noValidate={noValidate}>
                <InnerModal>{children}</InnerModal>
                {getFooter()}
            </ContentModal>
        </DialogModal>
    );
};

export default Modal;
