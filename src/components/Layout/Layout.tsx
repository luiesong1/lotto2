import { useEffect, useLayoutEffect, useState } from 'react';
import { Badge, Button, Menu } from 'antd';

import { useNavigate, useLocation } from 'react-router-dom';
import * as S from './style';
import Main from 'components/Main';
import { AsideMenu } from 'components/AsideMenu';
import TransformBox from 'components/TransformBox';
import { useQuery, useSubscription } from '@apollo/client';
import {
  SeeCountNotConfirmPartnershipInquiryResponse,
  SeeCountNotReplyInquiryResponse,
  SEE_COUNT_NOT_CONFIRM_PARTNERSHIP_INQUIRY,
  SEE_COUNT_NOT_REPLY_INQUIRY,
} from 'graphql/query';
import {
  SeeCountNotConfirmPartnershipInquirySubResponse,
  SeeCountNotReplyInquirySubResponse,
  CREATED_INQUIRY,
  CREATED_PARTNERSHIP_INQUIRY,
} from 'graphql/subscriptions';

export type BadgeType = {
  [index: string]: number;
  inquiryCount: number;
  partnerCount: number;
};

function Layout() {
  const [badgeData, setBadgeData] = useState<BadgeType>({
    inquiryCount: 0,
    partnerCount: 0,
  });

  const navigator = useNavigate();

  const statusText = [
    {
      text: '제휴문의',
      path: '/customer/partner',
      keyword: 'partnerCount',
    },

    {
      text: '1:1문의 알림',
      path: '/customer/inquiry',
      keyword: 'inquiryCount',
    },
  ];

  const handleClick = (path: string) => () => {
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      navigator(path);
    }
  };

  useQuery<SeeCountNotReplyInquiryResponse>(SEE_COUNT_NOT_REPLY_INQUIRY, {
    onCompleted: (data) => {
      setBadgeData({
        ...badgeData,
        inquiryCount: data.seeCountNotReplyInquiry,
      });
    },
  });
  useQuery<SeeCountNotConfirmPartnershipInquiryResponse>(
    SEE_COUNT_NOT_CONFIRM_PARTNERSHIP_INQUIRY,
    {
      onCompleted: (data) => {
        setBadgeData({
          ...badgeData,
          partnerCount: data.seeCountNotConfirmPartnershipInquiry,
        });
      },
    },
  );

  useSubscription<SeeCountNotReplyInquirySubResponse>(CREATED_INQUIRY, {
    onSubscriptionData: (data) => {
      if (data.subscriptionData.data) {
        setBadgeData({
          ...badgeData,
          inquiryCount: data.subscriptionData.data.seeCountNotReplyInquiry,
        });
      }
    },
    fetchPolicy: 'no-cache',
  });

  useSubscription<SeeCountNotConfirmPartnershipInquirySubResponse>(
    CREATED_PARTNERSHIP_INQUIRY,
    {
      onSubscriptionData: (data) => {
        if (data.subscriptionData.data) {
          setBadgeData({
            ...badgeData,
            partnerCount:
              data.subscriptionData.data.seeCountNotConfirmPartnershipInquiry,
          });
        }
      },
      fetchPolicy: 'no-cache',
    },
  );

  return (
    <S.Layout>
      <AsideMenu />

      <S.Layout $marginLeft={200}>
        <S.Content>
          <S.StatusBar>
            <TransformBox>
              {statusText.map((v, i) => {
                return (
                  <S.StatusWrap key={i}>
                    <Badge count={badgeData ? badgeData[v.keyword] : 0}>
                      <Button
                        key={i}
                        type="primary"
                        style={{
                          fontWeight: 'bold',
                        }}
                        onClick={handleClick(v.path)}
                      >
                        {v.text}
                      </Button>
                    </Badge>
                  </S.StatusWrap>
                );
              })}
            </TransformBox>
          </S.StatusBar>
          <Main />
        </S.Content>
        <S.Footer>LottoAgain ©2022 Created by Lawdians</S.Footer>
      </S.Layout>
    </S.Layout>
  );
}

export default Layout;
