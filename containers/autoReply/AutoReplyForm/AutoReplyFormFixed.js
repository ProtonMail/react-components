import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';

import DurationField from './fields/DurationField';
import DateField from './fields/DateField';
import Alert from '../../../components/alert/Alert';
import TimeField from './fields/TimeField';
import TimeZoneField from './fields/TimeZoneField';
import RichTextEditor from '../../../components/input/RichTextEditor';
import { modelShape } from './autoReplyShapes';

const AutoReplyFormFixed = ({ model: { duration, start, end, timezone, message }, updateModel }) => {
    return (
        <>
            <DurationField value={duration} onChange={updateModel('duration')} />
            <Alert>{c('Info').t`Auto-reply is active from the start time to the end time.`}</Alert>
            <DateField
                id="startDate"
                label={c('Label').t`Start date`}
                value={start.date}
                max={end.date}
                onChange={updateModel('start.date')}
            />
            <TimeField
                value={start.time}
                onChange={updateModel('start.time')}
                label={c('Label').t`Start time`}
                id="startTime"
            />
            <DateField
                id="endDate"
                label={c('Label').t`End date`}
                value={end.date}
                min={start.date}
                onChange={updateModel('end.date')}
            />
            <TimeField
                value={end.time}
                onChange={updateModel('end.time')}
                label={c('Label').t`End time`}
                id="endTime"
            />
            <TimeZoneField value={timezone} onChange={updateModel('timezone')} />
            <RichTextEditor value={message} onChange={updateModel('message')} />
        </>
    );
};

AutoReplyFormFixed.propTypes = {
    model: modelShape,
    updateModel: PropTypes.func
};

export default AutoReplyFormFixed;
