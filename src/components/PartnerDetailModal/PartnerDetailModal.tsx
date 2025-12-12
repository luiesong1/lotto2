import { useMutation } from '@apollo/client';
import { Modal, Input, Button, notification } from 'antd';
import TransformBox from 'components/TransformBox';
import {
  ConfirmPartnershipInquiryParams,
  ConfirmPartnershipInquiryResponse,
  CONFIRM_PARTNERSHIP_INQUIRY,
} from 'graphql/mutation';
import moment from 'moment';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { PartnerType } from 'utils/columns';
import { phoneFormat } from 'utils/phoneFormat';
import * as S from './style';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  data: PartnerType | undefined;
  refetch: () => void;
};

export function PartnerDetailModal({
  data,
  handleCancel,
  visible,
  refetch,
}: Props) {
  const roles = useRecoilValue(rolesState);

  const handleClick = () => {
    if (!data?.isConfirm) {
      confirmInquiry({
        variables: {
          id: data?.id ?? -1,
        },
      });
    }
    handleCancel();
  };

  const [confirmInquiry] = useMutation<
    ConfirmPartnershipInquiryResponse,
    ConfirmPartnershipInquiryParams
  >(CONFIRM_PARTNERSHIP_INQUIRY, {
    onCompleted: () => {
      notification.success({ message: '제휴문의를 확인했습니다.' });
      refetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      centered
      footer={false}
      width={1000}
    >
      <TransformBox alignItems="center" marginBottom="30px">
        <S.Label>회사(기관)명</S.Label>
        <span>{data?.companyName}</span>
      </TransformBox>
      <TransformBox alignItems="center" marginBottom="30px">
        <S.Label>담당자</S.Label>
        <span>{data?.name}</span>
      </TransformBox>
      <TransformBox alignItems="center" marginBottom="30px">
        <S.Label>전화번호</S.Label>
        <span>{phoneFormat(data?.phone ?? '')}</span>
      </TransformBox>
      <TransformBox alignItems="center" marginBottom="30px">
        <S.Label>이메일</S.Label>
        <span>{data?.email}</span>
      </TransformBox>
      {data?.url && (
        <TransformBox alignItems="center" marginBottom="30px">
          <S.Label>홈페이지</S.Label>
          <a
            target="_blank"
            rel="noreferrer"
            href={
              data.url.indexOf('http') === -1 ? `http://${data.url}` : data.url
            }
          >
            {data.url}
          </a>
        </TransformBox>
      )}
      <TransformBox alignItems="center" marginBottom="30px">
        <S.Label>문의날짜</S.Label>
        <span>{moment(data?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      </TransformBox>
      <TransformBox flexDirection="column" marginBottom="30px">
        <S.Label
          style={{
            marginBottom: 10,
          }}
        >
          문의 내용
        </S.Label>
        <Input.TextArea
          value={data?.content}
          style={{
            height: 200,
          }}
        />
      </TransformBox>
      {roles.some((i) =>
        ['MASTER', 'WRITE_PARTNERSHIP_INQUIRY'].includes(i),
      ) && (
        <TransformBox justifyContent="center">
          <>
            {!data?.isConfirm && (
              <Button
                type="primary"
                danger
                style={{
                  width: 150,
                  height: 50,
                  marginRight: 20,
                }}
                onClick={handleCancel}
              >
                취소
              </Button>
            )}
            <Button
              type="primary"
              style={{
                width: 150,
                height: 50,
              }}
              onClick={handleClick}
            >
              확인
            </Button>
          </>
        </TransformBox>
      )}
    </Modal>
  );
}
