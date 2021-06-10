import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ApiContext from '../../api/apiContext';
import TopNavbarListItemContactsDropdown from './TopNavbarListItemContactsDropdown';
import { ModalsProvider } from '../../modals';
import NotificationsProvider from '../../notifications/Provider';
import { CONTACT_WIDGET_TABS, CustomAction } from './types';
import { CacheProvider } from '../../cache';
import createCache from '../../../../shared/lib/helpers/cache';

jest.mock('../../../hooks/useUserSettings', () => () => [{}, jest.fn()]);

function renderComponent({ customActions }: { customActions: CustomAction[] }) {
    return (
        <NotificationsProvider>
            <ApiContext.Provider value={jest.fn().mockRejectedValue(Promise.resolve({}))}>
                <ModalsProvider>
                    <CacheProvider cache={createCache()}>
                        <TopNavbarListItemContactsDropdown customActions={customActions} />
                    </CacheProvider>
                </ModalsProvider>
            </ApiContext.Provider>
        </NotificationsProvider>
    );
}

describe('TopNavbarListItemContactsDropdown', () => {
    it('should display custom actions', () => {
        const customAction1 = {
            render: () => <p>custom action 1</p>,
            tabs: [CONTACT_WIDGET_TABS.CONTACTS],
        };
        const customAction2 = {
            render: () => <p>custom action 2</p>,
            tabs: [CONTACT_WIDGET_TABS.GROUPS],
        };
        const customActions = [customAction1];

        const { rerender } = render(renderComponent({ customActions }));

        expect(screen.queryByText('custom action')).toBeFalsy();

        fireEvent.click(screen.getByTitle('View contacts'));

        expect(screen.getByText('custom action 1')).toBeInTheDocument();

        customActions.push(customAction2);

        rerender(renderComponent({ customActions }));

        expect(screen.getByText('custom action 1')).toBeInTheDocument();
        expect(screen.queryByText('custom action 2')).toBeFalsy();

        fireEvent.click(screen.getByText('Groups'));

        expect(screen.queryByText('custom action 1')).toBeFalsy();
        expect(screen.getByText('custom action 2')).toBeInTheDocument();
    });
});
