import { ColumnsType } from 'antd/lib/table';
import * as S from './style';

export type AdminType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  phone: string;
  otpSecret?: string;
  adminRoles: KindType[];
};

export type AuthDescType = {
  name: string;
  desc: string;
};

export const authDescColumns: ColumnsType<AuthDescType> = [
  {
    title: 'no',
    key: 'no',
    align: 'center',
    render: (_val, _record, idx) => {
      return idx + 1;
    },
  },
  {
    title: '권한명',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '권한내용',
    key: 'desc',
    dataIndex: 'desc',
    render: (val: string, record) => {
      return (
        <S.AuthWrap>
          <div>{record.name === 'MASTER' ? '모든 권한 사용 가능' : val}</div>
        </S.AuthWrap>
      );
    },
    align: 'center',
  },
];
