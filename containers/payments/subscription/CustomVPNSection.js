import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Price, Icon, Info, Checkbox, Select, useToggle, SmallButton } from 'react-components';
import { c } from 'ttag';
import { range } from 'proton-shared/lib/helpers/array';
import { omit } from 'proton-shared/lib/helpers/object';

import { getTextOption, getPlan, getAddon, getTotal } from './helpers';
import CyclePromotion from './CyclePromotion';

const vpnOptions = range(5, 501).map((value, index) => ({
    text: getTextOption('vpn', value, index),
    value: index
}));

const CustomVPNSection = ({ plans, model, onChange }) => {
    const vpnBasicPlan = getPlan(plans, { name: 'vpnbasic', cycle: model.cycle });
    const vpnPlusPlan = getPlan(plans, { name: 'vpnplus', cycle: model.cycle });
    const vpnAddon = getAddon(plans, { name: '1vpn', cycle: model.cycle });
    const { state, toggle } = useToggle();

    const handleCheckboxChange = (key) => ({ target }) => {
        const toOmit = ['vpnbasic', 'vpnplus'];

        if (key !== 'plus' || !target.checked) {
            toOmit.push('vpn');
        }

        const plansMap = omit(model.plansMap, toOmit);

        if (target.checked) {
            plansMap[key] = 1;
        }

        onChange({ ...model, plansMap });
    };

    const handleSelectChange = ({ target }) => {
        onChange({ ...model, plansMap: { ...model.plansMap, ['1vpn']: +target.value } });
    };

    const total = getTotal({ ...model, plans });

    return (
        <>
            <Alert>{c('Info')
                .t`By using ProtonVPN to browser the web, your Internet connection is encrypted to ensure that your navigation is secure. ProtonVPN has servers located in 30+ countries around the world.`}</Alert>
            <CyclePromotion model={model} onChange={onChange} />
            <table className="pm-simple-table">
                <thead>
                    <tr>
                        <th />
                        <th>Basic</th>
                        <th>Plus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{c('Header').t`Pricing`}</th>
                        <td>
                            <Price currency={model.currency} suffix={c('Suffix').t`/mo`}>
                                {vpnBasicPlan.Amount / vpnBasicPlan.Cycle}
                            </Price>
                        </td>
                        <td>
                            <Price currency={model.currency} suffix={c('Suffix').t`/mo`}>
                                {vpnPlusPlan.Amount / vpnPlusPlan.Cycle}
                            </Price>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {c('Header').t`Speed`}{' '}
                            <Info title={c('Tooltip').t`Download and stream faster with a faster VPN connection.`} />
                        </th>
                        <td>{c('VPN speed').t`High`}</td>
                        <td>{c('VPN speed').t`Highest`}</td>
                    </tr>
                    <tr>
                        <th>
                            {c('Header').t`Simultaneous connections`}{' '}
                            <Info
                                title={c('Tooltip')
                                    .t`More connections allows more devices to use ProtonVPN at the same time.`}
                            />
                        </th>
                        <td>2</td>
                        <td>5</td>
                    </tr>
                    {state ? (
                        <tr>
                            <th>{c('Header').t`Advanced encryption`}</th>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th>{c('Header').t`No logs policy`}</th>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th>{c('Header').t`No data limits`}</th>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th>{c('Header').t`P2P support`}</th>
                            <td>
                                <Icon name="on" />
                            </td>
                            <td>
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <th>{c('Header').t`Secure streaming`}</th>
                        <td>
                            <Icon name="off" />
                        </td>
                        <td>
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {c('Header').t`Tor over VPN`}{' '}
                            <Info
                                url="https://protonvpn.com/support/tor-vpn/"
                                title={c('Tooltip').t`Easily route your traffic through the Tor anonymity network.`}
                            />
                        </th>
                        <td>
                            <Icon name="off" />
                        </td>
                        <td>
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            {c('Header').t`Secure core`}{' '}
                            <Info
                                url="https://protonvpn.com/support/secure-core-vpn/"
                                title={c('Tooltip')
                                    .t`Additional protection by routing your traffic through multiple locations before leaving the ProtonVPN network.`}
                            />
                        </th>
                        <td>
                            <Icon name="off" />
                        </td>
                        <td>
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <SmallButton onClick={toggle}>
                                {state ? c('Action').t`Hide additional features` : c('Action').t`Compare all features`}
                            </SmallButton>
                        </td>
                        <td>
                            <Checkbox checked={!!model.plansMap.vpnbasic} onChange={handleCheckboxChange('vpnbasic')} />
                        </td>
                        <td>
                            <Checkbox checked={!!model.plansMap.vpnplus} onChange={handleCheckboxChange('vpnplus')} />
                        </td>
                    </tr>
                </tbody>
            </table>
            {model.plansMap.vpnplus ? (
                <div className="flex flex-spacebetween mb1 border-bottom">
                    <div>
                        <Select options={vpnOptions} value={model.plansMap['1vpn']} onChange={handleSelectChange} />
                    </div>
                    <div>
                        {model.plansMap['1vpn'] ? (
                            <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                                {vpnAddon.Amount / vpnAddon.Cycle}
                            </Price>
                        ) : (
                            '-'
                        )}
                    </div>
                </div>
            ) : null}
            <div className="flex flex-spacebetween mb1">
                <div className="bold">{c('Label').t`Total`}</div>
                <div>
                    <Price currency={model.currency} suffix={c('Suffix').t`/ month`}>
                        {total / model.cycle}
                    </Price>
                </div>
            </div>
        </>
    );
};

CustomVPNSection.propTypes = {
    plans: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CustomVPNSection;
