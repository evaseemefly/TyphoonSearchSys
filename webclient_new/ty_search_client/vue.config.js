const { defineConfig } = require('@vue/cli-service')
const debug = process.env.NODE_ENV !== 'production'
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
	transpileDependencies: true,
	productionSourceMap: true,
	// configureWebpack: (config) => {
	//     // webpack配置，值位对象时会合并配置，为方法时会改写配置
	//     if (debug) {
	//         // 开发环境配置
	//         config.devtool = 'cheap-module-eval-source-map'
	//     } else {
	//         // 生产环境配置
	//     }
	// },
	devServer: {
		// 由之前的 'localhost'改为如下，端口默认8080
		host: '0.0.0.0',
		port: '8081',
		// options has an unknown property 'overlay'. These properties are valid:
		// overlay: {
		// 	warnings: false,
		// 	errors: false,
		// },
	},
}