import { gql } from '@apollo/client';

export type ReplyInquiryByAdminParams = {
  id: number;
  reply: string;
};

export type ReplyInquiryByAdminResponse = {
  replyInquiryByAdmin: boolean;
};

export const REPLY_INQUIRY_BY_ADMIN = gql`
  mutation replyInquiryByAdmin($id: Int!, $reply: String!) {
    replyInquiryByAdmin(id: $id, reply: $reply)
  }
`;
