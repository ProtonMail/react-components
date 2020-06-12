import React from 'react';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';
import { getVerificationHeaders } from 'proton-shared/lib/api';

import HumanVerificationModal from '../api/HumanVerificationModal';
import { Api } from 'proton-shared/lib/interfaces';
import { SignupModel } from './interfaces';
import { MethodType } from '../api/HumanVerificationForm';

interface ExtraArguments {
    api: Api;
    createModal: any;
    model: SignupModel;
    updateModel: (data: SignupModel) => void;
}

/**
 * Special human api handling for the signup since the human verification code needs to be triggered and included
 * in possibly multiple api requests.
 */
const humanApi = <T,>(config: any, { api, createModal, model, updateModel }: ExtraArguments): Promise<T> => {
    return api<T>({
        ...config,
        headers: {
            ...config.headers,
            ...getVerificationHeaders(model.verificationToken, model.verificationTokenType)
        },
        noHandling: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED],
        silence: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED]
    }).catch((error: any) => {
        if (
            error.data?.Code !== API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED ||
            config.noHandling?.includes(API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED)
        ) {
            throw error;
        }

        const onVerify = (token: string, tokenType: MethodType): Promise<T> => {
            return api<T>({
                ...config,
                headers: {
                    ...config.headers,
                    ...getVerificationHeaders(token, tokenType)
                },
                noHandling: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED],
                silence: [API_CUSTOM_ERROR_CODES.TOKEN_INVALID]
            }).then((result: T) => {
                // Token was ok, set it in the model
                updateModel({
                    ...model,
                    verificationToken: token,
                    verificationTokenType: tokenType
                });
                return result;
            });
        };

        const handleVerification = ({ token, methods, onVerify }: any): Promise<T> => {
            return new Promise((resolve, reject) => {
                createModal(
                    <HumanVerificationModal
                        token={token}
                        methods={methods}
                        onClose={() => reject(error)}
                        onVerify={onVerify}
                        onSuccess={resolve}
                    />
                );
            });
        };

        const { Details: { HumanVerificationToken = '', HumanVerificationMethods: methods = [] } = {} } =
            error.data || {};

        return handleVerification({ token: HumanVerificationToken, methods, onVerify });
    });
};

export default humanApi;
