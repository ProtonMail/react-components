import { useState } from 'react';
import moment from 'moment-timezone';

/* 
    BE sends times and dates in UNIX format
    FE always works with UTC
    ---
    FE converts from UTC to selected timezone before sending to BE
    FE converts from selected timezone to UTC after receiving from BE
*/
const toModel = (AutoResponder) => {
    const start = moment.unix(AutoResponder.StartTime).tz(AutoResponder.Zone);
    const end = moment.unix(AutoResponder.EndTime).tz(AutoResponder.Zone);

    const startDate = moment(start).startOf('day');
    const endDate = moment(end).startOf('day');
    const startTime =
        moment(start)
            .startOf('hour')
            .add(30 * Math.floor(moment(start).minutes() / 30), 'minutes')
            .valueOf() - startDate.valueOf();
    const endTime =
        moment(end)
            .startOf('hour')
            .add(30 * Math.floor(moment(end).minutes() / 30), 'minutes')
            .valueOf() - endDate.valueOf();
    return {
        message: AutoResponder.Message,
        duration: AutoResponder.Repeat,
        daysOfWeek: AutoResponder.DaysSelected,
        timeZone: AutoResponder.Zone,
        subject: AutoResponder.Subject,
        enabled: AutoResponder.IsEnabled,

        startDate: startDate.utc(true).valueOf(),
        endDate: endDate.utc(true).valueOf(),
        startTime,
        endTime
    };
};

const toAutoResponder = (model) => ({
    Message: model.message,
    Repeat: model.duration,
    DaysSelected: model.daysOfWeek,
    Zone: model.timeZone,
    Subject: model.subject,
    IsEnabled: model.enabled,
    StartTime: moment
        .utc(model.startDate + model.startTime)
        .tz(model.timeZone, true)
        .unix(),
    EndTime: moment
        .utc(model.endDate + model.endTime)
        .tz(model.timeZone, true)
        .unix()
});

const useAutoReplyForm = (AutoResponder) => {
    const [model, setModel] = useState(() => toModel(AutoResponder));
    const updateModel = (key) => (value) => setModel((prev) => ({ ...prev, [key]: value }));

    return {
        model,
        toAutoResponder,
        updateModel
    };
};

export default useAutoReplyForm;
