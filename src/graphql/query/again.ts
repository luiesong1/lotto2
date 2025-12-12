import { gql } from '@apollo/client';
import { SearchType } from 'components/SearchForm/SearchForm';
import { WinningResultType } from 'pages/Again/ResultInput';
import { WinningDetailType, WinningHistoryType } from 'utils/columns';

export type SeeWinningNumberByAdminResponse = {
  seeWinningNumberByAdmin: {
    winningNumbers: WinningResultType[];
  };
};

export type SeeWinningNumberByAdminParams = {
  date: string;
};

export const SEE_WINNING_NUMBER_BY_ADMIN = gql`
  query seeWinningNumberByAdmin($date: DateTime!) {
    seeWinningNumberByAdmin(date: $date) {
      winningNumbers {
        no
        type
        number
      }
    }
  }
`;

export type SeeWinningNumberHistoryByAdminParams = SearchType &
  IsPaginationBaseParams;

export type SeeWinningNumberHistoryByAdminResponse = {
  seeWinningNumberHistoryByAdmin: {
    winningNumbers: WinningHistoryType[];
    totalCount: number;
  };
};

export const SEE_WINNING_NUMBER_HISTORY = gql`
  query seeWinningNumberHistoryByAdmin(
    $searchText: String
    $startTextForRound: Int
    $endTextForRound: Int
    $startPeriodForDate: DateTime
    $endPeriodForDate: DateTime
    $take: Int!
    $skip: Int!
  ) {
    seeWinningNumberHistoryByAdmin(
      searchText: $searchText
      startTextForRound: $startTextForRound
      endTextForRound: $endTextForRound
      startPeriodForDate: $startPeriodForDate
      endPeriodForDate: $endPeriodForDate
      take: $take
      skip: $skip
    ) {
      winningNumbers {
        round
        date
        winningNumber
        one
        two
        three
        four
        five
      }
      totalCount
    }
  }
`;

export type SeeWinningNumberDetailHistoryParmas = SearchType &
  IsPaginationBaseParams;

export type SeeWinningNumberDetailHistoryResponse = {
  seeWinningNumberDetailHistoryByAdmin: {
    histories: WinningDetailType[];
    totalCount: number;
  };
};

export const SEE_WINNING_NUMBER_DETAIL_HISTORY = gql`
  query seeWinningNumberDetailHistoryByAdmin(
    $startTextForRound: Int
    $endTextForRound: Int
    $startPeriodForDate: DateTime
    $endPeriodForDate: DateTime
    $take: Int!
    $skip: Int!
    $isReceive: Boolean
  ) {
    seeWinningNumberDetailHistoryByAdmin(
      startTextForRound: $startTextForRound
      endTextForRound: $endTextForRound
      startPeriodForDate: $startPeriodForDate
      endPeriodForDate: $endPeriodForDate
      take: $take
      skip: $skip
      isReceive: $isReceive
    ) {
      histories {
        round
        date
        rank
        name
        nickname
        address
        addressDetail
        phone
        kakaoId
        isReceive
        isSend
        isFcmToken
        email
      }
      totalCount
    }
  }
`;
