import { useMutation } from '@apollo/client';
import {
  Button,
  Divider,
  Input,
  notification,
  Radio,
  RadioChangeEvent,
} from 'antd';
import Loader from 'components/Loader';
import { SearchUserForm } from 'components/SearchUserForm';
import TransformBox from 'components/TransformBox';
import {
  SendNotificationAllUserParams,
  SendNotificationAllUserResponse,
  SendNotificationSpecificUserParams,
  SendNotificationSpecificUserResponse,
  SEND_NOTIFICATION_ALL_USER,
  SEND_NOTIFICATION_SPECIFIC_USER,
} from 'graphql/mutation/notification';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import * as S from './style';

type PushNotificationType = {
  title: string;
  body: string;
};

export function PushNotification() {
  const [pushNotificationData, setPushNotificationData] =
    useState<PushNotificationType>({
      body: '',

      title: '',
    });
  const [email, setEmail] = useState('');
  const [isAllUser, setIsAllUser] = useState(true);

  const roles = useRecoilValue(rolesState);

  const handleChange = (
    e:
      | RadioChangeEvent
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    keyword: string,
  ) => {
    setPushNotificationData({
      ...pushNotificationData,
      [keyword]: e.target.value,
    });
  };

  const handleClick = () => {
    if (!isAllUser && !email.length) {
      return notification.error({
        message: '푸시알림을 전송할 회원을 선택해주세요',
      });
    }
    if (!pushNotificationData.title.length) {
      return notification.error({ message: '푸시알림 제목을 입력해주세요' });
    }
    if (!pushNotificationData.body.length) {
      return notification.error({ message: '푸시알림 내용을 입력해주세요' });
    }
    if (isAllUser) {
      sendNotificationAllUser({
        variables: {
          ...pushNotificationData,
        },
      });
    } else {
      sendNotificationSpecificUser({
        variables: {
          ...pushNotificationData,
          emails: [email],
        },
      });
    }
  };

  const [sendNotificationAllUser, { loading: loading1 }] = useMutation<
    SendNotificationAllUserResponse,
    SendNotificationAllUserParams
  >(SEND_NOTIFICATION_ALL_USER, {
    onCompleted: () => {
      notification.success({ message: '푸시알림을 발송했습니다.' });
      setPushNotificationData({
        body: '',
        title: '',
      });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [sendNotificationSpecificUser, { loading: loading2 }] = useMutation<
    SendNotificationSpecificUserResponse,
    SendNotificationSpecificUserParams
  >(SEND_NOTIFICATION_SPECIFIC_USER, {
    onCompleted: () => {
      notification.success({ message: '푸시알림을 발송했습니다.' });
      setPushNotificationData({
        body: '',
        title: '',
      });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  return (
    <>
      {(loading1 || loading2) && <Loader />}
      <Divider>푸시알림</Divider>
      <S.Container>
        <S.Wrapper>
          <h3>받는대상</h3>
          <Radio.Group
            onChange={(e) => setIsAllUser(e.target.value)}
            value={isAllUser}
          >
            <Radio value={true}>전체회원</Radio>
            {roles.some((v) => ['READ_USER', 'MASTER'].includes(v)) && (
              <Radio value={false}>특정회원</Radio>
            )}
          </Radio.Group>
        </S.Wrapper>
        {!isAllUser && (
          <S.Wrapper>
            <h3>회원</h3>
            <SearchUserForm setEmail={setEmail} />
          </S.Wrapper>
        )}
        <S.Wrapper>
          <h3>제목</h3>
          <Input
            onChange={(e) => {
              handleChange(e, 'title');
            }}
            value={pushNotificationData.title}
          />
        </S.Wrapper>
        <S.Wrapper>
          <h3>내용</h3>
          <Input.TextArea
            style={{
              height: 200,
            }}
            onChange={(e) => {
              handleChange(e, 'body');
            }}
            value={pushNotificationData.body}
          />
        </S.Wrapper>
        {roles.some((v) => ['WRITE_NOTIFICATION', 'MASTER'].includes(v)) && (
          <TransformBox justifyContent="flex-end">
            <Button type="primary" onClick={handleClick}>
              보내기
            </Button>
          </TransformBox>
        )}
      </S.Container>
    </>
  );
}
