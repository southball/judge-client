import { Field, FieldRow, ReactAceHelper, ReactSelectHelper, TrueFalseSelect } from '@/components/FormHelper';
import NowLoading from '@/components/NowLoading';
import JWTContext from '@/contexts/JWTContext';
import API, { Problem } from '@/models/API';
import * as marked from 'marked';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';

const ProblemEditRender = ({ initialProblem }: { initialProblem: Problem }) => {
  const [frozen, setFrozen] = useState(false);
  const [problem, setProblem] = useState(initialProblem);
  const [compiledProblemStatement, setCompiledProblemStatement] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [testcases, setTestcases] = useState(initialProblem.testcases);
  const [showTestcases, setShowTestcases] = useState(false);
  const jwtContext = useContext(JWTContext);
  const history = useHistory();

  useEffect(() => {
    setProblem(initialProblem);
    setTestcases(initialProblem.testcases);
  }, [initialProblem]);

  useEffect(() => {
    console.log('Recompile triggered.');
    setCompiledProblemStatement(marked(problem.statement));
  }, [problem.statement]);

  const save = async () => {
    setFrozen(true);
    try {
      const newProblem = await API.withJWTContext(jwtContext).updateProblem(initialProblem.slug, problem);
      if (newProblem.slug === initialProblem.slug) setProblem(newProblem);
      else history.push(`/problem/${newProblem.slug}/edit`);

      toast.success(
        <div>
          <i className="fas fa-save" /> Saved problem.
        </div>,
      );
    } catch (err) {
      console.error(err);

      const message = err?.response?.data?.message ?? err?.message ?? err.toString();

      const additionalInformation =
        typeof err?.response?.data?.additionalInformation !== 'undefined' ? (
          <pre>{JSON.stringify(err?.response?.data?.additionalInformation, null, 2)}</pre>
        ) : (
          <></>
        );

      toast.error(
        <div>
          <i className="fas fa-exclamation-circle" /> Failed to save problem: {message} {additionalInformation}
        </div>,
      );
    } finally {
      setFrozen(false);
    }
  };

  const onFieldChange = <T extends { target: { value: K } }, K, Q = K>(
    field: keyof Problem,
    postprocessing: (k: K) => Q = (x: K & Q) => x,
  ) => (event: T): void => {
    setProblem({
      ...problem,
      [field]: postprocessing(event.target.value),
    });
  };

  const [file, setFile] = useState<ArrayBuffer>();
  const onTestcasesFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setFile(fileReader.result as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const uploadTestcases = async () => {
    if (file) {
      setFrozen(true);
      try {
        const response = await API.withJWTContext(jwtContext).uploadTestcases(initialProblem.slug, file);
        setTestcases(response.testcases);
      } catch (err) {
        console.error(err);
      }
      setFrozen(false);
    }
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
              defaultValue={problem.slug}
            />
          </Field>
          <Field className="column" description="Problem Title">
            <input
              className="input"
              disabled={frozen}
              type="text"
              onChange={onFieldChange('title')}
              defaultValue={problem.title}
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field className="column" description="Is Public?">
            <TrueFalseSelect
              disabled={frozen}
              trueLabel="Yes"
              falseLabel="No"
              onChange={onFieldChange('is_public')}
              value={problem.is_public}
            />
          </Field>
          <Field className="column" description="Type">
            <ReactSelectHelper
              disabled={frozen}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'interactive', label: 'Interactive' },
              ]}
              onChange={onFieldChange('type')}
              value={problem.type}
            />
          </Field>
          <Field className="column" description="Time Limit (s)">
            <input
              className="input"
              disabled={frozen}
              type="number"
              onChange={onFieldChange('time_limit', (x: string) => +x)}
              defaultValue={problem.time_limit}
            />
          </Field>
          <Field className="column" description="Memory Limit (KB)">
            <input
              className="input"
              disabled={frozen}
              type="text"
              onChange={onFieldChange('memory_limit')}
              defaultValue={problem.memory_limit}
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field className="column" description="Compile Time Limit (s)">
            <input
              className="input"
              disabled={frozen}
              type="number"
              onChange={onFieldChange('compile_time_limit', (x: string) => +x)}
              defaultValue={problem.compile_time_limit}
            />
          </Field>
          <Field className="column" description="Compile Memory Limit (KB)">
            <input
              className="input"
              disabled={frozen}
              type="text"
              onChange={onFieldChange('compile_memory_limit')}
              defaultValue={problem.compile_memory_limit}
            />
          </Field>
          <Field className="column" description="Checker Time Limit (s)">
            <input
              className="input"
              disabled={frozen}
              type="number"
              onChange={onFieldChange('checker_time_limit', (x: string) => +x)}
              defaultValue={problem.checker_time_limit}
            />
          </Field>
          <Field className="column" description="Checker Memory Limit (KB)">
            <input
              className="input"
              disabled={frozen}
              type="text"
              onChange={onFieldChange('checker_memory_limit')}
              defaultValue={problem.checker_memory_limit}
            />
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
          {showPreview && (
            <Field className="column" description="Statement Preview">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: compiledProblemStatement }}
                style={{ padding: '0.75rem', border: '1px solid #000000' }}
              />
            </Field>
          )}
        </FieldRow>

        <FieldRow>
          <Field className="column" description="Checker">
            <ReactAceHelper
              mode="c_cpp"
              name="checker_editor"
              disabled={frozen}
              onChange={onFieldChange('checker')}
              value={problem.checker}
            />
          </Field>
          <Field className="column" description="Interactor">
            <ReactAceHelper
              mode="c_cpp"
              name="interactor_editor"
              disabled={frozen || problem.type !== 'interactive'}
              onChange={onFieldChange('interactor')}
              value={problem.interactor}
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <button
            type="button"
            className="button is-primary"
            disabled={frozen}
            onClick={save}
            style={{ margin: '0 0.75rem' }}
          >
            Save
          </button>
        </FieldRow>

        <hr />

        <FieldRow style={{ margin: 'inherit' }}>
          <article className="message" style={{ width: '100%' }}>
            <div
              className="message-header"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowTestcases(!showTestcases)}
            >
              <p>Testcases (Click to {!showTestcases ? 'show' : 'collapse'})</p>
            </div>
            {showTestcases && (
              <div className="message-body">
                <table className="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>In</th>
                      <th>Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testcases.map(([inFile, outFile]: [string, string]) => (
                      <tr key={inFile}>
                        <td>{inFile}</td>
                        <td>{outFile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </FieldRow>

        <FieldRow>
          <Field className="column" description="Testcases Upload">
            <input type="file" accept=".zip" multiple={false} disabled={frozen} onChange={onTestcasesFileChange} />
          </Field>
        </FieldRow>

        <FieldRow style={{ margin: '0' }}>
          File information: {!file ? `no file uploaded` : `file of ${file.byteLength} bytes`}
        </FieldRow>

        <FieldRow style={{ margin: '0' }}>
          <button type="button" className="button is-primary" onClick={uploadTestcases} disabled={!file || frozen}>
            Upload Testcases
          </button>
        </FieldRow>
      </form>
    </div>
  );
};

const ProblemEditPage = () => {
  const { problemSlug } = useParams();
  const jwtContext = React.useContext(JWTContext);
  const [problem, setProblem] = React.useState<Problem>();

  React.useEffect(() => {
    console.log('Refetched.');
    API.withJWTContext(jwtContext)
      .getProblem(problemSlug as string)
      .then(setProblem);
  }, [problemSlug]);

  return (
    <div>
      <h1 className="title is-2">Problem Edit</h1>
      {!problem ? <NowLoading /> : <ProblemEditRender initialProblem={problem} />}
    </div>
  );
};

export default ProblemEditPage;
