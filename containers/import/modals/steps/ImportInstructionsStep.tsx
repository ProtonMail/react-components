import React, { useState } from 'react';
import { c } from 'ttag';

import gmailImapFolderImg from 'design-system/assets/img/import-instructions/gmail-folder-imap.jpg';
import gmailImapImg from 'design-system/assets/img/import-instructions/gmail-imap.jpg';
import gmailLessSecureAppsImg from 'design-system/assets/img/import-instructions/gmail-less-secure-apps.jpg';
import gmailAppPasswordImg from 'design-system/assets/img/import-instructions/gmail-2FA.jpg';
import yahooAppPasswordImg from 'design-system/assets/img/import-instructions/yahoo.jpg';

import { Alert, Button, Icon, Tabs } from '../../../../components';

import { PROVIDER_INSTRUCTIONS } from '../../interfaces';

interface Props {
    changeProvider: (provider: PROVIDER_INSTRUCTIONS) => void;
    provider?: PROVIDER_INSTRUCTIONS;
    instructionsCurrentStep: number;
}

const ImportInstructionsStep = ({ changeProvider, provider, instructionsCurrentStep }: Props) => {
    const [tabIndex, setTabIndex] = useState(0);
    const gmailTabs = [
        {
            title: c('Import instructions tab title').t`2-step verification disabled (default settings)`,
            content: (
                <>
                    <div>
                        {c('Import instructions')
                            .t`Go to myaccount.google.com. In the Security section, turn on access for less secure apps. If you don't see this option, you might have 2-step verification enabled.`}
                    </div>
                    <img
                        src={gmailLessSecureAppsImg}
                        alt={c('Import instructions image alternative text')
                            .t`How to turn on access for Less Secure Apps in Gmail settings`}
                    />
                </>
            ),
        },
        {
            title: c('Import instructions tab title').t`2-step verification enabled`,
            content: (
                <>
                    <div>
                        {c('Import instructions')
                            .t`Go to myaccount.google.com. In the Security section, create an app password if you don't have one already. You will need this password during the import.`}
                    </div>
                    <img
                        src={gmailAppPasswordImg}
                        alt={c('Import instructions image alternative text')
                            .t`How to create an app password in Gmail setings`}
                    />
                </>
            ),
        },
    ];
    const handleChangeIndex = (index: number) => setTabIndex(index);

    const renderGmail = () => {
        switch (instructionsCurrentStep) {
            case 0:
                return (
                    <>
                        <div>
                            {c('Import instructions')
                                .t`In your Gmail Settings, go to Forwarding and POP/IMAP and make sure that IMAP access is enabled.`}
                        </div>
                        <img
                            src={gmailImapImg}
                            alt={c('Import instructions image alternative text')
                                .t`How to enable IMAP Forwarding in Gmail setings`}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <div>
                            {c('Import instructions')
                                .t`In the Labels section, choose the folders allowed for import into ProtonMail.`}
                        </div>
                        <img
                            src={gmailImapFolderImg}
                            alt={c('Import instructions image alternative text')
                                .t`How to show folders in IMAP in Gmail setings`}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <div>
                            {c('Import instructions')
                                .t`Allow ProtonMail access into your Gmail account: choose whether 2-step verification is enabled and follow the steps below.`}
                        </div>
                        <Tabs tabs={gmailTabs} value={tabIndex} onChange={handleChangeIndex} />
                    </>
                );
            default:
                return null;
        }
    };

    const renderNoProviderChosen = () => {
        return (
            <>
                <Alert className="mb1">
                    {c('Info').t`To prepare your external account for import, please follow the instructions for:`}
                </Alert>

                <div className="mb1">
                    <Button
                        onClick={() => changeProvider(PROVIDER_INSTRUCTIONS.GMAIL)}
                        className="inline-flex flex-items-center"
                    >
                        <span>{c('Provider').t`Gmail`}</span>
                        <Icon
                            name="caret"
                            className="ml0-5"
                            style={{
                                transform: 'rotate(-90deg)',
                            }}
                        />
                    </Button>
                </div>

                <div className="mb1">
                    <Button
                        onClick={() => changeProvider(PROVIDER_INSTRUCTIONS.YAHOO)}
                        className="inline-flex flex-items-center"
                    >
                        <span>{c('Provider').t`Yahoo Mail`}</span>
                        <Icon
                            name="caret"
                            className="ml0-5"
                            style={{
                                transform: 'rotate(-90deg)',
                            }}
                        />
                    </Button>
                </div>

                <Alert>
                    {c('Info')
                        .t`If you are using a different email provider or your account is already prepared, you can skip to import.`}
                </Alert>
            </>
        );
    };

    const renderYahoo = () => {
        return (
            <>
                <div>
                    {c('Import instructions')
                        .t`Log into Yahoo Mail and click on your name in the upper right corner to access Account info. In the Account security section, go to Manage app passwords to generate a password. You will need this password during the import.`}
                </div>
                <img
                    src={yahooAppPasswordImg}
                    alt={c('Import instructions image alternative text')
                        .t`How to create an app password in Gmail setings`}
                />
            </>
        );
    };

    const renderWithProvider = () => (provider === PROVIDER_INSTRUCTIONS.GMAIL ? renderGmail() : renderYahoo());

    return provider ? renderWithProvider() : renderNoProviderChosen();
};

export default ImportInstructionsStep;
