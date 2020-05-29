export enum DestinationLabelID {
    INBOX = 0,
    ALL_DRAFTS = 1,
    ALL_SENT = 2,
    TRASH = 3,
    SPAM = 4,
    ALL_MAIL = 5,
    STARRED = 10,
    ARCHIVE = 6,
    SENT = 7,
    DRAFTS = 8
}

export interface Folder {
    SourceFolder: string;
    DestinationLabelID?: DestinationLabelID;
    DestinationLabelName?: string;
    Processed: number;
}

export interface MailImportFolder {
    Name: string;
    Total: number;
    Flags: string[];
    DestinationLabelID?: DestinationLabelID;
    DestinationLabelName?: string;
    Size: number;
}

export interface MailImportFolderModel extends MailImportFolder {
    id: string;
    name: string;
}

export enum Step {
    START,
    PREPARE,
    STARTED
}

export interface ModalModel {
    newFolders: MailImportFolderModel[];
    oldFolders: MailImportFolder[];
    step: Step;
    needDetails: boolean;
    importID: string;
    email: string;
    password: string;
    port: string;
    imap: string;
    errorCode: number;
}

export enum ImportMailStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    PAUSED = 2,
    CANCELED = 3,
    DONE = 4,
    FAILED = 5
}

export interface ImportMail {
    ID: string;
    CreationTime: number;
    Email: string;
    AddressID: string;
    Status: ImportMailStatus;
    FilterStartDate: string;
    FilterEndDate: string;
    FolderMapping: Folder[];
}

export enum ImportMailReportStatus {
    CANCELED = 3,
    DONE = 4,
    FAILED = 5
}

export interface ImportMailReport {
    ID: string;
    Email: string;
    Status: ImportMailReportStatus;
    CreateTime: number;
    EndTime: number;
    Report: string;
}

export interface MailboxSize {
    [mailboxID: string]: number;
}
