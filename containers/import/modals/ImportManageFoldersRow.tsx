import React, { ChangeEvent, useState, useRef, useEffect, useMemo } from 'react';
import { c } from 'ttag';

import { Tooltip, Icon, Checkbox, InlineLinkButton, Input } from '../../../components';
import { classnames } from '../../../helpers';

import {
    DestinationFolder,
    CheckedFoldersMap,
    DisabledFoldersMap,
    ChildrenRelationshipMap,
    MailImportFolder,
    FoldersNameMap,
} from '../interfaces';

import { PATH_SPLIT_REGEX } from '../constants';

const FOLDER_ICONS = {
    [DestinationFolder.INBOX]: 'inbox',
    [DestinationFolder.ALL_DRAFTS]: 'drafts',
    [DestinationFolder.ALL_SENT]: 'sent',
    [DestinationFolder.TRASH]: 'trash',
    [DestinationFolder.SPAM]: 'spam',
    [DestinationFolder.ARCHIVE]: 'archive',
    [DestinationFolder.SENT]: 'sent',
    [DestinationFolder.DRAFTS]: 'drafts',
    [DestinationFolder.STARRED]: 'star',
    [DestinationFolder.ALL_MAIL]: 'all-emails',
};

const ERRORS = {
    nameTooLongError: c('Error').t`The folder name is too long. Please choose a different name.`,
    emptyValueError: c('Error').t`Folder name cannot be empty`,
};

const WARNINGS = {
    mergeWarning: c('Warning').t`This folder name already exists. Messages will be imported into the existing folder.`,
};

const DIMMED_OPACITY_CLASSNAME = 'opacity-30';

interface Props {
    onRename: (providerName: string, newPath: string, previousPath: string) => void;
    onToggleCheck: (providerName: string, checked: boolean) => void;
    folder: MailImportFolder;
    level: number;
    checkedFoldersMap: CheckedFoldersMap;
    disabledFoldersMap: DisabledFoldersMap;
    childrenRelationshipMap: ChildrenRelationshipMap;
    providerFolders: MailImportFolder[];
    foldersNameMap: FoldersNameMap;
}

const escapeSlashes = (s: string) => s.split(PATH_SPLIT_REGEX).join('\\\\/');
const unescapeSlashes = (s: string) => s.split('\\\\/').join('/');

const getSourceDisplayName = (name: string, separator: string) =>
    name.split(separator === '/' ? PATH_SPLIT_REGEX : separator).pop() || name;

const getDestinationDisplayName = (destinationPath: string, levelDestination = 0) => {
    const splittedDestination = destinationPath.split(PATH_SPLIT_REGEX);
    splittedDestination.splice(0, levelDestination);
    return levelDestination ? unescapeSlashes(splittedDestination.join('/')) : unescapeSlashes(destinationPath);
};

const forgeNewPath = (initialPath: string, level: number, newName: string) => {
    const splitted = initialPath.split(PATH_SPLIT_REGEX);
    return [...splitted.slice(0, level), escapeSlashes(newName.trim())].join('/');
};

const ImportManageFoldersRow = ({
    folder,
    level,
    onToggleCheck,
    checkedFoldersMap,
    disabledFoldersMap,
    childrenRelationshipMap,
    providerFolders,
    foldersNameMap,
    onRename,
}: Props) => {
    const { Source, Separator, DestinationFolder } = folder;
    const checked = checkedFoldersMap[Source];
    const disabled = disabledFoldersMap[Source];
    const children = childrenRelationshipMap[Source].reduce<MailImportFolder[]>((acc, childName) => {
        const found = providerFolders.find((f) => f.Source === childName);
        if (found) {
            acc.push(found);
        }
        return acc;
    }, []);

    const levelDestination = Math.min(level, 2);
    const destinationPath = foldersNameMap[Source];

    const destinationName = getDestinationDisplayName(destinationPath, levelDestination);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(destinationName);
    const initialValue = useRef<string>(inputValue);

    const preventDefaultAndStopPropagation = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const emptyValueError = useMemo(() => !inputValue || !inputValue.trim(), [inputValue]);

    const nameTooLongError = useMemo(() => {
        const newPath = forgeNewPath(destinationPath, levelDestination, inputValue);
        return newPath.length >= 100;
    }, [destinationPath, inputValue]);

    const mergeWarning = useMemo(() => {
        const newPath = forgeNewPath(destinationPath, levelDestination, inputValue);

        return Object.entries(foldersNameMap).some(([sourcePath, destinationPath]) => {
            return sourcePath !== Source && destinationPath === newPath;
        });
    }, [foldersNameMap, destinationPath, inputValue]);

    const hasError = emptyValueError || nameTooLongError;

    const [editMode, setEditMode] = useState(hasError);

    const toggleEditMode = (e: React.MouseEvent) => {
        if (disabled || editMode) {
            return;
        }
        if (!editMode) {
            initialValue.current = inputValue;
        }

        setEditMode(!editMode);
    };

    const handleSave = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        const newPath = forgeNewPath(destinationPath, levelDestination, inputValue);
        setEditMode(false);
        onRename(Source, newPath, destinationPath);
        initialValue.current = inputValue;
    };

    const handleCancel = (e: React.MouseEvent) => {
        preventDefaultAndStopPropagation(e);

        setEditMode(false);
        setInputValue(initialValue.current);
    };

    const renderInput = () => {
        let error;
        let warning;
        let item;

        if (nameTooLongError) {
            error = ERRORS.nameTooLongError;
        }

        if (emptyValueError) {
            error = ERRORS.emptyValueError;
        }

        if (warning) {
            item = (
                <Tooltip title={WARNINGS.mergeWarning} type="warning">
                    <Icon
                        tabIndex={-1}
                        name="info"
                        className="color-global-attention inline-flex flex-self-vcenter flex-item-noshrink"
                    />
                </Tooltip>
            );
        }

        if (error) {
            item = (
                <Tooltip title={error} type="error">
                    <Icon
                        tabIndex={-1}
                        name="info"
                        className="color-global-warning inline-flex flex-self-vcenter flex-item-noshrink"
                    />
                </Tooltip>
            );
        }

        return (
            <Input
                autoFocus
                required
                isSubmitted
                ref={inputRef}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onPressEnter={(e: React.KeyboardEvent) => {
                    e.preventDefault();
                    if (emptyValueError || nameTooLongError) {
                        return;
                    }
                    handleSave(e);
                }}
                icon={item}
                error={error || warning}
                errorZoneClassName="hidden"
            />
        );
    };

    useEffect(() => {
        if (disabled) {
            setEditMode(false);
            setInputValue(initialValue.current);
        }
    }, [disabled]);

    useEffect(() => {
        if (editMode && inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    return (
        <li>
            <div className="border-bottom">
                <label
                    htmlFor={Source}
                    className={classnames([
                        'flex flex-nowrap flex-items-center pt1 pb1',
                        !checked && DIMMED_OPACITY_CLASSNAME,
                        (disabled || editMode) && 'cursor-default',
                    ])}
                    onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
                        if (editMode) {
                            preventDefaultAndStopPropagation(e);
                        }
                    }}
                >
                    <div className="flex w40 flex-nowrap flex-items-center flex-item-noshrink pr1">
                        <div
                            className="flex-item-noshrink"
                            style={DestinationFolder ? undefined : { marginLeft: `${level}em` }}
                        >
                            <Checkbox
                                onChange={({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
                                    if (!checked && editMode) {
                                        setEditMode(false);
                                    }
                                    onToggleCheck(Source, checked);
                                }}
                                id={Source}
                                checked={checked}
                                disabled={disabled}
                            />
                        </div>
                        <div
                            className="ml0-5 flex-item-fluid-auto ellipsis"
                            // @todo put me back
                            // title={getSourceDisplayName(Source)}
                            title={Source}
                        >
                            {getSourceDisplayName(Source, Separator)}
                        </div>
                    </div>

                    <div className="flex w40 pr1">
                        <div
                            className="flex flex-nowrap flex-items-center flex-item-fluid-auto"
                            style={DestinationFolder ? undefined : { marginLeft: `${levelDestination}em` }}
                        >
                            <Icon
                                name={DestinationFolder ? FOLDER_ICONS[DestinationFolder] : 'folder'}
                                className={classnames([
                                    'flex-item-noshrink',
                                    hasError && 'color-global-warning',
                                    mergeWarning && 'color-global-attention',
                                ])}
                            />
                            <div
                                className={classnames([
                                    'ml0-5 w100 flex flex-nowrap',
                                    hasError && 'color-global-warning',
                                    mergeWarning && 'color-global-attention',
                                ])}
                            >
                                {editMode && !disabled ? (
                                    renderInput()
                                ) : (
                                    <>
                                        <span
                                            className={classnames([
                                                'flex-item-fluid-auto ellipsis',
                                                (nameTooLongError || mergeWarning) && 'bold',
                                            ])}
                                            // @todo put me back
                                            // title={destinationName}
                                            title={destinationPath}
                                        >
                                            {destinationName}
                                        </span>
                                        {nameTooLongError && (
                                            <Tooltip
                                                title={ERRORS.nameTooLongError}
                                                className="flex-item-noshrink"
                                                type="error"
                                            >
                                                <Icon
                                                    tabIndex={-1}
                                                    name="info"
                                                    className="color-global-warning inline-flex flex-self-vcenter flex-item-noshrink"
                                                />
                                            </Tooltip>
                                        )}
                                        {mergeWarning && (
                                            <Tooltip
                                                title={WARNINGS.mergeWarning}
                                                className="flex-item-noshrink"
                                                type="warning"
                                            >
                                                <Icon
                                                    tabIndex={-1}
                                                    name="info"
                                                    className="color-global-attention inline-flex flex-self-vcenter flex-item-noshrink"
                                                />
                                            </Tooltip>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {!DestinationFolder && (
                        <div
                            className="flex w20 flex-items-center"
                            onClick={(e) => {
                                if (disabled) {
                                    preventDefaultAndStopPropagation(e);
                                }
                            }}
                        >
                            {editMode && !disabled ? (
                                <>
                                    <InlineLinkButton
                                        onClick={handleSave}
                                        className={classnames(['p0-5', hasError && DIMMED_OPACITY_CLASSNAME])}
                                        aria-disabled={hasError}
                                        disabled={hasError}
                                    >
                                        {c('Action').t`Save`}
                                    </InlineLinkButton>
                                    <InlineLinkButton onClick={handleCancel} className="ml0-5 p0-5">
                                        {c('Action').t`Cancel`}
                                    </InlineLinkButton>
                                </>
                            ) : (
                                <InlineLinkButton
                                    aria-disabled={!checked}
                                    disabled={!checked}
                                    tabIndex={disabled ? -1 : 0}
                                    onClick={toggleEditMode}
                                    className="p0-5"
                                >
                                    {c('Action').t`Rename`}
                                </InlineLinkButton>
                            )}
                        </div>
                    )}
                </label>
            </div>
            {children.length > 0 && (
                <ul className="unstyled m0">
                    {children.map((f) => (
                        <ImportManageFoldersRow
                            onToggleCheck={onToggleCheck}
                            key={f.Source}
                            folder={f}
                            level={level + 1}
                            checkedFoldersMap={checkedFoldersMap}
                            disabledFoldersMap={disabledFoldersMap}
                            childrenRelationshipMap={childrenRelationshipMap}
                            providerFolders={providerFolders}
                            foldersNameMap={foldersNameMap}
                            onRename={onRename}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default ImportManageFoldersRow;
