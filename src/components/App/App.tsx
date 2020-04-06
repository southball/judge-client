import * as React from 'react';
import { useContext } from 'react';
import { Route, Switch } from 'react-router';
import JWTContext from '../../contexts/JWTContext';
import AdminPage from '../../pages/admin/admin';
import ContestPage from '../../pages/contest/contest';
import ContestEditPage from '../../pages/contest/edit';
import ContestsPage from '../../pages/contests/contests';
import HomePage from '../../pages/home/home';
import LoginPage from '../../pages/login/login';
import LogoutPage from '../../pages/logout/logout';
import NotFoundPage from '../../pages/not-found/not-found';
import ProblemEditPage from '../../pages/problem/edit';
import ProblemPage from '../../pages/problem/problem';
import ProblemsPage from '../../pages/problems/problems';
import SubmissionPage from '../../pages/submission/submission';
import SubmissionsPage from '../../pages/submissions/submissions';
import NavBar, { NavLinkType } from '../NavBar/NavBar';
import './App.scss';
import { ToastContainer, Flip } from 'react-toastify';

const NavBarLeft = (NavLink: NavLinkType) => {
    const jwtContext = useContext(JWTContext);

    return (
        <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/contests">Contests</NavLink>
            <NavLink to="/problems">Problems</NavLink>
            <NavLink to="/submissions">Submissions</NavLink>
            {
                jwtContext.hasPermission('admin') &&
                <NavLink to="/admin">Admin</NavLink>
            }
        </>
    );
};

const NavBarRight = (NavLink: NavLinkType) => {
    const jwtContext = useContext(JWTContext);
    const authenticated = jwtContext.loggedIn();

    return (
        !authenticated
            ? <NavLink to="/login">Login</NavLink>
            : <NavLink to="/logout">Logout</NavLink>
    )
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

                    {
                        !jwtContext.loggedIn()
                            ? <Route path="/login" exact component={LoginPage} />
                            : <Route path="/logout" exact component={LogoutPage} />
                    }

                    {
                        jwtContext.hasPermission('admin') &&
                        <Route path="/admin" exact component={AdminPage} />
                    }

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
