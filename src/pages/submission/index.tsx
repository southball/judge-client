import NotFound from '@/components/NotFound';
import NowLoading from '@/components/NowLoading';
import Verdict from '@/components/Verdict';
import GlobalConfigContext from '@/contexts/GlobalConfigContext';
import JWTContext from '@/contexts/JWTContext';
import API, { Submission } from '@/models/API';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import * as io from 'socket.io-client';

interface SubmissionUpdateEvent {
  progress: number;
  total: number;
}

const SubmissionRender = ({ submission }: { submission: Submission }) => {
  const jwtContext = useContext(JWTContext);
  const isAdmin = jwtContext.hasPermission('admin');

  return (
    <div>
      <h2 className="title is-3">Source Code</h2>

      <AceEditor width="100%" height="500px" value={submission.source_code} setOptions={{ readOnly: true }} />

      <hr />
      <h2 className="title is-3">Verdict</h2>

      <table className="table is-bordered is-hoverable is-fullwidth">
        <tbody>
          <tr>
            <th>User</th>
            <td>
              <NavLink to={`/user/${submission.username}`}>{submission.username}</NavLink>
            </td>
          </tr>
          {submission.contest_slug && (
            <tr>
              <th>Contest</th>
              <td>
                <NavLink to={`/contest/${submission.contest_slug}`}>{submission.contest_title}</NavLink>
              </td>
            </tr>
          )}
          <tr>
            <th>Problem</th>
            <td>
              <NavLink
                to={
                  submission.contest_slug
                    ? `/contest/${submission.contest_slug}/problem/${submission.contest_problem_slug}`
                    : `/problem/${submission.problem_slug}`
                }
              >
                {submission.problem_title}
              </NavLink>
            </td>
          </tr>
          <tr>
            <th>Verdict</th>
            <td>
              <Verdict verdict={submission.verdict} />
            </td>
          </tr>
          <tr>
            <th>Time</th>
            <td>{submission.time && `${submission.time} s`}</td>
          </tr>
          <tr>
            <th>Memory</th>
            <td>{submission.memory && `${submission.memory} KB`}</td>
          </tr>
          <tr>
            <th>Compile Message</th>
            <td>
              <pre>
                <code>{submission.compile_message}</code>
              </pre>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: '0' }}>
              <table className="table is-fullwidth is-hoverable is-bordered-nested">
                <thead>
                  <tr>
                    <th colSpan={isAdmin ? 6 : 4}>Testcases</th>
                  </tr>
                  <tr>
                    <th>Test</th>
                    <th>Verdict</th>
                    <th>Time</th>
                    <th>Memory</th>
                    {isAdmin && (
                      <>
                        <th>Checker</th>
                        <th>Isolate</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {submission?.testcases?.map((testcase: any, index: number) => (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Verdict verdict={testcase.verdict} />
                        </td>
                        <td>{testcase.time} s</td>
                        <td>{testcase.memory} KB</td>
                        {isAdmin && (
                          <>
                            <td>
                              <pre>
                                <code>{testcase.checker_output}</code>
                              </pre>
                            </td>
                            <td>
                              <pre>
                                <code>{testcase.sandbox_output}</code>
                              </pre>
                            </td>
                          </>
                        )}
                      </tr>
                    </>
                  )) || (
                    <tr>
                      <td colSpan={4}>Judging...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
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

    API.withJWTContext(jwtContext)
      .getSubmission(parseInt(submissionID as string))
      .then((newSubmission: Submission) => {
        console.log('Fetched:', newSubmission);

        if (fetchId > lastFetchId) {
          setLastFetchId(fetchId);
          const verdict =
            newSubmission.verdict !== 'WJ' || newSubmission.testcases === null
              ? newSubmission.verdict
              : (() => {
                  const progress = newSubmission.testcases.filter((testcase: any) => testcase.verdict !== 'WJ');
                  const total = newSubmission.testcases.length;
                  return `${progress} / ${total}`;
                })();

          setSubmission({
            ...newSubmission,
            verdict,
          });
        }
      })
      .catch(() => setNotFound(true));
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
        // if (jwtContext.hasPermission('admin')) {
        //     refetchSubmission();
        // } else {
        // TODO consider partial submission fetch for admin
        console.log(event);
        if (event.progress !== event.total)
          setSubmission({ ...submission, verdict: `${event.progress} / ${event.total}` });
        else refetchSubmission();
        // }

        if (event.progress === event.total) socket.disconnect();
      });

      socket.emit('authenticate', await jwtContext.getAccessToken());
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [lastRejudgeTime]);

  const rejudge = async () => {
    setSubmission(undefined);
    await API.withJWTContext(jwtContext)
      .rejudgeSubmission(parseInt(submissionID as string))
      .then(setSubmission)
      .catch(() => setNotFound(true));
    setLastRejudgeTime(new Date());
  };

  return (
    <div>
      <h1 className="title is-2">Submission {submissionID}</h1>
      {jwtContext.hasPermission('admin') && (
        <div className="control-group">
          <button className="button is-warning" onClick={rejudge}>
            Rejudge
          </button>
        </div>
      )}
      <hr />
      {notFound ? (
        <NotFound />
      ) : typeof submission === 'undefined' ? (
        <NowLoading />
      ) : (
        <SubmissionRender submission={submission} />
      )}
    </div>
  );
};

export default SubmissionPage;
