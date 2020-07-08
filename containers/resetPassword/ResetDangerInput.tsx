import React from 'react';
import { c } from 'ttag';
import { Input } from '../../index';

interface Props {
    danger: string;
    setDanger: (danger: string) => void;
    dangerWord: string;
    id: string;
}
const ResetDangerInput = ({ id, danger, setDanger, dangerWord }: Props) => {
    return (
        <Input
            id={id}
            placeholder={c('Placeholder').t`Enter the word '${dangerWord}' here`}
            value={danger}
            onChange={({ target }) => setDanger(target.value)}
            error={danger.length > 0 && danger !== dangerWord ? c('Error').t`Please enter '${dangerWord}'` : ''}
            required
        />
    );
};

export default ResetDangerInput;
