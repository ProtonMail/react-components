import React from 'react';
import { c } from 'ttag';

import { Icon, InlineLinkButton } from '../../../components';

interface Props {
    countMergeableContacts: number;
    onMerge: () => void;
}

const MergeContactBanner = ({ countMergeableContacts, onMerge }: Props) => {
    const mergeAction = <InlineLinkButton onClick={onMerge}>{c('Action').t`Merge`}</InlineLinkButton>;
    return (
        <div className="pl2 pr2 pt1 pb1 bg-weak flex flex-items-align-center flex-nowrap">
            <Icon name="merge" className="mr0-5" />
            <span>{c('Info, no need for singular')
                .jt`${countMergeableContacts} contacts look identical. ${mergeAction}`}</span>
        </div>
    );
};

export default MergeContactBanner;
