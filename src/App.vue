<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="this.$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive" />
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif -webkit-font-smoothing antialiased -moz-osx-font-smoothing grayscale;
  color: #2c3e50;
}

div,
section {
  &:focus {
    outline: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

}
</style>
