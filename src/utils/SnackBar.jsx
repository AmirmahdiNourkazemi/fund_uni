import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SnackbarComponent = ({ open, onClose, message, severity }) => {
  // You can customize the toast appearance based on the severity
  const notify = () => {
    switch (severity) {
      case 'success':
        toast.success(message, { onClose });
        break;
      case 'error':
        toast.error(message, { onClose });
        break;
      case 'warning':
        toast.warn(message, { onClose });
        break;
      case 'info':
        toast.info(message, { onClose });
        break;
      default:
        toast(message, { onClose });
        break;
    }
  };

  // Trigger the toast if `open` is true
  React.useEffect(() => {
    if (open) {
      notify();
    }
  }, [open]); // re-run when 'open' changes

  return <ToastContainer draggable  progressStyle={{color:'blue'}} bodyStyle={{fontFamily:'irms-w600' , textAlign:'end'}} position="top-center" autoClose={3000} hideProgressBar />;
};

export default SnackbarComponent;
