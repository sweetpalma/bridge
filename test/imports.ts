import { expect, describe, it } from 'vitest'
import * as VueFunctions from 'vue'
import { defaultPresets } from '../src/imports/presets'

const excludedVueHelpers = [
  // Already globally registered
  'defineEmits',
  'defineExpose',
  'defineProps',
  'withDefaults',
  'stop',
  //
  'default',
  'set',
  'del',
  //
  '__esModule',
  'devtools',
  'EffectScope',
  'ReactiveEffect',
  'stop',
  'camelize',
  'capitalize',
  'normalizeClass',
  'normalizeProps',
  'normalizeStyle',
  'toDisplayString',
  'toHandlerKey',
  'BaseTransition',
  'Comment',
  'Fragment',
  'KeepAlive',
  'Static',
  'Suspense',
  'Teleport',
  'Text',
  'callWithAsyncErrorHandling',
  'callWithErrorHandling',
  'cloneVNode',
  'compatUtils',
  'createBlock',
  'createCommentVNode',
  'createElementBlock',
  'createElementVNode',
  'createHydrationRenderer',
  'createPropsRestProxy',
  'createRenderer',
  'createSlots',
  'createStaticVNode',
  'createTextVNode',
  'createVNode',
  'getTransitionRawChildren',
  'guardReactiveProps',
  'handleError',
  'initCustomFormatter',
  'isMemoSame',
  'isRuntimeOnly',
  'isVNode',
  'mergeDefaults',
  'mergeProps',
  'openBlock',
  'popScopeId',
  'pushScopeId',
  'queuePostFlushCb',
  'registerRuntimeCompiler',
  'renderList',
  'renderSlot',
  'resolveComponent',
  'resolveDirective',
  'resolveDynamicComponent',
  'resolveFilter',
  'resolveTransitionHooks',
  'setBlockTracking',
  'setDevtoolsHook',
  'setTransitionHooks',
  'ssrContextKey',
  'ssrUtils',
  'toHandlers',
  'transformVNodeArgs',
  'useSSRContext',
  'version',
  'warn',
  'watchPostEffect',
  'watchSyncEffect',
  'withAsyncContext',
  'Transition',
  'TransitionGroup',
  'VueElement',
  'createApp',
  'createSSRApp',
  'defineCustomElement',
  'defineSSRCustomElement',
  'hydrate',
  'initDirectivesForSSR',
  'render',
  'useCssVars',
  'vModelCheckbox',
  'vModelDynamic',
  'vModelRadio',
  'vModelSelect',
  'vModelText',
  'vShow',
  'compile'
]

describe('auto-imports:vue', () => {
  for (const name of Object.keys(VueFunctions)) {
    if (excludedVueHelpers.includes(name)) {
      continue
    }
    it(`should register ${name} globally`, () => {
      expect(defaultPresets.find(a => a.from === 'vue').imports).toContain(name)
    })
  }
})
