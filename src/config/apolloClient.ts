import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { notification } from 'antd';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

export const SERVER = process.env.REACT_APP_BASE_URL!;

const httpLink = new HttpLink({
  uri: SERVER,
});

export const SOCKET = process.env.REACT_APP_SOCKET_URL!;

const uploadLink = createUploadLink({
  uri: SERVER,
  headers: {
    'keep-alive': 'true',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: SOCKET,
    connectionParams: () => {
      const accessToken = localStorage.getItem('accessToken');

      return {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      };
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
);

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken');

  operation.setContext({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return forward(operation);
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }: any) => {
    const unauthorizedError =
      graphQLErrors &&
      graphQLErrors.find((item: any) => item.message === 'Unauthorized');

    if (unauthorizedError) {
      notification.error({
        message: '장기간 사용하지 않아 자동 로그아웃되었습니다.',
      });
      window.location.href = '/login';
      return localStorage.setItem('accessToken', '');
    }

    if (networkError) {
      notification.error({
        message: '네트워크 상태가 올바르지 않습니다.',
      });
    }
  },
);

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authMiddleware, errorLink, splitLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
