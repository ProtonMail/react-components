import React from 'react';
import { c } from 'ttag';
import { Bordered, Icon, Block, Href, SimpleDropdown, DropdownMenu } from '../../../components';

interface Props {
    title: string;
    link: string;
    icon: string;
    moreOption?: boolean;
}

const VPNClientCard = ({ title, link, icon, moreOption }: Props) => {
    return (
        <Bordered className="mr1 aligncenter relative">
            <div>
                <Icon size={24} name={icon} />
            </div>
            <Block>{title}</Block>
            <div className="flex mt1 flex-justify-center">
                <Href url={link} className="pm-button increase-surface-click">
                    {c('Action').t`Download`}
                    <span className="sr-only">{title}</span>
                </Href>
                {moreOption ? (
                    <SimpleDropdown
                        className="pm-button pm-button--for-icon relative"
                        title={c('Title').t`More download options`}
                        content={null}
                    >
                        <DropdownMenu className="p1">
                            <p>More download options:</p>
                            <p>
                                Direct APK link:
                                <a href="https://protonvpn.com/download/ProtonVPN.apk">
                                    https://protonvpn.com/download/ProtonVPN.apk
                                </a>
                            </p>

                            <p>
                                GitHub:
                                <a href="https://github.com/ProtonVPN/android-app/releases">
                                    https://github.com/ProtonVPN/android-app/releases
                                </a>
                            </p>
                            <p>
                                F-Droid:
                                <a href="https://f-droid.org/en/packages/ch.protonvpn.android/">
                                    https://f-droid.org/en/packages/ch.protonvpn.android/
                                </a>
                            </p>
                        </DropdownMenu>
                    </SimpleDropdown>
                ) : null}
            </div>
        </Bordered>
    );
};

export default VPNClientCard;
