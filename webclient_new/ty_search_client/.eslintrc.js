module.exports = {
	root: true,
	env: {
		node: true,
	},
	// 注意一下的插件为 vue-cli2 创建工程时默认设置的，请不要修改，会出现无法使用 eslint 的问题
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
		// indent: ['off'],
		// .eslintrc.js: 	Configuration for rule "indent" is invalid: 	Severity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '4').
		indent: [0, 'tab'],
		'no-const-assign': 2, //禁止修改const声明的变量
		'no-dupe-args': 2, //函数参数不能重复
		'no-dupe-class-members': 2, //不允许类中出现重复的声明
		'no-dupe-keys': 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
		'no-duplicate-case': 2, //switch中的case标签不能重复
		'no-func-assign': 2, //禁止重复的函数声明
		'@typescript-eslint/no-this-alias': [
			// 不允许使用 this
			'warn',
			// {
			// 	allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
			// 	allowedNames: ['self'], // Allow `const self = this`; `[]` by default
			// },
		],
		'@typescript-eslint/ban-ts-comment': ['warn'],
		'no-case-declarations': ['warn'], // 在 case 子句中不允许定义变量
		'@typescript-eslint/no-empty-function': ['warn'], // 方法可以为空方法
		strict: 0,
	},
}
