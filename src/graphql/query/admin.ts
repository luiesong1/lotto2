import { gql } from '@apollo/client';
import { AdminType } from 'utils/columns/admin';

export type CreateAccessTokenByAdminParams = {
  email: string;
  password: string;
  code: string;
};

export type CreateAccessTokenByAdminResponse = {
  createAccessTokenByAdmin: string;
};

export const CREATE_ACCESS_TOKEN_BY_ADMIN = gql`
  query createAccessTokenByAdmin(
    $email: String!
    $password: String!
    $code: String!
  ) {
    createAccessTokenByAdmin(email: $email, password: $password, code: $code)
  }
`;

export type CreateOtpQrCodeParams = {
  email: string;
};

export type CreateOtpQrCodeResponse = {
  createOtpQrCode: {
    url: string;
    otpSecret: string;
  };
};

export const CREATE_OTP_QR_CODE = gql`
  query createOtpQrCode($email: String!) {
    createOtpQrCode(email: $email) {
      url
      otpSecret
    }
  }
`;

export type SeeMyInfoByAdminResponse = {
  seeMyInfoByAdmin: AdminType;
};

export const SEE_MY_INFO_BY_ADMIN = gql`
  query seeMyInfoByAdmin {
    seeMyInfoByAdmin {
      email
      adminRoles {
        name
      }
      name
      phone
      createdAt
      otpSecret
      updatedAt
    }
  }
`;

export type SeeAdminHistoryByAdminResponse = {
  seeAdminHistoryByAdmin: {
    admins: AdminType[];
    totalCount: number;
  };
};

export type SeeAdminHistoryByAdminParams = IsSearchTextBaseParams;

export type SeeAdminRoleResponse = {
  seeAdminRole: KindType[];
};

export const SEE_ADMIN_HISTORY_BY_ADMIN = gql`
  query seeAdminHistoryByAdmin($searchText: String, $take: Int!, $skip: Int!) {
    seeAdminHistoryByAdmin(searchText: $searchText, take: $take, skip: $skip) {
      admins {
        email
        adminRoles {
          id
          name
        }
        name
        phone
        createdAt
        otpSecret
        updatedAt
      }
      totalCount
    }
  }
`;

export const SEE_ADMIN_ROLE = gql`
  query seeAdminRole {
    seeAdminRole {
      id
      name
    }
  }
`;
