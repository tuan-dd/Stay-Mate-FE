import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

type TDate = Date | number | string | undefined | null | Dayjs;

export function fDate(date: TDate, format = 'DD-MM-YYYY', defaultDate = '') {
  if (!defaultDate) return dayjs(date).format(format);

  return dayjs(date, defaultDate).format(format);
}

export function fDateTime(date: TDate) {
  return dayjs(date).format('dd MMM yyyy HH:mm');
}

export function fTimestamp(date: TDate) {
  return dayjs(date).unix();
}

export function fDateTimeSuffix(date: TDate) {
  return dayjs(date).format('dd-MM-yyyy hh:mm p');
}

export function fToNow(date: TDate, start?: TDate, withoutSuffix = false) {
  dayjs.extend(relativeTime);
  return dayjs(start).to(dayjs(date), withoutSuffix);
}
