import dayjs from 'dayjs';

export function formatDate(isoDate: string, pattern: string = 'DD MMM YYYY'): string {
  return dayjs(isoDate).format(pattern);
}

export function formatTime(time: string, pattern: string = 'HH:mm'): string {
  return dayjs(`2000-01-01T${time}`).format(pattern);
}

export function isToday(isoDate: string): boolean {
  return dayjs(isoDate).isSame(dayjs(), 'day');
}
