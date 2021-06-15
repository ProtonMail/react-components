// export const G_OAUTH_CLIENT_ID = '923746734024-4rggv7tvusv9c0fi9tvh5elnuj5o067b.apps.googleusercontent.com';
export const G_OAUTH_CLIENT_ID = '192543898962-v1mvc6s9jlfn71tms865ercsun7crnk4.apps.googleusercontent.com';

export const G_OAUTH_REDIRECT_PATH = '/oauth/callback';
export const G_OAUTH_SCOPE_MAIL = ['email', 'openid', 'https://mail.google.com/'].join(' ');
export const G_OAUTH_SCOPE_CONTACTS = [
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/contacts.readonly',
].join(' ');
export const G_OAUTH_SCOPE_CALENDAR = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ');

export const OAUTH_TEST_IDS = [
    'cxinT4HnEQpRz7FHRiGu7CjH9pFULfMwqHc9mv65yycL99EohZgfRP7eMbBUMlEZG4Ks_yszjrcMzDeKD2No6w==',
    'ddjZNL8VtjZIOVR6tenP3u1Yj9s-hRLPFHuK-iDPnJunIano7ExK27dZGG41Z7t-4NQ_JJB1W2pK1N6dgEuVTA==',
    'hFe07LzzAjBB4HxpAZnIiK7nUIja1qXkdOGPAlPeToHDKd7KlFvovGzZD13Ylp1DrJ00wJkqifz58YeYlVmxFg==',
    // @todo remove me: adding `pro` id on proton.black for testing purpose
    'rSUCW_Qlh8dCCsxWKPXvkUsoDNL5eW9FJUM7WX8jTPrDE3ftOMIfWt-BSuKaw5PZ7EQ6Zsp8HL9Y9qMv4Y5XJQ==',
];
