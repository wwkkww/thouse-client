import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useMutation } from 'react-apollo';
import { Affix, Layout, Spin } from 'antd';
import { AppHeader, Home, Host, Listing, Listings, NotFound, User, Login } from './sections';
import { Viewer } from './lib/types';
import * as serviceWorker from './serviceWorker';
import './styles/index.css';
import { LOGIN } from './lib/graphql/mutations/';
import {
  Login as LoginData,
  LoginVariables,
} from './lib/graphql/mutations/Login/__generated__/Login';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';

const client = new ApolloClient({
  uri: '/api',
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [login, { error }] = useMutation<LoginData, LoginVariables>(LOGIN, {
    onCompleted: data => {
      if (data && data.login) {
        setViewer(data.login);
      }
    },
  });

  const loginRef = useRef(login);

  useEffect(() => {
    loginRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse" />
        </div>
      </Layout>
    );
  }

  const loginErrorBanner = error ? (
    <ErrorBanner description="Login failed. Please try again later" />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {loginErrorBanner}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route exact path="/login" render={props => <Login {...props} setViewer={setViewer} />} />
          <Route exact path="/user/:id" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
