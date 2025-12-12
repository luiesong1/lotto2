import { useLazyQuery, useQuery } from '@apollo/client';
import { Modal, notification, Image, Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import { GetAdminOtpQrCodeReponse, GET_ADMIN_OTP_QR_CODE } from 'graphql/query';
import * as S from './style';
import TransformBox from 'components/TransformBox';
import {
  CreateOtpQrCodeParams,
  CreateOtpQrCodeResponse,
  CREATE_OTP_QR_CODE,
} from 'graphql/query';

type Props = {
  email: string;
  visible: boolean;
  handleCancel: () => void;
  handleNext: () => void;
  otpSecret: string;
  setOtpSecret: React.Dispatch<React.SetStateAction<string>>;
};

export function OtpQrModal({
  email,
  visible,
  handleNext,
  handleCancel,
  otpSecret,
  setOtpSecret,
}: Props) {
  const [imageUrl, setImageUrl] = useState('');

  const handleCopy = () => {
    navigator.clipboard
      .writeText(otpSecret)
      .then(() => {
        notification.success({ message: 'OTP KEY를 복사했습니다.' });
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  const [getOtpQr] = useLazyQuery<
    CreateOtpQrCodeResponse,
    CreateOtpQrCodeParams
  >(CREATE_OTP_QR_CODE, {
    onCompleted: (data) => {
      setImageUrl(data.createOtpQrCode.url);
      setOtpSecret(data.createOtpQrCode.otpSecret);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    if (email.length && visible === true) {
      getOtpQr({
        variables: {
          email,
        },
      });
    }
  }, [visible]);

  return (
    <Modal
      centered
      footer={false}
      onCancel={handleCancel}
      visible={visible}
      closable={false}
    >
      <S.QRWrap>
        <Image src={imageUrl} />
      </S.QRWrap>
      <TransformBox
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <S.KeyWrap>key: {otpSecret}</S.KeyWrap>
        <Button onClick={handleCopy}>복사</Button>
      </TransformBox>
      <TransformBox justifyContent="flex-end" marginTop="20px">
        <Button type="primary" onClick={handleNext}>
          다음
        </Button>
      </TransformBox>
    </Modal>
  );
}
