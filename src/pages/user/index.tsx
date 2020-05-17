import AsyncRenderer from '@/components/AsyncRenderer';
import JWTContext from '@/contexts/JWTContext';
import API, { User } from '@/models/API';
import * as moment from 'moment';
import * as React from 'react';
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router';

const UserRender = ({ user }: any) => {
  const jwtContext = useContext(JWTContext);
  const history = useHistory();

  const canEditUser = jwtContext.hasPermission('admin') || jwtContext.getUsername() === user.username;

  return (
    <div>
      <table className="table is-fullwidth is-hoverable">
        {canEditUser && (
          <thead>
            <tr>
              <td colSpan={2}>
                <button className="button is-primary" onClick={() => history.push(`/user/${user.username}/edit`)}>
                  Edit
                </button>
              </td>
            </tr>
          </thead>
        )}
        <tbody>
          {jwtContext.hasPermission('admin') && (
            <tr>
              <th>ID</th>
              <td>{user.id}</td>
            </tr>
          )}
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
          {canEditUser && (
            <>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Permissions</th>
                <td>{user.permissions.join(', ')}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

const UserPage = () => {
  const { username } = useParams();
  const jwtContext = useContext(JWTContext);

  return (
    <>
      <h1 className="title is-2">User {username}</h1>
      <AsyncRenderer fetcher={() => new API(jwtContext).getUser(username)} dependencies={[username]}>
        {(user: User) => <UserRender user={user} />}
      </AsyncRenderer>
    </>
  );
};

export default UserPage;
