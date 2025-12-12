import { gql } from '@apollo/client';

export type SendNotificationAllUserResponse = {
  sendNotificationAllUser: boolean;
};

export type SendNotificationAllUserParams = {
  title: string;
  body: string;
};

export const SEND_NOTIFICATION_ALL_USER = gql`
  mutation sendNotificationAllUser($title: String!, $body: String!) {
    sendNotificationAllUser(title: $title, body: $body)
  }
`;

export type SendNotificationSpecificUserResponse = {
  sendNotificationSpecificUser: boolean;
};

export type SendNotificationSpecificUserParams = {
  title: string;
  body: string;
  emails: string[];
};

export const SEND_NOTIFICATION_SPECIFIC_USER = gql`
  mutation sendNotificationSpecificUser(
    $emails: [String!]!
    $title: String!
    $body: String!
  ) {
    sendNotificationSpecificUser(emails: $emails, title: $title, body: $body)
  }
`;
