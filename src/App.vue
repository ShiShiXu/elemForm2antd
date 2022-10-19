<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="this.$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive" />
  </div>
</template>

<style lang="less">

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
