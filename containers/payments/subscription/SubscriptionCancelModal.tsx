import React, { useState } from 'react';
import { c } from 'ttag';
import { ACCOUNT_DELETION_REASONS } from 'proton-shared/lib/constants';
import { Alert, FormModal, Row, Field, Label, SelectTwo, TextArea, Option, ErrorButton } from '../../../components';
// import { useUser } from '../../../hooks';

export interface SubscriptionCancelModel {
    Reason?: string;
    Score?: number;
    Feedback?: string;
}

interface Props {
    onClose: () => void;
    onSubmit: (model: SubscriptionCancelModel) => void;
}

const SubscriptionCancellationModal = ({ onSubmit, ...rest }: Props) => {
    const title = c('Title').t`Cancel Subscription`;
    const submit = c('Action').t`Submit`;

    const [model, setModel] = useState<SubscriptionCancelModel>({
        Reason: '',
        Score: undefined,
        Feedback: '',
    });

    const handleChange = (field: string) => (e: any) => {
        setModel({
            ...model,
            [field]: e.target.value,
        });
    };

    const handleSubmit = () => {
        onSubmit(model);
    };

    // const [ { isAdmin } ] = useUser();

    return (
        <FormModal
            title={title}
            submit={<ErrorButton type="submit">{submit}</ErrorButton>}
            onSubmit={handleSubmit}
            close={null}
            {...rest}
        >
            <Alert type="warning">
                <div className="bold uppercase">{c('Info').t`Warning: This will *<WARNING>*`}</div>
                <div>{c('Info').t`Example: ProtonMail, ProtonContacts, ProtonVPN, ProtonDrive, ProtonCalendar`}</div>
            </Alert>

            <Row>
                <Label htmlFor="reason">{c('Label').t`What is the main reason you are cancelling?`}</Label>
                <Field>
                    <SelectTwo
                        id="reason"
                        autoFocus
                        value={model.Reason}
                        onChange={({ value }) => setModel({ ...model, Reason: value })}
                    >
                        <Option title={c('Option').t`Select a reason`} value="" />
                        <Option
                            title={c('Option').t`I use a different Proton account`}
                            value={ACCOUNT_DELETION_REASONS.DIFFERENT_ACCOUNT}
                        />
                        {/* {isAdmin ? (
                            <Option
                                title={c('Option').t`It's too expensive`}
                                value={ACCOUNT_DELETION_REASONS.TOO_EXPENSIVE}
                            />
                        ) : null} */}
                        <Option
                            title={c('Option').t`It's missing a key feature that I need`}
                            value={ACCOUNT_DELETION_REASONS.MISSING_FEATURE}
                        />
                        <Option
                            title={c('Option').t`I found another service that I like better`}
                            value={ACCOUNT_DELETION_REASONS.USE_OTHER_SERVICE}
                        />
                        <Option title={c('Option').t`My reason isn't listed`} value={ACCOUNT_DELETION_REASONS.OTHER} />
                    </SelectTwo>
                </Field>
            </Row>

            <Row>
                <Label htmlFor="email">{c('Label').t`How likely are you to recommend ProtonMail to others?`}</Label>
                <Field>
                    <div className="mb0-5">
                        <input type="range" min="0" max="10" value={model.Score} onChange={handleChange('Score')} />
                    </div>
                </Field>
            </Row>

            <Row>
                <Label htmlFor="feedback">
                    {c('Label').t`How do you think we could improve our products or service in the future?`}
                </Label>
                <Field>
                    <TextArea
                        id="feedback"
                        value={model.Feedback}
                        placeholder={c('Placeholder').t`Feedback`}
                        onChange={handleChange('Feedback')}
                    />
                </Field>
            </Row>
        </FormModal>
    );
};

export default SubscriptionCancellationModal;
