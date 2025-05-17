<script setup lang="ts">
const statusDict = [
  'new', 'viewed', 'invited', 'interview', 'no-show',
  'interviewed', 'awaiting-response', 'considering',
  'accepted', 'denied', 'archived'
]

const props = defineProps<{
    statusSelf: string,
    statusLabels: Record<string, string>,
}>()


const currentIndex = computed(() =>
  statusDict.indexOf(props.statusSelf)
)
</script>

<template>
  <div class="flex flex-wrap gap-2 mt-6">
    <div
      v-for="(status, index) in statusDict"
      :key="status"
      class="relative flex text-white overflow-hidden"
    >
      <div
        class="px-4 py-2 text-sm font-medium"
        :class="{
          'bg-purple-700': index === currentIndex,
          'bg-purple-600': index < currentIndex,
          'bg-purple-400': index > currentIndex
        }"
      >
        {{ statusLabels[status] }}
      </div>
      <div
        class="h-full w-3"
        :class="{
          'bg-purple-700': index === currentIndex,
          'bg-purple-600': index < currentIndex,
          'bg-purple-400': index > currentIndex
        }"
        style="clip-path: polygon(0% 0%, 100% 50%, 0% 100%)"
      />
    </div>
  </div>
</template>
