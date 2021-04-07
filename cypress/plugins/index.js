/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const webpackConfig = require('../webpack.config.js');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
    if (config.testingType === 'component') {
        const { startDevServer } = require('@cypress/webpack-dev-server');
        on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));
        return config;
    }
    on('file:preprocessor', webpackPreprocessor(webpackConfig));
    return config;
};
