import { gql } from '@apollo/client';

export type CreateWinningNumberParams = {
  round: number;
  date: moment.Moment | null;
  winningNumber: number[];
};

export type CreateWinningNumberResponse = {
  createWinningNumber: boolean;
};

export const CREATE_WINNING_NUMBER = gql`
  mutation createWinningNumber(
    $round: Int!
    $date: DateTime!
    $winningNumber: [Int!]!
  ) {
    createWinningNumber(
      round: $round
      date: $date
      winningNumber: $winningNumber
    )
  }
`;

export type UpdateWinningNumberParams = CreateWinningNumberParams;

export const UPDATE_WINNING_NUMBER = gql`
  mutation updateWinningNumber(
    $date: DateTime!
    $round: Int
    $winningNumber: [Int!]
  ) {
    updateWinningNumber(
      date: $date
      round: $round
      winningNumber: $winningNumber
    )
  }
`;

export type UpdateRegistrationInfoForSendGiftResponse = {
  updateRegistrationInfoForSendGift: {
    name: string;
    nickname: string;
    phone: string;
    result: string;
  }[];
};

export type UpdateRegistrationInfoForSendGiftParams = {
  datas: {
    name: string;
    nickname: string;
    phone: string;
  }[];
};

export const UPDATE_REGISTRATION_INFO_FOR_SEND_GIFT = gql`
  mutation updateRegistrationInfoForSendGift(
    $datas: [DatasOnUpdateRegistrationInfoForSendGiftArgs!]!
  ) {
    updateRegistrationInfoForSendGift(datas: $datas) {
      name
      nickname
      phone
      result
    }
  }
`;
