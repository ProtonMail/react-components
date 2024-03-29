import React from 'react';
import { c, msgid } from 'ttag';
import { DomainsModel } from 'proton-shared/lib/models';
import { loadModels } from 'proton-shared/lib/models/helper';

import { Button, Loader } from '../../components';
import { useApi, useCache, useOrganization, useDomains, useModals, useLoading } from '../../hooks';
import DomainModal from './DomainModal';
import DomainsTable from './DomainsTable';
import RestoreAdministratorPrivileges from '../organization/RestoreAdministratorPrivileges';
import useDomainsAddresses from '../../hooks/useDomainsAddresses';
import { SettingsParagraph, SettingsSectionWide } from '../account';

const DomainsSection = () => {
    const api = useApi();
    const cache = useCache();
    const [domains, loadingDomains] = useDomains();
    const [domainsAddressesMap, loadingDomainsAddressesMap] = useDomainsAddresses(domains);
    const [organization, loadingOrganization] = useOrganization();
    const [loading, withLoading] = useLoading();
    const { createModal } = useModals();

    const allModelsArePresent = domains && domainsAddressesMap && organization;

    if (!allModelsArePresent && (loadingDomains || loadingDomainsAddressesMap || loadingOrganization)) {
        return <Loader />;
    }

    const { UsedDomains, MaxDomains } = organization;

    const handleRefresh = async () => {
        await loadModels([DomainsModel], { api, cache, useCache: false });
    };

    return (
        <SettingsSectionWide>
            <RestoreAdministratorPrivileges />
            <SettingsParagraph learnMoreUrl="https://protonmail.com/support/categories/custom-domains/">
                {c('Message')
                    .t`Set up a custom domain email address (e.g., you@yourcompany.com). It only takes a few minutes, and our wizard will guide you through the process.`}
            </SettingsParagraph>
            <div className="mb1">
                <Button color="norm" onClick={() => createModal(<DomainModal />)} className="mr1">
                    {c('Action').t`Add domain`}
                </Button>
                <Button loading={loading || loadingDomainsAddressesMap} onClick={() => withLoading(handleRefresh())}>{c(
                    'Action'
                ).t`Refresh status`}</Button>
            </div>
            {!domains.length ? null : <DomainsTable domains={domains} domainsAddressesMap={domainsAddressesMap} />}
            <div className="mb1 color-weak">
                {UsedDomains} / {MaxDomains} {c('Info').ngettext(msgid`domain used`, `domains used`, UsedDomains)}
            </div>
        </SettingsSectionWide>
    );
};

export default DomainsSection;
