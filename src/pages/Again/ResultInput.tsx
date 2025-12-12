import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, DatePicker, Divider, Input, notification } from 'antd';
import TransformBox from 'components/TransformBox';
import {
  CreateWinningNumberParams,
  CREATE_WINNING_NUMBER,
  UpdateWinningNumberParams,
  UPDATE_WINNING_NUMBER,
} from 'graphql/mutation';
import {
  SeeWinningNumberByAdminParams,
  SeeWinningNumberByAdminResponse,
  SEE_WINNING_NUMBER_BY_ADMIN,
} from 'graphql/query';
import useResizeHandler from 'hooks/useHandleResize';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';
import { getRound } from 'utils/getRound';
import { checkSameNumber } from './service';
import * as S from './style';

export type WinningResultType = {
  type: 'NORMAL' | 'BONUS';
  no: number;
  number: string;
};

const initData: WinningResultType[] = [
  {
    no: 1,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 2,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 3,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 4,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 5,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 6,
    number: '',
    type: 'NORMAL',
  },
  {
    no: 7,
    number: '',
    type: 'BONUS',
  },
];

export function ResultInput() {
  const [winningResult, setWinningResult] =
    useState<WinningResultType[]>(initData);
  const [date, setDate] = useState(
    moment()
      .add(6 - moment().days(), 'd')
      .subtract(7, 'd'),
  );
  const [round, setRound] = useState<number>(1009);
  const [isEdit, setIsEdit] = useState(false);

  const roles = useRecoilValue(rolesState);

  const handleChangeDate = (e: moment.Moment | null) => {
    if (e) {
      setDate(() => e);
    } else {
      setDate(() => moment().add(6 - moment().days(), 'd'));
    }
  };

  const handleReset = () => {
    setWinningResult((prev) => {
      prev.map((_v, i) => {
        prev[i].number = '';
      });
      return [...prev];
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (/\D/g.test(e.target.value)) {
      return;
    }
    setWinningResult((prev) => {
      prev[idx].number = e.target.value;
      return [...prev];
    });
  };

  const handleSave = () => {
    const winningNumber = [];
    if (date.isBefore(moment().subtract(7, 'd'))) {
      return notification.error({
        message: '이전회차의 당첨번호는 수정할 수 없습니다.',
      });
    }
    for (const result of winningResult) {
      if (!result.number.length) {
        return notification.error({ message: '당첨번호를 모두 입력해주세요.' });
      }
      if (result.type === 'BONUS') {
        continue;
      }
      winningNumber.push(Number(result.number));
    }
    if (!checkSameNumber(winningResult)) {
      return notification.error({
        message: '중복되는 숫자가 있습니다.',
      });
    }
    winningNumber.sort((a: number, b: number): number => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });

    winningNumber.push(Number(winningResult[6].number));
    if (!isEdit) {
      createWinningNum({
        variables: {
          date,
          round,
          winningNumber,
        },
      });
    } else {
      updateWinningNum({
        variables: {
          date,
          round,
          winningNumber,
        },
      });
    }
  };

  const handleRefetch = () => {
    if (refetch) {
      refetch({ date: date.format('YYYY-MM-DD') })
        .then((data) => {
          const { winningNumbers } = data.data.seeWinningNumberByAdmin;
          setIsEdit(winningNumbers.length > 0);
          setWinningResult(() => initData);
          setWinningResult((prev) => {
            winningNumbers.map((v) => {
              const idx = prev.findIndex((v2) => v.no === v2.no);
              if (idx > -1) {
                prev[idx] = {
                  ...v,
                  number: String(v.number),
                };
              }
            });
            return [...prev];
          });
        })
        .catch((e) => {
          notification.error({ message: e.message });
        });
    }
  };

  const [seeWinningNumbers, { refetch }] = useLazyQuery<
    SeeWinningNumberByAdminResponse,
    SeeWinningNumberByAdminParams
  >(SEE_WINNING_NUMBER_BY_ADMIN, {
    onCompleted: (data) => {
      if (data === null) {
        setIsEdit(false);
        return setWinningResult(() => initData);
      }
      const { winningNumbers } = data.seeWinningNumberByAdmin;
      setIsEdit(winningNumbers.length > 0);
      setWinningResult((prev) => {
        winningNumbers.map((v) => {
          const idx = prev.findIndex((v2) => v.no === v2.no);
          if (idx > -1) {
            prev[idx] = {
              ...v,
              number: String(v.number),
            };
          }
        });
        return [...prev];
      });
    },
    onError: (e) => {
      setIsEdit(false);

      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'ignore',
  });

  const [createWinningNum] = useMutation<{}, CreateWinningNumberParams>(
    CREATE_WINNING_NUMBER,
    {
      onCompleted: () => {
        notification.success({ message: '당첨결과를 저장했습니다.' });
        handleRefetch();
      },
      onError: (e) => {
        notification.error({
          message: e.message,
        });
      },
    },
  );

  const [updateWinningNum] = useMutation<{}, UpdateWinningNumberParams>(
    UPDATE_WINNING_NUMBER,
    {
      onCompleted: () => {
        notification.success({ message: '당첨결과를 저장했습니다.' });
        handleRefetch();
      },
      onError: (e) => {
        notification.error({
          message: e.message,
        });
      },
    },
  );

  useEffect(() => {
    handleReset();
    seeWinningNumbers({
      variables: {
        date: date.format('YYYY-MM-DD'),
      },
    });
    setRound(getRound(date));
  }, [date]);

  const { isMobile } = useResizeHandler();
  return (
    <>
      <Divider>당첨결과 입력</Divider>
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
          value={date}
          onChange={handleChangeDate}
          disabledDate={(date) => date.days() !== 6}
        />
      </TransformBox>
      <S.ResultInputContainer>
        {winningResult?.map((v, i) => {
          if (v.type === 'NORMAL') {
            return (
              <S.ResultInputBox
                maxLength={2}
                value={v.number}
                key={i}
                onChange={(e) => {
                  handleChange(e, i);
                }}
              />
            );
          }
        })}

        {!isMobile && (
          <PlusOutlined
            style={{
              fontSize: 50,
            }}
          />
        )}
        {!isMobile && (
          <S.ResultInputBox
            maxLength={2}
            value={winningResult?.find((v) => v.type === 'BONUS')?.number}
            onChange={(e) => {
              handleChange(e, 6);
            }}
          />
        )}
      </S.ResultInputContainer>
      {isMobile && (
        <>
          <TransformBox marginTop="30px" justifyContent="center">
            <PlusOutlined
              style={{
                fontSize: 50,
              }}
            />
          </TransformBox>
          <TransformBox marginTop="30px" justifyContent="center">
            <S.ResultInputBox
              maxLength={2}
              value={winningResult.find((v) => v.type === 'BONUS')?.number}
              onChange={(e) => {
                handleChange(e, 6);
              }}
            />
          </TransformBox>
        </>
      )}
      {roles.some((i) => ['MASTER', 'WRITE_WINNING_NUMBER'].includes(i)) && (
        <TransformBox justifyContent="center" marginTop="50px">
          <Button
            type="primary"
            style={{
              width: '150px',
              height: 50,
            }}
            onClick={handleSave}
          >
            저장
          </Button>
        </TransformBox>
      )}
    </>
  );
}
