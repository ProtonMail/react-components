interface Folder {
    SourceFolder: string;
    DestinationLabelID?: number;
    DestinationLabelName?: string;
    Processed: number;
    Total: number;
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
