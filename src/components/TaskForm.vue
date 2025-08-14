<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ task ? 'Editar Tarefa' : 'Nova Tarefa' }}
        </h3>
        <button 
          @click="$emit('cancel')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Título da Tarefa *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Implementar sistema de login"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Descreva os detalhes da tarefa..."
          ></textarea>
        </div>

        <!-- Type and Priority Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Type -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecione um tipo</option>
              <option v-for="type in taskTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
              Prioridade *
            </label>
            <select
              id="priority"
              v-model="form.priority"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecione uma prioridade</option>
              <option v-for="priority in priorities" :key="priority" :value="priority">
                {{ priority }}
              </option>
            </select>
          </div>
        </div>

        <!-- Status and Hours Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecione um status</option>
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <!-- Estimated Hours -->
          <div>
            <label for="estimatedHours" class="block text-sm font-medium text-gray-700 mb-2">
              Estimativa (horas) *
            </label>
            <input
              id="estimatedHours"
              v-model.number="form.estimatedHours"
              type="number"
              min="0.5"
              step="0.5"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: 8"
            />
          </div>
        </div>

        <!-- Assignee -->
        <div>
          <label for="assignee" class="block text-sm font-medium text-gray-700 mb-2">
            Responsável *
          </label>
          <input
            id="assignee"
            v-model="form.assignee"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nome do programador responsável"
          />
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('cancel')"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-primary"
          >
            {{ task ? 'Atualizar' : 'Criar' }} Tarefa
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  taskTypes: {
    type: Array,
    required: true
  },
  priorities: {
    type: Array,
    required: true
  },
  statuses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  title: '',
  description: '',
  type: '',
  priority: '',
  status: 'To Do',
  estimatedHours: 1,
  assignee: ''
})

// Watch for task prop changes to populate form when editing
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      type: newTask.type || '',
      priority: newTask.priority || '',
      status: newTask.status || 'To Do',
      estimatedHours: newTask.estimatedHours || 1,
      assignee: newTask.assignee || ''
    }
  } else {
    // Reset form for new task
    form.value = {
      title: '',
      description: '',
      type: '',
      priority: '',
      status: 'To Do',
      estimatedHours: 1,
      assignee: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', { ...form.value })
}
</script>
