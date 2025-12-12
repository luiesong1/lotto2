import { Button, Divider, Form, Input, notification, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import * as S from './style';
import { authDescColumns } from 'utils/columns';
import TransformBox from 'components/TransformBox';
import { AdminDetailModal } from 'components/AdminDetailModal';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { OtpQrModal } from 'components/OtpQrModal';
import { OtpInputModal } from 'components/OtpInputModal';
import { AdminType, AuthDescType } from 'utils/columns/admin';
import {
  UpdateOtpSecretParams,
  UpdateOtpSecretResponse,
  UPDATE_OTP_SECRET,
} from 'graphql/mutation';
import {
  SeeAdminHistoryByAdminParams,
  SeeAdminHistoryByAdminResponse,
  SeeAdminRoleResponse,
  SEE_ADMIN_HISTORY_BY_ADMIN,
  SEE_ADMIN_ROLE,
} from 'graphql/query';
import { rolesState } from 'recoil/atoms/roles';
import { useRecoilValue } from 'recoil';
import useResizeHandler from 'hooks/useHandleResize';

export function Admin() {
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState<AdminType>();
  const [adminData, setAdminData] = useState<AdminType[]>([]);
  const [adminAuths, setAdminAuths] = useState<KindType[]>([]);
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [authDescData, setAuthDescData] = useState<AuthDescType[]>([]);

  const roles = useRecoilValue(rolesState);

  const { isMobile } = useResizeHandler();

  const handlePagination = (e: number) => {
    setSkip((e - 1) * take);
    setCurrent(e);
  };
  const inputRef = useRef<HTMLInputElement[]>([]);

  const columns: ColumnsType<AdminType> = [
    {
      title: '이메일',
      key: 'email',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: '이름',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '권한',
      key: 'adminRoles',
      dataIndex: 'adminRoles',
      render: (val) => {
        return (
          <TransformBox alignItems="center" flexDirection="column">
            {val[0].name}
            {val.length >= 2 ? ` 외 ${val.length - 1}개` : ''}
          </TransformBox>
        );
      },
      align: 'center',
    },
    {
      title: 'OTP 설정',
      key: 'OTP',
      dataIndex: 'otpSecret',
      render: (val, record) => {
        return (
          <S.OtpWrap>
            {val?.length ? (
              <Tag
                color="green"
                style={{
                  margin: 0,
                }}
              >
                설정 완료
              </Tag>
            ) : (
              <Tag
                color="error"
                style={{
                  margin: 0,
                }}
              >
                설정 미완료
              </Tag>
            )}
            {(roles.includes('WRITE_ADMIN') || roles.includes('MASTER')) && (
              <Button
                type="primary"
                size="small"
                style={{
                  marginTop: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setEmail(record.email);
                  setQrModalVisible(true);
                }}
              >
                {val?.length ? '재설정' : '설정'}
              </Button>
            )}
          </S.OtpWrap>
        );
      },
      align: 'center',
    },
    {
      title: '생성일',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (val) => {
        return moment(val).format('YYYY-MM-DD hh:mm');
      },
      align: 'center',
    },
    {
      title: '수정일',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (val) => {
        return moment(val).format('YYYY-MM-DD hh:mm');
      },
      align: 'center',
    },
  ];

  const handleCancel = () => {
    setVisible(false);
  };

  const handleClick = () => {
    setVisible(true);
    setModalData(undefined);
  };

  const handleRow = (record: AdminType) => {
    setVisible(true);
    setModalData(record);
  };

  const handleCancelOtp = () => {
    setOtp((prev) => {
      if (prev.length) {
        prev.map((_v, i) => (prev[i] = ''));
      }
      return [...prev];
    });
    setOtpModalVisible(false);
  };

  const handleCancelQr = () => {
    setQrModalVisible(false);
  };

  const handleNext = () => {
    handleCancelQr();
    setOtpModalVisible(true);
  };

  const handleFinish = () => {
    setOtpSecret({
      variables: {
        email,
        otpSecret: secret,
        code: otp.concat().join().replaceAll(',', ''),
      },
    });
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch()
        .then((data) => {
          setAdminData(data.data.seeAdminHistoryByAdmin.admins);
          setTotalCount(data.data.seeAdminHistoryByAdmin.totalCount);
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const handleFocus = (idx: number) => {
    inputRef.current[idx]!.focus();
  };

  const handleSearch = (value: { searchText?: string }) => {
    getAllAdmins({
      variables: {
        take,
        skip: 0,
        ...value,
      },
    });
    setSkip(0);
    setCurrent(1);
    setSearchText(value.searchText ?? '');
  };

  const getAuthName = (name: string) => {
    switch (name) {
      case 'DASHBOARD':
        return '대시보드';
      case 'ADMIN':
        return '관리자 계정';
      case 'USER':
        return '회원';
      case 'INQUIRY':
        return '1:1문의';
      case 'GIVEAWAY':
        return '경품 설정';
      case 'BROADCAST_INFO':
        return '방송 설정';
      case 'ADVERTISEMENT':
        return '광고 관리';
      case 'WINNING_NUMBER':
        return '당첨 결과';
      case 'PARTNERSHIP_INQUIRY':
        return '제휴 문의';
      case 'PARTNERSHIP':
        return '제휴사 관리';
      case 'FAQ':
        return 'FAQ';
      case 'NOTICE':
        return '공지사항';
      case 'POLICY':
        return '약관 관리';
      case 'NOTIFICATION':
        return '푸시알림';
      case 'REGISTRATION_INFO':
        return '발송내역 업로드';
      case 'SPORT_GAME':
        return '스포츠';
      case 'STATIC_LINK':
        return '유튜브 링크';
      case 'YOUTUBE_SUBSCRIPTION':
        return '구독 확인 여부';

      default:
        return '마스터';
    }
  };

  const getAdminAuthDesc = () => {
    const arr = adminAuths.map((v) => {
      const kind = v.name.split('_')[0] + '_';
      const authName = v.name.split(kind)[1];

      return {
        ...v,

        desc: `[${getAuthName(authName)}] ${
          kind === 'READ_' ? '조회 가능' : '버튼 사용 가능'
        }`,
      };
    });
    setAuthDescData(arr);
  };

  const [getAllAdmins, { refetch, loading }] = useLazyQuery<
    SeeAdminHistoryByAdminResponse,
    SeeAdminHistoryByAdminParams
  >(SEE_ADMIN_HISTORY_BY_ADMIN, {
    onCompleted: (data) => {
      setAdminData(data.seeAdminHistoryByAdmin.admins);
      setTotalCount(data.seeAdminHistoryByAdmin.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useQuery<SeeAdminRoleResponse>(SEE_ADMIN_ROLE, {
    onCompleted: (data) => {
      setAdminAuths(data.seeAdminRole);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  const [setOtpSecret, { loading: otpLoading }] = useMutation<
    UpdateOtpSecretResponse,
    UpdateOtpSecretParams
  >(UPDATE_OTP_SECRET, {
    onCompleted: () => {
      notification.success({ message: 'OTP를 재설정했습니다.' });
      handleCancelOtp();
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
      setOtp((prev) => {
        if (prev.length) {
          prev.map((_v, i) => (prev[i] = ''));
        }
        return [...prev];
      });
      handleFocus(0);
    },
  });
  useEffect(() => {
    getAllAdmins({
      variables: {
        take,
        skip,
        searchText,
      },
    });
  }, [take, skip]);

  useEffect(() => {
    getAdminAuthDesc();
  }, [adminAuths]);

  return (
    <>
      <AdminDetailModal
        visible={visible}
        handleCancel={handleCancel}
        admin={modalData}
        refetch={handleRefetch}
        adminRoles={adminAuths}
      />
      <OtpQrModal
        visible={qrModalVisible}
        handleCancel={handleCancelQr}
        handleNext={handleNext}
        email={email}
        otpSecret={secret}
        setOtpSecret={setSecret}
      />
      <OtpInputModal
        handleCancel={handleCancelOtp}
        visible={otpModalVisible}
        handleFinish={handleFinish}
        handleFocus={handleFocus}
        inputRef={inputRef}
        loading={otpLoading}
        otp={otp}
        setOtp={setOtp}
      />
      <Divider>관리자 계정</Divider>
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{
          marginBottom: 30,
        }}
      >
        <Form.Item name="searchText">
          <Input.Search
            enterButton
            placeholder="검색어(이메일, 이름, 연락처)"
            onSearch={(e) => {
              handleSearch({ searchText: e });
            }}
          />
        </Form.Item>
      </Form>
      {(roles.includes('WRITE_ADMIN') || roles.includes('MASTER')) && (
        <TransformBox
          justifyContent="flex-end"
          marginBottom={isMobile ? '10px' : '30px'}
        >
          <Button type="primary" onClick={handleClick}>
            관리자 생성
          </Button>
        </TransformBox>
      )}
      <Table
        columns={columns}
        dataSource={adminData}
        onRow={(rec) => {
          return {
            onClick: () => handleRow(rec),
          };
        }}
        rowKey={(rec) => rec.email}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        style={{
          marginBottom: 30,
        }}
        scroll={{ x: 1000 }}
      />
      <h3>권한 설명</h3>
      <Table
        columns={authDescColumns}
        dataSource={authDescData}
        pagination={false}
        rowKey={(rec) => rec.name}
        scroll={{ x: 800 }}
      />
    </>
  );
}
