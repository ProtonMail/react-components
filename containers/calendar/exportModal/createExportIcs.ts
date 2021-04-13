import { RequireSome } from 'proton-shared/lib/interfaces/utils';
import {
    Calendar,
    VcalVcalendar,
    VcalVeventComponent,
    VcalVtimezoneComponent,
} from 'proton-shared/lib/interfaces/calendar';
import { serialize } from 'proton-shared/lib/calendar/vcal';
import { ICAL_METHOD } from 'proton-shared/lib/calendar/constants';

interface CreateExportIcsParams {
    prodId: string;
    events: VcalVeventComponent[];
    vtimezones?: VcalVtimezoneComponent[];
    calendar: Calendar;
    defaultTzid: string;
}

type ExportVcal = RequireSome<VcalVcalendar, 'components'> & {
    'X-WR-TIMEZONE': { value: string };
    'X-WR-CALNAME': { value: string };
    'X-WR-CALDESC': { value: string };
};

export const createExportIcs = ({
    calendar,
    prodId,
    events,
    vtimezones,
    defaultTzid,
}: CreateExportIcsParams): string => {
    const exportVcal: ExportVcal = {
        component: 'vcalendar',
        components: events,
        prodid: { value: prodId },
        version: { value: '2.0' },
        method: { value: ICAL_METHOD.PUBLISH },
        calscale: { value: 'GREGORIAN' },
        'X-WR-TIMEZONE': { value: defaultTzid },
        'X-WR-CALNAME': { value: calendar.Name },
        'X-WR-CALDESC': { value: calendar.Description },
    };

    if (vtimezones?.length) {
        exportVcal.components = [...vtimezones, ...exportVcal.components];
    }

    return serialize(exportVcal);
};
