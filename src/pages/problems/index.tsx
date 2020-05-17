import AsyncRenderer from '@/components/AsyncRenderer';
import JWTContext from '@/contexts/JWTContext';
import { LastUpdateContextDefaultProvider } from '@/contexts/LastUpdateContext';
import API, { Problem } from '@/models/API';
import * as React from 'react';
import { useHistory } from 'react-router';
import CreateProblemForm from './create-problem';

const ProblemsList = ({ problems }: { problems: Problem[] }) => {
  const history = useHistory();

  return (
    <table className="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <td colSpan={3}>
            <CreateProblemForm />
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

  return (
    <LastUpdateContextDefaultProvider>
      {({ lastUpdate }) => (
        <>
          <h1 className="title is-2">Problems</h1>
          <AsyncRenderer fetcher={() => new API(jwtContext).getProblems()} dependencies={[lastUpdate]}>
            {(problems: Problem[]) => <ProblemsList problems={problems} />}
          </AsyncRenderer>
        </>
      )}
    </LastUpdateContextDefaultProvider>
  );
};

export default ProblemsPage;
