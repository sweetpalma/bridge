import { createHead, renderHeadToString } from '@vueuse/head'
import { computed, ref, watchEffect, onBeforeUnmount, getCurrentInstance, ComputedGetter } from 'vue'
import { defu } from 'defu'
import type { MetaObject } from '@nuxt/schema'
import { defineNuxtPlugin } from '../app'

export default defineNuxtPlugin((nuxtApp) => {
  const head = createHead()

  nuxtApp.vueApp.use(head)

  let headReady = false
  nuxtApp.hooks.hookOnce('app:mounted', () => {
    watchEffect(() => { head.updateDOM() })
    headReady = true
  })

  const titleTemplate = ref<MetaObject['titleTemplate']>()

  nuxtApp._useHead = (_meta: MetaObject | ComputedGetter<MetaObject>) => {
    const meta = ref<MetaObject>(_meta)
    if ('titleTemplate' in meta.value) {
      titleTemplate.value = meta.value.titleTemplate
    }

    const headObj = computed(() => {
      const overrides: MetaObject = { meta: [] }
      if (titleTemplate.value && meta.value.title) {
        overrides.title = typeof titleTemplate.value === 'function' ? titleTemplate.value(meta.value.title) : titleTemplate.value.replace(/%s/g, meta.value.title)
      }
      if (meta.value.charset) {
        overrides.meta!.push({ key: 'charset', charset: meta.value.charset })
      }
      if (meta.value.viewport) {
        overrides.meta!.push({ name: 'viewport', content: meta.value.viewport })
      }
      return defu(overrides, meta.value)
    })
    head.addHeadObjs(headObj as any)

    if (process.server) { return }

    if (headReady) {
      watchEffect(() => { head.updateDOM() })
    }

    const vm = getCurrentInstance()
    if (!vm) { return }

    onBeforeUnmount(() => {
      head.removeHeadObjs(headObj as any)
      head.updateDOM()
    })
  }

  if (process.server && nuxtApp.ssrContext) {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head)
  }
})
