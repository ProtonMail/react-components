export enum Step {
    NAME,
    CONDITIONS,
    ACTIONS,
    PREVIEW
}

export interface ModalModel {
    step: Step;
    name: string;
}

export interface Filter {
    ID: string;
    Name: string;
    Status: number;
    Priority: number;
    Sieve: string;
    Version: number;
}
