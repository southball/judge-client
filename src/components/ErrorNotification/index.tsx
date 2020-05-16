import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import './style.scss';

interface ErrorNotificationProps {
  show: boolean;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) => (
  <CSSTransition
    in={show}
    appear={true}
    timeout={{ appear: 1000, enter: 1000, exit: 1000 }}
    classNames="error-transition"
  >
    <div className="notification is-danger error-notification">{children}</div>
  </CSSTransition>
);

export default ErrorNotification;
