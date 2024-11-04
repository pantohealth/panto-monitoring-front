import { atom } from 'jotai';

interface FilterState {
  fromDateTime: string;
  toDateTime: string;
}

export const filterAtom = atom<FilterState>({
  fromDateTime: '',
  toDateTime: '',
});