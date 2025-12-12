import { Button, Divider, Form, Input, notification, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import TransformBox from 'components/TransformBox';
import { policyColumns, PolicyType } from 'utils/columns';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PolicyDetailModal } from 'components/PolicyDetailModal';
import {
  SeePolicyHistoryByAdminParams,
  SeePolicyHistoryByAdminResponse,
  SeePolicyKindResponse,
  SEE_POLICY_HISTORY_BY_ADMIN,
  SEE_POLICY_KIND,
} from 'graphql/query';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import useResizeHandler from 'hooks/useHandleResize';

export function Policy() {
  const [policyData, setPolicyData] = useState<PolicyType[]>([]);
  const [policyKind, setPolicyKind] = useState<KindType[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalData, setModalData] = useState<PolicyType>();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState('');

  const roles = useRecoilValue(rolesState);

  const { isMobile } = useResizeHandler();

  const handlePagination = (e: number) => {
    setSkip((e - 1) * take);
    setCurrent(e);
  };

  const handleClick = () => {
    setVisible(true);
    setIsEdit(false);
  };

  const handleRow = (record: PolicyType) => {
    setVisible(true);
    setIsEdit(true);
    setModalData(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch()
        .then((data) => {
          setPolicyData(data.data.seePolicyHistoryByAdmin.policies);
          setTotalCount(data.data.seePolicyHistoryByAdmin.totalCount);
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const handleSearch = (value: { searchText?: string }) => {
    getPolicies({
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

  const [getPolicies, { refetch, loading }] = useLazyQuery<
    SeePolicyHistoryByAdminResponse,
    SeePolicyHistoryByAdminParams
  >(SEE_POLICY_HISTORY_BY_ADMIN, {
    onCompleted: (data) => {
      setPolicyData(data.seePolicyHistoryByAdmin.policies);
      setTotalCount(data.seePolicyHistoryByAdmin.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useQuery<SeePolicyKindResponse>(SEE_POLICY_KIND, {
    onCompleted: (data) => {
      setPolicyKind(data.seePolicyKind);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getPolicies({
      variables: {
        skip,
        take,
        searchText,
      },
    });
  }, [take, skip]);

  return (
    <>
      <PolicyDetailModal
        data={modalData}
        handleCancel={handleCancel}
        visible={visible}
        isEdit={isEdit}
        refetch={handleRefetch}
        policyKind={policyKind}
      />
      <Divider>약관 관리</Divider>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="searchText">
          <Input.Search
            enterButton
            placeholder="검색어(종류, 내용)"
            onSearch={(e) => {
              handleSearch({ searchText: e });
            }}
          />
        </Form.Item>
      </Form>

      {roles.some((i) => ['MASTER', 'WRITE_POLICY'].includes(i)) && (
        <TransformBox
          marginTop={isMobile ? '30px' : ''}
          justifyContent="flex-end"
        >
          <Button type="primary" onClick={handleClick}>
            약관 등록
          </Button>
        </TransformBox>
      )}
      <Table
        columns={policyColumns}
        dataSource={policyData}
        onRow={(rec) => {
          return {
            onClick: () => handleRow(rec),
          };
        }}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        loading={loading}
        rowKey={(rec) => rec.id}
        scroll={{ x: 800 }}
        style={{
          marginTop: isMobile ? '10px' : '30px',
        }}
      />
    </>
  );
}
