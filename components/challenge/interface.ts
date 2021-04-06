export type ChallengeLogType = 'message' | 'error' | 'step';

export interface ChallengeLog {
    type: ChallengeLogType;
    text: string;
    data: any;
}

export type ChallengeResult = { [key: string]: string } | undefined;

export interface ChallengeRef {
    getChallenge: () => Promise<ChallengeResult>;
}
