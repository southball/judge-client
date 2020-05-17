import JWTContext from '@/contexts/JWTContext';
import LastUpdateContext from '@/contexts/LastUpdateContext';
import API from '@/models/API';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router';

const CreateProblemForm = () => {
  const [newProblemSlug, setNewProblemSlug] = useState('');

  const jwtContext = useContext(JWTContext);
  const lastUpdateContext = useContext(LastUpdateContext);
  const history = useHistory();

  const createProblem = async (problemSlug: string) => {
    const problem = await new API(jwtContext).createProblem(problemSlug);
    history.push(`/problem/${problem.slug}/edit`);
    // This forces the problems list to be refreshed.
    lastUpdateContext.update();
  };

  return (
    <div className="field has-addons">
      <div className="control is-expanded">
        <input
          type="text"
          className="input"
          placeholder="Slug"
          value={newProblemSlug}
          onChange={(event) => setNewProblemSlug(event.target.value)}
        />
      </div>
      <div className="control">
        <a
          className="button is-info"
          onClick={async () => {
            await createProblem(newProblemSlug);
            setNewProblemSlug('');
          }}
        >
          Create Problem
        </a>
      </div>
    </div>
  );
};

export default CreateProblemForm;
