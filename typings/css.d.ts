declare module 'csstype' {
    // eslint-disable-next-line no-unused-vars
    interface Properties {
        // allow css variables
        [index: string]: unknown;
    }
}
