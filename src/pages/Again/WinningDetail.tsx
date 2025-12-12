import { Button, Checkbox, Divider, notification, Table } from 'antd';
import { CSVLink } from 'react-csv';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ColumnsType } from 'antd/lib/table';
import { SearchForm } from 'components/SearchForm';
import TransformBox from 'components/TransformBox';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { winningDetailColumns, WinningDetailType } from 'utils/columns';
import { WinningDetailHeaders } from './headers';
import { PushNotificationModal } from 'components/PushNotificationModal';
import { useLazyQuery } from '@apollo/client';
import {
  SeeWinningNumberDetailHistoryParmas,
  SeeWinningNumberDetailHistoryResponse,
  SEE_WINNING_NUMBER_DETAIL_HISTORY,
} from 'graphql/query';
import { SearchType } from 'components/SearchForm/SearchForm';
import { phoneFormat } from 'utils/phoneFormat';

export function WinningDetail() {
  const [checked, setChecked] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [winningDetailData, setWinningDetailData] = useState<
    WinningDetailType[]
  >([]);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchType>();

  const handlePagination = (e: number) => {
    setSkip((e - 1) * take);
    setCurrent(e);
  };

  const isAllCheck = () => {
    if (!checked.length) {
      return false;
    }
    for (const winningDetail of winningDetailData) {
      if (
        checked.indexOf(winningDetail.email) === -1 &&
        winningDetail.isFcmToken
      ) {
        return false;
      } else {
        continue;
      }
    }
    return true;
  };

  const handleChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setChecked([...checked, e.target.value]);
    } else {
      setChecked(checked.filter((v) => v !== e.target.value));
    }
  };

  const handleAllCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      const emailss = winningDetailData
        .filter((v) => v.isFcmToken)
        .map((v) => v.email);
      setChecked(emailss);
    } else {
      setChecked([]);
    }
  };

  const handleClick = () => {
    if (!checked.length) {
      return notification.error({ message: '회원을 1명 이상 선택해주세요.' });
    }
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
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
    seeWinningNumberDetail({
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
        isReceive: value.isReceive,
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
      isReceive: value.isReceive,
    });
  };

  const columns: ColumnsType<WinningDetailType> = [
    {
      title: <Checkbox checked={isAllCheck()} onChange={handleAllCheck} />,
      key: 'checked',
      dataIndex: 'email',
      align: 'center',
      render: (val, record) => {
        return record.isFcmToken ? (
          <Checkbox
            value={val}
            onChange={handleChange}
            checked={checked.includes(val)}
          />
        ) : (
          ''
        );
      },
    },
    ...winningDetailColumns,
  ];

  const [seeWinningNumberDetail, { loading }] = useLazyQuery<
    SeeWinningNumberDetailHistoryResponse,
    SeeWinningNumberDetailHistoryParmas
  >(SEE_WINNING_NUMBER_DETAIL_HISTORY, {
    onCompleted: (data) => {
      const { histories, totalCount } =
        data.seeWinningNumberDetailHistoryByAdmin;
      setWinningDetailData(histories);
      setTotalCount(totalCount);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    seeWinningNumberDetail({
      variables: {
        skip,
        take,
        ...searchOptions,
      },
    });
  }, [take, skip]);

  return (
    <>
      <PushNotificationModal
        handleCancel={handleCancel}
        visible={visible}
        emails={checked}
      />
      <Divider>당첨 세부내역</Divider>
      <SearchForm isHaveSelect={true} handleSearch={handleSearch} />
      <TransformBox
        justifyContent={
          winningDetailData.length > 0 ? 'space-between' : 'flex-end'
        }
        marginBottom="20px"
      >
        {winningDetailData.length > 0 && (
          <CSVLink
            data={winningDetailData.map((v) => {
              return {
                ...v,
                isReceive: v.isReceive ? 'O' : 'X',
                isSend: v.isSend ? 'O' : 'X',
                isFcmToken: v.isFcmToken ? 'O' : 'X',
                phone: phoneFormat(v.phone),
                address:
                  v.address && v.addressDetail
                    ? `${v.address} ${v.addressDetail}`
                    : '배송지가 없습니다.',
              };
            })}
            asyncOnClick={true}
            headers={WinningDetailHeaders}
          >
            <Button
              style={{
                color: 'green',
                borderColor: 'green',
              }}
              disabled={winningDetailData.length <= 0}
            >
              엑셀 다운로드
            </Button>
          </CSVLink>
        )}
        <Button type="primary" onClick={handleClick}>
          선택 알림 보내기
        </Button>
      </TransformBox>
      <Table
        columns={columns}
        dataSource={winningDetailData}
        scroll={{
          x: 1200,
        }}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange: handlePagination,
          onShowSizeChange: (_current, size) => setTake(size),
          total: totalCount,
          current: current,
        }}
        loading={loading}
      />
    </>
  );
}
