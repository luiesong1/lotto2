import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  DatePicker,
  Divider,
  Input,
  notification,
  Switch,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ThumbnailUploadBox } from 'components/ThumbnailUploadBox';
import TransformBox from 'components/TransformBox';
import {
  CreateBraodcastInfoParams,
  CreateBroadcastInfoResponse,
  CREATE_BROADCAST_INFO,
  UpdateBroadcastInfoParams,
  UpdateBroadcastInfoResponse,
  UPDATE_BROADCAST_INFO,
} from 'graphql/mutation';
import {
  SeeBroadcastInfoByAdminParams,
  SeeBroadcastInfoByAdminResponse,
  SEE_BROADCAST_INFO,
} from 'graphql/query';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { getRound } from 'utils/getRound';
import * as S from './style';

export type BroadCastInfoType = {
  id: number;
  thumbnail: string;
  youtubeUrl?: string;
  isOnAir: boolean;
  onAirDate: moment.Moment | null;
};

export function Live() {
  const [date, setDate] = useState(
    moment()
      .add(6 - moment().days(), 'd')
      .subtract(7, 'd'),
  );
  const [round, setRound] = useState<number>(1009);
  const [broadcastInfo, setBroadcastInfo] = useState<BroadCastInfoType>({
    id: -1,
    thumbnail: '',
    youtubeUrl: '',
    isOnAir: false,
    onAirDate: null,
  });
  const [texts, setTexts] = useState([
    {
      value: '',
      text: '방송 전 텍스트',
    },
    {
      value: '',
      text: '방송 중 텍스트',
    },
  ]);
  const roles = useRecoilValue(rolesState);

  const thumbnailColumns: ColumnsType<any> = [
    {
      title: '위치',
      key: 'position',
      align: 'center',
      render: () => {
        return '홈 썸네일';
      },
    },
    {
      title: '이미지 등록',
      key: 'thumbnail',
      dataIndex: 'thumbnail',
      align: 'center',
      render: () => {
        return (
          <ThumbnailUploadBox
            file={broadcastInfo}
            setFile={setBroadcastInfo}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_BROADCAST_INFO'].includes(i))
            }
          />
        );
      },
    },
  ];
  const textColumns: ColumnsType<any> = [
    {
      title: '시간',
      key: 'text',
      dataIndex: 'text',
      align: 'center',
    },
    {
      title: '내용',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      render: (val, _record, idx) => {
        return (
          <Input
            value={val}
            onChange={(e) => handleChangeText(e, idx)}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_BROADCAST_INFO'].includes(i))
            }
          />
        );
      },
    },
  ];

  const handleChangeDate = (e: moment.Moment | null) => {
    if (e) {
      setDate(() => e);
    } else {
      setDate(() => moment().add(6 - moment().days(), 'd'));
    }
  };
  const handleChangeBroadcastDate = (e: moment.Moment | null) => {
    setBroadcastInfo({
      ...broadcastInfo,
      onAirDate: e,
    });
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    setTexts((prev) => {
      prev[idx].value = e.target.value;
      return [...prev];
    });
  };

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBroadcastInfo({
      ...broadcastInfo,
      youtubeUrl: e.target.value,
    });
  };

  const handleSave = () => {
    if (date.isBefore(moment().subtract(7, 'd'))) {
      return notification.error({
        message: '이전회차의 방송 설정은 수정할 수 없습니다.',
      });
    }
    if (!broadcastInfo.thumbnail.length) {
      return notification.error({ message: '썸네일을 등록해주세요' });
    }
    if (!texts[0].value.length) {
      return notification.error({ message: '방송 전 텍스트를 입력해주세요' });
    }
    if (!texts[1].value.length) {
      return notification.error({ message: '방송중 텍스트를 입력해주세요' });
    }
    if (!broadcastInfo.onAirDate) {
      return notification.error({ message: '방송시작 시간을 등록해주세요' });
    }
    if (broadcastInfo.id === -1) {
      createBroadcastInfo({
        variables: {
          ...broadcastInfo,
          date,
          round,
          offAirText: texts[0].value,
          onAirText: texts[1].value,
          youtubeUrl: broadcastInfo.youtubeUrl?.length
            ? broadcastInfo.youtubeUrl
            : undefined,
        },
      });
    } else {
      updateBroadcastInfo({
        variables: {
          ...broadcastInfo,
          offAirText: texts[0].value,
          onAirText: texts[1].value,
          youtubeUrl: broadcastInfo.youtubeUrl?.length
            ? broadcastInfo.youtubeUrl
            : undefined,
          isOnAir: broadcastInfo.isOnAir,
        },
      });
    }
  };

  const [seeBroadcastInfo, { loading }] = useLazyQuery<
    SeeBroadcastInfoByAdminResponse,
    SeeBroadcastInfoByAdminParams
  >(SEE_BROADCAST_INFO, {
    onCompleted: (data) => {
      if (data.seeBroadcastInfoByAdmin.broadcastInfo !== null) {
        setBroadcastInfo(data.seeBroadcastInfoByAdmin.broadcastInfo);
        setTexts((prev) => {
          prev[0].value = data.seeBroadcastInfoByAdmin.broadcastInfo.offAirText;
          prev[1].value = data.seeBroadcastInfoByAdmin.broadcastInfo.onAirText;
          return [...prev];
        });
      } else {
        setBroadcastInfo({
          id: -1,
          thumbnail: '',
          youtubeUrl: '',
          isOnAir: false,
          onAirDate: null,
        });
        setTexts((prev) => {
          prev[0].value = '';
          prev[1].value = '';
          return [...prev];
        });
      }
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  });

  const [createBroadcastInfo] = useMutation<
    CreateBroadcastInfoResponse,
    CreateBraodcastInfoParams
  >(CREATE_BROADCAST_INFO, {
    onCompleted: () => {
      notification.success({ message: '방송 설정을 저장했습니다.' });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [updateBroadcastInfo] = useMutation<
    UpdateBroadcastInfoResponse,
    UpdateBroadcastInfoParams
  >(UPDATE_BROADCAST_INFO, {
    onCompleted: () => {
      notification.success({ message: '방송 설정을 저장했습니다.' });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    seeBroadcastInfo({
      variables: {
        date: date.format('YYYY-MM-DD'),
      },
    });
    setRound(getRound(date));
  }, [date, seeBroadcastInfo]);

  return (
    <>
      <Divider>방송 설정</Divider>
      <TransformBox alignItems="center" marginBottom="30px">
        <h3
          style={{
            margin: 0,
          }}
        >
          회차
        </h3>
        <Input
          style={{
            width: 200,
            marginLeft: 10,
          }}
          readOnly
          value={round}
        />
      </TransformBox>
      <TransformBox alignItems="center" marginBottom="30px">
        <h3
          style={{
            margin: 0,
          }}
        >
          날짜
        </h3>
        <DatePicker
          style={{
            width: 200,
            marginLeft: 10,
          }}
          disabledDate={(date) => date.days() !== 6}
          value={date}
          onChange={handleChangeDate}
        />
      </TransformBox>
      <h3>이미지 등록</h3>
      <Table
        style={{
          marginBottom: 30,
        }}
        scroll={{ x: 800 }}
        columns={thumbnailColumns}
        dataSource={[broadcastInfo?.thumbnail]}
        pagination={false}
        loading={loading}
      />
      <h3>텍스트 등록</h3>
      <Table
        scroll={{ x: 800 }}
        dataSource={texts}
        columns={textColumns}
        pagination={false}
        style={{
          marginBottom: 30,
        }}
      />
      <S.SmallTableContainer>
        <TransformBox alignItems="center" justifyContent="space-between">
          <h3>유튜브 링크</h3>
          <Switch
            unCheckedChildren="방송 전"
            checkedChildren="방송중"
            style={{
              marginBottom: '0.5em',
            }}
            checked={broadcastInfo.isOnAir}
            onChange={(e) => {
              setBroadcastInfo((prev) => {
                prev.isOnAir = e;
                return { ...prev };
              });
            }}
            disabled={
              !roles.some((i) =>
                ['MASTER', 'WRITE_BROADCAST_INFO'].includes(i),
              ) ||
              getRound(
                moment()
                  .day(6)
                  .add(6 - moment().days(), 'd')
                  .subtract(7, 'd'),
              ) !== getRound(date)
            }
          />
        </TransformBox>
        <TransformBox alignItems="center">
          <Input
            onChange={handleChangeUrl}
            value={broadcastInfo?.youtubeUrl}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_BROADCAST_INFO'].includes(i))
            }
          />
        </TransformBox>
        <TransformBox marginTop="30px" flexDirection="column">
          <h3>방송 시작시간</h3>
          <DatePicker
            showTime
            showSecond={false}
            showNow={false}
            value={
              broadcastInfo.onAirDate ? moment(broadcastInfo.onAirDate) : null
            }
            onChange={handleChangeBroadcastDate}
            format="YYYY-MM-DD HH:mm"
          />
        </TransformBox>
      </S.SmallTableContainer>
      <TransformBox justifyContent="flex-end">
        <Button
          type="primary"
          onClick={handleSave}
          disabled={
            !roles.some((i) => ['MASTER', 'WRITE_BROADCAST_INFO'].includes(i))
          }
        >
          저장
        </Button>
      </TransformBox>
    </>
  );
}
