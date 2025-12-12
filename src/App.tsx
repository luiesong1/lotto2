import 'antd/dist/antd.less';

import './App.css';
import Root from 'router';
import apolloClient from 'config/apolloClient';

import { ApolloProvider } from '@apollo/client';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Root />
    </ApolloProvider>
  );
}

export default App;
