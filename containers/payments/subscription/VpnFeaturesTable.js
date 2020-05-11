import React from 'react';
import PropTypes from 'prop-types';
import { usePlans, useVPNCountries, Loader, Info } from 'react-components';
import { toMap } from 'proton-shared/lib/helpers/object';
import { PLANS } from 'proton-shared/lib/constants';
import { c } from 'ttag';

import SubscriptionPrices from './SubscriptionPrices';

const VpnFeaturesTable = ({ cycle, currency }) => {
    const [vpnCountries, loadingVpnCountries] = useVPNCountries();
    const [plans, loadingPlans] = usePlans();
    const plansMap = toMap(plans, 'Name');

    if (loadingPlans || loadingVpnCountries) {
        return <Loader />;
    }

    return (
        <>
            <table className="pm-simple-table pm-simple-table--alternate-bg-row pm-simple-table--bordered w100">
                <thead>
                    <tr>
                        <th className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Free</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} />
                        </th>
                        <th className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Basic</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.VPNBASIC]} />
                        </th>
                        <th className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Plus</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.VPNPLUS]} />
                        </th>
                        <th className="aligncenter aligntop pm-simple-table-row-th pt1">
                            <div className="uppercase">Visionary</div>
                            <SubscriptionPrices cycle={cycle} currency={currency} plan={plansMap[PLANS.VISIONARY]} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{c('Feature').t`1 VPN connection`}</td>
                        <td>{c('Feature').t`2 VPN connections`}</td>
                        <td>{c('Feature').t`5 VPN connections`}</td>
                        <td>{c('Feature').t`10 VPN connections`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`Servers in ${vpnCountries.free.length} countries`}</td>
                        <td>{c('Feature').t`Servers in ${vpnCountries.basic.length} countries`}</td>
                        <td>{c('Feature').t`Servers in ${vpnCountries.all.length} countries`}</td>
                        <td>{c('Feature').t`Servers in ${vpnCountries.all.length} countries`}</td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`Medium speed`}</td>
                        <td>{c('Feature').t`High speed`}</td>
                        <td>{c('Feature').t`Highest speed (10 Gbps)`}</td>
                        <td>{c('Feature').t`Highest speed (10 Gbps)`}</td>
                    </tr>
                    <tr>
                        <td>
                            <del className="mr0-5">{c('Feature').t`P2P filesharing/BitTorrent support`}</del>
                            <Info
                                title={c('Info').t`Support for file sharing protocols such as BitTorrent.`}
                                url="https://protonvpn.com/support/p2p-vpn-redirection/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`P2P filesharing/BitTorrent support`}</span>
                            <Info
                                title={c('Info').t`Support for file sharing protocols such as BitTorrent.`}
                                url="https://protonvpn.com/support/p2p-vpn-redirection/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`P2P filesharing/BitTorrent support`}</span>
                            <Info
                                title={c('Info').t`Support for file sharing protocols such as BitTorrent.`}
                                url="https://protonvpn.com/support/p2p-vpn-redirection/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`P2P filesharing/BitTorrent support`}</span>
                            <Info
                                title={c('Info').t`Support for file sharing protocols such as BitTorrent.`}
                                url="https://protonvpn.com/support/p2p-vpn-redirection/"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Secure Core VPN`}</del>
                            <Info
                                title={c('Info')
                                    .t`Defends against threats to VPN privacy by passing your Internet traffic through multiple servers.`}
                                url="https://protonvpn.com/support/secure-core-vpn/"
                            />
                        </td>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Secure Core VPN`}</del>
                            <Info
                                title={c('Info')
                                    .t`Defends against threats to VPN privacy by passing your Internet traffic through multiple servers.`}
                                url="https://protonvpn.com/support/secure-core-vpn/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Secure Core VPN`}</span>
                            <Info
                                title={c('Info')
                                    .t`Defends against threats to VPN privacy by passing your Internet traffic through multiple servers.`}
                                url="https://protonvpn.com/support/secure-core-vpn/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Secure Core VPN`}</span>
                            <Info
                                title={c('Info')
                                    .t`Defends against threats to VPN privacy by passing your Internet traffic through multiple servers.`}
                                url="https://protonvpn.com/support/secure-core-vpn/"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Tor over VPN`}</del>
                            <Info
                                title={c('Info')
                                    .t`Route your Internet traffic through the Tor network with a single click.`}
                                url="https://protonvpn.com/support/tor-vpn/"
                            />
                        </td>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Tor over VPN`}</del>
                            <Info
                                title={c('Info')
                                    .t`Route your Internet traffic through the Tor network with a single click.`}
                                url="https://protonvpn.com/support/tor-vpn/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Tor over VPN`}</span>
                            <Info
                                title={c('Info')
                                    .t`Route your Internet traffic through the Tor network with a single click.`}
                                url="https://protonvpn.com/support/tor-vpn/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Tor over VPN`}</span>
                            <Info
                                title={c('Info')
                                    .t`Route your Internet traffic through the Tor network with a single click.`}
                                url="https://protonvpn.com/support/tor-vpn/"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Access blocked content`}</del>
                            <Info
                                title={c('Info')
                                    .t`Access geo-blocked content (Netflix, Amazon Prime Video, BBC iPlayer, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                                url="https://protonvpn.com/support/streaming-guide/"
                            />
                        </td>
                        <td>
                            <del className="mr0-5">{c('Feature').t`Access blocked content`}</del>
                            <Info
                                title={c('Info')
                                    .t`Access geo-blocked content (Netflix, Amazon Prime Video, BBC iPlayer, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                                url="https://protonvpn.com/support/streaming-guide/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Access blocked content`}</span>
                            <Info
                                title={c('Info')
                                    .t`Access geo-blocked content (Netflix, Amazon Prime Video, BBC iPlayer, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                                url="https://protonvpn.com/support/streaming-guide/"
                            />
                        </td>
                        <td>
                            <span className="mr0-5">{c('Feature').t`Access blocked content`}</span>
                            <Info
                                title={c('Info')
                                    .t`Access geo-blocked content (Netflix, Amazon Prime Video, BBC iPlayer, Wikipedia, Facebook, Youtube, etc) no matter where you are.`}
                                url="https://protonvpn.com/support/streaming-guide/"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{c('Feature').t`ProtonMail (optional) *`}</td>
                        <td>{c('Feature').t`ProtonMail (optional) *`}</td>
                        <td>{c('Feature').t`ProtonMail (optional) *`}</td>
                        <td>{c('Feature').t`ProtonMail included`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`No logs/No ads`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Perfect Forward Secrecy (PFS)`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`AES-256 encryption`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`DNS leak protection`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Kill switch`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Always-on VPN`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`100% anonymous`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Split tunneling support`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Swiss based`}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{c('Feature').t`Professional support`}</td>
                    </tr>
                </tbody>
            </table>
            <p className="small mt1 mb0">* {c('Info concerning plan features').t`Denotes customizable features`}</p>
        </>
    );
};

VpnFeaturesTable.propTypes = {
    cycle: PropTypes.number,
    currency: PropTypes.string
};

export default VpnFeaturesTable;
