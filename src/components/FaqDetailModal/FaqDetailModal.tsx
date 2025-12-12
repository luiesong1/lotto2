import { useMutation } from '@apollo/client';
import { Button, Input, Modal, notification, Popconfirm, Select } from 'antd';
import { Editor } from 'components/Editor';
import TransformBox from 'components/TransformBox';
import {
  CreateFaqResponse,
  CreateFaqParams,
  CREATE_FAQ,
  UpdateFaqResponse,
  UpdateFaqParams,
  UPDATE_FAQ,
  DeleteFaqResponse,
  DeleteFaqParams,
  DELETE_FAQ,
} from 'graphql/mutation/customer';

import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { FaqType } from 'utils/columns';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  isEdit: boolean;
  data: FaqType | undefined;
  refetch: () => void;
  faqKind: KindType[];
};

export function FaqDetailModal({
  visible,
  handleCancel,
  isEdit,
  data,
  refetch,
  faqKind,
}: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqKindId, setFaqKindId] = useState(1);

  const roles = useRecoilValue(rolesState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {
    if (!question.length) {
      return notification.error({ message: 'FAQ 질문을 입력해주세요' });
    }
    if (!answer.length) {
      return notification.error({ message: 'FAQ 답변을 입력해주세요' });
    }
    const variables = {
      question,
      answer,
      faqKindId,
    };
    if (!isEdit) {
      createFaq({
        variables,
      });
    } else {
      updateFaq({
        variables: {
          ...variables,
          id: data?.id ?? -1,
        },
      });
    }
  };

  const handleDelete = () => {
    deleteFaq({
      variables: {
        id: data?.id ?? 0,
      },
    });
  };

  const [createFaq] = useMutation<CreateFaqResponse, CreateFaqParams>(
    CREATE_FAQ,
    {
      onCompleted: () => {
        notification.success({ message: 'FAQ를 생성했습니다.' });
        handleCancel();
        refetch();
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  const [updateFaq] = useMutation<UpdateFaqResponse, UpdateFaqParams>(
    UPDATE_FAQ,
    {
      onCompleted: () => {
        notification.success({ message: 'FAQ를 수정했습니다.' });
        handleCancel();
        refetch();
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  const [deleteFaq] = useMutation<DeleteFaqResponse, DeleteFaqParams>(
    DELETE_FAQ,
    {
      onCompleted: () => {
        notification.success({ message: 'FAQ를 삭제했습니다.' });
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
      setQuestion(data?.question ?? '');
      setAnswer(data?.answer ?? '');
      setFaqKindId(data?.faqKind.id ?? faqKind[0]?.id);
    } else {
      setQuestion('');
      setAnswer('');
      setFaqKindId(faqKind[0]?.id);
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
            {roles.some((i) => ['MASTER', 'WRITE_FAQ'].includes(i)) && (
              <Button type="primary" onClick={handleSubmit}>
                {isEdit ? '저장' : '등록'}
              </Button>
            )}
          </>
        </TransformBox>
      }
    >
      <TransformBox alignItems="center" justifyContent="space-between">
        <>
          <h3>FAQ 종류</h3>
          {isEdit && roles.some((i) => ['MASTER', 'WRITE_FAQ'].includes(i)) && (
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
      <Select
        onChange={setFaqKindId}
        value={faqKindId}
        style={{
          width: 150,
        }}
      >
        {faqKind.map((v) => {
          return (
            <Select.Option value={v.id} key={v.id}>
              {v.name}
            </Select.Option>
          );
        })}
      </Select>
      <TransformBox
        alignItems="center"
        justifyContent="space-between"
        marginTop="30px"
      >
        <h3>질문</h3>
      </TransformBox>
      <Input value={question} onChange={handleChange} />
      <TransformBox marginBottom="30px" marginTop="30px" flexDirection="column">
        <h3>답변</h3>
        <Editor state={answer} setState={setAnswer} />
      </TransformBox>
    </Modal>
  );
}
