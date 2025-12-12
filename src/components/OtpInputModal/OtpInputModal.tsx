import { Modal } from 'antd';
import Loader from 'components/Loader';
import React, { useEffect } from 'react';
import * as S from './style';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  otp: string[];
  loading: boolean;
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  handleFinish: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement[]>;
  handleFocus: (idx: number) => void;
};

export function OtpInputModal({
  visible,
  setOtp,
  otp,
  loading,
  handleCancel,
  inputRef,
  handleFocus,
  handleFinish,
}: Props) {
  useEffect(() => {
    if (otp[5].length) {
      handleFinish();
    }
  }, [otp]);
  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={false}
      centered
      closable={false}
      width={800}
      confirmLoading={loading}
    >
      <S.ModalTitle>OTP 인증번호</S.ModalTitle>
      {loading && <Loader />}
      <S.OtpWrap>
        {otp.map((v, i) => {
          return (
            <S.OtpInput
              ref={(elem) => {
                if (elem) {
                  inputRef.current[i] = elem;
                }
              }}
              key={i}
              maxLength={1}
              value={otp[i]}
              pattern="[0-9]*"
              inputMode="numeric"
              onChange={(e) => {
                setOtp((prev) => {
                  if (/[0-9]/g.test(e.target.value)) {
                    prev[i] = e.target.value;
                  }
                  return [...prev];
                });
                if (e.target.value.length > 0) {
                  if (i === 5) {
                    return;
                  }
                  if (/[0-9]/g.test(e.target.value)) {
                    handleFocus(i + 1);
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && i !== 0 && !otp[i].length) {
                  handleFocus(i - 1);
                  setOtp((prev) => {
                    prev[i - 1] = '';
                    return [...prev];
                  });
                }
              }}
            />
          );
        })}
      </S.OtpWrap>
    </Modal>
  );
}
