import { startOfWeek } from 'date-fns';

export type WeekStartsOn = Pick<Parameters<typeof startOfWeek>[1] & {}, 'weekStartsOn'>['weekStartsOn'];

export type DateTuple = [Date | undefined, Date | undefined];
