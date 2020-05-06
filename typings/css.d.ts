import { Properties as BaseProperties } from 'csstype';

declare module 'csstype' {
    interface Properties extends BaseProperties {
        // allow css variables
        [index: string]: unknown;
    }
}
