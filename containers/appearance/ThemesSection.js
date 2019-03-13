import React from 'react';
import PropTypes from 'prop-types';
import { c, t } from 'ttag';
import { SubTitle, Alert, Bordered, Label, Radio } from 'react-components';

const darkTheme = {
    name: 'Dark (Default)',
    colorLeft: '#262a33',
    colorBig: '#3c414e',
    colorSmall: '#ffffff',
    'background-image': 'linear-gradient(to bottom, #262a33, #3c414e);'
};

const lightTheme = {
    name: 'Light',
    colorLeft: '#eeeff1',
    colorBig: '#f6f7fa',
    colorSmall: '#ffffff'
};

const blueTheme = {
    name: 'Blue',
    colorLeft: '#526ee0',
    colorBig: '#788ee8',
    colorSmall: '#ffffff'
};

const companyTheme = {
    name: 'Company (Editor)',
    colorLeft: '#1b8a8e',
    colorBig: '#1ad5a3',
    colorSmall: '#ffffff'
};

const customTheme = {
    name: 'Test (Custom)',
    colorLeft: '#8e1b7b',
    colorBig: '#d51a71',
    colorSmall: '#ffffff'
};

const Theme = ({ theme }) => {
    const styleLeft = {
        height: '82px',
        width: '6px',
        'background-color': `${theme.colorLeft}`,
        display: 'inline-block'
    };
    const styleBig = /darko/i.test(theme.name)
        ? {
              height: '82px',
              width: '149px',
              'background-image': `${theme['background-image']}`,
              display: 'inline-block',
              position: 'relative'
          }
        : {
              height: '82px',
              width: '149px',
              'background-color': `${theme.colorBig}`,
              display: 'inline-block',
              position: 'relative'
          };
    const styleSmall = {
        height: '69px',
        width: '118px',
        'background-color': `${theme.colorSmall}`,
        position: 'absolute',
        bottom: '0',
        right: '4px'
    };

    return (
        <Bordered>
            <div style={{ height: '164px' }}>
                <div className="flex-item-fluid">
                    <Label htmlFor={theme.name}>
                        <Radio name="chooseTheme" id={theme.name} />
                        {t` ${theme.name}`}
                    </Label>
                </div>
                <div className="flex-item-fluid">
                    <div style={styleLeft} />
                    <div style={styleBig}>
                        <div style={styleSmall} />
                    </div>
                </div>
                <div>Preview</div>
            </div>
        </Bordered>
    );
};

Theme.propTypes = {
    theme: PropTypes.string
};

const ThemesSection = () => {
    const dummyText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium enim nec massa fringilla, ac ultrices tortor posuere. Fusce sed quam vitae arcu pharetra congue. Quisque in elementum nibh.';

    return (
        <>
            <SubTitle>{c('Title').t`Themes`}</SubTitle>
            <Alert learnMore="someURL">{c('Info').t`${dummyText}`}</Alert>
            <div style={{ display: 'flex' }}>
                <Theme theme={darkTheme} />
                <Theme theme={lightTheme} />
                <Theme theme={blueTheme} />
                <Theme theme={companyTheme} />
                <Theme theme={customTheme} />
            </div>
        </>
    );
};

export default ThemesSection;
