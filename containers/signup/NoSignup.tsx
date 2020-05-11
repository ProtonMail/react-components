import React from 'react';
import { Alert, Link } from 'react-components';
import { c } from 'ttag';

const NoSignup = () => {
    return (
        <div className="pl2 pr2">
            <Alert className="mb1" type="error">{c('Error')
                .t`TODO Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vestibulum dolor sed nisi suscipit, vitae gravida mauris lobortis. Ut porttitor leo vitae augue vestibulum commodo. Aenean tempor nisl quis ligula sagittis, at sollicitudin ante dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</Alert>
            <Link to="TODO">{c('Link').t`Continue on website`}</Link>
        </div>
    );
};

export default NoSignup;
