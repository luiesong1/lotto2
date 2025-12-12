import { ColumnsType } from 'antd/lib/table';
import { phoneFormat } from 'utils/phoneFormat';

export type ShippingResultType = {
  name: string;
  nickname: string;
  phone: string;
  result: string;
};

export const shippingResultColumns: ColumnsType<ShippingResultType> = [
  {
    title: '순번',
    key: 'no',
    render: (_val, record, idx) => {
      return {
        props: {
          style: {
            backgroundColor: record.result !== '완료' ? 'red' : 'white',
            color: record.result !== '완료' ? 'white' : 'black',
            fontWeight: 'bold',
          },
        },
        children: <>{idx + 1}</>,
      };
    },
    align: 'center',
  },
  {
    title: '이름',
    key: 'name',
    dataIndex: 'name',
    render: (val, record) => {
      return {
        props: {
          style: {
            backgroundColor: record.result !== '완료' ? 'red' : 'white',
            color: record.result !== '완료' ? 'white' : 'black',
            fontWeight: 'bold',
          },
        },
        children: <>{val}</>,
      };
    },
    align: 'center',
  },
  {
    title: '닉네임',
    key: 'nickname',
    dataIndex: 'nickname',
    render: (val, record) => {
      return {
        props: {
          style: {
            backgroundColor: record.result !== '완료' ? 'red' : 'white',
            color: record.result !== '완료' ? 'white' : 'black',
            fontWeight: 'bold',
          },
        },
        children: <>{val}</>,
      };
    },
    align: 'center',
  },
  {
    title: '전화번호',
    key: 'phone',
    dataIndex: 'phone',
    render: (val, record) => {
      return {
        props: {
          style: {
            backgroundColor: record.result !== '완료' ? 'red' : 'white',
            color: record.result !== '완료' ? 'white' : 'black',
            fontWeight: 'bold',
          },
        },
        children: <>{phoneFormat(val)}</>,
      };
    },
    align: 'center',
  },
  {
    title: '상태',
    key: 'result',
    dataIndex: 'result',
    render: (val, record) => {
      return {
        props: {
          style: {
            backgroundColor: record.result !== '완료' ? 'red' : 'white',
            color: record.result !== '완료' ? 'white' : 'black',
            fontWeight: record.result !== '완료' ? 'bold' : 'normal',
          },
        },
        children: <>{val !== '완료' ? val : '성공'}</>,
      };
    },
    align: 'center',
  },
];
