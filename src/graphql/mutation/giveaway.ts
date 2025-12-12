import { gql } from '@apollo/client';

export type UploadGiveawayImageResponse = {
  uploadGiveawayImage: string;
};

export const UPLOAD_GIVEAWAY_IMAGE = gql`
  mutation uploadGiveawayImage($file: Upload!) {
    uploadGiveawayImage(file: $file)
  }
`;

export type CreateGiveawayParams = {
  rank: number;
  round: number;
  date: moment.Moment;
  name: string;
  image: string;
};

export type CreateGiveawayResponse = {
  createGiveaway: boolean;
};

export const CREATE_GIVEAWAY = gql`
  mutation createGiveaway(
    $rank: Int!
    $round: Int!
    $date: DateTime!
    $name: String!
    $image: String!
  ) {
    createGiveaway(
      rank: $rank
      round: $round
      date: $date
      name: $name
      image: $image
    )
  }
`;

export type UpdateGiveawayParams = {
  id: number;
  name: string;
  image: string;
};

export type UpdateGiveawayResponse = {
  updateGiveaway: boolean;
};

export const UPDATE_GIVEAWAY = gql`
  mutation updateGiveaway($id: Int!, $name: String, $image: String) {
    updateGiveaway(id: $id, name: $name, image: $image)
  }
`;
