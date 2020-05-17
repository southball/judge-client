import JWTContext from '@/contexts/JWTContext';
import LastUpdateContext from '@/contexts/LastUpdateContext';
import API from '@/models/API';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router';

const CreateContestForm = () => {
  const [newContestSlug, setNewContestSlug] = useState('');

  const jwtContext = useContext(JWTContext);
  const lastUpdateContext = useContext(LastUpdateContext);
  const history = useHistory();

  const createContest = async (contestSlug: string) => {
    const contest = await new API(jwtContext).createContest(contestSlug);
    history.push(`/contest/${contest.slug}/edit`);
    // This forces the contests list to be refreshed.
    lastUpdateContext.update();
  };

  return (
    <div className="field has-addons">
      <div className="control is-expanded">
        <input
          type="text"
          className="input"
          placeholder="Slug"
          value={newContestSlug}
          onChange={(event) => setNewContestSlug(event.target.value)}
        />
      </div>
      <div className="control">
        <a
          className="button is-info"
          onClick={async () => {
            await createContest(newContestSlug);
            setNewContestSlug('');
          }}
        >
          Create Contest
        </a>
      </div>
    </div>
  );
};

export default CreateContestForm;
