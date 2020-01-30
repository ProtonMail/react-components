import React from 'react';
import PropTypes from 'prop-types';
import { Icon, TreeView } from 'react-components';

const ROOT = '0';

const buildTreeView = (items = [], parents = {}) => {
    return items.map((item) => {
        return (
            <TreeView
                key={item.ID}
                icon={<Icon name="folder" color={item.Color} />}
                name={item.Name}
                toggled={!!item.Expanded}
                title={item.Path}
            >
                {buildTreeView(parents[item.ID], parents)}
            </TreeView>
        );
    });
};

const getParents = (items = []) => {
    return items.reduce((acc, item) => {
        const { ParentID = ROOT } = item;
        acc[ParentID] = acc[ParentID] || [];
        acc[ParentID].push(item);
        return acc;
    }, {});
};

const FolderTreeViewList = ({ items = [] }) => {
    const parents = getParents(items);
    const rootFolders = items.filter(({ ParentID = ROOT }) => ParentID === ROOT);

    const treeview = {
        name: '',
        toggled: true,
        disabled: true,
        children: buildTreeView(rootFolders, parents)
    };

    return <TreeView {...treeview} />;
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
