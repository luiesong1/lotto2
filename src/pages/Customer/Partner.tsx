import { useLazyQuery } from '@apollo/client';
import { Divider, Form, Input, notification, Table } from 'antd';
import { PartnerDetailModal } from 'components/PartnerDetailModal';
import {
  SeePartnershipInquiryHistoryByAdminParams,
  SeePartnershipInquiryHistoryByAdminResponse,
  SEE_PARTNERSHIP_INQUIRY_HISTORY,
} from 'graphql/query';
import React, { useEffect, useState } from 'react';
import { PartnerType, partnerColumns } from 'utils/columns';

export function Partner() {
  const [partnerData, setPartnerData] = useState<PartnerType[]>([]);
  const [modalData, setModalData] = useState<PartnerType>();
  const [visible, setVisible] = useState(false);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');

  const handlePagination = (e: number) => {
    setCurrent(e);
    setSkip((e - 1) * take);
  };

  const handleRow = (record: PartnerType) => {
    setVisible(true);
    setModalData(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch({ searchText, skip, take })
        .then((data) => {
          const { partnershipInquiries, totalCount } =
            data.data.seePartnershipInquiryHistoryByAdmin;
          setPartnerData(partnershipInquiries);
          setTotalCount(totalCount);
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const handleSearch = (value: { searchText?: string }) => {
    seePartnershipInquiry({
      variables: {
        searchText: value.searchText,
        skip: 0,
        take,
      },
    });
    setSkip(0);
    setCurrent(1);
    setSearchText(value.searchText ?? '');
  };

  const [seePartnershipInquiry, { loading, refetch }] = useLazyQuery<
    SeePartnershipInquiryHistoryByAdminResponse,
    SeePartnershipInquiryHistoryByAdminParams
  >(SEE_PARTNERSHIP_INQUIRY_HISTORY, {
    onCompleted: (data) => {
      const { partnershipInquiries, totalCount } =
        data.seePartnershipInquiryHistoryByAdmin;
      setPartnerData(partnershipInquiries);
      setTotalCount(totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    seePartnershipInquiry({
      variables: {
        take,
        skip,
        searchText,
      },
    });
  }, [take, skip]);

  return (
    <>
      <PartnerDetailModal
        visible={visible}
        handleCancel={handleCancel}
        data={modalData}
        refetch={handleRefetch}
      />
      <Divider>제휴문의</Divider>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="searchText">
          <Input.Search
            enterButton
            placeholder="검색어(회사명, 문의내용, 담당자명, 이메일, 연락처)"
            onSearch={(e) => {
              handleSearch({ searchText: e });
            }}
          />
        </Form.Item>
      </Form>

      <Table
        columns={partnerColumns}
        dataSource={partnerData}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        onRow={(record) => {
          return {
            onClick: () => handleRow(record),
          };
        }}
        loading={loading}
        rowKey={(rec) => rec.id}
        scroll={{ x: 1200 }}
        style={{
          marginTop: 30,
        }}
      />
    </>
  );
}
