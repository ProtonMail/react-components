import { c } from 'ttag';
import { TIME_UNIT } from './interfaces';

export const timeUnitLabels = {
    [TIME_UNIT.BIG_BANG]: c('Label').t`Account creation date`,
    [TIME_UNIT.LAST_YEAR]: c('Label').t`12 months ago`,
    [TIME_UNIT.LAST_3_MONTHS]: c('Label').t`3 months ago`,
    [TIME_UNIT.LAST_MONTH]: c('Label').t`1 month ago`,
};

export const IMAPS = {
    GMAIL: 'imap.gmail.com',
    YAHOO: 'imap.mail.yahoo.com',
};

/* The following constants are use to forge OAuth URL in the import assistant */
// export const G_OAUTH_CLIENT_ID = '923746734024-4rggv7tvusv9c0fi9tvh5elnuj5o067b.apps.googleusercontent.com';
export const G_OAUTH_SCOPE = ['email', 'openid', 'https://mail.google.com/'].join(' ');
export const G_OAUTH_REDIRECT_PATH = '/oauth/callback';

export const G_OAUTH_CLIENT_ID = '192543898962-v1mvc6s9jlfn71tms865ercsun7crnk4.apps.googleusercontent.com';
