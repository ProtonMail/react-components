import { PLANS } from 'proton-shared/lib/constants';

export interface PlanLabel {
    label: string;
    key: PLANS | 'free';
}

export interface Feature {
    label: React.ReactNode;
    free: React.ReactNode;
}

export type CalendarFeatureName = 'multi' | 'import' | 'recurring' | 'invitation' | 'share';

export type MailFeatureName =
    | 'users'
    | 'storage'
    | 'addresses'
    | 'custom domains'
    | 'messages per day'
    | 'folders / labels'
    | 'support'
    | 'encrypted contacts'
    | 'address verification'
    | 'custom filters'
    | 'IMAP/SMTP'
    | 'autoresponder'
    | 'short domain'
    | 'catch all email'
    | 'multi user support';

export type VPNFeatureName =
    | 'connections'
    | 'countries'
    | 'connection speed'
    | 'filesharing'
    | 'netshield'
    | 'secure core'
    | 'privacy features'
    | 'access blocked content'
    | 'no logs'
    | 'PFS'
    | 'encryption'
    | 'DNS leak protection'
    | 'kill switch'
    | 'always-on'
    | 'open source'
    | '10 Gbps servers'
    | 'split tunneling'
    | 'swiss based'
    | 'support';

export interface CalendarFeature extends Feature {
    name: CalendarFeatureName;
    [PLANS.PLUS]: React.ReactNode;
    [PLANS.PROFESSIONAL]: React.ReactNode;
    [PLANS.VISIONARY]: React.ReactNode;
}

export interface MailFeature extends Feature {
    name: MailFeatureName;
    [PLANS.PLUS]: React.ReactNode;
    [PLANS.PROFESSIONAL]: React.ReactNode;
    [PLANS.VISIONARY]: React.ReactNode;
}

export interface VPNFeature extends Feature {
    name: VPNFeatureName;
    [PLANS.VPNBASIC]: React.ReactNode;
    [PLANS.VPNPLUS]: React.ReactNode;
    [PLANS.VISIONARY]: React.ReactNode;
}
