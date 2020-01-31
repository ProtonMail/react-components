import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, TreeView } from 'react-components';

import ActionsLabel from './ActionsLabel';

const ROOT = '0';

const getParents = (items = []) => {
    return items.reduce((acc, item) => {
        const { ParentID = ROOT } = item;
        acc[ParentID] = acc[ParentID] || [];
        acc[ParentID].push(item);
        return acc;
    }, {});
};

const DropArea = ({ onDragOver, onDrop }) => {
    const [hover, setHover] = useState(false);
    return (
        <div
            onDrop={(event) => {
                setHover(false);
                onDrop && onDrop(event);
            }}
            onDragOver={(event) => {
                setHover(true);
                onDragOver && onDragOver(event);
            }}
            onDragLeave={() => setHover(false)}
            style={{
                backgroundColor: hover ? 'coral' : 'lightyellow',
                height: '1em'
            }}
        />
    );
};

DropArea.propTypes = {
    onDragOver: PropTypes.func,
    onDrop: PropTypes.func
};

const FolderTreeViewList = ({ items = [] }) => {
    const [grabbed, setGrabbed] = useState();
    const overRef = useRef();
    const timeoutRef = useRef();
    const parents = getParents(items);
    const rootFolders = items.filter(({ ParentID = ROOT }) => ParentID === ROOT);

    const clearGrabbed = () => {
        timeoutRef.current = setTimeout(() => setGrabbed(null), 200);
    };

    const buildTreeView = (items = [], level = 0) => {
        return items.map((item) => {
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
                        overRef.current = item.ID;
                    }}
                    onDrop={() => {
                        if (grabbed === overRef.current) {
                            return;
                        }
                    }}
                    draggable={true}
                    key={item.ID}
                    toggled={true}
                    title={item.Path}
                    content={
                        <>
                            {grabbed && grabbed !== item.ID ? (
                                <DropArea
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        overRef.current = `before:${item.ID}`;
                                    }}
                                    onDrop={() => clearGrabbed()}
                                />
                            ) : null}
                            <div className="flex flex-nowrap flex-spacebetween pl1 pr1 pt0-5 pb0-5 border-bottom">
                                <div>
                                    <Icon name="text-justify" className="mr1" />
                                    <Icon name="folder" className={`ml${level} mr0-5`} />
                                    <span>{item.Name}</span>
                                </div>
                                <ActionsLabel label={item} />
                            </div>
                            {grabbed && grabbed !== item.ID ? (
                                <DropArea
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        overRef.current = `after:${item.ID}`;
                                    }}
                                    onDrop={() => clearGrabbed()}
                                />
                            ) : null}
                        </>
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

    return <div className="folderTreeViewList-container">{buildTreeView(rootFolders)}</div>;
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
