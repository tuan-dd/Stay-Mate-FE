import pick from 'lodash/pick';
import omit from 'lodash/omit';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export type TProsLodash<T = unknown> = { [P in keyof T]: T[P] };

export const getDeleteFilter = (filter: string[], object: object): TProsLodash =>
  omit(object, filter);

export const getFilter = (filter: string[], object: object) => pick(object, filter);

export function throttle<Params extends any[]>(
  fun: (...args: Params) => any,
  delay: number
): (...args: Params) => void {
  let inThrottle: boolean;
  return (...args: Params) => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, delay);
      fun(...args);
    }
  };
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  delay: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export type Pros<T> = { [P in keyof T]: T[P] | any };

export function deleteValueNull(data: Pros<any>): Pros<any> {
  return Object.fromEntries(
    Object.entries(data).filter(([_key, val]) => {
      if (typeof val === 'object') {
        if (Array.isArray(val) && val.length > 0) {
          return val;
        }
        return val;
      }
      return val !== null && val !== '';
    })
  );
}

export function isValidStartDate(date: Date | string) {
  const numberStartDate = dayjs(date).set('hour', 10).set('minute', 0).unix();
  const numberDayNow = dayjs().unix();

  return numberDayNow - numberStartDate < 60 * 60 * 24;
}

export function createToast(
  content: string,
  type: 'success' | 'error' | 'warning' | 'info'
) {
  return toast[type](content);
}

export const customScrollbar = {
  '::-webkit-scrollbar': { width: 8, height: 8, bgcolor: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    backgroundColor: '#e76993',
  },
  '::-webkit-scrollbar-track': {
    borderRadius: '10px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
    backgroundColor: '#F5F5F5',
  },
};
