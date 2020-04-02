import * as moment from 'moment';
import * as React from 'react';
import { useHistory } from 'react-router';
import NowLoading from '../../components/NowLoading/NowLoading';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';
import API, { Problem } from '../../models/API';

interface ProblemsListProps {
    problems: any[];
}

const ProblemsList = ({ problems }: ProblemsListProps) => {
    const history = useHistory();

    return (
        <table className="table is-fullwidth is-hoverable">
            <thead>
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
    const [problems, setProblems] = React.useState<Problem[]>();
    const jwtContext = React.useContext(JWTContext);

    React.useEffect(() => {
        API.withJWTContext(jwtContext).getProblems().then(setProblems);
    }, []);

    return (
        <>
            <h1 className="title is-3">Problems</h1>
            {
                typeof problems === 'undefined'
                    ? <NowLoading />
                    : <ProblemsList problems={problems} />
            }
        </>
    );
};

export default ProblemsPage;

