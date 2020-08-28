import { Label } from 'proton-shared/lib/interfaces/Label';
import { TIME_UNIT } from './constants';

export enum DestinationFolder {
    INBOX = 'Inbox',
    ALL_DRAFTS = 'All Drafts',
    ALL_SENT = 'All Sent',
    TRASH = 'Trash',
    SPAM = 'Spam',
    ALL_MAIL = 'All Mail',
    STARRED = 'Starred',
    ARCHIVE = 'Archive',
    SENT = 'Sent',
    DRAFTS = 'Drafts',
}

export enum IMPORT_ERROR {
    AUTH_IMAP = 2000,
    AUTH_CREDENTIALS = 2902,
    ALREADY_EXISTS = 2500,
}

export interface ImportedFolder {
    SourceFolder: string;
    DestinationFolder?: DestinationFolder;
    Processed: number;
    Total: number;
}

export interface MailImportFolder {
    Name: string;
    Total: number;
    Flags: string[];
    DestinationFolder?: DestinationFolder;
    Size: number;
}

export enum Step {
    START,
    PREPARE,
    STARTED,
}

export interface ImportModalModel {
    providerFolders: MailImportFolder[];
    step: Step;
    needIMAPDetails: boolean;
    importID: string;
    email: string;
    password: string;
    port: string;
    imap: string;
    errorCode: number;
    errorLabel: string;
    selectedPeriod: TIME_UNIT;
    payload: ImportPayloadModel;
}

export interface FolderMapping {
    Source: string;
    Destinations: {
        FolderName: string;
    };
}

export interface ImportPayloadModel {
    AddressID?: string;
    Code?: string;
    ImportLabel?: Partial<Label>;
    StartTime?: Date;
    EndTime?: Date;
    Mapping: FolderMapping[];
}

export enum ImportMailStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    PAUSED = 2,
    CANCELED = 3,
    DONE = 4,
    FAILED = 5,
}

export interface ImportMail {
    ID: string;
    CreateTime: number;
    Email: string;
    AddressID: string;
    State: ImportMailStatus;
    FilterStartDate: string;
    FilterEndDate: string;
    Mapping: ImportedFolder[];
}

export enum ImportMailReportStatus {
    QUEUED = 0,
    RUNNING = 1,
    DONE = 2,
    FAILED = 3,
    PAUSED = 4,
    CANCELED = 5,
}

export interface ImportMailReport {
    ID: string;
    Email: string;
    CreateTime: number;
    EndTime: number;
    NumMessages: number;
    State: ImportMailReportStatus;
    TotalSize: number;
}

export interface ProviderFoldersMapItem {
    providerPath: string;
    destinationPath: string;
    checked: boolean;
    recommendedFolder?: DestinationFolder;
    descendants: string[];
}

export interface ProviderFolderMap {
    [key: string]: ProviderFoldersMapItem;
}
