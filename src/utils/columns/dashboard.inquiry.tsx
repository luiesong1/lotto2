import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { InquiryType } from '.';

export const dashboardInquiryColumns: ColumnsType<InquiryType> = [
  {
    title: 'no',
    key: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '질문',
    key: 'content',
    dataIndex: 'content',
    align: 'center',
  },
  // {
  //   title: '닉네임',
  //   key: 'user',
  //   dataIndex: 'user',
  //   render: (val) => {
  //     return val.name;
  //   },
  //   align: 'center',
  // },
  {
    title: '접수일시',
    key: 'reportingDate',
    dataIndex: 'reportingDate',
    render: (val) => {
      return moment(val).format('YYYY-MM-DD hh:mm');
    },
    align: 'center',
  },
  {
    title: '처리일시',
    key: 'processingDate',
    dataIndex: 'processingDate',
    render: (val, record) => {
      return record.reply ? moment(val).format('YYYY-MM-DD hh:mm') : '-';
    },
    align: 'center',
  },
  {
    title: '처리',
    key: 'isReply',
    dataIndex: 'reply',
    render: (val?: string) => {
      return val ? (
        <Tag color="blue">완료</Tag>
      ) : (
        <Tag color="error">미처리</Tag>
      );
    },
    align: 'center',
  },
];
