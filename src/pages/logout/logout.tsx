import * as React from 'react';
import { useHistory } from 'react-router';
import JWTContext from '../../contexts/JWTContext';

const LogoutPage = () => {
    const jwtContext = React.useContext(JWTContext);
    const history = useHistory();

    function logout() {
        jwtContext.set({
            accessToken: undefined,
            refreshToken: undefined,
        });

        history.push('/');
    }

    return (
        <div>
            <button className="button" onClick={logout}>Logout</button>
        </div>
    );
};

export default LogoutPage;
