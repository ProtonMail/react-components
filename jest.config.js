// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('proton-shared/configs/jest.config.base');

module.exports = {
    ...baseConfig,
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|scss|less)$': '<rootDir>/__mocks__/styleMock.js',
        pmcrypto: '<rootDir>/__mocks__/pmcrypto.js',
        'sieve.js': '<rootDir>/__mocks__/sieve.js'
    }
};
