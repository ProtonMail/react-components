import { getPropertyTzid } from 'proton-shared/lib/calendar/vcalHelper';
import { VcalVeventComponent } from 'proton-shared/lib/interfaces/calendar';
import { unique } from 'proton-shared/lib/helpers/array';

import { useGetVTimezones } from '../../hooks/useGetVtimezones';

const useExtractUniqueVTimezonesFromVevents = () => {
    const getVTimezones = useGetVTimezones();

    return async (vevents: VcalVeventComponent[]) => {
        return Object.values(
            await getVTimezones(
                unique(
                    vevents.flatMap(({ dtstart, dtend }) =>
                        [dtstart, dtend]
                            .flatMap((date) => (date ? [date] : []))
                            .map(getPropertyTzid)
                            .flatMap((tzid) => (tzid ? [tzid] : []))
                    )
                )
            )
        ).flatMap((vtimezoneObj) => (vtimezoneObj ? [vtimezoneObj.vtimezone] : []));
    };
};

export default useExtractUniqueVTimezonesFromVevents;
