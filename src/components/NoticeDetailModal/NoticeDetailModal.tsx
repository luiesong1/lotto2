import { useMutation } from '@apollo/client';
import { Button, Input, Modal, notification, Popconfirm, Switch } from 'antd';
import { Editor } from 'components/Editor';
import TransformBox from 'components/TransformBox';
import {
  CreateNoticeRespons,
  CreateNoticeParams,
  CREATE_NOTICE,
  UpdateNoticeResponse,
  UpdateNoticeParams,
  UPDATE_NOTICE,
  DeleteNoticeResponse,
  DeleteNoticeParams,
  DELETE_NOTICE,
} from 'graphql/mutation';

import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { NoticeType } from 'utils/columns';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  isEdit: boolean;
  data: NoticeType | undefined;
  refetch: () => void;
};

export function NoticeDetailModal({
  visible,
  handleCancel,
  isEdit,
  data,
  refetch,
}: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(' ');
  const [isFix, setisFix] = useState(false);

  const roles = useRecoilValue(rolesState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleClick = () => {
    if (!title.length) {
      return notification.error({ message: '공지사항 제목을 입력해주세요.' });
    }
    if (!content.length) {
      return notification.error({ message: '공지사항 내용을 입력해주세요.' });
    }
    const variables = {
      title,
      content,
      isFix,
    };
    if (!isEdit) {
      createNotice({
        variables,
      });
    } else {
      updateNotice({
        variables: {
          ...variables,
          id: data?.id ?? -1,
        },
      });
    }
  };

  const handleDelete = () => {
    deleteNotice({
      variables: {
        id: data?.id ?? -1,
      },
    });
  };

  const [createNotice] = useMutation<CreateNoticeRespons, CreateNoticeParams>(
    CREATE_NOTICE,
    {
      onCompleted: () => {
        notification.success({ message: '공지사항을 등록했습니다' });
        handleCancel();
        refetch();
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  const [updateNotice] = useMutation<UpdateNoticeResponse, UpdateNoticeParams>(
    UPDATE_NOTICE,
    {
      onCompleted: () => {
        notification.success({ message: '공지사항을 수정했습니다' });
        handleCancel();
        refetch();
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  const [deleteNotice] = useMutation<DeleteNoticeResponse, DeleteNoticeParams>(
    DELETE_NOTICE,
    {
      onCompleted: () => {
        notification.success({ message: '공지사항을 삭제했습니다' });
        handleCancel();
        refetch();
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  useEffect(() => {
    if (isEdit) {
      setTitle(data?.title ?? '');
      setContent(data?.content ?? ' ');
      setisFix(data?.isFix ?? false);
    } else {
      setTitle('');
      setContent(' ');
      setisFix(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      width={1000}
      closable={false}
      centered
      footer={
        <TransformBox justifyContent="flex-end">
          <Button onClick={handleCancel}>취소</Button>
          <>
            {roles.some((i) => ['MASTER', 'WRITE_NOTICE'].includes(i)) && (
              <Button type="primary" onClick={handleClick}>
                {isEdit ? '저장' : '등록'}
              </Button>
            )}
          </>
        </TransformBox>
      }
    >
      <TransformBox
        alignItems="center"
        justifyContent="space-between"
        marginBottom="10px"
      >
        <>
          <h3>제목</h3>
          {isEdit && roles.some((i) => ['MASTER', 'WRITE_NOTICE'].includes(i)) && (
            <TransformBox>
              <Popconfirm
                title="삭제하시겠습니까?"
                okText="삭제"
                cancelText="취소"
                onConfirm={handleDelete}
              >
                <Button type="primary" danger>
                  삭제
                </Button>
              </Popconfirm>
            </TransformBox>
          )}
        </>
      </TransformBox>
      <Input value={title} onChange={handleChange} />
      <TransformBox marginBottom="30px" marginTop="30px" flexDirection="column">
        <TransformBox justifyContent="space-between" alignItems="center">
          <h3>내용</h3>
          <TransformBox>
            <span>고정</span>
            <Switch
              checked={isFix}
              style={{
                margin: '0 10px',
              }}
              onChange={setisFix}
            />
          </TransformBox>
        </TransformBox>
        <Editor state={content} setState={setContent} isNotice={true} />
      </TransformBox>
    </Modal>
  );
}
