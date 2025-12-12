import { useMutation } from '@apollo/client';
import { Button, Input, Modal, notification } from 'antd';
import TransformBox from 'components/TransformBox';
import {
  SendNotificationSpecificUserParams,
  SendNotificationSpecificUserResponse,
  SEND_NOTIFICATION_SPECIFIC_USER,
} from 'graphql/mutation/notification';
import React, { useState } from 'react';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  emails: string[];
};

export function PushNotificationModal({
  handleCancel,
  visible,
  emails,
}: Props) {
  const [title, setTitle] = useState('샘플 제목입니다. 바뀔 예정임.');
  const [body, setBody] = useState('샘플 내용입니다. 바뀔 예정임.');
  const handleSubmit = () => {
    if (!title.length) {
      return notification.error({ message: '제목을 입력해주세요.' });
    }
    if (!body.length) {
      return notification.error({ message: '내용을 입력해주세요' });
    }
    sendNotification({
      variables: {
        body,
        title,
        emails,
      },
    });
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const [sendNotification] = useMutation<
    SendNotificationSpecificUserResponse,
    SendNotificationSpecificUserParams
  >(SEND_NOTIFICATION_SPECIFIC_USER, {
    onCompleted: () => {
      notification.success({ message: '푸시알림을 전송했습니다.' });
      handleCancel();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      title="푸시알림 보내기"
      footer={false}
      centered
    >
      <TransformBox flexDirection="column" marginBottom="30px">
        <h3>제목</h3>
        <Input value={title} onChange={handleChangeTitle} />
      </TransformBox>
      <h3>내용</h3>
      <Input.TextArea
        style={{
          height: 100,
        }}
        value={body}
        onChange={handleChangeContent}
      />
      <TransformBox marginTop="30px" justifyContent="flex-end">
        <Button type="primary" onClick={handleSubmit}>
          전송
        </Button>
      </TransformBox>
    </Modal>
  );
}
