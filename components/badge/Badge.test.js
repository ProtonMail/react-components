import React from 'react';
import { render, waitForElement } from 'react-testing-library';

import Badge from './Badge';

it('renders badge with text', async () => {
    const { getByText } = render(<Badge>Success</Badge>);
    await waitForElement(() => getByText(/Success/i));
});
