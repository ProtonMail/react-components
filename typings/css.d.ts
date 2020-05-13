declare module 'csstype' {
    interface Properties {
        // allow css variables
        [index: string]: unknown;
    }
}
