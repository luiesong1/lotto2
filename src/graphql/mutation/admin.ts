import { gql } from '@apollo/client';

export type CreateAdminParams = {
  email: string;
  password: string;
  name: string;
  phone: string;
  adminRoleIds: number[];
};

export type CreateAdminResponse = {
  createAdmin: boolean;
};

export const CREATE_ADMIN = gql`
  mutation createAdmin(
    $email: String!
    $password: String!
    $name: String!
    $phone: String!
    $adminRoleIds: [Int!]!
  ) {
    createAdmin(
      email: $email
      password: $password
      name: $name
      phone: $phone
      adminRoleIds: $adminRoleIds
    )
  }
`;

export type UpdateOtpSecretParams = {
  email: string;
  otpSecret: string;
  code: string;
};

export type UpdateOtpSecretResponse = {
  updateOtpSecret: boolean;
};

export const UPDATE_OTP_SECRET = gql`
  mutation updateOtpSecret(
    $email: String!
    $otpSecret: String!
    $code: String!
  ) {
    updateOtpSecret(email: $email, otpSecret: $otpSecret, code: $code)
  }
`;

export type DeleteAdminParams = {
  email: string;
};

export type DeleteAdminResponse = {
  deleteAdmin: boolean;
};

export const DELETE_ADMIN = gql`
  mutation deleteAdmin($email: String!) {
    deleteAdmin(email: $email)
  }
`;

export type UpdateAdminParams = {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  adminRoleIds?: number[];
};

export type UpdateAdminResponse = {
  updateAdmin: boolean;
};

export const UPDATE_ADMIN = gql`
  mutation updateAdmin(
    $email: String!
    $password: String
    $name: String
    $phone: String
    $adminRoleIds: [Int!]
  ) {
    updateAdmin(
      email: $email
      password: $password
      name: $name
      phone: $phone
      adminRoleIds: $adminRoleIds
    )
  }
`;
