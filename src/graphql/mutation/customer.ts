import { gql } from '@apollo/client';

export type CreateNoticeParams = {
  title: string;
  content: string;
  isFix: boolean;
};

export type CreateNoticeRespons = {
  createNotice: boolean;
};

export const CREATE_NOTICE = gql`
  mutation createNotice($title: String!, $content: String!, $isFix: Boolean!) {
    createNotice(title: $title, content: $content, isFix: $isFix)
  }
`;

export type UpdateNoticeParams = {
  id: number;
} & CreateNoticeParams;

export type UpdateNoticeResponse = {
  updateNotice: boolean;
};

export const UPDATE_NOTICE = gql`
  mutation updateNotice(
    $title: String!
    $content: String!
    $isFix: Boolean!
    $id: Int!
  ) {
    updateNotice(title: $title, content: $content, isFix: $isFix, id: $id)
  }
`;

export type DeleteNoticeParams = {
  id: number;
};

export type DeleteNoticeResponse = {
  deleteNotice: boolean;
};

export const DELETE_NOTICE = gql`
  mutation deleteNotice($id: Int!) {
    deleteNotice(id: $id)
  }
`;

export type ConfirmPartnershipInquiryParams = {
  id: number;
};

export type ConfirmPartnershipInquiryResponse = {
  confirmPartnershipInquiry: boolean;
};

export type UploadNoticeImageParams = {
  file: File;
};

export type UploadNoticeImageResponse = {
  uploadNoticeImage: string;
};

export const UPLOAD_NOTICE_IMAGE = gql`
  mutation uploadNoticeImage($file: Upload!) {
    uploadNoticeImage(file: $file)
  }
`;

export const CONFIRM_PARTNERSHIP_INQUIRY = gql`
  mutation confirmPartnershipInquiry($id: Int!) {
    confirmPartnershipInquiry(id: $id)
  }
`;
export type CreateFaqParams = {
  faqKindId: number;
  question: string;
  answer: string;
};

export type CreateFaqResponse = {
  createFaq: boolean;
};

export const CREATE_FAQ = gql`
  mutation createFaq($faqKindId: Int!, $question: String!, $answer: String!) {
    createFaq(faqKindId: $faqKindId, question: $question, answer: $answer)
  }
`;

export type UpdateFaqParams = {
  id: number;
  question: string;
  answer: string;
};

export type UpdateFaqResponse = {
  updateFaq: boolean;
};

export const UPDATE_FAQ = gql`
  mutation updateFaq(
    $faqKindId: Int!
    $id: Int!
    $question: String!
    $answer: String!
  ) {
    updateFaq(
      faqKindId: $faqKindId
      id: $id
      question: $question
      answer: $answer
    )
  }
`;

export type DeleteFaqParams = {
  id: number;
};

export type DeleteFaqResponse = {
  deleteFaq: boolean;
};

export const DELETE_FAQ = gql`
  mutation deleteFaq($id: Int!) {
    deleteFaq(id: $id)
  }
`;
