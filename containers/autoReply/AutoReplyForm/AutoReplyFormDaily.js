import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';

import DurationField from './fields/DurationField';
import DaysOfWeekField from './fields/DaysOfWeekField';
import TimeZoneField from './fields/TimeZoneField';
import TimeField from './fields/TimeField';
import RichTextEditor from '../../../components/input/RichTextEditor';
import Alert from '../../../components/alert/Alert';
import { modelShape } from './autoReplyShapes';

const AutoReplyFormDaily = ({ model: { daysOfWeek, duration, start, end, timezone, message }, updateModel }) => {
    return (
        <>
            <DurationField value={duration} onChange={updateModel('duration')} />
            <Alert>{c('Info')
                .t`Auto-reply is always active on the days of the week you select, between the selected hours.`}</Alert>
            <DaysOfWeekField value={daysOfWeek} onChange={updateModel('daysOfWeek')} />
            <TimeField
                value={start.time}
                onChange={updateModel('start.time')}
                label={c('Label').t`Start time`}
                id="startTime"
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

AutoReplyFormDaily.propTypes = {
    model: modelShape,
    updateModel: PropTypes.func
};

export default AutoReplyFormDaily;
