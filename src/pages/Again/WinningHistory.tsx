import { useLazyQuery } from '@apollo/client';
import { Divider, notification, Table } from 'antd';
import { SearchForm } from 'components/SearchForm';
import { SearchType } from 'components/SearchForm/SearchForm';
import {
  SeeWinningNumberHistoryByAdminParams,
  SeeWinningNumberHistoryByAdminResponse,
  SEE_WINNING_NUMBER_HISTORY,
} from 'graphql/query';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { winningHistoryColumns, WinningHistoryType } from 'utils/columns';
import * as S from './style';

export function WinningHistory() {
  const [winningHistory, setWinningHistory] = useState<WinningHistoryType[]>(
    [],
  );
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchType>();

  const handlePagination = (e: number) => {
    setSkip((e - 1) * take);
    setCurrent(e);
  };

  const handleSearch = (value: SearchType) => {
    if (
      (value.endTextForRound?.toString().length &&
        !value.startTextForRound?.toString().length) ||
      (!value.endTextForRound?.toString().length &&
        value.startTextForRound?.toString().length)
    ) {
      return notification.error({
        message: '시작회차와 종료회차를 모두 입력해주세요',
      });
    }
    if (
      (value.endPeriodForDate && !value.startPeriodForDate) ||
      (!value.endPeriodForDate && value.startPeriodForDate)
    ) {
      return notification.error({
        message: '시작일과 종료일을 모두 선택해주세요',
      });
    }
    seeWinnginHistory({
      variables: {
        take,
        skip: 0,
        startPeriodForDate: value.startPeriodForDate
          ? moment(value.startPeriodForDate).format('YYYY-MM-DD')
          : undefined,
        endPeriodForDate: value.endPeriodForDate
          ? moment(value.endPeriodForDate).format('YYYY-MM-DD')
          : undefined,
        endTextForRound: value.startTextForRound
          ? Number(value.endTextForRound)
          : undefined,
        startTextForRound: value.endTextForRound
          ? Number(value.startTextForRound)
          : undefined,
      },
    });
    setSkip(0);
    setCurrent(1);
    setSearchOptions({
      startPeriodForDate: value.startPeriodForDate
        ? moment(value.startPeriodForDate).format('YYYY-MM-DD')
        : undefined,
      endPeriodForDate: value.endPeriodForDate
        ? moment(value.endPeriodForDate).format('YYYY-MM-DD')
        : undefined,
      endTextForRound: value.startTextForRound
        ? Number(value.endTextForRound)
        : undefined,
      startTextForRound: value.endTextForRound
        ? Number(value.startTextForRound)
        : undefined,
    });
  };

  const [seeWinnginHistory, { loading }] = useLazyQuery<
    SeeWinningNumberHistoryByAdminResponse,
    SeeWinningNumberHistoryByAdminParams
  >(SEE_WINNING_NUMBER_HISTORY, {
    onCompleted: (data) => {
      const { totalCount, winningNumbers } =
        data.seeWinningNumberHistoryByAdmin;
      setWinningHistory(winningNumbers);
      setTotalCount(totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    seeWinnginHistory({
      variables: {
        ...searchOptions,
        take,
        skip,
      },
    });
  }, [take, skip]);

  return (
    <>
      <Divider>과거 당첨결과</Divider>
      <SearchForm handleSearch={handleSearch} />
      <Table
        columns={winningHistoryColumns}
        dataSource={winningHistory}
        pagination={{
          position: ['bottomCenter'],
          onChange: handlePagination,
          total: totalCount,
          current: current,
        }}
        scroll={{ x: 800 }}
        loading={loading}
      />
    </>
  );
}
