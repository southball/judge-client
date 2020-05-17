import AsyncRenderer from '@/components/AsyncRenderer';
import JWTContext from '@/contexts/JWTContext';
import { LastUpdateContextDefaultProvider } from '@/contexts/LastUpdateContext';
import API, { Contest } from '@/models/API';
import * as moment from 'moment';
import * as React from 'react';
import { useHistory } from 'react-router';
import CreateContestForm from './create-contest';

const ContestsList = ({ contests }: { contests: Contest[] }) => {
  const history = useHistory();
  return (
    <table className="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <td colSpan={2}>
            <CreateContestForm />
          </td>
        </tr>
        <tr>
          <th style={{ width: '200px' }}>Start Time</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {contests.map((contest) => (
          <tr key={contest.id} onClick={() => history.push(`/contest/${contest.slug}`)} style={{ cursor: 'pointer' }}>
            <td>{moment(contest.start_time).format('YYYY-MM-DD hh:mm:ss')}</td>
            <td>{contest.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ContestsPage = () => {
  const jwtContext = React.useContext(JWTContext);

  return (
    <LastUpdateContextDefaultProvider>
      {({ lastUpdate }) => (
        <>
          <h1 className="title is-2">Contests</h1>
          <AsyncRenderer fetcher={() => new API(jwtContext).getContests()} dependencies={[lastUpdate]}>
            {(contests: Contest[]) => <ContestsList contests={contests} />}
          </AsyncRenderer>
        </>
      )}
    </LastUpdateContextDefaultProvider>
  );
};

export default ContestsPage;
