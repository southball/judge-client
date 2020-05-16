import JWTContext from '@/contexts/JWTContext';
import ContestPage from '@/pages/contest';
import ContestEditPage from '@/pages/contest/edit';
import ContestsPage from '@/pages/contests';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import LogoutPage from '@/pages/logout';
import NotFoundPage from '@/pages/not-found';
import ProblemPage from '@/pages/problem';
import ProblemEditPage from '@/pages/problem/edit';
import ProblemsPage from '@/pages/problems';
import RegisterPage from '@/pages/register';
import SubmissionPage from '@/pages/submission';
import SubmissionsPage from '@/pages/submissions';
import UserPage from '@/pages/user';
import UserEditPage from '@/pages/user/edit';
import UsersPage from '@/pages/users';
import * as React from 'react';
import { useContext } from 'react';
import { Route, Switch } from 'react-router';
import { Flip, ToastContainer } from 'react-toastify';
import NavBar, { NavLinkType } from '../NavBar';
import './style.scss';

const NavBarLeft = (NavLink: NavLinkType) => {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/contests">Contests</NavLink>
      <NavLink to="/problems">Problems</NavLink>
      <NavLink to="/submissions">Submissions</NavLink>
      <NavLink to="/users">Users</NavLink>
      {/*
                jwtContext.hasPermission('admin') &&
                <NavLink to="/admin">Admin</NavLink>
            */}
    </>
  );
};

const NavBarRight = (NavLink: NavLinkType) => {
  const jwtContext = useContext(JWTContext);
  const authenticated = jwtContext.loggedIn();

  return !authenticated ? (
    <NavLink to="/login">Login / Register</NavLink>
  ) : (
    <>
      <NavLink to={`/user/${jwtContext.getUsername()}`}>Profile</NavLink>
      <NavLink to="/logout">Logout</NavLink>
    </>
  );
};

const App = () => {
  const jwtContext = useContext(JWTContext);

  return (
    <>
      <NavBar left={NavBarLeft} right={NavBarRight} />

      <div className="container main-container">
        <Switch>
          <Route path="/" exact component={HomePage} />

          <Route path="/contests" exact component={ContestsPage} />
          <Route path="/contest/:contestSlug" exact component={ContestPage} />
          <Route path="/contest/:contestSlug/edit" exact component={ContestEditPage} />
          <Route path="/contest/:contestSlug/problem/:contestProblemSlug" exact component={ProblemPage} />

          <Route path="/problems" exact component={ProblemsPage} />
          <Route path="/problem/:problemSlug" exact component={ProblemPage} />
          <Route path="/problem/:problemSlug/edit" exact component={ProblemEditPage} />

          <Route path="/submissions" exact component={SubmissionsPage} />
          <Route path="/submission/:submissionID" exact component={SubmissionPage} />

          <Route path="/users" exact component={UsersPage} />
          <Route path="/user/:username" exact component={UserPage} />
          <Route path="/user/:username/edit" exact component={UserEditPage} />

          {!jwtContext.loggedIn() ? (
            <>
              <Route path="/login" exact component={LoginPage} />
              <Route path="/register" exact component={RegisterPage} />
            </>
          ) : (
            <Route path="/logout" exact component={LogoutPage} />
          )}

          {/*
                        jwtContext.hasPermission('admin') &&
                        <Route path="/admin" exact component={AdminPage} />
                    */}

          <Route path="*" component={NotFoundPage} />
        </Switch>
      </div>

      <ToastContainer
        toastClassName="judge-toast"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable={false}
        transition={Flip}
        pauseOnHover
      />
    </>
  );
};

export default App;
