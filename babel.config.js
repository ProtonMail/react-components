import baseConfig from 'proton-shared/configs/babel.config.base';

module.exports = {
    presets: [...baseConfig.presets, '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [...baseConfig.plugins, 'transform-require-context']
};
