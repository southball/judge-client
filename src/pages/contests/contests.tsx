import * as moment from 'moment';
import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import NowLoading from '../../components/NowLoading/NowLoading';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';
import API, { Contest } from '../../models/API';

interface ContestsListProps {
    contests: any[];
    createContest: (slug: string) => Promise<void>;
}

const ContestsList = ({ contests, createContest }: ContestsListProps) => {
    const history = useHistory();
    const [newContestSlug, setNewContestSlug] = useState('');

    return (
        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <td colSpan={2}>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Slug"
                                    value={newContestSlug}
                                    onChange={(event) => setNewContestSlug(event.target.value)} />
                            </div>
                            <div className="control">
                                <a
                                    className="button is-info"
                                    onClick={async () => {
                                        await createContest(newContestSlug);
                                        setNewContestSlug('');
                                    }}
                                >Create Contest</a>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style={{ width: "200px" }}>Start Time</th>
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
    const [updateTime, setUpdateTime] = React.useState(new Date().toString());

    React.useEffect(() => {
        API.withJWTContext(jwtContext).getContests().then(setContests);
    }, [updateTime]);

    const createContest = async (slug: string) => {
        await API.withJWTContext(jwtContext).createContest(slug);
        setUpdateTime(new Date().toString());
    }

    return (
        <>
            <h1 className="title is-2">Contests</h1>
            {
                typeof contests === 'undefined'
                    ? <NowLoading />
                    : <ContestsList contests={contests} createContest={createContest} />
            }
        </>
    );
};

export default ContestsPage;

