import React from 'react';
import { c } from 'ttag';

import { Loader, Button, Row, Label, Field, Info } from '../../components';
import { useFolders, useMailSettings, useModals } from '../../hooks';

import { SettingsSection } from '../account';

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

                    <div className="mt2 mb2">
                        <Button color="norm" onClick={() => createModal(<EditLabelModal type="folder" />)}>
                            {c('Action').t`Add folder`}
                        </Button>
                    </div>

                    {folders.length ? <FolderTreeViewList items={folders} /> : null}
                </>
            )}
        </SettingsSection>
    );
}

export default LabelsSection;
