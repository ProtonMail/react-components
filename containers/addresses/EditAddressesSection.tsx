import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { c } from 'ttag';

import { isMac } from 'proton-shared/lib/helpers/browser';
import { updateAddress } from 'proton-shared/lib/api/addresses';
import { Address } from 'proton-shared/lib/interfaces';

import { Row, Field, Label, Input, SimpleSquireEditor, PrimaryButton } from '../../components';
import {
    useApi,
    useLoading,
    useNotifications,
    useEventManager,
    useMailSettings,
    useHotkeys,
    useHandler,
} from '../../hooks';

import { SquireEditorRef } from '../../components/editor/SquireEditor';

const EMPTY_VALUES = [/^(<div><br><\/div>)+$/, /^(<div>\s*<\/div>)+$/];

const formatSignature = (value: string) => (EMPTY_VALUES.some((regex) => regex.test(value)) ? '' : value);

interface Props {
    address: Address;
}
const EditAddressesSection = ({ address }: Props) => {
    const [{ Shortcuts = 1 } = {}] = useMailSettings();
    const api = useApi();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();
    const [model, updateModel] = useState({
        displayName: address.DisplayName,
        signature: address.Signature,
    });
    const [squireReady, setSquireReady] = useState(false);
    const { createNotification } = useNotifications();

    const editorRef = useRef<SquireEditorRef>(null);
    const composerRef = useRef<HTMLDivElement>(null);

    const handleReady = () => {
        if (editorRef.current) {
            editorRef.current.value = model.signature;
        }
        setSquireReady(true);
    };

    const handleDisplayName = ({ target }: ChangeEvent<HTMLInputElement>) => {
        updateModel({ ...model, displayName: target.value });
    };

    const handleSignature = (value: string) => {
        updateModel({ ...model, signature: value });
    };

    const handleSubmit = async () => {
        await api(
            updateAddress(address.ID, {
                DisplayName: model.displayName,
                Signature: formatSignature(model.signature),
            })
        );
        await call();
        createNotification({ text: c('Success').t`Address updated` });
    };

    const squireKeydownHandler = useHandler((e: KeyboardEvent) => {
        const ctrlOrMetaKey = (e: KeyboardEvent) => (isMac() ? e.metaKey : e.ctrlKey);

        switch (e.key.toLowerCase()) {
            case 'enter':
                if (Shortcuts && ctrlOrMetaKey(e)) {
                    void withLoading(handleSubmit());
                }
                break;
            default:
                break;
        }
    });

    useHotkeys(composerRef, [
        [
            ['Meta', 'Enter'],
            async () => {
                if (Shortcuts) {
                    await withLoading(handleSubmit());
                }
            },
        ],
    ]);

    useEffect(() => {
        updateModel({
            displayName: address.DisplayName,
            signature: address.Signature,
        });
        setTimeout(() => {
            if (editorRef?.current && squireReady) {
                editorRef.current.value = address.Signature;
            }
        }, 100);
    }, [address]);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                await withLoading(handleSubmit());
            }}
        >
            <Row>
                <Label htmlFor="displayName" className="w16r text-bold">{c('Label').t`Display name`}</Label>
                <Field className="w100">
                    <Input
                        id="displayName"
                        value={model.displayName}
                        placeholder={c('Placeholder').t`Choose display name`}
                        onChange={handleDisplayName}
                    />
                </Field>
            </Row>

            <Row>
                <Label className="w16r text-bold" onClick={() => editorRef.current?.focus()}>{c('Label')
                    .t`Signature`}</Label>
                <Field className="w100 h100">
                    <div ref={composerRef} tabIndex={-1}>
                        <SimpleSquireEditor
                            ref={editorRef}
                            onReady={handleReady}
                            onChange={handleSignature}
                            keydownHandler={squireKeydownHandler}
                        />
                    </div>

                    <PrimaryButton type="submit" disabled={loading} loading={loading} className="mt1">
                        {c('Action').t`Update`}
                    </PrimaryButton>
                </Field>
            </Row>
        </form>
    );
};

export default EditAddressesSection;
