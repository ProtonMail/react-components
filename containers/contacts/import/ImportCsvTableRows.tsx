import React from 'react';
import { PreVcardsProperty } from 'proton-shared/lib/interfaces/contacts/Import';
import { toVcard } from 'proton-shared/lib/contacts/helpers/csv';

import { Checkbox } from '../../../components';

import SelectImportField from './SelectImportField';
import SelectImportType from './SelectImportType';

interface Props {
    preVcards: PreVcardsProperty;
    onToggle: (index: number) => void;
    onChangeField: (field: string) => void;
    onChangeType: (type: string) => void;
}
const ImportCsvTableRows = ({ preVcards, onToggle, onChangeField, onChangeType }: Props) => {
    const { field, type, display } = toVcard(preVcards) || {};
    let formattedDisplay = display;

    if (field === 'n' || field === 'categories') {
        // Do not display N or CATEGORIES vcard fields since they cannot be edited from the contact modal
        return null;
    }

    // Display the date on a readable format
    if (display && (field === 'bday' || field === 'anniversary')) {
        formattedDisplay = display.slice(0, 10);
    }

    return (
        <>
            {preVcards.map(({ checked, header }, i) => (
                <tr key={i.toString()}>
                    <td className="text-center">
                        <Checkbox checked={checked} onChange={() => onToggle(i)} />
                    </td>
                    <td>{header}</td>
                    {i === 0 ? (
                        <>
                            <td rowSpan={preVcards.length}>
                                <div className="flex">
                                    <SelectImportField value={field} onChangeField={onChangeField} />
                                    {type !== undefined ? (
                                        <SelectImportType field={field} value={type} onChangeType={onChangeType} />
                                    ) : null}
                                </div>
                            </td>
                            <td rowSpan={preVcards.length} className="text-ellipsis" title={formattedDisplay}>
                                {formattedDisplay}
                            </td>
                        </>
                    ) : null}
                </tr>
            ))}
        </>
    );
};

export default ImportCsvTableRows;
