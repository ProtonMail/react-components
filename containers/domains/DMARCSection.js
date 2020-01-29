import React from 'react';
import { c } from 'ttag';
import { Alert, Label, Table, TableHeader, TableBody, TableRow } from 'react-components';

const DMARCSection = () => {
    const none = <strong key="none">p=none</strong>;
    const address = <strong key="address">address@yourdomain.com</strong>;
    return (
        <>
            <Alert learnMore="https://protonmail.com/support/knowledge-base/anti-spoofing/">
                {c('Info')
                    .t`If you have set both SPF and DKIM, DMARC allows you to specify how other email services should deliver email for your domain if both SPF and DKIM checks have failed. This can make it harder for spammers pretending to be you but may also cause delivery issues if not done properly. Feel free to ignore and skip DMARC unless you really want strict policies such as "p=quarantine" or "p=reject".`}
            </Alert>
            <Label>{c('Label').t`Here is a basic DMARC record that does nothing except email you reports.`}</Label>
            <Table>
                <TableHeader
                    cells={[
                        c('Header for domain modal').t`Type`,
                        c('Header for domain modal').t`Host name`,
                        c('Header for domain modal').t`Value / Data / Points to`
                    ]}
                />
                <TableBody>
                    <TableRow cells={['TXT', '_dmarc', 'v=DMARC1; p=none; rua=mailto:address@yourdomain.com']} />
                </TableBody>
            </Table>
            <Alert>
                {c('Info').jt`${none} has no effect on email delivery.`}
                <br />
                {c('Info').jt`${address} is where you will receive DMARC reports from other email services.`}
            </Alert>
        </>
    );
};

export default DMARCSection;
