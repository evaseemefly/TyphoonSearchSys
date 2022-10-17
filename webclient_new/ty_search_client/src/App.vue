<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<style lang="less" scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	background: #87a2bd;
	display: flex;
	height: 100vh !important;
	min-height: 100vh !important;
	flex-direction: column;
	// TODO:[-] 22-10-17 win 系统中的浏览器会出现垂直和水平的滚动条
	width: 100%;
}
</style>
