import JWTContext from '@/contexts/JWTContext';
import * as React from 'react';
import { useHistory } from 'react-router';

const LogoutPage = () => {
  const jwtContext = React.useContext(JWTContext);
  const history = useHistory();

  jwtContext.set({
    accessToken: undefined,
    refreshToken: undefined,
  });

  history.push('/');

  return <div>Logging out...</div>;
};

export default LogoutPage;
