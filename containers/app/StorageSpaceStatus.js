import React, { useState } from 'react';
import { c } from 'ttag';
import { CircularProgress, Dropdown, Icon, generateUID, useUser, usePopperAnchor } from 'react-components';
import humanSize from 'proton-shared/lib/helpers/humanSize';

const StorageSpaceStatus = () => {
    const [{ MaxSpace, UsedSpace }] = useUser();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    const usedPercent = Math.round(UsedSpace / MaxSpace);
    const maxSpaceFormatted = humanSize(MaxSpace);
    const usedSpaceFormatted = humanSize(UsedSpace);

    return (
        <>
            <CircularProgress
                className="center"
                progress={usedPercent}
                aria-describedby={uid}
                rootRef={anchorRef}
                onClick={toggle}
            >
                <text
                    x="50%"
                    y="50%"
                    fontFamily="Constantia"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    stroke="#ffffff"
                >
                    i
                </text>
            </CircularProgress>
            <span className="center opacity-40 smaller storage">{usedSpaceFormatted}</span>
            <Dropdown
                id={uid}
                isOpen={isOpen}
                anchorRef={anchorRef}
                onClose={close}
                originalPlacement="left-bottom"
                auto
            >
                <div className="dropDown-content p1">
                    <div className="absolute top-right mt0-5 mr0-5">
                        <button className="flex flex-items-center">
                            <Icon name="close" />
                        </button>
                    </div>
                    <div className="flex">
                        <div className="pr1 flex flex-items-center">
                            <div className="relative">
                                <CircularProgress progress={usedPercent} size={100} backgroundColor="#eeeeee" />
                                <span className="centered-absolute">{usedPercent}%</span>
                            </div>
                        </div>
                        <div className="w150p">
                            <div className="big mt0 mb0">Storage</div>
                            <div className="small color-black mt0 mb0">
                                {usedSpaceFormatted} of {maxSpaceFormatted} used
                            </div>
                            <p className="smaller opacity-40 mt0 mb1">
                                Your storage space is shared across all Proton products.
                            </p>
                            <a href="/settings/subscription" className="pm-button-blue">{c('Action').t`Upgrade`}</a>
                        </div>
                    </div>
                </div>
            </Dropdown>
        </>
    );
};

export default StorageSpaceStatus;
