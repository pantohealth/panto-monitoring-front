import { atom } from 'jotai';

export interface FilterState {
  fromDateTime: string;
  toDateTime: string;
  exactDateTime: string;
  isExactSearch: boolean;
}

export const filterAtom = atom<FilterState>({
  fromDateTime: '',
  toDateTime: '',
  exactDateTime: '',
  isExactSearch: false,
});