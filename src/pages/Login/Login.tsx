import { useLazyQuery, useQuery } from '@apollo/client';
import { Form, Input, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { loginLogo } from 'assets/images';
import { OtpInputModal } from 'components/OtpInputModal';
import {
  CreateAccessTokenByAdminParams,
  CreateAccessTokenByAdminResponse,
  CREATE_ACCESS_TOKEN_BY_ADMIN,
  CREATE_OTP_QR_CODE,
} from 'graphql/query';
import React, { useEffect, useRef, useState } from 'react';

import * as S from './style';

type SubmitType = {
  email: string;
  password: string;
};

export function Login() {
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const [form] = useForm<SubmitType>();

  const emailReg =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passwordReg =
    /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

  const handleCancel = () => {
    setOtp((prev) => {
      if (prev.length) {
        prev.map((_v, i) => (prev[i] = ''));
      }
      return [...prev];
    });
    setVisible(false);
  };
  const handleSubmit = (values: SubmitType) => {
    if (!values.email?.trim().length) {
      return notification.error({ message: '이메일을 입력해주세요' });
    }
    if (!emailReg.test(values.email)) {
      return notification.error({ message: '이메일 형식을 맞춰주세요' });
    }
    if (!values.password?.trim().length) {
      return notification.error({ message: '비밀번호를 입력해주세요' });
    }
    if (!passwordReg.test(values.password)) {
      return notification.error({
        message:
          '비밀번호는 특수문자 / 문자 / 숫자 포함 형태의 8~15자리로 입력해주세요',
      });
    }
    setVisible(true);
    handleFocus(0);
  };
  const handleFocus = (idx: number) => {
    inputRef.current[idx]!.focus();
  };

  const handleFinish = () => {
    const userInfo: SubmitType = {
      email: form.getFieldValue('email'),
      password: form.getFieldValue('password'),
    };
    const code = otp.concat().join().replaceAll(',', '');
    createAccessToken({
      variables: {
        ...userInfo,
        code,
      },
    });
  };

  const [createAccessToken, { loading }] = useLazyQuery<
    CreateAccessTokenByAdminResponse,
    CreateAccessTokenByAdminParams
  >(CREATE_ACCESS_TOKEN_BY_ADMIN, {
    onCompleted: (data) => {
      localStorage.setItem('accessToken', data.createAccessTokenByAdmin);
      handleCancel();

      return (window.location.href = '/');
    },
    onError: (e) => {
      handleCancel();
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  return (
    <S.Container>
      <OtpInputModal
        visible={visible}
        handleCancel={handleCancel}
        handleFinish={handleFinish}
        handleFocus={handleFocus}
        setOtp={setOtp}
        otp={otp}
        inputRef={inputRef}
        loading={loading}
      />
      <S.Wrapper>
        <S.FormWrap>
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <S.ImageWrap>
              <S.Image src={loginLogo} alt="logo" />
            </S.ImageWrap>
            <Form.Item label="이메일" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="비밀번호" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <S.Button type="submit">로그인</S.Button>
            </Form.Item>
          </Form>
        </S.FormWrap>
      </S.Wrapper>
    </S.Container>
  );
}
