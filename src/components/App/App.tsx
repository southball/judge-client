import * as React from 'react';
import { useContext } from 'react';
import { Route } from 'react-router';
import JWTContext from '../../contexts/JWTContext';
import ContestPage from '../../pages/contest/contest';
import ContestsPage from '../../pages/contests/contests';
import HomePage from '../../pages/home/home';
import LoginPage from '../../pages/login/login';
import LogoutPage from '../../pages/logout/logout';
import ProblemPage from '../../pages/problem/problem';
import ProblemsPage from '../../pages/problems/problems';
import SubmissionPage from '../../pages/submission/submission';
import NavBar, { NavLinkType } from '../NavBar/NavBar';
import './App.scss';

const NavBarLeft = (NavLink: NavLinkType) => {
    return (
        <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/contests">Contests</NavLink>
            <NavLink to="/problems">Problems</NavLink>
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

                <Route path="/" exact component={HomePage} />
                <Route path="/contests" exact component={ContestsPage} />
                <Route path="/contest/:contestSlug" exact component={ContestPage} />
                <Route path="/contest/:contestSlug/problem/:contestProblemSlug" exact component={ProblemPage} />
                <Route path="/problems" exact component={ProblemsPage} />
                <Route path="/problem/:problemSlug" exact component={ProblemPage} />
                <Route path="/submission/:submissionID" exact component={SubmissionPage} />
                <Route path="/login" exact component={LoginPage} />
                <Route path="/logout" exact component={LogoutPage} />

            </div>
        </>
    );
};

export default App;
