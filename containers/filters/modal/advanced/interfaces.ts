export enum Step {
    NAME,
    SIEVE
}

export interface ModalModel {
    step: Step;
    name: string;
    sieve: string;
}

export interface Errors {
    name: string;
    sieve: string;
}
