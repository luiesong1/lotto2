import { Button, Input, Modal, notification, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import * as S from './style';
import TransformBox from 'components/TransformBox';
import moment from 'moment';
import { InquiryType } from 'utils/columns';
import { useMutation } from '@apollo/client';
import {
  ReplyInquiryByAdminParams,
  ReplyInquiryByAdminResponse,
  REPLY_INQUIRY_BY_ADMIN,
} from 'graphql/mutation';
import { rolesState } from 'recoil/atoms/roles';
import { useRecoilValue } from 'recoil';
import useResizeHandler from 'hooks/useHandleResize';

type Props = {
  handleCancel: () => void;
  visible: boolean;
  data: InquiryType | undefined;
  refetch: () => void;
};

export function InquiryDetailModal({
  visible,
  handleCancel,
  data,
  refetch,
}: Props) {
  const [reply, setReply] = useState('');
  const roles = useRecoilValue(rolesState);

  const { isMobile } = useResizeHandler();

  const handleReply = () => {
    if (data?.reply) {
      return handleCancel();
    }
    if (!reply.length) {
      return notification.error({ message: '답변을 입력해주세요.' });
    }
    updateInquiryReply({
      variables: {
        id: Number(data?.id ?? 0),
        reply,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
  };

  const [updateInquiryReply] = useMutation<
    ReplyInquiryByAdminResponse,
    ReplyInquiryByAdminParams
  >(REPLY_INQUIRY_BY_ADMIN, {
    onCompleted: () => {
      notification.success({ message: '답변을 등록했습니다.' });
      handleCancel();
      refetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    if (data?.reply) {
      setReply(data.reply);
    } else {
      setReply('');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={false}
      centered
      width={1020}
      bodyStyle={{
        maxHeight: '90vh',
        overflow: 'auto',
      }}
    >
      <S.Wrap>
        <S.Label>문의자</S.Label>
        {data?.user?.nickname}
      </S.Wrap>
      <S.Wrap>
        <S.Label>문의 날짜</S.Label>
        {moment(data?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      </S.Wrap>
      {data && data.inquiryImages && data.inquiryImages.length > 0 && (
        <>
          <h3>첨부 사진</h3>
          <TransformBox
            marginBottom={'30px'}
            width={'100%'}
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems="center"
          >
            {data.inquiryImages.map((v) => {
              return (
                <S.ImageWrap key={v.id}>
                  <Image
                    src={`${process.env.REACT_APP_INQUIRY_IMAGE_URL}/${v.name}`}
                    alt="image"
                    key={v.id}
                    height={300}
                    width={300}
                  />
                </S.ImageWrap>
              );
            })}
          </TransformBox>
        </>
      )}
      <h3>문의내용</h3>
      <Input.TextArea
        value={data?.content}
        readOnly
        style={{
          marginBottom: 30,
          height: 100,
        }}
      />

      <h3>문의답변</h3>
      <Input.TextArea
        value={reply}
        readOnly={(data?.reply?.length ?? -1) > 0}
        style={{
          height: 100,
        }}
        onChange={handleChange}
        disabled={!roles.some((i) => ['MASTER', 'WRITE_INQUIRY'].includes(i))}
      />

      {roles.some((i) => ['MASTER', 'WRITE_INQUIRY'].includes(i)) && (
        <TransformBox justifyContent="center" marginTop="30px">
          <Button
            type="primary"
            style={{
              width: 150,
            }}
            onClick={handleReply}
          >
            {data?.reply ? '확인' : '답변 작성'}
          </Button>
        </TransformBox>
      )}
    </Modal>
  );
}
