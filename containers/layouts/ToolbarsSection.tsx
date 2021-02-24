import React from 'react';
import { c } from 'ttag';
import { updateMessageButtons } from 'proton-shared/lib/api/mailSettings';
import { MESSAGE_BUTTONS } from 'proton-shared/lib/constants';
import { ButtonGroup, Group, Row, Label, Field, Radio } from '../../components';
import { useEventManager, useMailSettings, useNotifications, useApiWithoutResult } from '../../hooks';

const { READ_UNREAD, UNREAD_READ } = MESSAGE_BUTTONS;

const ToolbarsSection = () => {
    const { request, loading } = useApiWithoutResult(updateMessageButtons);
    const [{ MessageButtons = 0 } = {}] = useMailSettings();
    const { createNotification } = useNotifications();
    const { call } = useEventManager();

    const hanldeChange = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const newState = parseInt(target.value, 10);
        await request(newState);
        await call();
        createNotification({
            text: c('Success').t`Buttons position saved`,
        });
    };

    return (
        <>
            <Row>
                <Label>{c('Label').t`Read/unread order`}</Label>
                <Field>
                    <div className="mb1">
                        <Radio
                            id="read-unread"
                            name="read-unread"
                            checked={MessageButtons === READ_UNREAD}
                            disabled={loading}
                            onChange={hanldeChange}
                            value={READ_UNREAD}
                        >
                            <Group className="ml1 no-pointer-events">
                                <ButtonGroup icon="read" title={c('Action').t`Read`} />
                                <ButtonGroup icon="unread" title={c('Action').t`Unread`} />
                            </Group>
                        </Radio>
                    </div>
                    <div>
                        <Radio
                            id="unread-read"
                            name="unread-read"
                            checked={MessageButtons === UNREAD_READ}
                            disabled={loading}
                            onChange={hanldeChange}
                            value={UNREAD_READ}
                        >
                            <Group className="ml1 no-pointer-events">
                                <ButtonGroup icon="unread" title={c('Action').t`Unread`} />
                                <ButtonGroup icon="read" title={c('Action').t`Read`} />
                            </Group>
                        </Radio>
                    </div>
                </Field>
            </Row>
        </>
    );
};

export default ToolbarsSection;
