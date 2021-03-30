import React, { useState } from 'react';
import { c } from 'ttag';

import { FormModal, Scale, TextArea } from '../../components';

interface FeedbackModalModel {
    Score?: number;
    Feedback?: string;
}

interface Props {
    onClose: () => void;
    onSubmit: (model: FeedbackModalModel) => void;
}

const FeedbackModal = ({ onSubmit, onClose, ...rest }: Props) => {
    const [model, setModel] = useState<FeedbackModalModel>({
        Score: undefined,
        Feedback: '',
    });

    const handleSubmit = () => {
        onSubmit(model);
        onClose();
    };

    const handleChange = (field: string) => (e: any) => {
        setModel({
            ...model,
            [field]: e.target.value,
        });
    };

    const handleScoreChange = (Score: number) => {
        setModel({ ...model, Score });
    };

    return (
        <FormModal title={c('Title').t`Give feedback`} submit={c('Action').t`Submit`} onSubmit={handleSubmit} {...rest}>
            <div className="w75 on-mobile-w100">
                <p className="mb2">{c('Info')
                    .t`Proton has received a facelift. We would love to hear what you think about it!`}</p>
                <div className="mb2">
                    <label className="mb1 block" id="score-label">{c('Label')
                        .t`How would you rate our new look and feel?`}</label>
                    <Scale
                        from={0}
                        to={10}
                        fromLabel={c('Label').t`0 - Not a fan`}
                        toLabel={c('Label').t`10 - Love it!`}
                        value={model.Score}
                        InputButtonProps={{ 'aria-describedby': 'score-label' }}
                        onChange={handleScoreChange}
                    />
                </div>
                <div>
                    <label className="mb1 block" htmlFor="feedback-label">{c('Label')
                        .t`Please let us know about any additional feedback that you might have. Thank you for helping us making Proton products better!`}</label>
                    <TextArea
                        id="feedback-label"
                        value={model.Feedback}
                        placeholder={c('Placeholder').t`Feedback`}
                        onChange={handleChange('Feedback')}
                    />
                </div>
            </div>
        </FormModal>
    );
};

export default FeedbackModal;
