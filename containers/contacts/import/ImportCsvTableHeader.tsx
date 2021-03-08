import React from 'react';
import { c } from 'ttag';

import { TableCell, Button, Icon } from '../../../components';

interface Props {
    disabledPrevious: boolean;
    disabledNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
}
const ImportCsvTableHeader = ({ disabledPrevious = true, disabledNext = true, onPrevious, onNext, ...rest }: Props) => {
    return (
        <thead {...rest}>
            <tr>
                <TableCell type="header" className="w15 text-center">
                    {c('TableHeader').t`IMPORT`}
                </TableCell>
                <TableCell type="header" className="text-center">{c('TableHeader').t`CSV FIELD`}</TableCell>
                <TableCell type="header" className="text-center">{c('TableHeader').t`VCARD FIELD`}</TableCell>
                <TableCell type="header" className="w30 text-center">
                    <div className="inline-flex">
                        <span className="flex-item-centered-vert mr0-5">{c('TableHeader').t`VALUES`}</span>
                        <span className="flex flex-nowrap">
                            <Button
                                disabled={disabledPrevious}
                                icon={<Icon name="caret" className="flex-item-noshrink rotateZ-90" />}
                                onClick={onPrevious}
                            />
                            <Button
                                disabled={disabledNext}
                                icon={<Icon name="caret" className="flex-item-noshrink rotateZ-270" />}
                                onClick={onNext}
                            />
                        </span>
                    </div>
                </TableCell>
            </tr>
        </thead>
    );
};

export default ImportCsvTableHeader;
