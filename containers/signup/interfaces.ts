export interface PlanIDs {
    [planID: string]: number;
}

export interface SignupModel {
    step: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    verifyMethods: string[];
    domains: string[];
    recoveryEmail: string;
    recoveryPhone: string;
    verificationCode: string;
    currency: string;
    cycle: number;
    planIDs: PlanIDs;
}

export interface SignupErros {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
    verificationCode?: string;
}

export interface SignupPlanPricing {
    1: number;
    12: number;
    24: number;
}

export interface SignupPlan {
    ID: string;
    Name: string;
    Type: number;
    Title: string;
    Currency: string;
    Amount: number;
    Quantity: number;
    Cycle: number;
    Services: number;
    Features: number;
    Pricing: SignupPlanPricing;
}

export interface SubscriptionCheckResult {
    Amount: number;
    AmountDue: number;
    Proration: number;
    Credit: number;
    Currency: string;
    Cycle: number;
    Gift: number;
    CouponDiscount: number;
    Coupon: null | {
        Code: string;
        Description: string;
    };
}
