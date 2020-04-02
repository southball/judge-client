import { useContext, useEffect, useState } from 'react';
import * as React from 'react';
import AceEditor from 'react-ace';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import NowLoading from '../../components/NowLoading/NowLoading';
import JWTContext from '../../contexts/JWTContext';
import API, { Submission } from '../../models/API';

const SubmissionRender = ({ submission }: { submission: Submission }) => {
    return (
        <div>
            <table className="table is-narrow is-hoverable is-fullwidth">
                <tbody>
                <tr>
                    <th>User</th>
                    <td><NavLink to={`/user/${submission.username}`}>{submission.username}</NavLink></td>
                </tr>
                {submission.contest_slug && <tr>
                    <th>Contest</th>
                    <td><NavLink to={`/contest/${submission.contest_slug}`}>{submission.contest_title}</NavLink></td>
                </tr>}
                <tr>
                    <th>Problem</th>
                    <td>
                        <NavLink to={
                            submission.contest_slug
                                ? `/contest/${submission.contest_slug}/problem/${submission.contest_problem_slug}`
                                : `/problem/${submission.problem_slug}`
                        }>
                            {submission.problem_title}
                        </NavLink>
                    </td>
                </tr>
                <tr>
                    <th>Verdict</th>
                    <td><span className={`tag ${submission.verdict === "AC" ? "is-success" : "is-danger"}`}>{submission.verdict}</span></td>
                </tr>
                <tr>
                    <th>Time</th>
                    <td>{submission.time} s</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{submission.memory} KB</td>
                </tr>
                </tbody>
            </table>

            <h2 className="title is-3">Source Code</h2>

            <AceEditor
                width="100%"
                height="500px"
                value={submission.source_code}
                setOptions={{ readOnly: true }}
            />
            <pre>{JSON.stringify(submission, null, 4)}</pre>

        </div>
    )
}

const SubmissionPage = () => {
    const { submissionID } = useParams();
    const [submission, setSubmission] = useState();
    const jwtContext = useContext(JWTContext);

    useEffect(() => {
        API.withJWTContext(jwtContext).getSubmission(parseInt(submissionID as string)).then(setSubmission);
    }, []);

    return (
        <div>
            <h1 className="title is-3">Submission {submissionID}</h1>
            <hr />
            {
                typeof submission === 'undefined'
                    ? <NowLoading />
                    : <SubmissionRender submission={submission} />
            }
        </div>
    )
};

export default SubmissionPage;
