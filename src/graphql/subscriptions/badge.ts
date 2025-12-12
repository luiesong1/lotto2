import { gql } from '@apollo/client';

export type SeeCountNotConfirmPartnershipInquirySubResponse = {
  seeCountNotConfirmPartnershipInquiry: number;
};

export const CREATED_PARTNERSHIP_INQUIRY = gql`
  subscription seeCountNotConfirmPartnershipInquiry {
    seeCountNotConfirmPartnershipInquiry
  }
`;

export type SeeCountNotReplyInquirySubResponse = {
  seeCountNotReplyInquiry: number;
};

export const CREATED_INQUIRY = gql`
  subscription seeCountNotReplyInquiry {
    seeCountNotReplyInquiry
  }
`;
