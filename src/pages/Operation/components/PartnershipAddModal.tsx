import { useMutation } from '@apollo/client';
import { Button, Input, Modal, notification } from 'antd';
import TransformBox from 'components/TransformBox';
import {
  CreatePartnershipParams,
  CreatePartnershipResponse,
  CREATE_PARTNERSHIP,
} from 'graphql/mutation';
import React, { useState } from 'react';
import { LogoUploadBoxOnModal } from './LogoUploadBoxOnModal';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  handleRefetch: () => void;
};

export function PartnershipAddModal({
  visible,
  handleCancel,
  handleRefetch,
}: Props) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | undefined>();

  const handleAdd = () => {
    if (!url.length) {
      return notification.error({ message: '제휴사 URL을 입력해주세요.' });
    }
    if (!file) {
      return notification.error({ message: '제휴사 이미지를 추가해주세요.' });
    }
    createPartnership({
      variables: {
        file,
        url,
      },
    });
  };

  const [createPartnership] = useMutation<
    CreatePartnershipResponse,
    CreatePartnershipParams
  >(CREATE_PARTNERSHIP, {
    onCompleted: () => {
      notification.success({
        message: '제휴사를 등록했습니다.',
      });
      handleCancel();
      handleRefetch();
    },
    onError: (e) => {
      notification.error({
        message: e.message,
      });
      handleCancel();
    },
  });

  return (
    <Modal
      title="제휴사 등록"
      visible={visible}
      onCancel={handleCancel}
      footer={false}
      centered
    >
      <h3>제휴사 URL</h3>
      <Input.TextArea
        style={{
          height: 80,
          resize: 'none',
        }}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value.replace(/\r?\n|\r/g, ''));
        }}
      />
      <h3
        style={{
          marginTop: 20,
        }}
      >
        제휴사 이미지
      </h3>
      <LogoUploadBoxOnModal file={file} setFile={setFile} />
      <TransformBox justifyContent="flex-end" marginTop="30px">
        <Button type="primary" onClick={handleAdd}>
          등록
        </Button>
      </TransformBox>
    </Modal>
  );
}
