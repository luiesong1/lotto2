import { gql } from '@apollo/client';
import { InquiryType, UserType } from 'utils/columns';

export type SeeUserHistoryByAdminParams = {
  searchText?: string;
} & IsPaginationBaseParams;

export type SeeUserHistoryByAdminResponse = {
  seeUserHistoryByAdmin: { users: UserType[]; totalCount: number };
};

export const SEE_USER_HISTORY_BY_ADMIN = gql`
  query seeUserHistoryByAdmin($take: Int!, $skip: Int!, $searchText: String) {
    seeUserHistoryByAdmin(take: $take, skip: $skip, searchText: $searchText) {
      users {
        email
        nickname
        name
        phone
        createdAt
      }
      totalCount
    }
  }
`;

export type SeeUserDetailByAdminResponse = {
  seeUserDetailByAdmin: UserType;
};

export type SeeUserDetailByAdminParams = {
  email: string;
};

export const SEE_USER_DETAIL_BY_ADMIN = gql`
  query seeUserDetailByAdmin($email: String!) {
    seeUserDetailByAdmin(email: $email) {
      email
      nickname
      name
      phone
      createdAt
      shippingAddresses {
        id
        address
        addressDetail
        isDefault
      }
    }
  }
`;

export type SeeUserInquiryHistoryParams = {
  email: string;
} & IsPaginationBaseParams;

export type SeeUserInquiryHistoryResponse = {
  seeUserInquiryHistoryByAdmin: {
    totalCount: number;
    inquiries: InquiryType[];
  };
};

export const SEE_USER_INQUIRY_HISTORY_BY_ADMIN = gql`
  query seeUserInquiryHistoryByAdmin(
    $searchText: String
    $email: String!
    $take: Int!
    $skip: Int!
  ) {
    seeUserInquiryHistoryByAdmin(
      searchText: $searchText
      email: $email
      take: $take
      skip: $skip
    ) {
      inquiries {
        id
        content
        reportingDate
        processingDate
        reply
        inquiryKind {
          name
        }
        inquiryImages {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export type SearchUserByAdminParams = {
  searchText: string;
};

export type SearchUserByAdminResponse = {
  searchUserByAdmin: UserType[];
};

export const SEARCH_USER_BY_ADMIN = gql`
  query searchUserByAdmin($searchText: String!) {
    searchUserByAdmin(searchText: $searchText) {
      email
      nickname
      name
    }
  }
`;
