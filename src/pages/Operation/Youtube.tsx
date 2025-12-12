import { Button, Divider, Input, notification, Switch } from 'antd';
import React, { useState } from 'react';
import TransformBox from 'components/TransformBox';
import * as S from './style';
import { useMutation, useQuery } from '@apollo/client';
import {
  SeeStaticLinkResponse,
  SeeYoutubeSubscriptionResponse,
  SEE_STATIC_LINK,
  SEE_YOUTUBE_SUBSCRIPTION,
} from 'graphql/query';
import Loader from 'components/Loader';
import {
  TOGGLE_YOUTUBE_SUBSCRIPTION,
  UpdateStaticLinkParams,
  UpdateStaticLinkResponse,
  UPDATE_STATIC_URL,
} from 'graphql/mutation';
import { rolesState } from 'recoil/atoms/roles';
import { useRecoilValue } from 'recoil';

export function Youtube() {
  const [uri, setUri] = useState('');
  const [isServiceable, setIsServiceable] = useState<boolean>(false);

  const roles = useRecoilValue(rolesState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUri(e.target.value);
  };

  const handleChangeToggle = (value: boolean) => {
    if (
      roles.some((v) => ['WRITE_YOUTUBE_SUBSCRIPTION', 'MASTER'].includes(v))
    ) {
      setIsServiceable(value);
      toggleYoutubeSubscription();
    }
  };

  const handleClick = () => {
    if (!uri.length) {
      return notification.error({ message: '유튜브 링크를 입력해주세요.' });
    }
    updateStaticLink({
      variables: {
        uri,
      },
    });
  };

  const { loading: loading3 } = useQuery<SeeYoutubeSubscriptionResponse>(
    SEE_YOUTUBE_SUBSCRIPTION,
    {
      onCompleted: (data) => {
        setIsServiceable(data.seeYoutubeSubscription);
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  );

  const { loading } = useQuery<SeeStaticLinkResponse>(SEE_STATIC_LINK, {
    onCompleted: (data) => {
      setUri(data.seeStaticLink);
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  const [updateStaticLink, { loading: loading2 }] = useMutation<
    UpdateStaticLinkResponse,
    UpdateStaticLinkParams
  >(UPDATE_STATIC_URL, {
    onCompleted: () => {
      notification.success({ message: '유튜브 링크를 수정했습니다.' });
    },
    onError: (e) => {
      notification.error({ message: e.message });
    },
  });

  const [toggleYoutubeSubscription, { loading: loading4 }] = useMutation(
    TOGGLE_YOUTUBE_SUBSCRIPTION,
    {
      onCompleted: () => {
        notification.success({
          message: '구독 확인 여부 설정을 변경했습니다.',
        });
      },
      onError: (e) => {
        notification.error({ message: e.message });
      },
    },
  );

  return (
    <>
      {(loading || loading2 || loading3 || loading4) && <Loader />}
      <Divider>유튜브 설정</Divider>
      <S.SmallTableContainer>
        <h3>유튜브 링크</h3>
        <TransformBox alignItems="center">
          <>
            <Input
              style={{
                width: 200,
              }}
              value={uri}
              onChange={handleChange}
            />
            {(roles.includes('WRITE_STATIC_LINK') ||
              roles.includes('MASTER')) && (
              <Button
                type="primary"
                style={{
                  marginLeft: 30,
                }}
                onClick={handleClick}
              >
                저장
              </Button>
            )}
          </>
        </TransformBox>
        <TransformBox marginTop="50px" flexDirection="column">
          <h3
            style={{
              margin: 0,
              marginRight: 20,
            }}
          >
            구독 확인 여부
          </h3>
          <Switch
            checked={isServiceable}
            onChange={handleChangeToggle}
            checkedChildren="구독 확인"
            unCheckedChildren="구독 미확인"
            style={{
              width: 100,
              marginTop: 10,
            }}
          />
        </TransformBox>
      </S.SmallTableContainer>
    </>
  );
}
