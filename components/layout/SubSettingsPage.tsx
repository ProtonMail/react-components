import React from 'react';

import { SubTitle } from '../../index';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    id: string;
    children: React.ReactNode;
}

const SubSettingsPage = ({ title, id, children, ...rest }: Props) => {
    return (
        <div id={id} {...rest}>
            <SubTitle>{title}</SubTitle>
            {children}
        </div>
    );
};
export default SubSettingsPage;
