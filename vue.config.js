module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/mds':{
                target:'http://10.16.98.192:20508',
                changeOrigin:true,
                pathRewrite:{
                    '/mds':''
                }
            }
        }
    }
}
