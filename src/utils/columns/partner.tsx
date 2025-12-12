import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { phoneFormat } from 'utils/phoneFormat';

export type PartnerType = {
  id: number;
  companyName: string;
  content: string;
  name: string;
  email: string;
  phone: string;
  url?: string;
  createdAt: string;
  isConfirm: boolean;
};

export const partnerColumns: ColumnsType<PartnerType> = [
  {
    title: 'no',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '회사(기관명)',
    key: 'companyName',
    dataIndex: 'companyName',
    align: 'center',
  },
  {
    title: '문의내용',
    key: 'content',
    dataIndex: 'content',
    align: 'center',
    render: (val) => {
      return val.length > 20 ? val.substr(0, 20) + '...' : val;
    },
  },
  {
    title: '담당자명',
    key: 'name',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '이메일',
    key: 'email',
    dataIndex: 'email',
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
    title: '문의날짜',
    key: 'createdAt',
    dataIndex: 'createdAt',
    align: 'center',
    render: (val) => {
      return moment(val).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '상태',
    key: 'isConfirm',
    dataIndex: 'isConfirm',
    align: 'center',
    render: (val) => {
      return val ? <Tag color="blue">확인</Tag> : <Tag color="error">대기</Tag>;
    },
  },
];
