import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Price, Icon, Info, Checkbox, Select, useToggle, SmallButton } from 'react-components';
import { c } from 'ttag';
import { range } from 'proton-shared/lib/helpers/array';
import { omit } from 'proton-shared/lib/helpers/object';
import { PLAN_SERVICES, ADDON_NAMES } from 'proton-shared/lib/constants';

import PlanPrice from './PlanPrice';
import { getTextOption, getPlan, getAddon, getSubTotal } from './helpers';
import AlertPromotion from './AlertPromotion';
import CycleDiscountBadge from '../CycleDiscountBadge';

const { VPN } = PLAN_SERVICES;

const CustomVPNSection = ({ plans, model, onChange }) => {
    const vpnBasicPlan = getPlan(plans, { name: 'vpnbasic' });
    const vpnPlusPlan = getPlan(plans, { name: 'vpnplus' });
    const vpnAddon = getAddon(plans, { name: ADDON_NAMES.VPN });
    const vpnOptions = range(5, 501).map((value, index) => ({
        text: getTextOption('vpn', value, index),
        value: index
    }));

    const { state, toggle } = useToggle();
    const subTotal = getSubTotal({ ...model, plans, services: VPN });

    const handleCheckboxChange = (key) => ({ target }) => {
        const toOmit = ['vpnbasic', 'vpnplus'];

        if (key !== 'plus' || !target.checked) {
            toOmit.push(ADDON_NAMES.VPN);
        }

        const plansMap = omit(model.plansMap, toOmit);

        if (target.checked) {
            plansMap[key] = 1;
        }

        onChange({ ...model, plansMap });
    };

    const handleSelectChange = ({ target }) => {
        onChange({ ...model, plansMap: { ...model.plansMap, [ADDON_NAMES.VPN]: +target.value } });
    };

    return (
        <>
            <Alert>{c('Info')
                .t`By using ProtonVPN to browse the web, your Internet connection is encrypted to ensure that your navigation is secure. ProtonVPN has servers located in 30+ countries around the world.`}</Alert>
            <AlertPromotion model={model} onChange={onChange} />
            <table className="pm-plans-table noborder">
                <thead>
                    <tr>
                        <th className="is-empty" />
                        <th scope="col" className="aligncenter">
                            BASIC
                        </th>
                        <th scope="col" className="aligncenter">
                            PLUS
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft bg-global-highlight">{c('Header')
                            .t`Pricing`}</th>
                        <td className="bg-global-highlight aligncenter">
                            <Price currency={model.currency} suffix={c('Suffix').t`/mo`}>
                                {vpnBasicPlan.Pricing[model.cycle] / model.cycle}
                            </Price>
                        </td>
                        <td className="bg-global-highlight aligncenter">
                            <Price currency={model.currency} suffix={c('Suffix').t`/mo`}>
                                {vpnPlusPlan.Pricing[model.cycle] / model.cycle}
                            </Price>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft">
                            <span className="mr0-5">{c('Header').t`Speed`}</span>
                            <Info title={c('Tooltip').t`Download and stream faster with a faster VPN connection.`} />
                        </th>
                        <td className="aligncenter">{c('VPN speed').t`High`}</td>
                        <td className="aligncenter">{c('VPN speed').t`Highest`}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft">
                            <span className="mr0-5">{c('Header').t`Simultaneous connections`}</span>
                            <Info
                                title={c('Tooltip')
                                    .t`More connections allows more devices to use ProtonVPN at the same time.`}
                            />
                        </th>
                        <td className="aligncenter">2</td>
                        <td className="aligncenter">5</td>
                    </tr>
                    {state ? (
                        <tr>
                            <th scope="row" className="pm-simple-table-row-th alignleft">{c('Header')
                                .t`Advanced encryption`}</th>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th scope="row" className="pm-simple-table-row-th alignleft">{c('Header')
                                .t`No logs policy`}</th>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th scope="row" className="pm-simple-table-row-th alignleft">{c('Header')
                                .t`No data limits`}</th>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    {state ? (
                        <tr>
                            <th scope="row" className="pm-simple-table-row-th alignleft">{c('Header')
                                .t`P2P support`}</th>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                            <td className="aligncenter">
                                <Icon name="on" />
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft">{c('Header')
                            .t`Secure streaming`}</th>
                        <td className="aligncenter">
                            <Icon name="off" />
                        </td>
                        <td className="aligncenter">
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft">
                            <span className="mr0-5">{c('Header').t`Tor over VPN`}</span>
                            <Info
                                url="https://protonvpn.com/support/tor-vpn/"
                                title={c('Tooltip').t`Easily route your traffic through the Tor anonymity network.`}
                            />
                        </th>
                        <td className="aligncenter">
                            <Icon name="off" />
                        </td>
                        <td className="aligncenter">
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft">
                            <span className="mr0-5">{c('Header').t`Secure core`}</span>
                            <Info
                                url="https://protonvpn.com/support/secure-core-vpn/"
                                title={c('Tooltip')
                                    .t`Additional protection by routing your traffic through multiple locations before leaving the ProtonVPN network.`}
                            />
                        </th>
                        <td className="aligncenter">
                            <Icon name="off" />
                        </td>
                        <td className="aligncenter">
                            <Icon name="on" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft ">
                            <SmallButton className="pm-button--link" onClick={toggle}>
                                {state ? c('Action').t`Hide additional features` : c('Action').t`Compare all features`}
                            </SmallButton>
                        </th>
                        <td className="aligncenter">
                            <Checkbox checked={!!model.plansMap.vpnbasic} onChange={handleCheckboxChange('vpnbasic')} />
                        </td>
                        <td className="aligncenter">
                            <Checkbox checked={!!model.plansMap.vpnplus} onChange={handleCheckboxChange('vpnplus')} />
                        </td>
                    </tr>
                </tbody>
            </table>
            {model.plansMap.vpnplus && model.plansMap.professional ? (
                <div className="flex flex-spacebetween pb1 border-bottom">
                    <div>
                        <Select
                            options={vpnOptions}
                            value={model.plansMap[ADDON_NAMES.VPN]}
                            onChange={handleSelectChange}
                        />
                        <Info
                            title={c('Tooltip')
                                .t`Order additional connections to provide ProtonVPN to other users with your organization`}
                        />
                    </div>
                    <div>
                        {model.plansMap[ADDON_NAMES.VPN] ? (
                            <PlanPrice
                                quantity={model.plansMap[ADDON_NAMES.VPN]}
                                currency={model.currency}
                                amount={vpnAddon.Pricing[model.cycle]}
                                cycle={model.cycle}
                            />
                        ) : (
                            '-'
                        )}
                    </div>
                </div>
            ) : null}
            <div className="flex flex-spacebetween pt1 pb1">
                <div className="bold">
                    ProtonVPN total <CycleDiscountBadge cycle={model.cycle} />
                </div>
                <div className="bold">
                    {subTotal ? (
                        <PlanPrice amount={subTotal} cycle={model.cycle} currency={model.currency} />
                    ) : (
                        c('Price').t`Free`
                    )}
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
