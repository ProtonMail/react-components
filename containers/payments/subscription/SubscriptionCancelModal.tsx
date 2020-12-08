import React, { useState } from 'react';
import { c } from 'ttag';
import { SUBSCRIPTION_CANCELLATION_REASONS } from 'proton-shared/lib/constants';
import { FormModal, Row, Field, Label, SelectTwo, TextArea, Option, InputButton } from '../../../components';

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

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModel({ ...model, Score: Number(e.target.value) });
    };

    return (
        <FormModal
            title={c('Title').t`Cancel Subscription`}
            submit={c('Action').t`Submit`}
            close={c('Action').t`Skip`}
            onSubmit={handleSubmit}
            {...rest}
        >
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
                            title={c('Option').t`It’s temporary, I’ll be back`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.TEMPORARY}
                        />
                        <Option
                            title={c('Option').t`I didn’t understand what I was signing up for`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.SUBSCRIPTION_MISUNDERSTANDING}
                        />
                        <Option
                            title={c('Option').t`It’s too expensive`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.TOO_EXPENSIVE}
                        />
                        <Option
                            title={c('Option').t`I’m unhappy with customer service`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.UNHAPPY_WITH_CS}
                        />
                        <Option
                            title={c('Option').t`Using Proton is too complicated`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.TOO_COMPLICATED}
                        />
                        <Option
                            title={c('Option').t`I'm switching to a different service`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.SWITCHING_TO_DIFFERENT_SERVICE}
                        />
                        <Option
                            title={c('Option').t`The quality didn't live up to my expectations`}
                            value={SUBSCRIPTION_CANCELLATION_REASONS.QUALITY_BELOW_EXPECTATIONS}
                        />
                        <Option title={c('Option').t`Other`} value={SUBSCRIPTION_CANCELLATION_REASONS.OTHER} />
                    </SelectTwo>
                </Field>
            </Row>

            <Label>{c('Label').t`How likely are you to recommend ProtonMail to others?`}</Label>

            <div className="mb2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <InputButton
                        key={n}
                        id={`score-${n}`}
                        name="score"
                        type="radio"
                        value={n}
                        title={String(n)}
                        checked={model.Score === n}
                        labelProps={{ className: 'mr1 mt1' }}
                        onChange={handleScoreChange}
                    >
                        {n}
                    </InputButton>
                ))}
            </div>

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
