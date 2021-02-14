<template>
  <div class="w-full relative flex flex-col justify-between">
    <div
      class="w-full relative"
      @keydown.down="increment"
      @keydown.up="decrement"
      @keydown.enter="go"
    >
      <label for="search" class="sr-only">Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <IconSearch class="h-5 w-5 text-gray-500" />
        </div>
        <input
          id="search"
          ref="search"
          v-model="q"
          class="block w-full pl-10 pr-3 py-2 truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-700 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-200 dark:bg-gray-800"
          :class="{ 'rounded-b-none': focus && (searching || results.length) }"
          placeholder="搜索文档（按 “/” 聚焦）"
          type="search"
          autocomplete="off"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <ul
      v-show="focus && (searching || results.length)"
      class="z-10 absolute w-full flex-1 top-0 bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden"
      :class="{ 'rounded-t-none': focus && (searching || results.length) }"
      style="margin-top: 37px"
    >
      <li v-if="searching && !results.length" class="px-4 py-2">
        Searching...
      </li>
      <li
        v-for="(result, index) of results"
        :key="result.slug"
        @mouseenter="focusIndex = index"
        @mousedown="go"
      >
        <NuxtLink
          :to="result.to"
          class="flex px-4 py-2 items-center leading-5 transition ease-in-out duration-150"
          :class="{
            'text-primary-500 bg-gray-200 dark:bg-gray-800':
              focusIndex === index,
          }"
          @click="focus = false"
        >
          <span v-if="result.category" class="font-bold">{{
            result.category
          }}</span>
          <IconChevronRight v-if="result.category" class="w-3 h-3 mx-1" />
          {{ result.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {
      q: '',
      focus: false,
      focusIndex: -1,
      searching: false,
      results: [],
      onFocus: () => {},
      onBlur: () => {},
      keyup: () => {},
      increment: () => {},
      decrement: () => {},
      go: () => {},
    }
  },
})
</script>
