export enum DestinationFolder {
    // @todo warning discrepancy FE/BE 'Inbox' vs 'INBOX'
    INBOX = 'INBOX',
    ALL_DRAFTS = 'All Drafts',
    ALL_SENT = 'All Sent',
    TRASH = 'Trash',
    SPAM = 'Spam',
    ALL_MAIL = 'All Mail',
    // @todo warning discrepancy FE/BE 'Starred' vs 'Flagged'
    STARRED = 'Flagged',
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
    FAILED = 5,
}

export interface ImportMail {
    ID: string;
    CreationTime: number;
    Email: string;
    AddressID: string;
    Status: ImportMailStatus;
    FilterStartDate: string;
    FilterEndDate: string;
    FolderMapping: ImportedFolder[];
}

export enum ImportMailReportStatus {
    CANCELED = 3,
    DONE = 4,
    FAILED = 5,
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
