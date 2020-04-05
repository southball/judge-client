import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import {
    Field,
    FieldRow,
    ReactAceHelper,
    ReactSelectHelper,
    TrueFalseSelect,
} from '../../components/FormHelper/FormHelper';
import NowLoading from '../../components/NowLoading/NowLoading';
import JWTContext from '../../contexts/JWTContext';
import API, { Problem } from '../../models/API';
import * as marked from 'marked';

const ProblemEditRender = ({ initialProblem }: { initialProblem: Problem }) => {
    const [frozen, setFrozen] = useState(false);
    const [problem, setProblem] = useState(initialProblem);
    const [compiledProblemStatement, setCompiledProblemStatement] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const jwtContext = useContext(JWTContext);
const history = useHistory();

    useEffect(() => {
        setProblem(initialProblem);
    }, [initialProblem]);

    useEffect(() => {
        console.log('Recompile triggered.');
        setCompiledProblemStatement(marked(problem.statement));
    }, [problem.statement]);

    const save = async () => {
        setFrozen(true);
        const newProblem = await API.withJWTContext(jwtContext).updateProblem(initialProblem.slug, problem);
        if (newProblem.slug === initialProblem.slug)
            setProblem(newProblem);
        else
            history.push(`/problem/${newProblem.slug}/edit`);
        setFrozen(false);
    };

    const onFieldChange = (field: keyof Problem) => <T extends { target: { value: K } }, K>(event: T): void => {
        setProblem({
            ...problem,
            [field]: event.target.value,
        });
    };

    return (
        <div>
            <form className="form">
                <FieldRow>
                    <Field className="column" description="Problem Slug">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('slug')}
                            defaultValue={problem.slug} />
                    </Field>
                    <Field className="column" description="Problem Title">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('title')}
                            defaultValue={problem.title} />
                    </Field>
                </FieldRow>

                <FieldRow>
                    <Field className="column" description="Is Public?">
                        <TrueFalseSelect
                            disabled={frozen}
                            trueLabel="Yes"
                            falseLabel="No"
                            onChange={onFieldChange('is_public')}
                            value={problem.is_public} />
                    </Field>
                    <Field className="column" description="Type">
                        <ReactSelectHelper
                            disabled={frozen}
                            options={[
                                { value: 'standard', label: 'Standard' },
                                { value: 'interactive', label: 'Interactive' },
                            ]}
                            onChange={onFieldChange('type')}
                            value={problem.type} />
                    </Field>
                    <Field className="column" description="Time Limit (s)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('time_limit')}
                            defaultValue={problem.time_limit} />
                    </Field>
                    <Field className="column" description="Memory Limit (KB)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('memory_limit')}
                            defaultValue={problem.memory_limit} />
                    </Field>
                </FieldRow>

                <FieldRow>
                    <Field className="column" description="Compile Time Limit (s)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('compile_time_limit')}
                            defaultValue={problem.compile_time_limit} />
                    </Field>
                    <Field className="column" description="Compile Memory Limit (KB)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('compile_memory_limit')}
                            defaultValue={problem.compile_memory_limit} />
                    </Field>
                    <Field className="column" description="Checker Time Limit (s)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('checker_time_limit')}
                            defaultValue={problem.checker_time_limit} />
                    </Field>
                    <Field className="column" description="Checker Memory Limit (KB)">
                        <input
                            className="input"
                            disabled={frozen}
                            type="text"
                            onChange={onFieldChange('checker_memory_limit')}
                            defaultValue={problem.checker_memory_limit} />
                    </Field>
                </FieldRow>

                <FieldRow>
                    <Field className="column" description="Statement">
                        <label className="checkbox">
                            <input type="checkbox" onChange={(event) => setShowPreview(event.target.checked)} />
                            Show Preview
                        </label>
                        <ReactAceHelper
                            mode="markdown"
                            name="statement_editor"
                            disabled={frozen}
                            onChange={onFieldChange('statement')}
                            value={problem.statement}
                        />
                    </Field>
                    {
                        showPreview &&
                        <Field className="column" description="Statement Preview">
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{ __html: compiledProblemStatement }}
                                style={{ padding: '0.75rem', border: '1px solid #000000' }} />
                        </Field>
                    }
                </FieldRow>

                <FieldRow>
                    <Field className="column" description="Checker">
                        <ReactAceHelper
                            mode="c_cpp"
                            name="checker_editor"
                            disabled={frozen}
                            onChange={onFieldChange('checker')}
                            value={problem.checker} />
                    </Field>
                    <Field className="column" description="Interactor">
                        <ReactAceHelper
                            mode="c_cpp"
                            name="interactor_editor"
                            disabled={frozen || problem.type !== 'interactive'}
                            onChange={onFieldChange('interactor')}
                            value={problem.interactor} />
                    </Field>
                </FieldRow>

                <FieldRow>
                    <button
                        className="button is-primary"
                        disabled={frozen}
                        onClick={save}
                        style={{ margin: '0 0.75rem' }}>
                        Save
                    </button>
                </FieldRow>
            </form>
        </div>
    )
}

const ProblemEditPage = () => {
    const { problemSlug } = useParams();
    const jwtContext = React.useContext(JWTContext);
    const [problem, setProblem] = React.useState<Problem>();

    React.useEffect(() => {
        console.log('Refetched.');
        API.withJWTContext(jwtContext).getProblem(problemSlug as string).then(setProblem);
    }, [problemSlug]);

    return (
        <div>
            <h1 className="title is-2">Problem Edit</h1>
            {
                !problem
                    ? <NowLoading />
                    : <ProblemEditRender initialProblem={problem} />
            }
        </div>
    );
}

export default ProblemEditPage;
