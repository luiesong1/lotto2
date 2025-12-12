const { override, fixBabelImports } = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          '@primary-color': '#0E6EB8',
          '@label-color': '#333333',
          '@text-color': '#333333',
          '@link-color': '#0E6EB8',
          '@menu-dark-inline-submenu-bg': '@primary-color',
          '@layout-sider-background': '@primary-color',
          '@menu-dark-bg': '@primary-color',
          '@menu-dark-item-active-bg':
            "color(~`colorPalette('@{primary-color}', 5) `);",
          //Input
          '@input-color': '#333333',
          // pageHeader
          '@page-header-padding': '0px',
        },
        javascriptEnabled: true,
      },
    },
  }),
);
