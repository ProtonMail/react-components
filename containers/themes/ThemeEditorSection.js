/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import {
    SubTitle,
    Alert,
    Row,
    Table,
    TableBody,
    TableRow,
    Label,
    Href,
    ColorPicker,
    Input,
    Button
} from 'react-components';

const ThemeEditor = ({ themeMode, onChange, loading }) => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    // TODO
    // eslint-disable-next-line no-unused-vars
    const themeName = (themeMode) => {
        return 'Company';
    };

    const themeNameRow = [
        c('Title').t`Theme Name`,
        themeName(themeMode),
        <Button className="pm-button-blue">Edit</Button>
    ];
    const inboxLogoRow = [
        c('Title').t`Inbox Logo`,
        'an image',
        <>
            <Button>{c('Description').t`Upload logo`}</Button>
            <Label className="p1">
                <Href url="TODO">Reset logo</Href>
            </Label>
        </>
    ];
    const colorRow = (type) => {
        return [
            c('Title').t`${type} Color`,
            <>
                <ColorPicker />
                <Input placeholder="#123456" />
            </>,
            <Href url="TODO">Reset</Href>
        ];
    };

    return (
        <>
            <SubTitle>{c('Title').t`Theme Editor`}</SubTitle>
            <Alert learnMore="TODO">{c('Info').t`${dummyText}`}</Alert>
            <br />
            <Table className="noborder border-collapse">
                <TableBody>
                    <TableRow cells={themeNameRow} />
                    <TableRow cells={inboxLogoRow} />
                    <TableRow cells={colorRow('Background')} />
                    <TableRow cells={colorRow('Primary')} />
                    <TableRow cells={colorRow('Light')} />
                    <TableRow cells={colorRow('Text')} />
                    <TableRow cells={colorRow('Muted')} />
                </TableBody>
            </Table>
            <br />
            <Row>
                <Button className="pm-button-blue" onChange={onChange} loading={loading}>
                    Save
                </Button>
                <Button>Reset all</Button>
            </Row>
        </>
    );
};

ThemeEditor.propTypes = {
    themeMode: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default ThemeEditor;
