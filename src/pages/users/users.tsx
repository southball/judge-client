import * as React from 'react';
import { useState, useEffect } from 'react';
import API, { User } from '../../models/API';
import NowLoading from '../../components/NowLoading/NowLoading';
import { Link } from 'react-router-dom';

const UsersRender = ({ users }: { users: User[] }) => {
    return (
        <>
            <table className="table is-fullwidth is-hoverable is-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Display Name</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr>
                            <td>
                                <Link to={`/user/${user.username}`}>{user.username}</Link>
                            </td>
                            <td>
                                {user.display_name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
};

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        API.noContext().getUsers().then(setUsers);
    });

    return (
        <>
            <h1 className="title is-2">Users</h1>
            {
                typeof users === 'undefined'
                    ? <NowLoading />
                    : <UsersRender users={users} />
            }
        </>
    )
};

export default UsersPage;
