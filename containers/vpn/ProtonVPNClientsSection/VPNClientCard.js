import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Bordered, Icon, Block, Href, Tooltip } from '../../../components';

const VPNClientCard = ({ title, link, icon, tooltip }) => {
    return (
        <Bordered className="mr1 aligncenter relative">
            <div>
                <Icon size={24} name={icon} />
            </div>
            <div className="flex flex-justify-center">
                <Block>{title}</Block>
                {tooltip ? (
                    <Tooltip title={tooltip}>
                        <Icon name="info" size={12} className="ml0-25" />
                    </Tooltip>
                ) : null}
            </div>
            <Href url={link} className="pm-button increase-surface-click">
                {c('Action').t`Download`}
                <span className="sr-only">{title}</span>
            </Href>
        </Bordered>
    );
};

VPNClientCard.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
};

export default VPNClientCard;
