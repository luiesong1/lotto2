import { Button, Divider, notification, Popconfirm, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import TransformBox from 'components/TransformBox';
import useResizeHandler from 'hooks/useHandleResize';
import Table, { ColumnsType } from 'antd/lib/table';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  SeeAdvertisementVideoHistoryParams,
  SeeAdvertisementVideoHistoryResponse,
  SEE_ADVERTISEMENT_VIDEO_HISTORY,
} from 'graphql/query';
import {
  DeleteAdvertisementVideoParams,
  DeleteAdvertisementVideoResponse,
  DELETE_ADVERTISEMENT_VIDEO,
  UploadAdvertisementVideoParams,
  UploadAdvertisementVideoResponse,
  UPLOAD_ADVERTISEMENT_VIDEO,
} from 'graphql/mutation';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Loader from 'components/Loader';

export type VideoAdvertisement = {
  id: number;
  file: string;
};

export function VideoAd() {
  const [adData, setAdData] = useState<VideoAdvertisement[]>([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { isMobile } = useResizeHandler();

  const columns: ColumnsType<VideoAdvertisement> = [
    {
      title: '영상',
      key: 'file',
      dataIndex: 'file',
      align: 'center',
      render: (value) => {
        return (
          <TransformBox justifyContent="center">
            <ReactPlayer
              url={`${process.env.REACT_APP_ADVERTISEMENT_VIDEO_URL}/${value}`}
              controls={true}
            />
          </TransformBox>
        );
      },
      width: 1400,
    },
    {
      title: '관리',
      key: 'delete',
      dataIndex: 'id',
      align: 'center',
      render: (value) => {
        return (
          <Popconfirm
            title="삭제하시겠습니까?"
            okText="삭제"
            cancelText="취소"
            onConfirm={handleDelete(value)}
          >
            <Button type="primary" danger>
              삭제
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const handleRefetch = () => {
    if (refetch) {
      refetch({ skip, take })
        .then((data) => {
          setAdData(data.data.seeAdvertisementVideoHistory.advertisementVideos);
          setTotalCount(data.data.seeAdvertisementVideoHistory.totalCount);
          if (
            data.data.seeAdvertisementVideoHistory.advertisementVideos
              .length === 0 &&
            data.data.seeAdvertisementVideoHistory.totalCount > 0
          ) {
            setSkip(skip - take);
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const handlePagination = (e: number) => {
    setCurrent(e);
    setSkip((e - 1) * take);
  };

  const handleUpload = (e: UploadChangeParam<UploadFile<any>>) => {
    if (e.fileList[0].originFileObj) {
      createAd({
        variables: {
          file: e.fileList[0].originFileObj,
        },
      });
    }
  };

  const handleDelete = (id: number) => () => {
    deleteAd({
      variables: {
        id,
      },
    });
  };

  const [seeAd, { loading, refetch }] = useLazyQuery<
    SeeAdvertisementVideoHistoryResponse,
    SeeAdvertisementVideoHistoryParams
  >(SEE_ADVERTISEMENT_VIDEO_HISTORY, {
    onCompleted: (data) => {
      setAdData(data.seeAdvertisementVideoHistory.advertisementVideos);
      setTotalCount(data.seeAdvertisementVideoHistory.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  const [createAd, { loading: loading2 }] = useMutation<
    UploadAdvertisementVideoResponse,
    UploadAdvertisementVideoParams
  >(UPLOAD_ADVERTISEMENT_VIDEO, {
    onCompleted: () => {
      notification.success({ message: '영상광고를 생성했습니다.' });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [deleteAd, { loading: loading3 }] = useMutation<
    DeleteAdvertisementVideoResponse,
    DeleteAdvertisementVideoParams
  >(DELETE_ADVERTISEMENT_VIDEO, {
    onCompleted: () => {
      notification.success({ message: '영상광고를 삭제했습니다.' });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    seeAd({
      variables: {
        skip,
        take,
      },
    });
  }, [take, skip, seeAd]);

  return (
    <>
      {(loading2 || loading3) && <Loader />}
      <Divider>영상 광고 설정</Divider>
      <TransformBox
        justifyContent="flex-end"
        marginTop={isMobile ? '30px' : ''}
        marginBottom="30px"
      >
        <Upload
          accept=".mp4"
          onChange={handleUpload}
          beforeUpload={() => false}
          showUploadList={false}
          maxCount={1}
        >
          <Button type="primary">영상광고 등록</Button>
        </Upload>
      </TransformBox>

      <Table
        columns={columns}
        dataSource={adData}
        scroll={{ x: 800 }}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
      />
    </>
  );
}
