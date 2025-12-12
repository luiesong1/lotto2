import { gql } from '@apollo/client';

export type CreatePolicyParams = {
  policyKindId: number;
  content: string;
};

export type CreatePolicyResponse = {
  createPolicy: boolean;
};

export const CREATE_POLICY = gql`
  mutation createPolicy($policyKindId: Int!, $content: String!) {
    createPolicy(policyKindId: $policyKindId, content: $content)
  }
`;

export type UpdatePolicyParams = {
  id: number;
} & CreatePolicyParams;

export type UpdatePolicyResponse = {
  updatePolicy: boolean;
};

export const UPDATE_POLICY = gql`
  mutation updatePolicy($id: Int!, $policyKindId: Int!, $content: String!) {
    updatePolicy(id: $id, policyKindId: $policyKindId, content: $content)
  }
`;

export type DeletePolicyParams = {
  id: number;
};

export type DeletePolicyResponse = {
  deletePolicy: boolean;
};

export const DELETE_POLICY = gql`
  mutation deletePolicy($id: Int!) {
    deletePolicy(id: $id)
  }
`;
