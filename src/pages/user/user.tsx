import * as React from 'react';
import { useParams, useHistory } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import NotFound from '../../components/NotFound/NotFound';
import NowLoading from '../../components/NowLoading/NowLoading';
import API from '../../models/API';
import JWTContext, { IfAdmin } from '../../contexts/JWTContext';
import * as moment from 'moment';
import If from '../../components/If/If';

const UserRender = ({ user }: any) => {
    const jwtContext = useContext(JWTContext);
    const history = useHistory();

    return (
        <div>
            <table className="table is-fullwidth is-hoverable">
                <If condition={jwtContext.hasPermission('admin') || jwtContext.getUsername() === user.username}>
                    <thead>
                        <tr>
                            <td colSpan={2}>
                                <button
                                    className="button is-primary"
                                    onClick={() => history.push(`/user/${user.username}/edit`)}>
                                    Edit
                                    </button>
                            </td>
                        </tr>
                    </thead>
                </If>
                <tbody>
                    <IfAdmin>
                        <tr>
                            <th>ID</th>
                            <td>{user.id}</td>
                        </tr>
                    </IfAdmin>
                    <tr>
                        <th>Username</th>
                        <td>{user.username}</td>
                    </tr>
                    <tr>
                        <th>Display Name</th>
                        <td>{user.display_name}</td>
                    </tr>
                    <tr>
                        <th>Registration Date</th>
                        <td>{moment(user.registration_time).format('LLL')}</td>
                    </tr>
                    {
                        jwtContext.hasPermission('admin') || user.username === jwtContext.getUsername()
                            ? <>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Permissions</th>
                                    <td>{user.permissions.join(', ')}</td>
                                </tr>
                            </>
                            : <></>
                    }
                </tbody>
            </table>
        </div>
    )
}

const UserPage = () => {
    const { username } = useParams();
    const [user, setUser] = useState();
    const [notFound, setNotFound] = useState(false);
    const jwtContext = useContext(JWTContext);

    useEffect(() => {
        API.withJWTContext(jwtContext).getUser(username).then(setUser).catch(() => setNotFound(true));
    }, [username]);

    return (
        <>
            <h1 className="title is-2">User {username}</h1>
            {
                notFound
                    ? <NotFound />
                    : typeof user === 'undefined'
                        ? <NowLoading />
                        : <UserRender user={user} />
            }
        </>
    );
};

export default UserPage;
