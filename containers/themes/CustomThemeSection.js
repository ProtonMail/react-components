/* eslint-disable react/jsx-key */
import React from 'react';
// import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SubTitle, Alert, Table, TableBody, TableRow, Button } from 'react-components';

const CustomTheme = () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    const uploadThemeRow = [c('Title').t`Upload theme file`, <Button>Upload</Button>];
    const pasteThemeRow = [c('Title').t`Paste theme code`, <Button>Paste</Button>];

    return (
        <>
            <SubTitle>{c('Title').t`Custom`}</SubTitle>
            <Alert learnMore="TODO">{c('Info').t`${dummyText}`}</Alert>
            <br />
            <Table className="noborder border-collapse">
                <TableBody>
                    <TableRow cells={uploadThemeRow} />
                    <TableRow cells={pasteThemeRow} />
                </TableBody>
            </Table>
        </>
    );
};

// CustomTheme.propTypes = {
//     themeMode: PropTypes.number.isRequired,
//     onChange: PropTypes.func.isRequired,
//     loading: PropTypes.bool
// };

export default CustomTheme;
