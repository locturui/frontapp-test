<script setup lang="ts">
import type { CandidateProfile } from '~/lib/types'

const { data: profile, pending, error } = await useFetch<CandidateProfile>('api/resume', {
  lazy: true,
  key: 'resume'
})

const formattedDescription = computed(() =>
  profile.value?.description
    ?.split('\r\n')
    .filter(line => line.trim() !== '')
    ?? []
)

const labels: Record<string, string> = {
  'new': 'Новое',
  'viewed': 'Просмотрено',
  'invited': 'Отправлено приглашение',
  'interview': 'Назначено собеседование',
  'no-show': 'Не дошел',
  'interviewed': 'Проведено собеседование',
  'awaiting-response': 'Ожидание ответа соискателя',
  'considering': 'Принятие решения',
  'accepted': 'Принят',
  'denied': 'Отклонено/Отказ',
  'archived': 'Архивировано'
}

const statusLabel = computed(() => {
  return labels[profile.value?.status ?? ''] || profile.value?.status
})
</script>

<template>
  <UCard v-if="profile" class="max-w-4xl mx-auto p-6">
    <template #header>
      <div class="flex justify-start space-x-2 mb-4 gap-2">
        <UButton icon="tabler:printer" color="primary" variant="soft" class="text-3xl" />
        <UButton icon="tabler:file-type-pdf" color="primary" variant="soft" class="text-3xl" />
        <UButton icon="tabler:file-type-doc" color="primary" variant="soft" class="text-3xl" />
        <UButton icon="tabler:file-pencil" color="primary" variant="soft" class="text-3xl" />
        <UButton icon="tabler:trash" color="error" variant="soft" class="text-3xl" />
        <UButton icon="i-heroicons-paper-clip" color="primary" variant="soft" class="text-3xl" />
        <UButton icon="i-heroicons-heart" color="primary" variant="soft" class="text-3xl" />
      </div>

      <div class="flex gap-6 items-start">
        <img :src="'https://dev.jobcart.ru' + profile.photo" class="max-w-32 max-h-70" >

        <div class="flex-1 space-y-1">
          <h2 class="text-2xl font-bold">
            {{ profile.name }}
            <Icon name="tabler:external-link" size="16"/>
          </h2>

          <p>Кандидат на вакансию: 
            <span class="text-primary underline">
              Жадный благотворитель
              <Icon name="tabler:external-link" size="16"/>
              ({{ profile.date }} Отклик)
            </span>
          </p>

          <p class="text-sm text-gray-400">{{ statusLabel }}</p>

          <p v-if="profile.age" class="text-sm text-gray-400">Возраст: {{ profile.age }}</p>
          <p v-else class="text-sm text-gray-400">Возраст не указан</p>

          <div class="flex items-center gap-4 mt-2">
            <div class="flex flex-col">
              <span class="inline-flex items-center text-green-400">
                <Icon name="tabler:phone" size="20" class="mr-1" />
                {{ profile.phone }}
              </span>
              <span class="inline-flex items-center text-green-400">
                <Icon name="tabler:mail" size="20" class="mr-1" />
                {{ profile.email }}
              </span>
            </div>
            
            <div class="flex gap-2">
              <UButton icon="tabler:phone" color="primary" variant="soft" class="text-2xl"/>
              <UButton icon="tabler:brand-whatsapp" color="primary" variant="soft" class="text-2xl"/>
              <UButton icon="tabler:brand-telegram" color="primary" variant="soft" class="text-2xl"/>
            </div>
          </div>
        </div>
      </div>
    </template>

    <h3 class="text-xl font-bold">Дела:</h3>
    <div class="flex gap-4 mt-6 flex-wrap">
      <UButton color="primary" variant="solid">Собеседование запланировано</UButton>
      <UButton color="primary" variant="outline">Создать видеозвонок</UButton>
      <UButton color="primary" variant="outline" disabled>Запланировать событие</UButton>
      <UButton color="primary" variant="outline">Отправить запрос</UButton>
    </div>

    <div class="mt-6">
      <h3 class="text-xl font-bold">Статус рассмотрения:</h3>
      <div class="flex flex-wrap gap-2 text-sm">
        <StatusStep :status-self="profile.status" :status-labels="labels"/>
      </div>
    </div>

    <template #footer>
      <div class="mt-4 text-l space-y-1">
        <p><span class="font-bold">Дата рождения: </span>{{ profile.birth_date }}</p>
        <p><span class="font-bold">Город: </span>{{ profile.town }}</p>
      </div>
      <h3 class="mt-10 mb-4 text-xl font-bold">Сопроводительное письмо</h3>
      <UCard v-if="profile?.description" class="space-y-2 text-sm leading-relaxed">
        <div v-for="(line, i) in formattedDescription" :key="i">
          <p v-if="line.includes(':')">
            <strong>{{ line.split(':')[0] }}:</strong> {{ line.split(':').slice(1).join(':').trim() }}
          </p>
          <p v-else-if="line.trim() !== ''">
            {{ line }}
          </p>
        </div>
      </UCard>
      <div class="mt-10 bg-gray-700 h-12 rounded-lg flex items-center justify-start p-10">
        <p class="text-cyan-300 inline-flex items-center">
          <Icon name="tabler:info-square-rounded-filled" size="48"/>
          Файлы портфолио:
        </p>
        <!-- Файлы (не нашел в апишке поля, надеюсь нормально) -->
      </div>
    </template>
  </UCard>

  <div v-else-if="pending" class="max-w-4xl mx-auto p-6 space-y-4">
    <UCard class="max-w-4xl mx-auto p-6 space-y-6">
      <div class="flex gap-2">
        <USkeleton v-for="i in 7" :key="i" class="h-10 w-10 rounded-md" />
      </div>

      <div class="flex gap-6 items-start mt-2">
        <USkeleton class="w-32 h-32 rounded" />

        <div class="flex-1 space-y-2">
          <USkeleton class="h-6 w-2/3" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-4 w-1/3" />
          <USkeleton class="h-4 w-1/4" />

          <div class="flex gap-4 mt-2">
            <div class="flex flex-col gap-2">
              <USkeleton class="h-4 w-40" />
              <USkeleton class="h-4 w-40" />
            </div>
            <div class="flex gap-2 mt-2">
              <USkeleton v-for="i in 3" :key="'contact-' + i" class="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 mt-4">
        <USkeleton v-for="i in 4" :key="'action-' + i" class="h-10 w-56 rounded-md" />
      </div>

      <div class="mt-10">
        <USkeleton class="h-6 w-40 mb-2" />
        <div class="flex flex-wrap gap-2">
          <USkeleton v-for="i in 6" :key="'step-' + i" class="h-8 w-36 rounded-md" />
        </div>
      </div>

      <div class="space-y-2 mt-2">
        <USkeleton class="h-4 w-1/3" />
        <USkeleton class="h-4 w-1/3" />
      </div>

      <USkeleton class="h-6 w-1/2 mt-10" />
      <USkeleton class="h-32 w-full rounded-md" />

      <div class="bg-gray-700 h-12 rounded-lg flex items-center justify-start p-10">
        <USkeleton class="h-8 w-1/3" />
      </div>
    </UCard>
  </div>

  <UAlert
    v-else-if="error"
    color="error"
    variant="soft"
    class="justify-center text-center py-6"
  >
    Ошибка загрузки профиля
  </UAlert>
</template>
