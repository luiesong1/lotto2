import { gql } from '@apollo/client';
import { AdType } from 'pages/Ad/Ad';
import { VideoAdvertisement } from 'pages/Ad/VideoAd';

export type SeeAdvertisementHistroyResponse = {
  seeAdvertisementHistoryByAdmin: {
    advertisements: AdType[];
    totalCount: number;
  };
};

export type SeeAdvertisementHistoryParams = IsSearchTextBaseParams;

export const SEE_ADVERTISEMENT_HISTORY = gql`
  query seeAdvertisementHistoryByAdmin(
    $searchText: String
    $take: Int!
    $skip: Int!
  ) {
    seeAdvertisementHistoryByAdmin(
      searchText: $searchText
      take: $take
      skip: $skip
    ) {
      advertisements {
        id
        place
        url
        image
        startPeriod
        endPeriod
        price
      }
      totalCount
    }
  }
`;

export type SeeAdvertisementVideoHistoryResponse = {
  seeAdvertisementVideoHistory: {
    advertisementVideos: VideoAdvertisement[];
    totalCount: number;
  };
};

export type SeeAdvertisementVideoHistoryParams = IsPaginationBaseParams;

export const SEE_ADVERTISEMENT_VIDEO_HISTORY = gql`
  query seeAdvertisementVideoHistory($take: Int!, $skip: Int!) {
    seeAdvertisementVideoHistory(take: $take, skip: $skip) {
      advertisementVideos {
        id
        file
      }
      totalCount
    }
  }
`;
