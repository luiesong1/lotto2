import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, DatePicker, Divider, Input, notification, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import TransformBox from 'components/TransformBox';
import { UploadBox } from 'components/UploadBox';
import {
  CreateGiveawayParams,
  CreateGiveawayResponse,
  CREATE_GIVEAWAY,
  UpdateGiveawayParams,
  UpdateGiveawayResponse,
  UPDATE_GIVEAWAY,
} from 'graphql/mutation';
import {
  SeeGiveawayByAdminParams,
  SeeGiveawayByAdminResponse,
  SEE_GIVEAWAY_BY_ADMIN,
} from 'graphql/query';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { getRound } from 'utils/getRound';
import { prizeInitData } from 'utils/prizeInitData';

export type PrizeType = {
  id: number;
  rank: number;
  name: string;
  image: string;
};

export function Prize() {
  const [prizeData, setPrizeData] = useState<PrizeType[]>([...prizeInitData]);
  const [round, setRound] = useState<number>();
  const [date, setDate] = useState(
    moment()
      .add(6 - moment().days(), 'd')
      .subtract(7, 'd'),
  );
  const roles = useRecoilValue(rolesState);

  const columns: ColumnsType<PrizeType> = [
    {
      title: '등수',
      key: 'rank',
      dataIndex: 'rank',
      align: 'center',
      render: (val) => {
        return `${val}등`;
      },
    },
    {
      title: '경품명',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      render: (val, _record, idx) => {
        return (
          <Input
            value={val}
            onChange={(e) => {
              handleChangeName(e, idx);
            }}
            disabled={
              !roles.some((i) => ['MASTER', 'WRITE_GIVEAWAY'].includes(i))
            }
          />
        );
      },
    },
    {
      title: '경품이미지등록',
      key: 'image',
      dataIndex: 'image',
      align: 'center',

      render: (val, record, idx) => {
        return (
          <>
            {
              <UploadBox
                idx={idx}
                setFile={setPrizeData}
                file={prizeData}
                disabled={
                  !roles.some((i) => ['MASTER', 'WRITE_GIVEAWAY'].includes(i))
                }
              />
            }
          </>
        );
      },
    },
    {
      title: '저장',
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
                !roles.some((i) => ['MASTER', 'WRITE_GIVEAWAY'].includes(i))
              }
            >
              저장
            </Button>
          </TransformBox>
        );
      },
    },
  ];

  const handleSave = (idx: number) => () => {
    const tmpDate = date.format('YYYY-MM-DD');
    if (moment(tmpDate).isBefore(moment().subtract(7, 'd'))) {
      return notification.error({
        message: '이전회차 경품은 수정할 수 없습니다.',
      });
    }
    if (!prizeData[idx].name.length) {
      return notification.error({ message: '경품명을 입력해주세요' });
    }
    if (!prizeData[idx].image.length) {
      return notification.error({ message: '경품 이미지를 등록해주세요' });
    }
    if (prizeData[idx].id < 0) {
      createPrize({
        variables: {
          date,
          round: round ?? 0,
          ...prizeData[idx],
        },
      });
    } else {
      updatePrize({
        variables: {
          ...prizeData[idx],
        },
      });
    }
  };

  const handleChangeDate = (e: moment.Moment | null) => {
    if (e) {
      setDate(() => e);
    } else {
      setDate(() => moment().add(6 - moment().days(), 'd'));
    }
  };

  const handleChangeName = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    setPrizeData((prev) => {
      prev[idx].name = e.target.value;
      return [...prev];
    });
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch({ date: date.format('YYYY-MM-DD') }).then((data) => {
        const { giveaways } = data.data.seeGiveawayByAdmin;
        setPrizeData((prev) => {
          giveaways.map((v, i) => {
            const idx = prev.findIndex((v2) => v2.rank === v.rank);
            if (idx > -1) {
              return (prev[i] = v);
            }
          });
          return [...prev];
        });
      });
    }
  };

  const [getPrize, { refetch, loading }] = useLazyQuery<
    SeeGiveawayByAdminResponse,
    SeeGiveawayByAdminParams
  >(SEE_GIVEAWAY_BY_ADMIN, {
    onCompleted: (data) => {
      setPrizeData([...prizeInitData]);
      const { giveaways } = data.seeGiveawayByAdmin;
      setPrizeData((prev) => {
        giveaways.map((v, i) => {
          const idx = prev.findIndex((v2) => v2.rank === v.rank);
          if (idx > -1) {
            return (prev[i] = v);
          }
        });
        return [...prev];
      });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  const [createPrize] = useMutation<
    CreateGiveawayResponse,
    CreateGiveawayParams
  >(CREATE_GIVEAWAY, {
    onCompleted: () => {
      notification.success({ message: '경품설정을 저장했습니다.' });
      handleRefetch();
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [updatePrize] = useMutation<
    UpdateGiveawayResponse,
    UpdateGiveawayParams
  >(UPDATE_GIVEAWAY, {
    onCompleted: () => {
      notification.success({ message: '경품설정을 저장했습니다.' });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  useEffect(() => {
    setPrizeData([...prizeInitData]);

    getPrize({
      variables: {
        date: date.format('YYYY-MM-DD'),
      },
    });
    setRound(getRound(date));
  }, [date]);

  return (
    <>
      <Divider>경품 설정</Divider>
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
      <TransformBox alignItems="center">
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
      <Table
        columns={columns}
        dataSource={prizeData}
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
