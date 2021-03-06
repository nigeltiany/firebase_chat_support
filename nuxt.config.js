const path = require('path')
const clientSourceDir = 'client/'
module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'starter',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Nuxt.js project' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
        ],
        script: [
            { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2HVq5gvnkTo-O-YnvntxsvDW-vH0CwTM&libraries=places' }
        ]
    },
    srcDir: clientSourceDir,
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#3B8070' },
    /*
    ** Build configuration
    */
    build: {
        vendor: ['vuetify'],
        extractCSS: true,
        extend (config, { isClient, isServer }) {
            if (isServer) {
                config.resolve.alias['_firebase'] = path.join(__dirname, clientSourceDir, 'firebase/server_firebase.js')
            } else if (isClient) {
                config.resolve.alias['_firebase'] = path.join(__dirname, clientSourceDir, 'firebase/client_firebase.js')
            }
        }
    },
    plugins: [
        '~plugins/plugins.js',
        // { src: '~plugins/client_only.js', ssr: false }
    ],
    css: [
        { src: '~assets/style/app.styl', lang: 'styl' }
    ],
    ssr: false,
    generate: {
        ssr: false,
        dir: '.static_client',
        minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            removeAttributeQuotes: false,
            removeComments: true,
            removeEmptyAttributes: false,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: false,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true
        }
    }
}
