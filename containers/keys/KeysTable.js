import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Table, TableCell, TableRow, TableBody } from 'react-components';

import KeysStatus from './KeysStatus';

const KeysTable = ({ keys, getKeyActions }) => {
    const headerCells = [
        { node: c('Title header for keys table').t`Fingerprint`, className: 'w50' },
        { node: c('Title header for keys table').t`Key type` },
        { node: c('Title header for keys table').t`Status` },
        { node: c('Title header for keys table').t`Actions` }
    ].map(({ node, className = '' }, i) => {
        return (
            <TableCell key={i.toString()} className={className} type="header">
                {node}
            </TableCell>
        );
    });

    const list = keys.map((key, i) => {
        const actions = getKeyActions(i);
        const { fingerprint, type, ...rest } = key;

        return (
            <TableRow
                key={fingerprint}
                cells={[
                    <code key="0" className="mw100 inbl ellipsis">
                        {fingerprint}
                    </code>,
                    type,
                    actions,
                    <KeysStatus key={1} {...rest} />
                ]}
            />
        );
    });

    return (
        <Table>
            <thead>
                <tr>{headerCells}</tr>
            </thead>
            <TableBody colSpan={4}>{list}</TableBody>
        </Table>
    );
};

KeysTable.propTypes = {
    keys: PropTypes.array,
    getKeyActions: PropTypes.func.isRequired
};

KeysTable.defaultProps = {
    keys: []
};

export default KeysTable;
