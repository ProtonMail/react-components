import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Row, Label, Info, Field } from 'react-components';
import ViewModeRadios from './ViewModeRadios';
import StickyLabelsToggle from './StickyLabelsToggle';
import { VIEW_MODE } from 'proton-shared/lib/constants';

const { GROUP } = VIEW_MODE;

const ConversationGrouping = ({
    viewMode,
    stickyLabels,
    onChangeViewMode,
    onToggleStickyLabels,
    loadingViewMode,
    loadingStickyLabels
}) => {
    const [show, set] = useState(viewMode === GROUP);

    const handleChangeViewMode = (mode) => {
        set(mode === GROUP);
        onChangeViewMode(mode);
    };

    return (
        <>
            <Row>
                <Label>
                    <span className="mr1">{c('Label').t`Conversations`}</span>
                    <Info
                        title={c('Tooltip')
                            .t`Conversation Grouping automatically groups messages in the same conversation together.`}
                    />
                </Label>
                <Field>
                    <ViewModeRadios viewMode={viewMode} onChange={handleChangeViewMode} loading={loadingViewMode} />
                </Field>
            </Row>
            {show ? (
                <Row>
                    <Label htmlFor={'stickyLabelsToggle'}>
                        <span className="mr1">{c('Label').t`Use sticky labels`}</span>
                        <Info
                            title={c('Tooltip')
                                .t`When a label is added to a message in a conversation, all future messages you send or receive will have that same label automatically applied.`}
                        />
                    </Label>
                    <Field>
                        <StickyLabelsToggle
                            id="stickyLabelsToggle"
                            stickyLabels={stickyLabels}
                            loading={loadingStickyLabels}
                            onToggle={onToggleStickyLabels}
                        />
                    </Field>
                </Row>
            ) : null}
        </>
    );
};

ConversationGrouping.propTypes = {
    viewMode: PropTypes.number.isRequired,
    stickyLabels: PropTypes.number.isRequired,
    onChangeViewMode: PropTypes.func.isRequired,
    onToggleStickyLabels: PropTypes.func.isRequired,
    loadingViewMode: PropTypes.bool,
    loadingStickyLabels: PropTypes.bool
};

export default ConversationGrouping;
