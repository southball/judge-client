import * as React from 'react';
import { useHistory, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import NowLoading from '../../components/NowLoading/NowLoading';
import JWTContext from '../../contexts/JWTContext';
import API, { Contest, Problem, SubmissionID } from '../../models/API';
import * as marked from 'marked';
import AceEditor from 'react-ace';
import Select from 'react-select';

import './problem.scss';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-github';

type SelectOption = { value: string, label: string };
type SubmitFunction = (language: string, sourceCode: string) => any;

const ProblemRender = ({ problem, contest, submit }: { problem: Problem, contest?: Contest, submit: SubmitFunction }) => {
    const [renderedStatement, setRenderedStatement] = React.useState(marked(problem.statement));
    const [sourceCode, setSourceCode] = React.useState('');
    const [frozen, setFrozen] = React.useState(false);
    const [language, setLanguage] = React.useState<SelectOption>();
    const jwtContext = React.useContext(JWTContext);

    const languages: SelectOption[] = [
        { value: 'python3', label: 'Python 3' },
        { value: 'cpp17', label: 'C++17' },
    ];

    React.useEffect(() => {
        const renderer = new marked.Renderer();

        renderer.code = (code, language, escaped) => {
            if (!escaped)
                code = code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');

            return `<pre className="code-block"><code class="language-${language}">${code}</code></pre>`;
        };

        setRenderedStatement(marked(problem.statement, { renderer }));
    }, [problem]);

    async function handleSubmit() {
        submit((language as SelectOption).value, sourceCode);
    }

    return (
        <div>
            <h1 className="title is-2">{problem.title}</h1>
            <h2 className="subtitle is-5">
                Time limit: {problem.time_limit} s / Memory
                limit: {problem.memory_limit} KB
            </h2>
            <hr />
            <div className="content" dangerouslySetInnerHTML={{ __html: renderedStatement }} />

            <h2 className="title is-3">Submit</h2>
            {
                !jwtContext.loggedIn()
                    ? <div>
                        <NavLink to="/login">Login</NavLink> to submit to this problem.
                    </div>
                    : <>
                        <Select
                            className="react-select"
                            options={languages}
                            value={language}
                            onChange={(value) => {
                                setLanguage(value as SelectOption);
                            }}
                            style={{ zIndex: 1000 }}
                        />
                        <AceEditor
                            mode="c_cpp"
                            theme="github"
                            name="editor"
                            value={sourceCode}
                            width="100%"
                            height="300px"
                            wrapEnabled={true}
                            onChange={setSourceCode}
                            setOptions={{ readOnly: frozen }}
                        />
                    </>
            }

            <div style={{ marginTop: '1em' }}>
                <button className="button is-primary" type="button" disabled={typeof language === 'undefined'}
                        onClick={() => handleSubmit()}>Submit
                </button>
                <button className="button" onClick={() => setFrozen(!frozen)}>Toggle Frozen</button>
            </div>
        </div>
    )
};

const ProblemPage = () => {
    const { contestSlug, contestProblemSlug, problemSlug } = useParams();
    const jwtContext = React.useContext(JWTContext);
    const [contest, setContest] = React.useState();
    const [problem, setProblem] = React.useState();
    const history = useHistory();

    React.useEffect(() => {
        const api = API.withJWTContext(jwtContext);
        if (problemSlug) {
            api.getProblem(problemSlug).then(setProblem);
        } else if (contestSlug && contestProblemSlug) {
            api.getContest(contestSlug).then(setContest);
            api.getContestProblem(contestSlug, contestProblemSlug).then(setProblem);
        }
    }, []);

    const submit: SubmitFunction = async (language: string, sourceCode: string): Promise<void> => {
        let submission: SubmissionID = { id: -1 };

        if (problemSlug) {
            submission = await API.withJWTContext(jwtContext).submitToProblem(problemSlug, language, sourceCode);
        } else if (contestSlug && contestProblemSlug) {
            submission = await API.withJWTContext(jwtContext).submitToContest(contestSlug, contestProblemSlug, language, sourceCode);
        }

        history.push(`/submission/${submission.id}`);
    };

    return (
        typeof problem === 'undefined'
            ? <NowLoading />
            : <ProblemRender contest={contest} problem={problem} submit={submit} />
    );
};

export default ProblemPage;
