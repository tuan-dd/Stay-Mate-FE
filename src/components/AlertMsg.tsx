import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function AlertMsg() {
  return (
    <ToastContainer
      position='top-right'
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnHover
      limit={2}
    />
  );
}

export default AlertMsg;
