import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { classnames, Icon, TreeView } from 'react-components';
import { orderBy } from 'proton-shared/lib/helpers/array';
import { c } from 'ttag';

import ActionsLabel from './ActionsLabel';
import ToggleNotify from './ToggleNotify';

const ROOT = '0';
const IN = 'in';
const AFTER = 'after';
const BEFORE = 'before';

const getParents = (items = []) => {
    return items.reduce((acc, item) => {
        const { ParentID = ROOT } = item;
        acc[ParentID] = acc[ParentID] || [];
        acc[ParentID].push(item);
        return acc;
    }, {});
};

const Header = () => {
    return (
        <div className="flex flex-nowrap w100">
            <span className="bold uppercase flex-item-fluid">
                <Icon name="arrow-cross" className="mr1" />
                {c('Header').t`Name`}
            </span>
            <span className="bold uppercase w140e">{c('Header').t`Notification`}</span>
            <span className="bold uppercase w140e">{c('Header').t`Action`}</span>
        </div>
    );
};

const orderFolders = (folders = []) => orderBy(folders, 'Order');

const FolderTreeViewList = ({ items = [] }) => {
    const [grabbed, setGrabbed] = useState();
    const [position, setPosition] = useState();
    const overRef = useRef();
    const timeoutRef = useRef();
    const parents = getParents(items);
    const rootFolders = items.filter(({ ParentID = ROOT }) => ParentID === ROOT);

    const clearGrabbed = () => {
        timeoutRef.current = setTimeout(() => setGrabbed(null), 200);
    };

    const buildTreeView = (items = [], level = 0) => {
        return orderFolders(items).map((item) => {
            const isOverred = item.ID === overRef.current;
            return (
                <TreeView
                    onDragStart={() => {
                        setGrabbed(item.ID);
                    }}
                    onDragEnd={() => {
                        clearGrabbed();
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        const { currentTarget, clientY } = event;
                        const { height, y } = currentTarget.getBoundingClientRect();
                        overRef.current = item.ID;
                        const quarter = height / 4;
                        const pointer = clientY - y;

                        if (pointer < quarter) {
                            setPosition(BEFORE);
                        } else if (pointer > quarter * 3) {
                            setPosition(AFTER);
                        } else {
                            setPosition(IN);
                        }
                    }}
                    onDrop={() => {
                        if (grabbed === overRef.current) {
                            return;
                        }
                        // console.log({ grabbed, position, dest: overRef.current });
                    }}
                    draggable={true}
                    key={item.ID}
                    toggled={true}
                    title={item.Path}
                    content={
                        <div
                            className={classnames([
                                'flex flex-nowrap flex-items-center flex-spacebetween w100 pt0-5 pb0-5 treeview-item',
                                isOverred && position === BEFORE && 'border-top',
                                isOverred && position === AFTER && 'border-bottom',
                                isOverred && position === IN && 'bg-global-highlight'
                            ])}
                        >
                            <div className="treeview-item-name flex flex-nowrap flex-items-center flex-item-fluid">
                                <Icon name="text-justify" className="mr1 flex-item-noshrink" />
                                <Icon name="folder" className="mr0-5 flex-item-noshrink" />
                                <span>{item.Name}</span>
                            </div>
                            <div className="treeview-toggle w140e">
                                <ToggleNotify label={item} />
                            </div>
                            <div className="treeview-actions w140e flex flex-column flex-items-end">
                                <div className="mtauto mbauto">
                                    <ActionsLabel label={item} />
                                </div>
                            </div>
                        </div>
                    }
                >
                    {buildTreeView(parents[item.ID], level + 1)}
                </TreeView>
            );
        });
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <>
            <Header />
            {buildTreeView(rootFolders)}
        </>
    );
};

FolderTreeViewList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            ID: PropTypes.string.isRequired,
            ParentID: PropTypes.string,
            Name: PropTypes.string.isRequired,
            Path: PropTypes.string.isRequired,
            Color: PropTypes.string.isRequired,
            Type: PropTypes.number.isRequired,
            Notify: PropTypes.number.isRequired,
            Order: PropTypes.number.isRequired,
            Expanded: PropTypes.number.isRequired,
            Sticky: PropTypes.number.isRequired
        })
    )
};

export default FolderTreeViewList;
