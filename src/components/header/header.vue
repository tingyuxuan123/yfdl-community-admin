<template>
  <div class="blog-header">
    <slot name="header-left"></slot>
    <slot name="header-right"></slot>
  </div>
</template>

<script lang="ts" setup name="header">
import { reactive, ref } from 'vue'
</script>

<style scoped lang="less">
.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
