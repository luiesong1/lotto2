import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

export type WinningHistoryType = {
  round: number;
  date: string;
  winningNumber: string;
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
};

export const winningHistoryColumns: ColumnsType<WinningHistoryType> = [
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
    title: '당첨번호',
    key: 'winningNumber',
    dataIndex: 'winningNumber',
    align: 'center',
  },
  {
    title: '1등',
    key: 'one',
    dataIndex: 'one',
    align: 'center',
    render: (val) => {
      return `${val}명`;
    },
  },
  {
    title: '2등',
    key: 'two',
    dataIndex: 'two',
    align: 'center',
    render: (val) => {
      return `${val}명`;
    },
  },
  {
    title: '3등',
    key: 'three',
    dataIndex: 'three',
    align: 'center',
    render: (val) => {
      return `${val}명`;
    },
  },
  {
    title: '4등',
    key: 'four',
    dataIndex: 'four',
    align: 'center',
    render: (val) => {
      return `${val}명`;
    },
  },
  {
    title: '5등',
    key: 'five',
    dataIndex: 'five',
    align: 'center',
    render: (val) => {
      return `${val}명`;
    },
  },
];
