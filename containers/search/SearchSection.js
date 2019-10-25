import React from 'react';
import { c } from 'ttag';
import {
    SubTitle,
    Row,
    Label,
    Info,
    Toggle,
    Field,
    useMailSettings,
    useEventManager,
    useLoading,
    useApi
} from 'react-components';
import { updateAutoWildcardSearch } from 'proton-shared/lib/api/mailSettings';

const SearchSection = () => {
    const api = useApi();
    const { call } = useEventManager();
    const [{ AutoWildcardSearch }] = useMailSettings();
    const [loading, withLoading] = useLoading();
    return (
        <>
            <SubTitle>{c('Title').t`Search`}</SubTitle>
            <Row>
                <Label htmlFor="exactMatchToggle">
                    <span className="mr0-5">{c('Label').t`Require exact match`}</span>
                    <Info url="https://protonmail.com/support/knowledge-base/search/" />
                </Label>
                <Field>
                    <Toggle
                        loading={loading}
                        checked={!AutoWildcardSearch}
                        id="exactMatchToggle"
                        onChange={({ target: { checked } }) => {
                            withLoading(api(updateAutoWildcardSearch(+!checked)).then(call));
                        }}
                    />
                </Field>
            </Row>
        </>
    );
};

export default SearchSection;
