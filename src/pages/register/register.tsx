import { FormEvent } from 'react';
import * as React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';
import { Link } from 'react-router-dom';
import API from '../../models/API';

const RegisterPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');

    const [isFrozen, setFrozen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const history = useHistory();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!username || !password || !displayName) {
            setErrorMessage('Username, password and display name must not be empty.');
            return;
        }

        setFrozen(true);

        try {
            const response = await API.noContext().register({
                username,
                password,
                displayName,
                ...(email ? {email} : {}),
            });

            // reset every field
            setUsername('');
            setPassword('');
            setEmail('');
            setDisplayName('');

            history.push("/login");
        } catch (err) {
            console.error(err);
            setErrorMessage('Wrong username or password.');
        } finally {
            setFrozen(false);
        }
    }

    return (
        <>
            <h1 className="title is-2">Register</h1>
            <hr />

            <ErrorNotification show={errorMessage.length > 0}>
                {errorMessage}
            </ErrorNotification>

            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input
                            disabled={isFrozen}
                            className="input"
                            type="text"
                            value={username}
                            required
                            onChange={(event) => setUsername(event.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            disabled={isFrozen}
                            className="input"
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email (Optional)</label>
                    <div className="control">
                        <input
                            disabled={isFrozen}
                            className="input"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Display Name</label>
                    <div className="control">
                        <input
                            disabled={isFrozen}
                            className="input"
                            type="text"
                            required
                            value={displayName}
                            onChange={(event) => setDisplayName(event.target.value)} />
                    </div>
                </div>

                <button type="submit" className="button is-primary">Register</button>
            </form>

            <hr />

            <p>Have an account? <Link to="/login">Login</Link> here.</p>
        </>
    );
};

export default RegisterPage;
