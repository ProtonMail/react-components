import React from 'react';
import { c } from 'ttag';

import TopNavbarListItemButton, { TopNavbarListItemButtonProps } from './TopNavbarListItemButton';
import { Icon } from '../icon';

const TopNavbarListItemSearchButton = React.forwardRef(
    (props: Omit<TopNavbarListItemButtonProps<'button'>, 'icon' | 'text' | 'as'>, ref: typeof props.ref) => {
        return (
            <TopNavbarListItemButton
                {...props}
                ref={ref}
                as="button"
                type="button"
                icon={<Icon name="search" />}
                title={c('Header').t`Search`}
                text={c('Header').t`Search`}
            />
        );
    }
);

export default TopNavbarListItemSearchButton;
