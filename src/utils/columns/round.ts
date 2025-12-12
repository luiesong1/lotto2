import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { PrizeType } from 'pages/Operation/Prize';

export type RoundHistoryType = {
  id: number;
  round: number;
  date: string;
  giveaways: PrizeType[];
  broadcastInfo: {
    offAirText: string;
    onAirText: string;
  };
};

const rank = [1, 2, 3, 4, 5];

const prizeColumns: ColumnsType<RoundHistoryType> = rank.map((v, i) => {
  return {
    title: `${v}등`,
    key: i,
    render: (_val, record) => {
      return record.giveaways.find((v2) => v2.rank === v)?.name;
    },
    align: 'center',
  };
});

const textColumns: ColumnsType<RoundHistoryType> = [
  {
    title: '방송 전 텍스트',
    key: 'offAirText',
    dataIndex: 'broadcastInfo',
    align: 'center',
    render: (val) => {
      return val.offAirText;
    },
  },
  {
    title: '방송중 텍스트',
    key: 'onAirText',
    dataIndex: 'broadcastInfo',
    align: 'center',
    render: (val) => {
      return val.onAirText;
    },
  },
];

export const RoundHistoryColumns: ColumnsType<RoundHistoryType> = [
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
      return moment(val).format('YYYY-MM-DD');
    },
  },
  {
    title: '경품',
    children: prizeColumns,
  },
  {
    title: '텍스트 등록',
    children: textColumns,
  },
];
