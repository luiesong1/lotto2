import { useLazyQuery } from '@apollo/client';
import { Button, Divider, Form, Input, Tag, Table, notification } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { InquiryDetailModal } from 'components/InquiryDetailModal';
import { UserDetailModal } from 'components/UserDetailModal';
import {
  SeeAllInquiryHistoryByAdminParams,
  SeeAllInquiryHistoryByAdminResponse,
  SEE_ALL_INQUIRY_HISTORY_BY_ADMIN,
} from 'graphql/query';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { InquiryType } from 'utils/columns';

export function Inquiry() {
  const [visible, setVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalData, setModalData] = useState<InquiryType>();
  const [inquiryData, setInquiryData] = useState<InquiryType[]>([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');

  const roles = useRecoilValue(rolesState);

  const columns: ColumnsType<InquiryType> = [
    {
      title: 'no',
      key: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '문의 종류',
      key: 'inquiryKind',
      dataIndex: 'inquiryKind',
      align: 'center',
      render: (val) => {
        return val.name;
      },
    },
    {
      title: '문의내용',
      key: 'content',
      dataIndex: 'content',
      align: 'center',
    },
    {
      title: '닉네임',
      key: 'user',
      dataIndex: 'user',
      render: (val, record) => {
        return (
          <Button
            type="link"
            onClick={(e) => {
              setVisible(true);
              setModalData(record);
              e.stopPropagation();
            }}
          >
            {val.nickname}
          </Button>
        );
      },
      align: 'center',
    },
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

  const handlePagination = (e: number) => {
    setCurrent(e);
    setSkip((e - 1) * take);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRow = (data: InquiryType) => {
    setDetailModalVisible(true);
    setModalData(data);
  };

  const handleCancelDetail = () => {
    setDetailModalVisible(false);
  };

  const handleSearch = (values: { searchText?: string }) => {
    getInquiry({
      variables: {
        take,
        skip: 0,
        searchText: values.searchText,
      },
    });
    setCurrent(1);
    setSkip(0);
    setSearchText(values.searchText ?? '');
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch({ take, skip })
        .then((data) => {
          setInquiryData(data.data.seeAllInquiryHistoryByAdmin.inquiries);
          setTotalCount(data.data.seeAllInquiryHistoryByAdmin.totalCount);
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const [getInquiry, { loading, refetch }] = useLazyQuery<
    SeeAllInquiryHistoryByAdminResponse,
    SeeAllInquiryHistoryByAdminParams
  >(SEE_ALL_INQUIRY_HISTORY_BY_ADMIN, {
    onCompleted: (data) => {
      setInquiryData(data.seeAllInquiryHistoryByAdmin.inquiries);
      setTotalCount(data.seeAllInquiryHistoryByAdmin.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getInquiry({
      variables: {
        skip,
        take,
        searchText,
      },
    });
  }, [skip, take]);

  return (
    <>
      {(roles.includes('READ_USER') || roles.includes('MASTER')) && (
        <UserDetailModal
          handleCancel={handleCancel}
          visible={visible}
          email={modalData?.user?.email ?? ''}
        />
      )}
      <InquiryDetailModal
        data={modalData}
        visible={detailModalVisible}
        handleCancel={handleCancelDetail}
        refetch={handleRefetch}
      />
      <Divider>1:1 문의</Divider>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="searchText">
          <Input.Search enterButton placeholder="검색어(문의내용, 닉네임)" />
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={inquiryData}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        style={{
          marginTop: 30,
        }}
        onRow={(record) => {
          return {
            onClick: () => handleRow(record),
          };
        }}
        loading={loading}
        scroll={{ x: 800 }}
      />
    </>
  );
}
