import React, { Ref } from 'react';
import { classnames, TopBanners } from '../../index';
import PrivateContentContainer from './PrivateContentContainer';
import PrivateContent from './PrivateContent';
import PrivateMainContainer from './PrivateMainContainer';
import PrivateMainAreaContainer from './PrivateMainAreaContainer';

interface Props {
    containerRef?: Ref<HTMLDivElement>;
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    isBlurred?: boolean;
    hasTopBanners?: boolean;
}

const PrivateAppContainer = ({
    header,
    sidebar,
    children,
    hasTopBanners = true,
    isBlurred = false,
    containerRef
}: Props) => {
    return (
        <PrivateContentContainer className={classnames([isBlurred && 'filter-blur'])} ref={containerRef}>
            {hasTopBanners ? <TopBanners /> : null}
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
