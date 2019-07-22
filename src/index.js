import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Layout from './core/Layout';

import 'tachyons';
import './index.scss';

const client = new ApolloClient({ uri: 'http://localhost:4000' });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Layout />
  </ApolloProvider>,
  document.getElementById('root')
);
