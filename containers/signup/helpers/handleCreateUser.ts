import { Api } from 'proton-shared/lib/interfaces';
import { HumanVerificationError } from '../interfaces';
import { srpVerify } from 'proton-shared/lib/srp';
import { queryCreateUser } from 'proton-shared/lib/api/user';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';

interface CreateUserArgs {
    api: Api;
    clientType: 1 | 2;
    payload?: { [key: string]: string };
    username: string;
    password: string;
    recoveryEmail: string;
}

const handleCreateUser = async ({ api, username, password, recoveryEmail, clientType, payload }: CreateUserArgs) => {
    if (!username) {
        throw new Error('Missing username');
    }
    try {
        return await srpVerify({
            api,
            credentials: { password },
            config: {
                ...queryCreateUser({
                    Type: clientType,
                    Email: recoveryEmail,
                    Username: username,
                    Payload: payload,
                }),
                silence: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED],
                ignoreHandler: [API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED],
            },
        });
    } catch (error) {
        const { data: { Code, Details } = { Code: 0, Details: {} } } = error;

        if (Code === API_CUSTOM_ERROR_CODES.HUMAN_VERIFICATION_REQUIRED) {
            const { HumanVerificationMethods = [], HumanVerificationToken = '' } = Details;
            throw new HumanVerificationError(HumanVerificationMethods, HumanVerificationToken);
        }

        throw error;
    }
};

export default handleCreateUser;
