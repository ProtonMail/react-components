import React from 'react';
import { ContactGroup } from 'proton-shared/lib/interfaces/contacts/Contact';

import LabelStack, { LabelDescription } from '../labelStack/LabelStack';

interface Props {
    contactGroups: ContactGroup[];
    isStacked?: boolean;
    className?: string;
}

const ContactGroupLabels = ({ contactGroups, isStacked = true, className }: Props) => {
    const labels = contactGroups.reduce((acc: LabelDescription[], contactGroup: ContactGroup) => {
        return contactGroup
            ? [
                  ...acc,
                  {
                      name: contactGroup.Name,
                      color: contactGroup.Color,
                      title: contactGroup.Name,
                  },
              ]
            : acc;
    }, []);

    return <LabelStack className={className} labels={labels} isStacked={isStacked} />;
};

export default ContactGroupLabels;
