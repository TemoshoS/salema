import React, { forwardRef } from 'react';
import Toast from 'react-native-toast-message';

// Wrap the Toast component with forwardRef
const ToastWrapper = forwardRef((props, ref) => {
  // Customize the component to handle success and error toasts
  const showSuccessToast = ({ text1, ...rest }) => {
    Toast.show({
      type: 'success',
      text1: text1 || 'Success',
      ...rest,
    });
  };

  const showErrorToast = ({ text1, ...rest }) => {
    Toast.show({
      type: 'error',
      text1: text1 || 'Error',
      ...rest,
    });
  };

  // Pass the ref to the Toast component
  return <Toast ref={ref} {...props} showSuccessToast={showSuccessToast} showErrorToast={showErrorToast} />;
});

export default ToastWrapper;
