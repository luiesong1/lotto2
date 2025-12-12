import { gql } from '@apollo/client';
import { SearchType } from 'components/SearchForm/SearchForm';
import { BroadCastInfoType } from 'pages/Operation/Live';
import { Partnership } from 'pages/Operation/PartnershipList';
import { PrizeType } from 'pages/Operation/Prize';
import { RoundHistoryType } from 'utils/columns';

export type SeeGiveawayByAdminResponse = {
  seeGiveawayByAdmin: {
    giveaways: PrizeType[];
    round: number;
  };
};

export type SeeGiveawayByAdminParams = {
  date: string;
};

export const SEE_GIVEAWAY_BY_ADMIN = gql`
  query seeGiveawayByAdmin($date: DateTime!) {
    seeGiveawayByAdmin(date: $date) {
      giveaways {
        id
        name
        rank
        image
      }
      round
    }
  }
`;

export type SeeBroadcastInfoByAdminResponse = {
  seeBroadcastInfoByAdmin: {
    broadcastInfo: {
      offAirText: string;
      onAirText: string;
    } & BroadCastInfoType;
  };
};

export type SeeBroadcastInfoByAdminParams = {
  date: string;
};

export const SEE_BROADCAST_INFO = gql`
  query seeBroadcastInfoByAdmin($date: DateTime!) {
    seeBroadcastInfoByAdmin(date: $date) {
      broadcastInfo {
        id
        thumbnail
        offAirText
        onAirText
        youtubeUrl
        isOnAir
        onAirDate
      }
    }
  }
`;

export type SeeRoundDateInfoHistoryByAdminParams = SearchType &
  IsPaginationBaseParams;

export type SeeRoundDateInfoHistoryByAdminResponse = {
  seeRoundDateInfoHistoryByAdmin: {
    roundDateInfos: RoundHistoryType[];
    totalCount: number;
  };
};

export const SEE_ROUND_DATE_INFO_HISTORY = gql`
  query seeRoundDateInfoHistoryByAdmin(
    $searchText: String
    $startTextForRound: Int
    $endTextForRound: Int
    $startPeriodForDate: DateTime
    $endPeriodForDate: DateTime
    $take: Int!
    $skip: Int!
  ) {
    seeRoundDateInfoHistoryByAdmin(
      searchText: $searchText
      startTextForRound: $startTextForRound
      endTextForRound: $endTextForRound
      startPeriodForDate: $startPeriodForDate
      endPeriodForDate: $endPeriodForDate
      take: $take
      skip: $skip
    ) {
      roundDateInfos {
        id
        round
        date
        createdAt
        giveaways {
          name
          id
          rank
        }
        broadcastInfo {
          offAirText
          onAirText
        }
      }
    }
  }
`;

export type SeeStaticLinkResponse = {
  seeStaticLink: string;
};

export const SEE_STATIC_LINK = gql`
  query seeStaticLink {
    seeStaticLink
  }
`;

export type SeePartnershipHistroyParams = IsPaginationBaseParams;

export type SeePartnershipHistoryResponse = {
  seePartnershipHistory: {
    partnerships: Partnership[];
    totalCount: number;
  };
};

export const SEE_PARTNERSHIP_HISTORY = gql`
  query seePartnershipHistory($take: Int!, $skip: Int!) {
    seePartnershipHistory(take: $take, skip: $skip) {
      partnerships {
        id
        no
        url
        image
      }
      totalCount
    }
  }
`;

export type SeeYoutubeSubscriptionResponse = {
  seeYoutubeSubscription: boolean;
};

export const SEE_YOUTUBE_SUBSCRIPTION = gql`
  query seeYoutubeSubscription {
    seeYoutubeSubscription
  }
`;
