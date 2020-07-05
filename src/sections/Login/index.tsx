import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Layout, Typography, Spin } from 'antd';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import googleLogo from './assets/google_logo.jpg';
import { Viewer } from '../../lib/types';
import { LOGIN } from '../../lib/graphql/mutations';
import { AUTH_URL } from '../../lib/graphql/queries';
import {
  Login as LoginData,
  LoginVariables,
} from '../../lib/graphql/mutations/Login/__generated__/Login';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { displayErrorMessage, displaySuccessNotification } from '../../lib/utils';
import { ErrorBanner } from '../../lib/components';

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
  // use this to call graphql query manually instead of useQuery
  const client = useApolloClient();
  const [login, { data: loginData, loading: loginLoading, error: loginError }] = useMutation<
    LoginData,
    LoginVariables
  >(LOGIN, {
    onCompleted: data => {
      if (data && data.login) {
        setViewer(data.login);
        displaySuccessNotification("You've successfully login!");
      }
    },
  });

  const loginRef = useRef(login);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      loginRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });

      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage('Failed to login. Please try again later!');
    }
  };

  if (loginLoading) {
    return (
      <Content>
        <Spin size="large" tip="Logging in..." />
      </Content>
    );
  }

  const loginErrorBanner = loginError ? (
    <ErrorBanner description="Failed to login. Please try again later!" />
  ) : null;

  if (loginData && loginData.login) {
    const { id: viewerId } = loginData.login;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  return (
    <Content className="log-in">
      {loginErrorBanner}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with google to start booking now!</Text>
        </div>
        <button className="log-in-card__google-button" onClick={handleAuthorize}>
          <img alt="google logo" src={googleLogo} className="log-in-card__google-button-logo" />
          <span className="log-in-card__google-button-text">Sign in with Google</span>
        </button>
        <Text type="secondary">
          Note: By signing in, you will be redirected to the Google consent form to sign in with
          your Google account.
        </Text>
      </Card>
    </Content>
  );
};
