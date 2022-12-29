<template>
  <div
    v-if="isExte"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  ></div>
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts" setup name="SvgIcon">
import { reactive, ref, computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
  iconClass: String,
  className: String
})

const attr = defineEmits({})

const isExte = computed(() => {
  return isExternal(props.iconClass)
})
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon' + props.className
  } else {
    return 'svg-icon'
  }
})

const styleExternalIcon = computed(() => {
  return {
    mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
  }
})
</script>

<style scoped lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
