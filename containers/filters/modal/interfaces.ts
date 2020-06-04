export enum Step {
    NAME,
    CONDITIONS,
    ACTIONS,
    PREVIEW
}

export enum FilterStatement {
    ALL = 'all',
    ANY = 'any'
}

export enum ConditionType {
    SELECT = 'select',
    SUBJECT = 'subject',
    SENDER = 'sender',
    RECIPIENT = 'recipient',
    ATTACHMENTS = 'attachments'
}

export enum ConditionComparator {
    CONTAINS = 'contains',
    IS = 'is',
    STARTS = 'starts',
    ENDS = 'ends',
    MATCHES = 'matches',
    IS_NOT = '!is',
    DOES_NOT_CONTAIN = '!contains',
    DOES_NOT_START = '!starts',
    DOES_NOT_END = '!ends',
    DOES_NOT_MATCH = '!matches'
}

export interface Actions {
    labelAs: {
        labels: string[];
        isOpen: boolean;
    };
    moveTo: {
        folder?: string;
        isOpen: boolean;
    };
    markAs: {
        read: boolean;
        starred: boolean;
        isOpen: boolean;
    };
    autoReply: boolean;
    stopProcessing: boolean;
    error?: string;
}

export interface Condition {
    type: ConditionType;
    comparator: ConditionComparator;
    values?: string[];
    withAttachment?: boolean;
    error?: string;
    isOpen: boolean;
}

export interface FilterModalModel {
    step: Step;
    name: string;
    actions: Actions;
    conditions: Condition[];
}

export interface Filter {
    ID: string;
    Name: string;
    Status: number;
    Priority: number;
    Sieve: string;
    Version: number;
}

export interface Errors {
    name: string;
    actions: string;
    conditions: string;
}
