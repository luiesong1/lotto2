import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  DatePicker,
  Divider,
  Input,
  notification,
  Popconfirm,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AdUploadBox } from 'components/AdUploadBox';
import TransformBox from 'components/TransformBox';
import {
  DeleteAdvertisementParams,
  DeleteAdvertisementResponse,
  DELETE_ADVERTISEMENT,
  UpdateAdvertisementParams,
  UpdateAdvertisementResponse,
  UPDATE_AD,
} from 'graphql/mutation';
import {
  SeeAdvertisementHistoryParams,
  SeeAdvertisementHistroyResponse,
  SEE_ADVERTISEMENT_HISTORY,
} from 'graphql/query';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import AdvertisementAddModal from './AdvertisementAddModal/AdvertisementAddModal';

export type AdType = {
  id: number;
  place: string;
  startPeriod: moment.Moment | null;
  endPeriod: moment.Moment | null;
  image: string;
  url?: string;
  price: string;
};

export function Ad() {
  const [adData, setAdData] = useState<AdType[]>([]);
  const [visible, setVisible] = useState(false);
  const roles = useRecoilValue(rolesState);

  const columns: ColumnsType<AdType> = [
    {
      title: 'no',
      key: 'id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '위치',
      key: 'place',
      dataIndex: 'place',
      align: 'center',
    },
    {
      title: '기간',
      key: 'period',
      align: 'center',
      render: (_val, record, idx) => {
        return (
          <DatePicker.RangePicker
            value={[record.startPeriod, record.endPeriod]}
            onChange={(e) => {
              setAdData((prev) => {
                prev[idx].startPeriod = e ? moment(e?.[0]) : null;
                prev[idx].endPeriod = e ? moment(e?.[1]) : null;
                return [...prev];
              });
            }}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i))
            }
          />
        );
      },
    },
    {
      title: '가격',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      render: (val, _record, idx) => {
        return (
          <Input
            value={val}
            onChange={(e) => {
              setAdData((prev) => {
                prev[idx].price = e.target.value;
                return [...prev];
              });
            }}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i))
            }
          />
        );
      },
    },

    {
      title: 'url 주소',
      key: 'url',
      dataIndex: 'url',
      align: 'center',
      render: (val, _record, idx) => {
        return (
          <Input.TextArea
            value={val}
            onChange={(e) => {
              setAdData((prev) => {
                prev[idx].url = e.target.value.replace(/\r?\n|\r/g, '');
                return [...prev];
              });
            }}
            style={{
              height: 100,
              resize: 'none',
            }}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i))
            }
          />
        );
      },
    },
    {
      title: '광고 이미지',
      key: 'customAd',
      align: 'center',

      render: (val, record, idx) => {
        return (
          <TransformBox flexDirection="column">
            <AdUploadBox
              idx={idx}
              setFile={setAdData}
              file={adData}
              disabled={
                !roles.some((i) =>
                  ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i),
                )
              }
            />
          </TransformBox>
        );
      },
    },
    {
      title: '관리',
      key: 'save',
      dataIndex: 'id',
      align: 'center',
      render: (_val, _record, idx) => {
        return (
          <TransformBox justifyContent="center">
            <Button
              type="primary"
              onClick={handleSave(idx)}
              disabled={
                !roles.some((i) =>
                  ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i),
                )
              }
              style={{
                marginRight: 10,
              }}
            >
              저장
            </Button>
            <Popconfirm
              okText="삭제"
              cancelText="취소"
              placement="topRight"
              title="정말 삭제하시겠습니까?"
              disabled={
                !roles.some((i) =>
                  ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i),
                )
              }
              onConfirm={handleDelete(_val)}
            >
              <Button
                danger
                type="primary"
                disabled={
                  !roles.some((i) =>
                    ['MASTER', 'WRITE_ADVERTISEMENT'].includes(i),
                  )
                }
              >
                삭제
              </Button>
            </Popconfirm>
          </TransformBox>
        );
      },
    },
  ];

  const handleClickAdd = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleRefetch = () => refetch();

  const handleDelete = (id: number) => () => {
    deleteAd({
      variables: {
        id,
      },
    });
  };

  const handleSave = (idx: number) => () => {
    if (!adData[idx].startPeriod) {
      return notification.error({ message: '시작일을 설정해주세요' });
    }
    if (!adData[idx].endPeriod) {
      return notification.error({ message: '종료일을 설정해주세요' });
    }
    if (!adData[idx].price.toString().length) {
      return notification.error({ message: '가격을 설정해주세요' });
    }
    if (!adData[idx].image.length) {
      return notification.error({ message: '광고 이미지를 설정해주세요' });
    }
    updateAd({
      variables: {
        ...adData[idx],
        url: adData[idx].url?.length ? adData[idx].url : undefined,
        startPeriod: adData[idx].startPeriod
          ? adData[idx].startPeriod
          : undefined,
        endPeriod: adData[idx].endPeriod ? adData[idx].endPeriod : undefined,
        price: Number(adData[idx].price),
      },
    });
  };

  const [seeAd, { refetch, loading }] = useLazyQuery<
    SeeAdvertisementHistroyResponse,
    SeeAdvertisementHistoryParams
  >(SEE_ADVERTISEMENT_HISTORY, {
    onCompleted: (data) => {
      setAdData(
        data.seeAdvertisementHistoryByAdmin.advertisements.map((v) => {
          return {
            ...v,
            startPeriod: moment(v.startPeriod),
            endPeriod: moment(v.endPeriod),
          };
        }),
      );
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  const [updateAd] = useMutation<
    UpdateAdvertisementResponse,
    UpdateAdvertisementParams
  >(UPDATE_AD, {
    onCompleted: () => {
      notification.success({ message: '광고 설정을 저장했습니다.' });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [deleteAd] = useMutation<
    DeleteAdvertisementResponse,
    DeleteAdvertisementParams
  >(DELETE_ADVERTISEMENT, {
    onCompleted: () => {
      notification.success({ message: '광고를 삭제했습니다.' });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    seeAd({
      variables: {
        take: 100,
        skip: 0,
      },
    });
  }, []);

  return (
    <>
      <AdvertisementAddModal
        visible={visible}
        handleCancel={handleCancel}
        refetch={handleRefetch}
      />
      <Divider>광고 영역 설정</Divider>
      <TransformBox justifyContent="flex-end">
        <Button type="primary" onClick={handleClickAdd}>
          상단 광고 추가
        </Button>
      </TransformBox>
      <Table
        columns={columns}
        dataSource={adData}
        pagination={false}
        style={{
          marginTop: 30,
        }}
        loading={loading}
        rowKey={(rec) => rec.id}
        scroll={{ x: 800 }}
      />
    </>
  );
}
