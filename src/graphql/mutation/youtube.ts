import { gql } from '@apollo/client';

export type UpdateStaticLinkResponse = {
  updateStaticLink: boolean;
};

export type UpdateStaticLinkParams = {
  uri: string;
};

export const UPDATE_STATIC_URL = gql`
  mutation updateStaticLink($uri: String!) {
    updateStaticLink(uri: $uri)
  }
`;

export const TOGGLE_YOUTUBE_SUBSCRIPTION = gql`
  mutation toggleYoutubeSubscription {
    toggleYoutubeSubscription
  }
`;
