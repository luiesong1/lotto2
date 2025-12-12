import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

export type FaqType = {
  id: number;
  question: string;
  answer: string;
  faqKind: KindType;
  admin: {
    name: string;
  };
  createdAt: string;
};

export const faqColumns: ColumnsType<FaqType> = [
  {
    title: 'no',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: 'FAQ 종류',
    key: 'faqKind',
    dataIndex: 'faqKind',
    align: 'center',
    render: (val) => {
      return val.name;
    },
  },
  {
    title: '질문',
    key: 'question',
    dataIndex: 'question',
    align: 'center',
  },
  {
    title: '답변',
    key: 'answer',
    dataIndex: 'answer',
    align: 'center',
    render: (val: string) => {
      return val.length > 40 ? val.substr(0, 40) + '...' : val;
    },
  },
  {
    title: '작성자',
    key: 'admin',
    dataIndex: 'admin',
    align: 'center',
    render: (val) => {
      return val.name;
    },
  },
  {
    title: '생성 일자',
    key: 'createdAt',
    dataIndex: 'createdAt',
    align: 'center',
    render: (val) => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];
