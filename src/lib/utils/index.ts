import { message, notification } from 'antd';

export const displaySuccessNotification = (message: string, description?: string) => {
  return notification['success']({
    message,
    description,
    placement: 'topRight',
    style: {
      marginTop: 50,
    },
  });
};

export const displayErrorMessage = (errorMsg: string) => {
  return message.error(errorMsg);
};
