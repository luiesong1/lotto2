import { gql } from '@apollo/client';
import { FaqType, InquiryType, NoticeType, PartnerType } from 'utils/columns';

export type SeeAllInquiryHistoryByAdminParams = IsSearchTextBaseParams;

export type SeeAllInquiryHistoryByAdminResponse = {
  seeAllInquiryHistoryByAdmin: {
    totalCount: number;
    inquiries: InquiryType[];
  };
};

export const SEE_ALL_INQUIRY_HISTORY_BY_ADMIN = gql`
  query seeAllInquiryHistoryByAdmin(
    $searchText: String
    $take: Int!
    $skip: Int!
  ) {
    seeAllInquiryHistoryByAdmin(
      searchText: $searchText
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
        user {
          email
          nickname
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

export type SeeFaqHistoryByAdminParams = IsSearchTextBaseParams;

export type SeeFaqHistoryByAdminResponse = {
  seeFaqHistoryByAdmin: {
    faqs: FaqType[];
    totalCount: number;
  };
};

export const SEE_FAQ_HISTORY_BY_ADMIN = gql`
  query seeFaqHistoryByAdmin($searchText: String, $take: Int!, $skip: Int!) {
    seeFaqHistoryByAdmin(searchText: $searchText, take: $take, skip: $skip) {
      faqs {
        id
        question
        answer
        createdAt
        faqKind {
          id
          name
        }
        admin {
          name
        }
      }
      totalCount
    }
  }
`;

export type SeeNoticeHistoryByAdminParams = IsSearchTextBaseParams;

export type SeeNoticeHistoryByAdminResponse = {
  seeNoticeHistoryByAdmin: {
    totalCount: number;
    notices: NoticeType[];
  };
};

export const SEE_NOTICE_HISTORY_BY_ADMIN = gql`
  query seeNoticeHistoryByAdmin(
    $orderBy: OrderByOnSeeNoticeHistoryByAdminArgs
    $searchText: String
    $take: Int!
    $skip: Int!
  ) {
    seeNoticeHistoryByAdmin(
      orderBy: $orderBy
      searchText: $searchText
      take: $take
      skip: $skip
    ) {
      notices {
        id
        title
        content
        createdAt
        isFix
        admin {
          name
        }
      }
      totalCount
    }
  }
`;

export type SeePartnershipInquiryHistoryByAdminParams = IsSearchTextBaseParams;
export type SeePartnershipInquiryHistoryByAdminResponse = {
  seePartnershipInquiryHistoryByAdmin: {
    partnershipInquiries: PartnerType[];
    totalCount: number;
  };
};
export const SEE_PARTNERSHIP_INQUIRY_HISTORY = gql`
  query seePartnershipInquiryHistoryByAdmin(
    $searchText: String
    $take: Int!
    $skip: Int!
  ) {
    seePartnershipInquiryHistoryByAdmin(
      searchText: $searchText
      take: $take
      skip: $skip
    ) {
      partnershipInquiries {
        id
        companyName
        name
        phone
        email
        url
        content
        createdAt
        isConfirm
      }
      totalCount
    }
  }
`;
export type SeeFaqKindResponse = {
  seeFaqKind: KindType[];
};

export const SEE_FAQ_KIND = gql`
  query seeFaqKind {
    seeFaqKind {
      id
      name
    }
  }
`;
