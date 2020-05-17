import API from '@/models/API';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type FormInputs = {
  username: string;
  password: string;
  email?: string;
  displayName: string;
};

const RegisterPage = () => {
  const { register, handleSubmit, errors } = useForm<FormInputs>();
  const history = useHistory();

  async function onSubmit({ username, password, email, displayName }: FormInputs) {
    try {
      await new API().register({
        username,
        password,
        displayName,
        ...(email ? { email } : {}),
      });

      history.push('/login');
    } catch (err) {
      console.error(err);
      toast.error(
        <div>
          <i className="fas fa-exclamation-circle" /> Unexpected error when registering account. See console for more
          information.
        </div>,
      );
    }
  }

  return (
    <>
      <h1 className="title is-2">Register</h1>
      <hr />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              className={'input' + (errors.username ? ' is-danger' : '')}
              type="text"
              name="username"
              ref={register({ minLength: 6, required: true })}
            />
          </div>
          {errors.username && (
            <p className="help is-danger">Username is required and must be at least 6 characters long.</p>
          )}
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className={'input' + (errors.password ? ' is-danger' : '')}
              type="password"
              name="password"
              ref={register({ minLength: 8, required: true })}
            />
          </div>
          {errors.password && (
            <p className="help is-danger">Password is required and must be at least 8 characters long.</p>
          )}
        </div>

        <div className="field">
          <label className="label">Email (Optional)</label>
          <div className="control">
            <input className="input" type="email" name="email" ref={register} />
          </div>
        </div>

        <div className="field">
          <label className="label">Display Name</label>
          <div className="control">
            <input
              className={'input' + (errors.displayName ? ' is-danger' : '')}
              type="text"
              name="displayName"
              ref={register({ required: true })}
            />
          </div>
          {errors.displayName && <p className="help is-danger">Display name is required.</p>}
        </div>

        <button type="submit" className="button is-primary">
          Register
        </button>
      </form>

      <hr />

      <p>
        Have an account? <Link to="/login">Login</Link> here.
      </p>
    </>
  );
};

export default RegisterPage;
