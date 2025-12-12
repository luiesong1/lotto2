import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { phoneFormat } from 'utils/phoneFormat';

export type WinningDetailType = {
  id: number;
  round: number;
  date: string;
  rank: number;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  address?: string;
  addressDetail?: string;
  kakaoId?: string;
  isFcmToken: boolean;
  isReceive: boolean;
  isSend: boolean;
};

export const winningDetailColumns: ColumnsType<WinningDetailType> = [
  {
    title: '회차',
    key: 'round',
    dataIndex: 'round',
    align: 'center',
  },
  {
    title: '날짜',
    key: 'date',
    dataIndex: 'date',
    align: 'center',
    render: (val) => {
      return moment(val).format('YY.MM.DD');
    },
  },
  {
    title: '등수',
    key: 'rank',
    dataIndex: 'rank',
    align: 'center',
  },
  {
    title: '이름',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '닉네임',
    key: 'nickname',
    dataIndex: 'nickname',
    align: 'center',
  },
  {
    title: '연락처',
    key: 'phone',
    dataIndex: 'phone',
    align: 'center',
    render: (val) => phoneFormat(val),
  },
  {
    title: '주소',
    key: 'address',
    align: 'center',
    render: (_, record) => {
      return `${
        record.address?.length
          ? record.address + ' ' + record.addressDetail
          : '-'
      }`;
    },
  },
  {
    title: '카카오ID',
    key: 'kakaoId',
    dataIndex: 'kakaoId',
    align: 'center',
    render: (val) => {
      return `${val?.length ? val : '-'}`;
    },
  },
  {
    title: '수령하기',
    key: 'isReceive',
    dataIndex: 'isReceive',
    align: 'center',
    render: (val) => {
      return val ? '완료' : '미완료';
    },
  },
  {
    title: '발송여부',
    key: 'isSend',
    dataIndex: 'isSend',
    align: 'center',
    render: (val) => {
      return val ? '발송완료' : '발송전';
    },
  },
  {
    title: '푸시알림 허용 여부',
    key: 'isFcmToken',
    align: 'center',
    render: (_, record) => {
      return record.isFcmToken ? (
        <Tag color="blue">O</Tag>
      ) : (
        <Tag color="error">X</Tag>
      );
    },
  },
];
