import { Form, DatePicker, Button, Select, Divider } from 'antd';
import TransformBox from 'components/TransformBox';
import useResizeHandler from 'hooks/useHandleResize';
import React, { useState } from 'react';
import * as S from './style';

type Props = {
  isHaveSelect?: boolean;
  handleSearch?: (value: SearchType) => void;
};

export type SearchType = {
  startTextForRound?: number;
  endTextForRound?: number;
  startPeriodForDate?: string;
  endPeriodForDate?: string;
  isReceive?: boolean;
};

export function SearchForm({ isHaveSelect, handleSearch }: Props) {
  const { isMobile } = useResizeHandler();
  const options = [
    {
      text: '전체',
      value: null,
    },
    {
      text: '완료',
      value: true,
    },
    {
      text: '미완료',
      value: false,
    },
  ];

  return (
    <Form onFinish={handleSearch}>
      <TransformBox flexDirection="column">
        <TransformBox flexDirection="column" marginBottom="30px">
          <S.Label>회차</S.Label>
          <S.FormWrap>
            <Form.Item name="startTextForRound" noStyle>
              <S.CustomInput
                size="small"
                placeholder="시작회차"
                style={{
                  marginRight: 5,
                }}
              />
            </Form.Item>

            <Form.Item name="endTextForRound" noStyle>
              <S.CustomInput size="small" placeholder="종료회차" />
            </Form.Item>
          </S.FormWrap>
        </TransformBox>
        <TransformBox marginBottom="30px" flexDirection="column">
          <S.Label>날짜</S.Label>

          <S.FormWrap>
            <Form.Item name="startPeriodForDate" noStyle>
              <DatePicker
                size="small"
                style={{
                  width: isMobile ? '35vw' : '200px',
                  fontSize: 0,
                  border: 0,
                  marginRight: 5,
                }}
                placeholder="시작일"
              />
            </Form.Item>

            <Form.Item name="endPeriodForDate" noStyle>
              <DatePicker
                size="small"
                style={{
                  width: isMobile ? '35vw' : '200px',
                  fontSize: 0,
                  border: 0,
                }}
                placeholder="종료일"
              />
            </Form.Item>
          </S.FormWrap>
        </TransformBox>
        <>
          {isHaveSelect && (
            <TransformBox flexDirection="column" marginBottom="30px">
              <S.Label>수령확인</S.Label>
              <Form.Item name="isReceive">
                <Select
                  style={{
                    width: 150,
                  }}
                  placeholder="상태"
                >
                  {options.map((v, i) => {
                    return (
                      <Select.Option value={v.value} key={i}>
                        {v.text}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </TransformBox>
          )}
        </>
      </TransformBox>
      <TransformBox justifyContent="center" width="100%">
        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
            }}
          >
            검색
          </Button>
        </Form.Item>
      </TransformBox>
      <Divider />
    </Form>
  );
}
