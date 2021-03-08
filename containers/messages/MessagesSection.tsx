import React, { useState } from 'react';
import { c } from 'ttag';

import { SHOW_IMAGES } from 'proton-shared/lib/constants';

import { Row, Field, Label, Info } from '../../components';
import { useMailSettings } from '../../hooks';

import RemoteToggle from './RemoteToggle';
import EmbeddedToggle from './EmbeddedToggle';
import ShowMovedToggle from './ShowMovedToggle';
import RequestLinkConfirmationToggle from './RequestLinkConfirmationToggle';
import DelaySendSecondsSelect from './DelaySendSecondsSelect';

const { EMBEDDED } = SHOW_IMAGES;

const MessagesSection = () => {
    const [{ ShowImages = EMBEDDED, ConfirmLink = 1, DelaySendSeconds = 10 } = {}] = useMailSettings();
    const [showImages, setShowImages] = useState(ShowImages);
    const handleChange = (newValue: number) => setShowImages(newValue);

    return (
        <>
            <Row>
                <Label htmlFor="remoteToggle" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Auto-load remote content`}</span>
                    <Info url="https://protonmail.com/support/knowledge-base/images-by-default/" />
                </Label>
                <Field>
                    <RemoteToggle id="remoteToggle" showImages={showImages} onChange={handleChange} />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="embeddedToggle" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Auto-load embedded images`}</span>
                    <Info url="https://protonmail.com/support/knowledge-base/images-by-default/" />
                </Label>
                <Field>
                    <EmbeddedToggle id="embeddedToggle" showImages={showImages} onChange={handleChange} />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="showMovedToggle" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Include moved in Sent/Drafts`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Setting to 'Include moved' means that sent / draft messages that have been moved to other folders will continue to appear in the Sent/Drafts folder.`}
                    />
                </Label>
                <Field>
                    <ShowMovedToggle id="showMovedToggle" />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="requestLinkConfirmationToggle" className="text-bold">{c('Label')
                    .t`Request link confirmation`}</Label>
                <Field>
                    <RequestLinkConfirmationToggle confirmLink={ConfirmLink} id="requestLinkConfirmationToggle" />
                </Field>
            </Row>
            <Row>
                <Label htmlFor="delaySendSecondsSelect" className="text-bold">
                    <span className="mr0-5">{c('Label').t`Undo send`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`This feature delays sending your emails. You can undo send during the selected timeframe.`}
                    />
                </Label>
                <Field>
                    <DelaySendSecondsSelect id="delaySendSecondsSelect" delaySendSeconds={DelaySendSeconds} />
                </Field>
            </Row>
        </>
    );
};

export default MessagesSection;
