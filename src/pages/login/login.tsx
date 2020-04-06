import { FormEvent } from 'react';
import * as React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';

const LoginPage = () => {
    const EMPTY_STATE = { username: '', password: '' };
    const [state, setState] = React.useState(EMPTY_STATE);
    const [isFrozen, setFrozen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const globalConfig = React.useContext(GlobalConfigContext);
    const jwtContext = React.useContext(JWTContext);
    const history = useHistory();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!state.username || !state.password) {
            setErrorMessage('Username and password must not be empty.');
            return;
        }

        const loginUrl = new URL('auth/login', globalConfig.judgeServer).href;

        setFrozen(true);

        const response = await axios.post(loginUrl, {
            username: state.username,
            password: state.password,
        });

        console.log(response);

        if (response.data.success) {
            setState(EMPTY_STATE);
            jwtContext.set({
                accessToken: response.data.data.access_token,
                refreshToken: response.data.data.refresh_token,
            });
            history.push("/");
        } else {
            setErrorMessage('Wrong username or password.');
        }

        setFrozen(false);
    }

    return (
        <>
            <h1 className="title is-2">Login</h1>
            <hr />

            <ErrorNotification show={errorMessage.length > 0}>
                {errorMessage}
            </ErrorNotification>

            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input disabled={isFrozen} className="input" type="text" value={state.username} onChange={(event) => {
                            setState({ ...state, username: event.target.value });
                        }} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input disabled={isFrozen} className="input" type="password" value={state.password} onChange={(event) => {
                            setState({ ...state, password: event.target.value });
                        }} />
                    </div>
                </div>

                <button type="submit" className="button is-primary">Submit</button>
            </form>
        </>
    );
};

export default LoginPage;
