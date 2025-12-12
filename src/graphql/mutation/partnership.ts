import { gql } from '@apollo/client';

export type UpdatePartnershipNoParams = {
  no: number;
  id: number;
};

export type UpdatePartnershipNoResponse = {
  updatePartnershipNo: boolean;
};

export const UPDATE_PARTNERSHIP_NO = gql`
  mutation updatePartnershipNo($id: Int!, $no: Int!) {
    updatePartnershipNo(id: $id, no: $no)
  }
`;

export type UpdatePartnershipResponse = {
  updatePartnership: boolean;
};

export type UpdatePartnershipParams = {
  id: number;
  url?: string;
  file?: File;
};

export const UPDATE_PARTNERSHIP = gql`
  mutation updatePartnership($id: Int!, $url: String, $file: Upload) {
    updatePartnership(id: $id, url: $url, file: $file)
  }
`;

export type CreatePartnershipResponse = {
  createPartnership: boolean;
};

export type CreatePartnershipParams = {
  url: string;
  file: File;
};

export const CREATE_PARTNERSHIP = gql`
  mutation createPartnership($url: String!, $file: Upload!) {
    createPartnership(url: $url, file: $file)
  }
`;

export type DeletePartnershipParams = {
  id: number;
};

export type DeletePartnershipResponse = {
  deletePartnership: boolean;
};

export const DELETE_PARTNERSHIP = gql`
  mutation deletePartnership($id: Int!) {
    deletePartnership(id: $id)
  }
`;
