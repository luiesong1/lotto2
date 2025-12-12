import { gql } from '@apollo/client';

export type SeeDashboardStatsByAdminResponse = {
  seeDashboardStatsByAdmin: {
    userCount: {
      date: string;
      count: number;
    }[];
    registrationInfoCount: {
      date: string;
      count: number;
    }[];
    partnershipInquiryCount: {
      date: string;
      count: number;
    }[];
  };
};

export const SEE_DASHBOARD_STATS_BY_ADMIN = gql`
  query seeDashboardStatsByAdmin {
    seeDashboardStatsByAdmin {
      userCount {
        date
        count
      }
      registrationInfoCount {
        date
        count
      }
      partnershipInquiryCount {
        date
        count
      }
    }
  }
`;
