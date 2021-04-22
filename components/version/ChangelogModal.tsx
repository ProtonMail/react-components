import React, { useState } from 'react';
import { c } from 'ttag';
import markdownit from 'markdown-it';

import { FormModal } from '../modal';
import './ChangeLogModal.scss';
import { getAppVersion } from '../../helpers';

const md = markdownit('default', {
    breaks: true,
    linkify: true,
});

interface Props {
    changelog?: string;
}

const ChangelogModal = ({ changelog = '', ...rest }: Props) => {
    const [html] = useState(() => {
        const modifiedChangelog = changelog.toString().replace(/\[(\d+\.\d+\.\d+[^\]]*)]/g, (match, capture) => {
            return `[${getAppVersion(capture)}]`;
        });
        return {
            __html: md.render(modifiedChangelog),
        };
    });

    return (
        <FormModal title={c('Title').t`Release notes`} close={c('Action').t`Close`} submit={null} {...rest}>
            <div className="modal-content-inner-changelog" dangerouslySetInnerHTML={html} />
        </FormModal>
    );
};

export default ChangelogModal;
