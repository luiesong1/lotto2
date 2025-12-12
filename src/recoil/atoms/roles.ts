import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export type RoleStateType = string[];

export const rolesState = atom<RoleStateType>({
  key: 'rolesState',
  default: [''],
  effects_UNSTABLE: [persistAtom],
});
