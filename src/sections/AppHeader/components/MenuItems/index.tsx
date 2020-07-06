import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Menu, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Viewer } from '../../../../lib/types';
import { LOGOUT } from '../../../../lib/graphql/mutations';
import { Logout as LogoutData } from '../../../../lib/graphql/mutations/Logout/__generated__/Logout';
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logout] = useMutation<LogoutData>(LOGOUT, {
    onCompleted: data => {
      if (data && data.logout) {
        setViewer(data.logout);
        displaySuccessNotification("You've successfully logout.");
      }
    },
    onError: data => {
      displayErrorMessage('Unable to logout. Please try again.');
    },
  });

  const handleLogout = () => {
    logout();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="user">
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogout}>
            <LogoutOutlined />
            Logout
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign in</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
