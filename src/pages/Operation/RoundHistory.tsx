import React, { useEffect, useState } from 'react';
import { Divider, notification, Table } from 'antd';
import { SearchForm } from 'components/SearchForm';
import { SearchType } from 'components/SearchForm/SearchForm';
import { RoundHistoryColumns, RoundHistoryType } from 'utils/columns';
import { useLazyQuery } from '@apollo/client';
import {
  SeeRoundDateInfoHistoryByAdminParams,
  SeeRoundDateInfoHistoryByAdminResponse,
  SEE_ROUND_DATE_INFO_HISTORY,
} from 'graphql/query';
import moment from 'moment';

export function RoundHistory() {
  const [roundHistory, setRoundHistory] = useState<RoundHistoryType[]>([]);
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
        message: '시작회차와 종료회차를 모두 선택해주세요',
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
    seeRoundHistory({
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

  const [seeRoundHistory, { loading }] = useLazyQuery<
    SeeRoundDateInfoHistoryByAdminResponse,
    SeeRoundDateInfoHistoryByAdminParams
  >(SEE_ROUND_DATE_INFO_HISTORY, {
    onCompleted: (data) => {
      const { roundDateInfos, totalCount } =
        data.seeRoundDateInfoHistoryByAdmin;
      setRoundHistory(roundDateInfos);
      setTotalCount(totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    seeRoundHistory({
      variables: {
        take,
        skip,
        ...searchOptions,
      },
    });
  }, [take, skip]);

  return (
    <>
      <Divider>내역 조회</Divider>
      <SearchForm handleSearch={handleSearch} />
      <Table
        columns={RoundHistoryColumns}
        dataSource={roundHistory}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        scroll={{ x: 800 }}
        loading={loading}
      />
    </>
  );
}
