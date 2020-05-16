import AsyncRenderer from '@/components/AsyncRenderer';
import { Field, FieldRow } from '@/components/FormHelper';
import JWTContext from '@/contexts/JWTContext';
import API, { User } from '@/models/API';
import * as moment from 'moment';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Select from 'react-select';
import { toast } from 'react-toastify';

const UserEditRender = ({ user: defaultUser }: any) => {
  const jwtContext = useContext(JWTContext);

  const [user, setUser] = useState(defaultUser);
  const [isFrozen, setFrozen] = useState(false);
  useEffect(() => {
    setUser(defaultUser);
  }, [defaultUser]);

  const permissionOptions = [{ value: 'admin', label: 'Admin' }];

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFrozen(true);

    try {
      await API.withJWTContext(jwtContext).updateUser(defaultUser.username, {
        display_name: user.display_name,
        ...(user.email ? { email: user.email } : {}),
        ...(jwtContext.hasPermission('admin') ? { permissions: user.permissions } : {}),
      });

      toast.success(
        <div>
          <i className="fas fa-save" /> Saved edits to user.
        </div>,
      );
    } catch (err) {
      console.error(err);

      const message = err?.response?.data?.message ?? err?.message ?? err.toString();

      const additionalInformation =
        typeof err?.response?.data?.additionalInformation !== 'undefined' ? (
          <pre>{JSON.stringify(err?.response?.data?.additionalInformation, null, 2)}</pre>
        ) : (
          <></>
        );

      toast.error(
        <div>
          <i className="fas fa-exclamation-circle" /> Failed to edit user: {message} {additionalInformation}
        </div>,
      );
    } finally {
      setFrozen(false);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={save}>
        <FieldRow>
          {jwtContext.hasPermission('admin') && (
            <Field className="column" description="ID">
              <input className="input" type="text" value={user.id} readOnly disabled />
            </Field>
          )}
          <Field className="column" description="Username">
            <input type="text" className="input" value={user.username} readOnly disabled />
          </Field>
          <Field className="column" description="Display Name">
            <input
              disabled={isFrozen}
              type="text"
              className="input"
              value={user.display_name}
              onChange={(event) => setUser({ ...user, display_name: event.target.value })}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field className="column" description="Registration Date">
            <input
              type="text"
              className="input"
              value={moment(user.registration_time).format('LLL')}
              readOnly
              disabled
            />
          </Field>
          <Field className="column" description="Email">
            <input
              disabled={isFrozen}
              type="email"
              className="input"
              value={user.email ?? ''}
              onChange={(event) => setUser({ ...user, email: event.target.value })}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field className="column" description="Permissions">
            {jwtContext.hasPermission('admin') ? (
              <Select
                isDisabled={isFrozen}
                options={permissionOptions}
                isMulti
                defaultValue={permissionOptions.filter((permission) => user.permissions.includes(permission.value))}
                onChange={(newPermissions: any[]) => {
                  const permissions = (newPermissions ?? []).map((item) => item.value);
                  setUser({ ...user, permissions });
                }}
              />
            ) : (
              <input
                placeholder="No permissions"
                className="input"
                type="text"
                value={user.permissions.join(', ')}
                readOnly
                disabled
              />
            )}
          </Field>
        </FieldRow>

        <button className="button is-primary" style={{ marginTop: '1rem' }}>
          Save
        </button>
      </form>
    </div>
  );
};

const UserEditPage = () => {
  const { username } = useParams();
  const jwtContext = useContext(JWTContext);

  return (
    <>
      <h1 className="title is-2">Edit user {username}</h1>
      <AsyncRenderer fetcher={() => API.withJWTContext(jwtContext).getUser(username)} dependencies={[username]}>
        {(user: User) => <UserEditRender user={user} />}
      </AsyncRenderer>
    </>
  );
};

export default UserEditPage;
