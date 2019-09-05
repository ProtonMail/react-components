import { c } from 'ttag';
import PropTypes from 'prop-types';
import React from 'react';

import RichTextEditor from '../../../components/input/RichTextEditor';
import Alert from '../../../components/alert/Alert';
import DurationField from './fields/DurationField';
import { modelShape } from './autoReplyShapes';

const AutoReplyFormPermanent = ({ model: { duration, message }, updateModel }) => {
    return (
        <>
            <DurationField value={duration} onChange={updateModel('duration')} />
            <Alert>{c('Info').t`Auto-reply is active until you turn it off.`}</Alert>
            <RichTextEditor value={message} onChange={updateModel('message')} />
        </>
    );
};

AutoReplyFormPermanent.propTypes = {
    model: modelShape,
    updateModel: PropTypes.func
};

export default AutoReplyFormPermanent;
