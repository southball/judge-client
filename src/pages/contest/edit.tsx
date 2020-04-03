import * as moment from 'moment';
import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import Select from 'react-select';
import NowLoading from '../../components/NowLoading/NowLoading';
import JWTContext from '../../contexts/JWTContext';
import API, { Contest, Problem } from '../../models/API';
import './edit.scss';

interface FieldProps {
    className?: string;
    description: string;
    children: any;
}

const FieldRow = ({ children }: { children: any }) => (
    <div className="columns" style={{ marginBottom: '0' }}>{children}</div>
);

const Field = ({ className, children, description }: FieldProps) => (
    <div className={`${className ?? ''} field`}>
        <label className="label">{description}</label>
        <div className="control is-expanded">{children}</div>
    </div>
);

const ContestEditRender = ({ initialContest, initialProblems }: { initialContest: Contest, initialProblems: Problem[] }) => {
    const [contest, setContest] = React.useState(initialContest);
    const [problems, setProblems] = React.useState(
        initialProblems.map((problem: Problem) => ({ value: problem.id, label: `${problem.slug} - ${problem.title}` })),
    );
    const [frozen, setFrozen] = React.useState(false);

    React.useEffect(() => {
        setContest(initialContest);
    }, [initialContest]);

    React.useEffect(() => {
        setProblems(initialProblems.map((problem: Problem) => ({
            value: problem.id,
            label: `${problem.slug} - ${problem.title}`,
        })));
    }, [initialProblems]);

    const isPublicOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
    ];
    const jwtContext = React.useContext(JWTContext);
    const history = useHistory();

    const save = async () => {
        setFrozen(true);
        console.log('Save contest:', contest);
        try {
            const newContest = await API.withJWTContext(jwtContext).updateContest(initialContest.slug, contest);
            if (newContest.slug !== initialContest.slug) {
                history.push(`/contest/${newContest.slug}/edit`);
            }
            setContest(newContest);
        } catch (err) {
            console.error(err);
        } finally {
            setFrozen(false);
        }
    };

    let submittable = true;

    const contestProblemSlugMap = new Map();
    const problemIdMap = new Map();

    for (const { contest_problem_slug, problem_id } of contest.problems) {
        contestProblemSlugMap.set(contest_problem_slug, (contestProblemSlugMap.get(contest_problem_slug) ?? 0) + 1);
        problemIdMap.set(problem_id, (problemIdMap.get(problem_id) ?? 0) + 1);

        submittable = submittable
            && contestProblemSlugMap.get(contest_problem_slug) <= 1
            && problemIdMap.get(problem_id) <= 1
            && contest_problem_slug.length !== 0
            && typeof problem_id === 'number';
    }

    const badTime = new Date(contest.start_time) >= new Date(contest.end_time);
    submittable = submittable && !badTime;

    return (
        <div>
            <form className="form">
                <FieldRow>
                    <Field className="column" description="Contest Slug">
                        <input className="input"
                               disabled={frozen}
                               type="text"
                               onChange={(event) => setContest({ ...contest, slug: event.target.value })}
                               value={contest.slug} />
                    </Field>
                    <Field className="column" description="Contest Title">
                        <input className="input"
                               disabled={frozen}
                               type="text"
                               onChange={(event) => setContest({ ...contest, title: event.target.value })}
                               value={contest.title} />
                    </Field>
                </FieldRow>

                <FieldRow>
                    <Field className="column" description="Is Public?">
                        <Select
                            isDisabled={frozen}
                            onChange={(option: any) => setContest({ ...contest, is_public: option.value })}
                            options={isPublicOptions}
                            value={isPublicOptions.find((option) => option.value === contest.is_public)}
                        />
                    </Field>
                    <Field className="column" description="Start Time">
                        <input className={`input ${badTime ? 'is-danger' : ''}`}
                               disabled={frozen}
                               type="datetime-local"
                               onChange={(event) => setContest({
                                   ...contest,
                                   start_time: new Date(event.target.value).toJSON(),
                               })}
                               defaultValue={moment(contest.start_time).format('YYYY-MM-DDTHH:mm')} />
                        {badTime && <p className="help is-danger">Start time is on or after end time.</p>}
                    </Field>
                    <Field className="column" description="End Time">
                        <input className={`input ${badTime ? 'is-danger' : ''}`}
                               disabled={frozen}
                               type="datetime-local"
                               onChange={(event) => setContest({
                                   ...contest,
                                   end_time: new Date(event.target.value).toJSON(),
                               })}
                               defaultValue={moment(contest.end_time).format('YYYY-MM-DDTHH:mm')} />
                        {badTime && <p className="help is-danger">Start time is on or after end time.</p>}
                    </Field>
                </FieldRow>

                <h2 className="title is-3">Problems</h2>

                <div className="control-group">
                    <button className="button is-success"
                            disabled={frozen}
                            onClick={() => {
                                setContest({
                                    ...contest,
                                    problems: [...contest.problems, {
                                        contest_problem_slug: '',
                                        problem_id: undefined,
                                    }],
                                });
                            }}
                            type="button">
                        Add Problem
                    </button>
                </div>

                <table className="table is-fullwidth is-hoverable">
                    <thead>
                    <tr>
                        <th style={{ width: '200px' }}>Slug</th>
                        <th>Problem</th>
                        <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contest.problems.map((contestProblem: Problem, index: number) => {
                        const badSlug = contestProblemSlugMap.get(contestProblem.contest_problem_slug) > 1;
                        const badProblemId = problemIdMap.get(contestProblem.problem_id) > 1;
                        const emptySlug = contestProblem.contest_problem_slug.length === 0;
                        const emptyProblemId = typeof contestProblem.problem_id === 'undefined';

                        return (
                            <tr key={contestProblem.contest_problem_id}>
                                <td>
                                    <div className="control is-expanded">
                                        <input
                                            className={`input ${emptySlug || badSlug ? 'is-danger' : ''}`}
                                            disabled={frozen}
                                            type="text"
                                            onChange={(event) => {
                                                setContest({
                                                    ...contest,
                                                    problems: Object.assign(
                                                        contest.problems.slice(),
                                                        {
                                                            [index]: {
                                                                ...contestProblem,
                                                                contest_problem_slug: event.target.value,
                                                            },
                                                        },
                                                    ),
                                                });
                                            }}
                                            value={contestProblem.contest_problem_slug} />
                                    </div>
                                    {emptySlug && <p className="help is-danger">Slug cannot be empty.</p>}
                                    {badSlug && <p className="help is-danger">Duplicated slug.</p>}
                                </td>
                                <td>
                                    <Select
                                        className={emptyProblemId || badProblemId ? 'react-select-danger' : ''}
                                        isDisabled={frozen}
                                        isSearchable={true}
                                        options={problems}
                                        onChange={(newValue: any) => {
                                            setContest({
                                                ...contest,
                                                problems: Object.assign(
                                                    contest.problems.slice(),
                                                    { [index]: { ...contestProblem, problem_id: newValue.value } },
                                                ),
                                            });
                                        }}
                                        defaultValue={problems.find((problem) => problem.value === contestProblem.problem_id)}
                                    />
                                    {emptyProblemId && <p className="help is-danger">Problem cannot be empty.</p>}
                                    {badProblemId && <p className="help is-danger">Duplicated problem chosen.</p>}
                                </td>
                                <td>
                                    <button type="button" className="button is-danger" onClick={() => {
                                        setContest({
                                            ...contest,
                                            problems: contest.problems.filter((_: any, i: number) => i !== index),
                                        });
                                    }}>
                                        <span className="icon is-small"><i className="fas fa-trash-alt" /></span>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <button disabled={frozen || !submittable} className="button is-primary" type="button" onClick={save}>
                    Submit
                </button>
            </form>
        </div>
    );
}

const ContestEditPage = () => {
    const { contestSlug } = useParams();
    const jwtContext = React.useContext(JWTContext);
    const [contest, setContest] = React.useState<Contest>();
    const [problems, setProblems] = React.useState<Problem[]>();

    React.useEffect(() => {
        API.withJWTContext(jwtContext).getContest(contestSlug as string).then(setContest);
        API.withJWTContext(jwtContext).getProblems().then(setProblems);
    }, [contestSlug]);

    return (
        <div>
            <h1 className="title is-2">Contest Edit</h1>
            {
                !contest || !problems
                    ? <NowLoading />
                    : <ContestEditRender initialContest={contest} initialProblems={problems} />
            }
        </div>
    );
}

export default ContestEditPage;
