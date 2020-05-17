import AsyncRenderer from '@/components/AsyncRenderer';
import Verdict from '@/components/Verdict';
import JWTContext from '@/contexts/JWTContext';
import API, { Submission } from '@/models/API';
import * as React from 'react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

const SubmissionList = () => {
  const jwtContext = useContext(JWTContext);

  const submissionProblemURL = (submission: Submission) =>
    submission.contest_slug
      ? `/contest/${submission.contest_slug}/problem/${submission.contest_problem_slug}`
      : `/problem/${submission.problem_slug}`;
  const submissionProblemTitle = (submission: Submission) =>
    submission.contest_title
      ? `${submission.contest_title}: ${submission.problem_title}`
      : `${submission.problem_title}`;

  return (
    <AsyncRenderer fetcher={() => new API(jwtContext).getSubmissions(100)} dependencies={[]}>
      {(submissions: Submission[]) => (
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <td colSpan={6}>
                <b>Note:</b> currently, only the most recent 100 submissions are shown.
              </td>
            </tr>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Problem</th>
              <th>Verdict</th>
              <th>Time</th>
              <th>Memory</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <NavLink to={`/submission/${submission.id}`}>{submission.id}</NavLink>
                </td>
                <td>
                  <NavLink to={`/user/${submission.username}`}>{submission.username}</NavLink>
                </td>
                <td>
                  <NavLink to={submissionProblemURL(submission)}>{submissionProblemTitle(submission)}</NavLink>
                </td>
                <td>
                  <Verdict verdict={submission.verdict} />
                </td>
                <td>{submission.time && `${submission.time} s`}</td>
                <td>{submission.memory && `${submission.memory} KB`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AsyncRenderer>
  );
};

const SubmissionsPage = () => {
  return (
    <div>
      <h1 className="title is-2">Submissions</h1>
      <SubmissionList />
    </div>
  );
};

export default SubmissionsPage;
