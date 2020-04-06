import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import * as io from 'socket.io-client';
import NotFound from '../../components/NotFound/NotFound';
import NowLoading from '../../components/NowLoading/NowLoading';
import Verdict from '../../components/Verdict/Verdict';
import GlobalConfigContext from '../../contexts/GlobalConfigContext';
import JWTContext from '../../contexts/JWTContext';
import API, { Submission } from '../../models/API';
import NotFoundPage from '../not-found/not-found';

interface SubmissionUpdateEvent {
    progress: number;
    total: number;
}

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
                    <td><Verdict verdict={submission.verdict} /></td>
                </tr>
                <tr>
                    <th>Time</th>
                    <td>{submission.time && `${submission.time} s`}</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{submission.memory && `${submission.memory} KB`}</td>
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
};

const SubmissionPage = () => {
    const { submissionID } = useParams();
    const [submission, setSubmission] = useState<Submission>();
    const [notFound, setNotFound] = useState(false);
    const [lastRejudgeTime, setLastRejudgeTime] = useState(new Date());
    const jwtContext = useContext(JWTContext);
    const globalContext = useContext(GlobalConfigContext);

    // Ensure that only newer submission status is set.
    const [lastFetchId, setLastFetchId] = useState<number>(-1);
    const [accumulatedFetchId, setAccumulatedFetchId] = useState<number>(0);

    function refetchSubmission() {
        const fetchId = accumulatedFetchId + 1;
        setAccumulatedFetchId(fetchId);

        API.withJWTContext(jwtContext).getSubmission(parseInt(submissionID as string)).then((newSubmission: Submission) => {
            console.log('Fetched:', newSubmission);

            if (fetchId > lastFetchId) {
                setLastFetchId(fetchId);
                const verdict = newSubmission.verdict !== 'WJ' || newSubmission.testcases === null ? newSubmission.verdict : (() => {
                    const progress = newSubmission.testcases.filter((testcase: any) => testcase.verdict !== 'WJ');
                    const total = newSubmission.testcases.length;
                    return `${progress} / ${total}`;
                })();

                setSubmission({
                    ...newSubmission,
                    verdict,
                });
            }
        }).catch(() => setNotFound(true));
    }

    useEffect(() => {
        refetchSubmission();
    }, []);

    useEffect(() => {
        const socket = io(globalContext.judgeServer, {
            transports: ['websocket'],
            reconnectionAttempts: 2,
        });
        const eventName = `submission.${submissionID}`;

        socket.on('connect', async () => {
            console.log('Connected.');

            socket.on('authenticated', () => {
                console.log('Authenticated.');
            });
            socket.on('unauthenticated', (error: any) => {
                console.error('Failed to authenticate:', error);
            });

            socket.on(eventName, (event: SubmissionUpdateEvent) => {
                if (jwtContext.hasPermission('admin')) {
                    refetchSubmission();
                } else {
                    if (event.progress !== event.total)
                        setSubmission({ ...submission, verdict: `${event.progress} / ${event.total}` });
                    else
                        refetchSubmission();
                }

                if (event.progress === event.total)
                    socket.disconnect();
            });

            socket.emit('authenticate', await jwtContext.getAccessToken());
        });

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [lastRejudgeTime]);

    const rejudge = async () => {
        setSubmission(undefined);
        await API.withJWTContext(jwtContext).rejudgeSubmission(parseInt(submissionID as string))
            .then(setSubmission)
            .catch(() => setNotFound(true));
        setLastRejudgeTime(new Date());
    };

    return (
        <div>
            <h1 className="title is-2">Submission {submissionID}</h1>
            {
                jwtContext.hasPermission('admin') &&
                    <div className="control-group">
                        <button className="button is-warning" onClick={rejudge}>Rejudge</button>
                    </div>
            }
            <hr />
            {
                notFound
                    ? <NotFound />
                    : typeof submission === 'undefined'
                    ? <NowLoading />
                    : <SubmissionRender submission={submission} />
            }
        </div>
    )
};

export default SubmissionPage;
