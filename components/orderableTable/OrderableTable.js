import React from 'react';

import { Table } from '../table';
import OrderableContainer from '../orderable/OrderableContainer';
import './OrderableTable.scss';

const OrderableTable = ({ children, className, caption, ...props }) => (
    <OrderableContainer helperClass="orderableHelper pm-simple-table" {...props}>
        <Table caption={caption} className={`orderableTable ${className}`}>
            {children}
        </Table>
    </OrderableContainer>
);

OrderableTable.propTypes = Table.propTypes;

export default OrderableTable;
