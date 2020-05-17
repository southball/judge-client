import AsyncRenderer from '@/components/AsyncRenderer';
import API, { User } from '@/models/API';
import * as React from 'react';
import { Link } from 'react-router-dom';

const UsersDisplay = ({ users }: { users: User[] }) => (
  <table className="table is-fullwidth is-hoverable is-striped">
    <thead>
      <tr>
        <th>Username</th>
        <th>Display Name</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.username}>
          <td>
            <Link to={`/user/${user.username}`}>{user.username}</Link>
          </td>
          <td>{user.display_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const UsersPage = () => {
  return (
    <>
      <h1 className="title is-2">Users</h1>
      <AsyncRenderer fetcher={() => new API().getUsers()} dependencies={[]}>
        {(users: User[]) => <UsersDisplay users={users} />}
      </AsyncRenderer>
    </>
  );
};

export default UsersPage;
