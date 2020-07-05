import React from 'react';
import { Alert } from 'antd';

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner = ({
  message = 'Oops, something went wrong :(',
  description = 'Please check your connection or try again later',
}: Props) => {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      banner
      closable
      className="error-banner"
    />
  );
};
