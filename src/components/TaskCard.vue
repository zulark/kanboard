<template>
  <div 
    class="task-card group border-l-4 bg-white shadow-sm hover:shadow-md transition-all duration-200"
    :style="{ 
      borderLeftColor: statusColor,
      backgroundColor: statusBgColor + '40'
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Task Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="getTypeClass(task.type)"
        >
          {{ task.type }}
        </span>
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="getPriorityClass(task.priority)"
        >
          {{ task.priority }}
        </span>
      </div>
      
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click="$emit('edit', task)"
          class="p-1 text-gray-400 hover:text-blue-600 rounded"
          title="Editar"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button 
          @click="$emit('delete', task.id)"
          class="p-1 text-gray-400 hover:text-red-600 rounded"
          title="Excluir"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Task Title -->
    <h4 class="font-medium text-gray-900 mb-2 line-clamp-2">
      {{ task.title }}
    </h4>

    <!-- Task Description -->
    <p class="text-sm text-gray-600 mb-3 line-clamp-3">
      {{ task.description }}
    </p>

    <!-- Task Meta Info -->
    <div class="flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center gap-2">
        <ClockIcon class="h-4 w-4" />
        <span>{{ task.estimatedHours }}h</span>
      </div>
      <div class="flex items-center gap-2">
        <UserIcon class="h-4 w-4" />
        <span>{{ task.assignee }}</span>
      </div>
    </div>

    <!-- Status Actions -->
    <div class="mt-3 pt-3 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">
          {{ formatDate(task.createdAt) }}
        </span>
        
        <!-- <div class="flex gap-1 flex-wrap">
          <button
            v-for="status in sortedStatuses.filter(s => s.name !== task.status).slice(0, 3)"
            :key="status.id"
            @click="$emit('updateStatus', task.id, status.name)"
            class="px-2 py-1 text-xs rounded hover:opacity-80 transition-colors whitespace-nowrap"
            :style="{ 
              backgroundColor: status.bgColor,
              color: status.color,
              borderColor: status.borderColor
            }"
            :title="`Mover para ${status.name}`"
          >
            {{ status.name.length > 8 ? status.name.substring(0, 8) + '...' : status.name }}
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  PencilIcon, 
  TrashIcon, 
  ClockIcon, 
  UserIcon 
} from '@heroicons/vue/24/outline'
import { useTaskStatuses } from '../composables/useTaskStatuses.js'

const { sortedStatuses } = useTaskStatuses()

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  statusColor: {
    type: String,
    default: '#6b7280'
  },
  statusBgColor: {
    type: String,
    default: '#f9fafb'
  },
  statusBorderColor: {
    type: String,
    default: '#d1d5db'
  }
})

const emit = defineEmits(['edit', 'delete', 'updateStatus', 'dragStart', 'dragEnd'])

const getTypeClass = (type) => {
  const classes = {
    'Story': 'bg-blue-100 text-blue-800',
    'Task': 'bg-gray-100 text-gray-800',
    'Bug': 'bg-red-100 text-red-800',
    'Epic': 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority) => {
  const classes = {
    'Baixa': 'bg-green-100 text-green-800',
    'Média': 'bg-yellow-100 text-yellow-800',
    'Alta': 'bg-orange-100 text-orange-800',
    'Crítica': 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}

const handleDragStart = (event) => {
  // Define os dados que serão transferidos durante o drag
  event.dataTransfer.setData('application/json', JSON.stringify(props.task))
  event.dataTransfer.effectAllowed = 'move'
  
  // Adiciona classe CSS para feedback visual
  event.target.classList.add('dragging')
  
  // Emite evento para o componente pai
  emit('dragStart', props.task)
}

const handleDragEnd = (event) => {
  // Remove classe CSS
  event.target.classList.remove('dragging')
  
  // Emite evento para o componente pai
  emit('dragEnd', props.task)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
