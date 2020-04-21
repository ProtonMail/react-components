export const SIGNUP_STEPS = {
    LOADING_CREATION: 'loading-creation',
    NO_SIGNUP: 'no-signup',
    ACCOUNT_CREATION_USERNAME: 'account-creation-username',
    ACCOUNT_CREATION_EMAIL: 'account-creation-email',
    RECOVERY_EMAIL: 'recovery-email',
    RECOVERY_PHONE: 'recovery-phone',
    VERIFICATION_CODE: 'verification-code',
    PLANS: 'plans',
    PAYMENT: 'payment',
    CREATING_ACCOUNT: 'creating-account',
    HUMAN_VERIFICATION: 'human-verification'
};

export const DEFAULT_SIGNUP_MODEL = {
    step: SIGNUP_STEPS.LOADING_CREATION,
    amount: 0,
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    verifyMethods: [],
    domains: [],
    recoveryEmail: '',
    recoveryPhone: '',
    verificationCode: '',
    currency: 'EUR',
    cycle: 12,
    planIDs: {},
    humanVerificationMethods: [],
    humanVerificationToken: '',
    verificationToken: '',
    verificationTokenType: '',
    paymentToken: '',
    paymentTokenType: ''
};

export const DEFAULT_CHECK_RESULT = {
    Amount: 0,
    AmountDue: 0,
    Proration: 0,
    Credit: 0,
    Currency: 'EUR',
    Cycle: 0,
    Gift: 0,
    CouponDiscount: 0,
    Coupon: null
};
