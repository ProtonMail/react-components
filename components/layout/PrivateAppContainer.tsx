import React, { Ref } from 'react';
import PrivateContentContainer from './PrivateContentContainer';
import PrivateContent from './PrivateContent';
import PrivateMainContainer from './PrivateMainContainer';
import { PrivateMainAreaContainer } from './index';
import { classnames, TopBanners } from '../../index';

interface Props {
    containerRef?: Ref<HTMLDivElement>;
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    isBlurred?: boolean;
}

const PrivateAppContainer = ({ header, sidebar, children, isBlurred = false, containerRef }: Props) => {
    return (
        <PrivateContentContainer className={classnames([isBlurred && 'filter-blur'])} ref={containerRef}>
            <TopBanners />
            <PrivateContent>
                {header}
                <PrivateMainContainer>
                    {sidebar}
                    <PrivateMainAreaContainer>{children}</PrivateMainAreaContainer>
                </PrivateMainContainer>
            </PrivateContent>
        </PrivateContentContainer>
    );
};

export default PrivateAppContainer;
