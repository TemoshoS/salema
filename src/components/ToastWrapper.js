import React, { forwardRef } from 'react';
import Toast from 'react-native-toast-message';

// Wrap the Toast component with forwardRef
const ToastWrapper = forwardRef((props, ref) => {
  // Pass the ref to the Toast component
  return <Toast ref={ref} {...props} />;
});

export default ToastWrapper;
