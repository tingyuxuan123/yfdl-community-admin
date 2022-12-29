<template>
  <div class="block">
    <div class="top">
      <div class="title">{{ title }}</div>
      <div class="icon">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="bottom">
      {{ data.tweenedNumber.toFixed(0) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap'
import { reactive, ref, watch } from 'vue'
type Props = {
  title?: string
  count?: number
  padding?: string
}

const data = reactive({
  tweenedNumber: 0
})

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  count: 0,
  padding: '20px'
})

watch(
  () => props.count,
  (newVal, oldVal) => {
    console.log(newVal)

    gsap.to(data, {
      duration: 1,
      tweenedNumber: newVal,
      ease: 'power2.out'
    })
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.block {
  width: 100%;
  height: 100%;
  font-size: 18px;
  padding: v-bind('props.padding');
  box-sizing: border-box;

  .top {
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: #8c8c8c;
    }
  }

  .bottom {
    height: calc(100% - 24px);
    display: flex;
    align-items: flex-end;
    font-size: 32px;
  }
}
</style>
