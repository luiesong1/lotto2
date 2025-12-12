import React, { useEffect, useState } from 'react';
import { notification, Table } from 'antd';

import { userInquiryColumns, InquiryType } from 'utils/columns';
import {
  SeeUserInquiryHistoryParams,
  SeeUserInquiryHistoryResponse,
  SEE_USER_INQUIRY_HISTORY_BY_ADMIN,
} from 'graphql/query';
import { useLazyQuery } from '@apollo/client';

type Props = {
  email: string;
  selectedKey: string;
};

export function UserInquiryHistory({ email, selectedKey }: Props) {
  const [inquiryData, setInquiryData] = useState<InquiryType[]>([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = (e: number) => {
    setCurrent(e);
    setSkip((e - 1) * 10);
  };

  const [getInquire, { loading }] = useLazyQuery<
    SeeUserInquiryHistoryResponse,
    SeeUserInquiryHistoryParams
  >(SEE_USER_INQUIRY_HISTORY_BY_ADMIN, {
    onCompleted: (data) => {
      setInquiryData(data.seeUserInquiryHistoryByAdmin.inquiries);
      setTotalCount(data.seeUserInquiryHistoryByAdmin.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (selectedKey === '2') {
      getInquire({
        variables: {
          take,
          skip,
          email,
        },
      });
    }
  }, [skip, selectedKey]);

  return (
    <>
      <Table
        columns={userInquiryColumns}
        dataSource={inquiryData}
        pagination={{
          current: current,
          total: totalCount,
          onChange: handlePagination,
          position: ['bottomCenter'],
        }}
        loading={loading}
        rowKey={(rec) => rec.id}
        scroll={{ x: 800 }}
      />
    </>
  );
}
