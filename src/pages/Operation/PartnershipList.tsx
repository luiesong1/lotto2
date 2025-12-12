import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Divider,
  Input,
  message,
  notification,
  Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import TransformBox from 'components/TransformBox';
import {
  DeletePartnershipParams,
  DeletePartnershipResponse,
  DELETE_PARTNERSHIP,
  UpdatePartnershipParams,
  UpdatePartnershipResponse,
  UPDATE_PARTNERSHIP,
} from 'graphql/mutation';
import {
  SeePartnershipHistoryResponse,
  SeePartnershipHistroyParams,
  SEE_PARTNERSHIP_HISTORY,
} from 'graphql/query';
import useResizeHandler from 'hooks/useHandleResize';
import React, { useEffect, useState } from 'react';
import { DragSortingTable } from './components/DragableTable';
import { LogoUploadBox } from './components/LogoUploadBox';
import { PartnershipAddModal } from './components/PartnershipAddModal';

export type Partnership = {
  id: number;
  no: number;
  url: string;
  image: string;
};

export type FileType = {
  id: number;
  file: File;
};

export function PartnershipList() {
  const [partnershipData, setPartnershipData] = useState<Partnership[]>([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [files, setFiles] = useState<FileType[]>([]);
  const [visible, setVisible] = useState(false);

  const { isMobile } = useResizeHandler();

  const handlePagination = (e: number) => {
    setSkip((e - 1) * take);
    setCurrent(e);
  };

  const handleClickSave = (idx: number) => () => {
    if (!partnershipData[idx].url.length) {
      return notification.error({
        message: 'URL 주소를 입력해주세요.',
      });
    }
    const file = files.find((v) => v.id === partnershipData[idx].id)?.file;
    updatePartnership({
      variables: {
        id: partnershipData[idx].id,
        url: partnershipData[idx].url,
        file,
      },
    });
  };

  const handleClick = () => setVisible(true);

  const handleCancel = () => setVisible(false);

  const handleDelete = (id: number) => () => {
    deletePartnership({
      variables: {
        id,
      },
    });
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch({ skip, take })
        .then((data) => {
          setPartnershipData(data.data.seePartnershipHistory.partnerships);
          setTotalCount(data.data.seePartnershipHistory.totalCount);
          if (
            data.data.seePartnershipHistory.partnerships.length === 0 &&
            data.data.seePartnershipHistory.totalCount > 0
          ) {
            setSkip(skip - take);
          }
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const columns: ColumnsType<Partnership> = [
    {
      title: '우선순위',
      key: 'no',
      dataIndex: 'no',
      align: 'center',
    },

    {
      title: 'url 주소',
      key: 'url',
      dataIndex: 'url',
      align: 'center',
      render: (val, _record, idx) => {
        return (
          <Input.TextArea
            style={{
              height: 100,
              resize: 'none',
            }}
            value={val}
            onChange={(e) => {
              setPartnershipData((prev) => {
                prev[idx].url = e.target.value.replace(/\r?\n|\r/g, '');
                return [...prev];
              });
            }}
          />
        );
      },
    },
    {
      title: '제휴사 이미지',
      key: 'customAd',
      align: 'center',

      render: (_val, _record, idx) => {
        return (
          <TransformBox flexDirection="column">
            <LogoUploadBox
              file={partnershipData}
              disabled={false}
              idx={idx}
              setFile={setPartnershipData}
              setFiles={setFiles}
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
      render: (val, _record, idx) => {
        return (
          <TransformBox justifyContent="center">
            <Button
              type="primary"
              onClick={handleClickSave(idx)}
              style={{
                marginRight: 10,
              }}
            >
              저장
            </Button>
            <Popconfirm
              title="삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={handleDelete(val)}
            >
              <Button type="primary" danger>
                삭제
              </Button>
            </Popconfirm>
          </TransformBox>
        );
      },
    },
  ];

  const [seePartnership, { refetch }] = useLazyQuery<
    SeePartnershipHistoryResponse,
    SeePartnershipHistroyParams
  >(SEE_PARTNERSHIP_HISTORY, {
    onCompleted: (data) => {
      setPartnershipData(data.seePartnershipHistory.partnerships);
      setTotalCount(data.seePartnershipHistory.totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  const [updatePartnership] = useMutation<
    UpdatePartnershipResponse,
    UpdatePartnershipParams
  >(UPDATE_PARTNERSHIP, {
    onCompleted: () => {
      notification.success({ message: '제휴사 설정을 변경했습니다.' });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [deletePartnership] = useMutation<
    DeletePartnershipResponse,
    DeletePartnershipParams
  >(DELETE_PARTNERSHIP, {
    onCompleted: () => {
      notification.success({
        message: '제휴사를 삭제했습니다.',
      });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({
        message: e.message,
      });
    },
  });

  useEffect(() => {
    seePartnership({
      variables: {
        skip,
        take,
      },
    });
  }, [take, skip, seePartnership]);

  return (
    <>
      <PartnershipAddModal
        visible={visible}
        handleCancel={handleCancel}
        handleRefetch={handleRefetch}
      />
      <Divider>제휴사 설정</Divider>
      <TransformBox
        marginTop={isMobile ? '30px' : ''}
        justifyContent="flex-end"
      >
        <Button type="primary" onClick={handleClick}>
          제휴사 등록
        </Button>
      </TransformBox>
      <DragSortingTable
        data={partnershipData}
        setData={setPartnershipData}
        setTake={setTake}
        columns={columns}
        current={current}
        totalCount={totalCount}
        handlePagination={handlePagination}
        handleRefetch={handleRefetch}
      />
    </>
  );
}
