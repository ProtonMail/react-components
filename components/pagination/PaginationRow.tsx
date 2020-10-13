import React from 'react';
import { c } from 'ttag';
import { range } from 'proton-shared/lib/helpers/array';

import { Group, ButtonGroup } from '../button';
import { Icon } from '../icon';
import { classnames } from '../../helpers';

interface Props {
    onStart: () => void;
    onEnd: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onPage: (pageNumber: number) => void;
    page: number;
    total: number;
    disabled?: boolean;
    step?: number;
}

const PaginationRow = ({ onStart, onEnd, onPrevious, onNext, onPage, page, disabled, total, step = 1 }: Props) => {
    const pages = range(page - step, page + step).filter((pageNumber) => pageNumber > 0 && pageNumber <= total);
    const goToPageTitle = c('Action').t`Go to page ${page}`;
    return (
        <Group>
            <ButtonGroup
                disabled={disabled || page === 1}
                onClick={() => onStart()}
                title={c('Action').t`Go to first page`}
            >
                <Icon name="TODO" />
            </ButtonGroup>
            <ButtonGroup
                disabled={disabled || page === 1}
                onClick={() => onPrevious()}
                title={c('Action').t`Go to previous page`}
            >
                <Icon name="TODO" />
            </ButtonGroup>
            {pages.map((pageNumber) => {
                const isActive = pageNumber === page;
                return (
                    <ButtonGroup
                        disabled={disabled || isActive}
                        className={classnames([isActive && 'is-active'])}
                        key={pageNumber}
                        title={goToPageTitle}
                        onClick={() => onPage(pageNumber)}
                    >
                        {pageNumber}
                    </ButtonGroup>
                );
            })}
            <ButtonGroup
                disabled={disabled || page === total}
                onClick={() => onNext()}
                title={c('Action').t`Go to next page`}
            >
                <Icon name="TODO" />
            </ButtonGroup>
            <ButtonGroup
                disabled={disabled || page === total}
                onClick={() => onEnd()}
                title={c('Action').t`Go to last page`}
            >
                <Icon name="TODO" />
            </ButtonGroup>
        </Group>
    );
};

export default PaginationRow;
