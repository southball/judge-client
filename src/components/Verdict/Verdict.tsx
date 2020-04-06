import * as React from 'react';

const Verdict = ({ verdict }: { verdict: string }) => {
    const verdictClass =
        verdict === 'AC'
            ? 'is-success'
            : /^\d+ \/ \d+$/.test(verdict) || verdict === 'WJ'
            ? ''
            : 'is-danger';

    return (
        <span className={`tag ${verdictClass}`}>
            {verdict}
        </span>
    );
};

export default Verdict;
