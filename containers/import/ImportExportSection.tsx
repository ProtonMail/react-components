import React from 'react';
import { c } from 'ttag';

import { Button } from '../../components';

import { SettingsSection, SettingsParagraph } from '../account';

const DOWNLOAD_URL = 'https://protonmail.com/import-export';

const ImportExportSection = () => {
    const handleClick = () => {
        window.open(DOWNLOAD_URL);
    };

    return (
        <SettingsSection>
            <SettingsParagraph>
                {c('Info')
                    .t`Import and export your messages for local backups with Proton's import/export desktop app. Available on MacOS, Windows and Linux.`}
            </SettingsParagraph>

            <Button color="norm" onClick={handleClick}>
                {c('Action').t`Download`}
            </Button>
        </SettingsSection>
    );
};

export default ImportExportSection;
