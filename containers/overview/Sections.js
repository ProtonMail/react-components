import React from 'react';
import PropTypes from 'prop-types';
import { hasPermission } from 'proton-shared/lib/helpers/permissions';

import LinkItem from './LinkItem';

const Sections = ({ route, sections = [], text, permissions = [], pagePermissions, history }) => {
    return (
        <ul className="unstyled mt0-5">
            {sections.length ? (
                sections
                    .reduce((acc, { text, id, hide }) => {
                        if (!hide) {
                            acc.push({ text, id, route: { pathname: route, hash: id } });
                        }
                        return acc;
                    }, [])
                    .map(({ text, id, route, permissions: sectionPermissions }) => {
                        return (
                            <li key={id}>
                                <LinkItem
                                    route={route}
                                    text={text}
                                    permission={hasPermission(permissions, pagePermissions, sectionPermissions)}
                                    history={history}
                                />
                            </li>
                        );
                    })
            ) : (
                <li>
                    <LinkItem
                        route={{ pathname: route }}
                        text={text}
                        permission={hasPermission(permissions, pagePermissions)}
                        history={history}
                    />
                </li>
            )}
        </ul>
    );
};

Sections.propTypes = {
    route: PropTypes.string,
    sections: PropTypes.array,
    text: PropTypes.string,
    permissions: PropTypes.array,
    pagePermissions: PropTypes.array,
    history: PropTypes.object.isRequired
};

export default Sections;
