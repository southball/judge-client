import AsyncRenderer from '@/components/AsyncRenderer';
import JWTContext from '@/contexts/JWTContext';
import API, { Problem } from '@/models/API';
import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';

interface ProblemsListProps {
  problems: any[];
  createProblem: (slug: string) => Promise<void>;
}

const ProblemsList = ({ problems, createProblem }: ProblemsListProps) => {
  const history = useHistory();
  const [newProblemSlug, setNewProblemSlug] = useState('');

  return (
    <table className="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <td colSpan={3}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  placeholder="Slug"
                  value={newProblemSlug}
                  onChange={(event) => setNewProblemSlug(event.target.value)}
                />
              </div>
              <div className="control">
                <a
                  className="button is-info"
                  onClick={async () => {
                    await createProblem(newProblemSlug);
                    setNewProblemSlug('');
                  }}
                >
                  Create Problem
                </a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>ID</th>
          <th>Shortname</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem) => (
          <tr key={problem.id} onClick={() => history.push(`/problem/${problem.slug}`)} style={{ cursor: 'pointer' }}>
            <td>{problem.id}</td>
            <td>{problem.slug}</td>
            <td>{problem.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ProblemsPage = () => {
  const jwtContext = React.useContext(JWTContext);
  const [updateTime, setUpdateTime] = React.useState(new Date().toString());

  const createProblem = async (slug: string) => {
    await API.withJWTContext(jwtContext).createProblem(slug);
    setUpdateTime(new Date().toString());
  };

  return (
    <>
      <h1 className="title is-2">Problems</h1>
      <AsyncRenderer fetcher={() => API.withJWTContext(jwtContext).getProblems()} dependencies={[updateTime]}>
        {(problems: Problem[]) => <ProblemsList problems={problems} createProblem={createProblem} />}
      </AsyncRenderer>
    </>
  );
};

export default ProblemsPage;
