import { gql } from '@apollo/client';

export type UpdateAdvertisementParams = {
  id: number;
  startPeriod?: moment.Moment | null;
  endPeriod?: moment.Moment | null;
  price: number;
  url?: string;
  image: string;
};

export type UpdateAdvertisementResponse = {
  updateAdvertisement: boolean;
};

export const UPDATE_AD = gql`
  mutation updateAdvertisement(
    $id: Int!
    $startPeriod: DateTime
    $endPeriod: DateTime
    $price: Int
    $url: String
    $image: String
  ) {
    updateAdvertisement(
      id: $id
      startPeriod: $startPeriod
      endPeriod: $endPeriod
      price: $price
      url: $url
      image: $image
    )
  }
`;

export type UploadAdvertisementImageResponse = {
  uploadAdvertisementImage: string;
};

export const UPLOAD_ADVERTISEMENT_IMAGE = gql`
  mutation uploadAdvertisementImage($file: Upload!) {
    uploadAdvertisementImage(file: $file)
  }
`;

export type UploadAdvertisementVideoResponse = {
  uploadAdvertisementVideo: string;
};

export type UploadAdvertisementVideoParams = {
  file: File;
};

export const UPLOAD_ADVERTISEMENT_VIDEO = gql`
  mutation uploadAdvertisementVideo($file: Upload!) {
    uploadAdvertisementVideo(file: $file)
  }
`;

export type DeleteAdvertisementVideoResponse = {
  deleteAdvertisementVideo: boolean;
};

export type DeleteAdvertisementVideoParams = {
  id: number;
};

export const DELETE_ADVERTISEMENT_VIDEO = gql`
  mutation deleteAdvertisementVideo($id: Int!) {
    deleteAdvertisementVideo(id: $id)
  }
`;

export type DeleteAdvertisementResponse = {
  deleteAdvertisement: boolean;
};

export type DeleteAdvertisementParams = {
  id: number;
};

export const DELETE_ADVERTISEMENT = gql`
  mutation deleteAdvertisement($id: Int!) {
    deleteAdvertisement(id: $id)
  }
`;

export type CreateAdvertisementResponse = {
  createAdvertisement: boolean;
};

export type CreateAdvertisementParams = {
  place: 'TOP' | 'MIDDLE' | 'SQUARE' | 'BOTTOM';
  startPeriod: moment.Moment | null;
  endPeriod: moment.Moment | null;
  price: number;
  url?: string;
  image: string;
};

export const CREATE_ADVERTISEMENT = gql`
  mutation createAdvertisement(
    $place: AdvertisementPlace!
    $startPeriod: DateTime!
    $endPeriod: DateTime!
    $price: Int
    $url: String
    $image: String!
  ) {
    createAdvertisement(
      place: $place
      startPeriod: $startPeriod
      endPeriod: $endPeriod
      price: $price
      url: $url
      image: $image
    )
  }
`;
