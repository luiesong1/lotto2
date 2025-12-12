import { gql } from '@apollo/client';

export type UploadBroadcastInfoImageResponse = {
  uploadBroadcastInfoImage: string;
};

export const UPLOAD_BROADCAST_INFO_IMAGE = gql`
  mutation uploadBroadcastInfoImage($file: Upload!) {
    uploadBroadcastInfoImage(file: $file)
  }
`;

export type CreateBroadcastInfoResponse = {
  createBraodcastInfo: boolean;
};

export type CreateBraodcastInfoParams = {
  round: number;
  date: moment.Moment;
  thumbnail: string;
  offAirText: string;
  onAirText: string;
  youtubeUrl?: string;
  onAirDate: moment.Moment | null;
};

export const CREATE_BROADCAST_INFO = gql`
  mutation createBroadcastInfo(
    $round: Int!
    $date: DateTime!
    $thumbnail: String!
    $offAirText: String!
    $onAirText: String!
    $youtubeUrl: String
    $onAirDate: DateTime!
  ) {
    createBroadcastInfo(
      round: $round
      date: $date
      thumbnail: $thumbnail
      offAirText: $offAirText
      onAirText: $onAirText
      youtubeUrl: $youtubeUrl
      onAirDate: $onAirDate
    )
  }
`;

export type UpdateBroadcastInfoResponse = {
  updateBroadcastInfo: boolean;
};

export type UpdateBroadcastInfoParams = {
  id: number;
  thumbnail?: string;
  offAirText?: string;
  onAirText?: string;
  youtubeUrl?: string;
  isOnAir?: boolean;
  onAirDate?: moment.Moment | null;
};

export const UPDATE_BROADCAST_INFO = gql`
  mutation updateBroadcastInfo(
    $id: Int!
    $thumbnail: String
    $offAirText: String
    $onAirText: String
    $youtubeUrl: String
    $isOnAir: Boolean
    $onAirDate: DateTime
  ) {
    updateBroadcastInfo(
      id: $id
      thumbnail: $thumbnail
      offAirText: $offAirText
      onAirText: $onAirText
      youtubeUrl: $youtubeUrl
      isOnAir: $isOnAir
      onAirDate: $onAirDate
    )
  }
`;
