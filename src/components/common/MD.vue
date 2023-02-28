<template>
  <div v-html="htmlStr" class="markdown-body" id="mycss" ref="mdRef"></div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
let htmlStr = ref('')
let mdRef = ref<HTMLElement>()

type Props = {
  content: string
}

const props = defineProps<Props>()
const emits = defineEmits(['handleCatalogue'])

marked.setOptions({
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

htmlStr.value = marked(props.content)

//代码块高亮
nextTick(() => {
  const blocks = mdRef.value.querySelectorAll('pre code')
  blocks.forEach((block) => {
    // 创建ol标签元素
    let ol = document.createElement('ol')

    let copy = document.createElement('span')
    copy.className = 'copy'
    copy.textContent = '复制'
    copy.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent)

      copy.textContent = '复制成功'

      setTimeout(() => {
        copy.textContent = '复制'
      }, 3000)
    })

    block.parentNode.appendChild(copy)

    // 2.根据换行符获取行数，根据获取的行数生成行号
    let rowCount = block.outerHTML.split('\n').length

    for (let i = 1; i < rowCount; i++) {
      // 创建li标签元素
      let li = document.createElement('li')
      let text = document.createTextNode(i + '')
      // 将生成的行号添加到li标签中
      li.appendChild(text)
      // 将li标签添加到ol标签中
      ol.appendChild(li)
    }
    // 为ol标签添加class名
    ol.className = 'pre-numbering'
    block.parentNode.appendChild(ol)

    hljs.highlightElement(block as HTMLElement)
  })

  emits('handleCatalogue', getCatalogue())
})

const getCatalogue = () => {
  type catalogue = {
    title: string
    height: number
    children?: catalogue[]
  }
  let catalogues: catalogue[] = []

  let jump = mdRef.value.querySelectorAll('h1,h2,h3,h4,h5,h6')
  let currentIndex = null
  let currentposition: Array<Record<string, any>>
  let lastTime = null

  let headerHeight = 68

  jump.forEach((element) => {
    let el = element as HTMLElement
    let currentTime = parseInt(el.nodeName.charAt(el.nodeName.length - 1))
    if (lastTime == null) {
      catalogues.push({
        title: el.textContent,
        height: el.offsetTop - headerHeight,
        children: []
      })
      currentIndex = 0
      currentposition = catalogues
    } else if (lastTime < currentTime) {
      currentposition = currentposition[currentposition.length - 1].children

      currentposition.push({
        title: el.textContent,
        height: el.offsetTop - headerHeight,
        children: []
      })
    } else if (lastTime == currentTime) {
      currentposition.push({
        title: el.textContent,
        height: el.offsetTop - headerHeight, //68位header高度
        children: []
      })
    } else if (lastTime > currentIndex) {
      currentposition = catalogues
      currentposition.push({
        title: el.textContent,
        height: el.offsetTop - headerHeight,
        children: []
      })
    }

    lastTime = currentTime
  })

  // console.log(jump);
  // console.log(catalogues);

  return catalogues
}
</script>

<style scoped lang="scss">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  margin: 0 auto;
  /* padding: 45px; */

  :deep(pre) {
    position: relative;
    padding: 0 29px;
    overflow: hidden;
    font-size: 90%;
    line-height: 1.9;
    background: #282c34;

    &:hover {
      .copy {
        display: block;
      }
    }
  }

  :deep(.pre-numbering) {
    position: absolute;
    top: 0;
    left: 0;
    width: 29px;
    padding: 9px 7px 12px 0;
    border-right: 1px solid #c3ccd0;
    color: #fff;
    background: #282c34;
    text-align: right;
    font-size: 16px;
    line-height: 1.45;
    margin-top: 0.5rem;
  }

  :deep(.copy) {
    color: #fff;
    background-color: #9999aa;
    padding: 0px 10px;
    border-radius: 6px;
    position: absolute;
    top: 3px;
    right: 3px;
    cursor: pointer;
    display: none;
  }
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
