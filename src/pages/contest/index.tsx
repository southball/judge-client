import AsyncRenderer from '@/components/AsyncRenderer';
import JWTContext from '@/contexts/JWTContext';
import API from '@/models/API';
import type { Contest, Problem } from '@/models/API';
import * as moment from 'moment';
import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

const ContestDisplay = ({ contest }: { contest: Contest }) => {
  const jwtContext = React.useContext(JWTContext);
  const history = useHistory();

  return (
    <div>
      <h1 className="title is-2">{contest.title}</h1>

      <div className="control-group">
        <NavLink to={`/contest/${contest.slug}/edit`}>
          <button className="button is-primary">Edit Contest</button>
        </NavLink>
      </div>

      <h2 className="title is-3">Information</h2>
      <table className="table is-fullwidth is-hoverable is-narrow ">
        <tbody>
          <tr>
            <th>Contest ID</th>
            <td>{contest.id}</td>
          </tr>
          <tr>
            <th>Contest Slug</th>
            <td>{contest.slug}</td>
          </tr>
          {jwtContext.hasPermission('admin') && (
            <tr>
              <th>Is Public?</th>
              <td>{contest.is_public ? 'Yes' : 'No'}</td>
            </tr>
          )}
          <tr>
            <th>Contest Start Time</th>
            <td>{moment(contest.start_time).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
          <tr>
            <th>Contest End Time</th>
            <td>{moment(contest.end_time).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="title is-3">Problems</h2>
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Time</th>
            <th>Memory</th>
          </tr>
        </thead>
        <tbody>
          {contest.problems.map((problem: Problem) => (
            <tr
              key={problem.id}
              onClick={() => {
                history.push(`/contest/${contest.slug}/problem/${problem.contest_problem_slug}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <th>{problem.contest_problem_slug}</th>
              <td>{problem.title}</td>
              <td>{problem.time_limit} s</td>
              <td>{problem.memory_limit} KB</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContestPage = () => {
  const { contestSlug } = useParams();
  const jwtContext = React.useContext(JWTContext);

  return (
    <AsyncRenderer
      fetcher={() => API.withJWTContext(jwtContext).getContest(contestSlug as string)}
      dependencies={[contestSlug]}
    >
      {(contest: Contest) => <ContestDisplay contest={contest} />}
    </AsyncRenderer>
  );
};

export default ContestPage;
