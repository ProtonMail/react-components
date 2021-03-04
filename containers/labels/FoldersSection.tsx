import React from 'react';
import { c } from 'ttag';

import { Loader, Button, Row, Label, Field, Info } from '../../components';
import { useFolders, useMailSettings, useModals } from '../../hooks';

import { SettingsSection, SettingsParagraph } from '../account';

import FolderTreeViewList from './FolderTreeViewList';
import EditLabelModal from './modals/EditLabelModal';
import ToggleEnableFolderColor from './ToggleEnableFolderColor';
import ToggleInheritParentFolderColor from './ToggleInheritParentFolderColor';

function LabelsSection() {
    const [folders = [], loadingFolders] = useFolders();
    const [mailSettings] = useMailSettings();
    const { createModal } = useModals();

    return (
        <SettingsSection>
            {loadingFolders ? (
                <Loader />
            ) : (
                <>
                    <SettingsParagraph
                        className="mt1 mb1"
                        learnMoreUrl="https://protonmail.com/support/knowledge-base/creating-folders/"
                    >
                        {c('LabelSettings').t`A message can only be filed in a single Folder at a time.`}
                    </SettingsParagraph>
                    <Row>
                        <Label htmlFor="folder-colors" className="text-semibold">
                            {c('Label').t`Use folder colors`}
                        </Label>
                        <Field>
                            <ToggleEnableFolderColor id="folder-colors" />
                        </Field>
                    </Row>
                    {mailSettings?.EnableFolderColor ? (
                        <Row>
                            <Label htmlFor="parent-folder-color" className="text-semibold">
                                <span>{c('Label').t`Inherit color from parent folder`}</span>
                                <Info
                                    buttonClass="ml0-5 inline-flex"
                                    title={c('Info - folder colouring feature')
                                        .t`When enabled, sub-folders inherit the color of the parent folder.`}
                                />
                            </Label>
                            <Field>
                                <ToggleInheritParentFolderColor id="parent-folder-color" />
                            </Field>
                        </Row>
                    ) : null}
                    <div className="mb1">
                        <Button color="norm" onClick={() => createModal(<EditLabelModal type="folder" />)}>
                            {c('Action').t`Add folder`}
                        </Button>
                    </div>
                    {folders.length ? (
                        <FolderTreeViewList items={folders} />
                    ) : (
                        <SettingsParagraph>{c('LabelSettings').t`No folders available`}</SettingsParagraph>
                    )}
                </>
            )}
        </SettingsSection>
    );
}

export default LabelsSection;
