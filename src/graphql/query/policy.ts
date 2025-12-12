import { gql } from '@apollo/client';
import { PolicyType } from 'utils/columns';

export type SeePolicyHistoryByAdminResponse = {
  seePolicyHistoryByAdmin: {
    policies: PolicyType[];
    totalCount: number;
  };
};

export type SeePolicyHistoryByAdminParams = IsSearchTextBaseParams;

export const SEE_POLICY_HISTORY_BY_ADMIN = gql`
  query seePolicyHistoryByAdmin($searchText: String, $take: Int!, $skip: Int!) {
    seePolicyHistoryByAdmin(searchText: $searchText, take: $take, skip: $skip) {
      policies {
        id
        content
        createdAt
        admin {
          name
        }
        policyKind {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export type SeePolicyKindResponse = {
  seePolicyKind: KindType[];
};

export const SEE_POLICY_KIND = gql`
  query seePolicyKind {
    seePolicyKind {
      id
      name
    }
  }
`;
