import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { groupWith, compare } from 'proton-shared/lib/helpers/array';
import { Details, Summary } from '../../../components';
import { useUser, useUserVPN } from '../../../hooks';
import { classnames } from '../../../helpers';
import { isSecureCoreEnabled } from './utils';
import ConfigsTable, { CATEGORY } from './ConfigsTable';
import Country from './Country';
import ServerNumber from './ServerNumber';
import CityNumber from './CityNumber';
import { isP2PEnabled, isTorEnabled } from './utils';
import { P2P, Tor } from './ConfigsTable';

const getServerNum = (server) => Number(server.Name.replace('-TOR', '').split('#')[1]);
const getServerRegion = (server) => server.Name.split('#')[0];
const serverRegionAsc = (a, b) => compare(getServerRegion(a), getServerRegion(b));
const serverNumAsc = (a, b) => compare(getServerNum(a), getServerNum(b));
const serverNameAsc = (a, b) => serverRegionAsc(a, b) || serverNumAsc(a, b);

const ServerConfigs = ({ servers, category, ...rest }) => {
    // Free servers at the top, then sorted by Name#ID
    const sortedGroups = useMemo(() => {
        const groupedServers = groupWith(
            (a, b) => a.Country === b.Country,
            servers.filter(({ Features = 0 }) => !isSecureCoreEnabled(Features))
        );

        return groupedServers.map((group) => {
            const freeServers = group.filter(({ Name }) => Name.includes('FREE')).sort(serverNameAsc);
            const otherServers = group.filter(({ Name }) => !Name.includes('FREE')).sort(serverNameAsc);
            return [...freeServers, ...otherServers];
        });
    }, [servers]);

    const [{ hasPaidVpn }] = useUser();
    const { result = {}, fetch: fetchUserVPN } = useUserVPN();

    const userVPN = result.VPN;
    const isBasicVPN = userVPN && userVPN.PlanName === 'vpnbasic';

    const isUpgradeRequired = (server) =>
        !userVPN || (!hasPaidVpn && server.Tier > 0) || (isBasicVPN && server.Tier === 2);

    useEffect(() => {
        fetchUserVPN();
    }, [hasPaidVpn]);

    return (
        <div className="mb1-5">
            {sortedGroups.map((group) => {
                const server = group[0];
                return (
                    <Details key={server.Country} open={server.open}>
                        <Summary>
                            <div className="ml0-5 flex flex-nowrap flex-items-center">
                                <div className={classnames([category === CATEGORY.SERVER ? 'w33' : ''])}>
                                    <Country server={server} />
                                </div>
                                {category === CATEGORY.SERVER ? (
                                    <div className="w33">
                                        <ServerNumber group={group} />
                                    </div>
                                ) : null}
                                {category === CATEGORY.SERVER ? (
                                    <div className="w33 flex flex-spacebetween">
                                        <CityNumber group={group} />
                                        <div className=" flex mr2">
                                            {category === CATEGORY.SERVER &&
                                            group.some((s) => isP2PEnabled(s.Features)) ? (
                                                <P2P />
                                            ) : null}{' '}
                                            {category === CATEGORY.SERVER &&
                                            group.some((s) => isTorEnabled(s.Features)) ? (
                                                <Tor />
                                            ) : null}{' '}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </Summary>
                        <div className="p1">
                            <ConfigsTable
                                {...rest}
                                category={category}
                                isUpgradeRequired={isUpgradeRequired}
                                servers={group}
                            />
                        </div>
                    </Details>
                );
            })}
        </div>
    );
};

ServerConfigs.propTypes = {
    servers: PropTypes.arrayOf(
        PropTypes.shape({
            ID: PropTypes.string,
            Country: PropTypes.string,
            EntryCountry: PropTypes.string,
            ExitCountry: PropTypes.string,
            Domain: PropTypes.string,
            Features: PropTypes.number,
            Load: PropTypes.number,
            Tier: PropTypes.number,
        })
    ),
};

export default ServerConfigs;
