import React from 'react';
import { usePermissions } from '../../hooks';
import { classnames } from '../../helpers';

import Sections from './Sections';
import { SectionConfig } from '../../components/layout';

const IndexSection = ({ pages }: { pages: SectionConfig[] }) => {
    const permissions = usePermissions();
    return (
        <div className="overview-grid">
            {pages.map(({ text, to, subsections = [], permissions: pagePermissions }) => {
                return (
                    <section
                        key={to}
                        className={classnames([
                            'overview-grid-item bordered-container bg-white-dm tiny-shadow-container p2',
                            subsections.length > 3 && 'overview-grid-item--tall'
                        ])}
                    >
                        <h2 className="h6 mb1">
                            <strong>{text}</strong>
                        </h2>
                        <Sections
                            to={to}
                            subsections={subsections}
                            text={text}
                            permissions={permissions}
                            pagePermissions={pagePermissions}
                        />
                    </section>
                );
            })}
        </div>
    );
};

export default IndexSection;
