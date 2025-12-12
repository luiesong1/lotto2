import { gql } from '@apollo/client';

export type SeeCountNotReplyInquiryResponse = {
  seeCountNotReplyInquiry: number;
};

export const SEE_COUNT_NOT_REPLY_INQUIRY = gql`
  query seeCountNotReplyInquiry {
    seeCountNotReplyInquiry
  }
`;

export type SeeCountNotConfirmPartnershipInquiryResponse = {
  seeCountNotConfirmPartnershipInquiry: number;
};

export const SEE_COUNT_NOT_CONFIRM_PARTNERSHIP_INQUIRY = gql`
  query seeCountNotConfirmPartnershipInquiry {
    seeCountNotConfirmPartnershipInquiry
  }
`;
