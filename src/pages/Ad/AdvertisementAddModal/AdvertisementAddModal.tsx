import { useMutation } from '@apollo/client';
import { DatePicker, Modal, Input, Button, notification } from 'antd';
import TransformBox from 'components/TransformBox';
import {
  CreateAdvertisementParams,
  CreateAdvertisementResponse,
  CREATE_ADVERTISEMENT,
} from 'graphql/mutation';
import React, { useEffect, useState } from 'react';
import { UploadBox } from '../UploadBoxOnModal';

type Props = {
  visible: boolean;
  handleCancel: () => void;
  refetch: () => void;
};

const InputStyle = {
  width: 250,
};

export type Variables = {
  startPeriod: moment.Moment | null;
  endPeriod: moment.Moment | null;
  price: string;
  url: string;
  image: string;
  [index: string]: any;
};

export default function AdvertisementAddModal({
  handleCancel,
  visible,
  refetch,
}: Props) {
  const [variables, setVariables] = useState<Variables>({
    endPeriod: null,
    image: '',
    price: '',
    startPeriod: null,
    url: '',
  });

  const handleChangeDate = (e: moment.Moment | null, keyword: string) => {
    setVariables((prev) => {
      if (prev) {
        prev[keyword] = e;
      }
      return { ...prev };
    });
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyword: string,
  ) => {
    setVariables((prev) => {
      if (prev) {
        prev[keyword] = e.target.value;
      }
      return { ...prev };
    });
  };

  const handleAdd = () => {
    if (!variables.startPeriod) {
      return notification.error({ message: '시작일을 입력해주세요.' });
    }
    if (!variables.endPeriod) {
      return notification.error({ message: '종료일을 입력해주세요.' });
    }
    if (variables.startPeriod.isAfter(variables.endPeriod)) {
      return notification.error({
        message: '시작일은 종료일보다 이후일 수 없습니다.',
      });
    }
    if (!variables.price.length) {
      return notification.error({ message: '가격을 입력해주세요.' });
    }
    if (/\D/g.test(variables.price)) {
      return notification.error({ message: '가격은 숫자로만 입력해주세요.' });
    }
    if (!variables.url.length) {
      return notification.error({ message: 'url을 입력해주세요.' });
    }
    if (!variables.image.length) {
      return notification.error({ message: '광고 이미지를 추가해주세요 ' });
    }
    createAd({
      variables: {
        ...variables,
        place: 'TOP',
        price: Number(variables.price),
      },
    });
  };

  const [createAd] = useMutation<
    CreateAdvertisementResponse,
    CreateAdvertisementParams
  >(CREATE_ADVERTISEMENT, {
    onCompleted: () => {
      notification.success({
        message: '상단 광고를 추가했습니다.',
      });
      refetch();
      handleCancel();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    if (visible) {
      setVariables({
        endPeriod: null,
        image: '',
        price: '',
        startPeriod: null,
        url: '',
      });
    }
  }, [visible]);

  return (
    <Modal
      title="상단 광고 추가"
      footer={false}
      width={800}
      visible={visible}
      onCancel={handleCancel}
      centered
      bodyStyle={{
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <TransformBox flexDirection="column">
        <h3>시작일</h3>
        <DatePicker
          style={InputStyle}
          onChange={(e) => handleChangeDate(e, 'startPeriod')}
          value={variables.startPeriod}
        />
      </TransformBox>
      <TransformBox flexDirection="column" marginTop="30px">
        <h3>종료일</h3>
        <DatePicker
          style={InputStyle}
          onChange={(e) => handleChangeDate(e, 'endPeriod')}
          value={variables.endPeriod}
        />
      </TransformBox>
      <TransformBox flexDirection="column" marginTop="30px">
        <h3>가격</h3>
        <Input
          style={InputStyle}
          onChange={(e) => handleChangeText(e, 'price')}
          value={variables.price}
        />
      </TransformBox>
      <TransformBox flexDirection="column" marginTop="30px">
        <h3>url 주소</h3>
        <Input
          style={InputStyle}
          onChange={(e) => handleChangeText(e, 'url')}
          value={variables.url}
        />
      </TransformBox>
      <TransformBox flexDirection="column" marginTop="30px">
        <h3>광고 이미지</h3>
        <UploadBox file={variables} setFile={setVariables} />
      </TransformBox>
      <TransformBox justifyContent="flex-end">
        <Button type="primary" onClick={handleAdd}>
          추가
        </Button>
      </TransformBox>
    </Modal>
  );
}
