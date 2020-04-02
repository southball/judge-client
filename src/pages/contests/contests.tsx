import * as moment from 'moment';
import * as React from 'react';
import { useHistory } from 'react-router';
import NowLoading from '../../components/NowLoading/NowLoading';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';
import API, { Contest } from '../../models/API';

interface ContestsListProps {
    contests: any[];
}

const ContestsList = ({ contests }: ContestsListProps) => {
    const history = useHistory();

    return (
        <table className="table is-fullwidth is-hoverable">
            <thead>
            <tr>
                <th style={{width: "200px"}}>Start Time</th>
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
    const [contests, setContests] = React.useState<Contest[]>();
    const jwtContext = React.useContext(JWTContext);

    React.useEffect(() => {
        API.withJWTContext(jwtContext).getContests().then(setContests);
    }, []);

    return (
        <>
            <h1 className="title is-3">Contests</h1>
            {
                typeof contests === 'undefined'
                    ? <NowLoading />
                    : <ContestsList contests={contests} />
            }
        </>
    );
};

export default ContestsPage;

