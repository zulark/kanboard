<template>
  <div 
    class="task-card group border-l-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
    :style="cardStyle"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
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
          class="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded"
          title="Editar"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button 
          @click="$emit('delete', task.id)"
          class="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded"
          title="Excluir"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Task Title -->
    <h4 class="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
      {{ task.title }}
    </h4>

    <!-- Task Description -->
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
      {{ task.description }}
    </p>

    <!-- Task Meta Info -->
    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(task.createdAt) }}
        </span>
        
        <!-- <div class="flex gap-1 flex-wrap">
          <button
            v-for="status in sortedStatuses.filter(s => s.name !== task.status).slice(0, 2)"
            :key="status.id"
            @click="$emit('updateStatus', task.id, status.name)"
            class="px-2 py-1 text-xs rounded hover:opacity-80 transition-colors whitespace-nowrap"
            :style="getStatusButtonStyle(status)"
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
import { useTheme } from '../composables/useTheme.js'
import { computed, ref } from 'vue'

const { sortedStatuses } = useTaskStatuses()
const { isDarkMode } = useTheme()

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
  statusBgColorDark: {
    type: String,
    default: '#1f2937'
  },
  statusBorderColor: {
    type: String,
    default: '#d1d5db'
  }
})

const emit = defineEmits(['edit', 'delete', 'updateStatus', 'dragStart', 'dragEnd'])

const hexToRgba = (hex, alpha) => {
  if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    // Retorna uma cor padrão ou transparente se o formato for inválido
    return 'transparent';
  }
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  const r = (c >> 16) & 255;
  const g = (c >> 8) & 255;
  const b = c & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const cardStyle = computed(() => {
  const bgColor = isDarkMode.value ? props.statusBgColorDark : props.statusBgColor
  return {
    borderLeftColor: props.statusColor,
    backgroundColor: hexToRgba(bgColor, 0.25) // Aplicando 25% de opacidade
  }
})

const getStatusButtonStyle = (status) => {
  const bgColor = isDarkMode.value ? status.bgColorDark : status.bgColor
  return {
    backgroundColor: bgColor,
    color: status.color,
    borderColor: status.borderColor
  }
}

const getTypeClass = (type) => {
  const classes = {
    'Funcionalidade': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Tarefa': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Bug': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Melhoria': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
  }
  return classes[type] || 'bg-gray-200 text-gray-800'
}

const getPriorityClass = (priority) => {
  const classes = {
    'Baixa': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Média': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Crítica': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Touch handling variables
const touchData = ref({
  startX: 0,
  startY: 0,
  isDragging: false,
  dragElement: null,
  dragPreview: null
})

// Touch event handlers
const handleTouchStart = (event) => {
  const touch = event.touches[0]
  touchData.value.startX = touch.clientX
  touchData.value.startY = touch.clientY
  touchData.value.isDragging = false
  
  // Store the initial scroll position
  touchData.value.initialScrollY = window.scrollY
}

const handleTouchMove = (event) => {
  if (!event.touches[0]) return
  
  const touch = event.touches[0]
  const deltaX = Math.abs(touch.clientX - touchData.value.startX)
  const deltaY = Math.abs(touch.clientY - touchData.value.startY)
  
  // Start dragging if moved more than 10px
  if (!touchData.value.isDragging && (deltaX > 10 || deltaY > 10)) {
    touchData.value.isDragging = true
    
    // Prevent page scrolling during drag
    document.body.classList.add('drag-active')
    
    // Create drag preview
    createDragPreview(event.target, touch.clientX, touch.clientY)
    
    // Add visual feedback
    event.target.classList.add('dragging')
    
    // Emit drag start
    emit('dragStart', props.task)
  }
  
  if (touchData.value.isDragging) {
    // Prevent default scrolling
    event.preventDefault()
    
    if (touchData.value.dragPreview) {
      // Update preview position
      touchData.value.dragPreview.style.left = `${touch.clientX - 150}px`
      touchData.value.dragPreview.style.top = `${touch.clientY - 50}px`
    }
  }
}

const handleTouchEnd = (event) => {
  if (!touchData.value.isDragging) return
  
  // Remove visual feedback
  event.target.classList.remove('dragging')
  
  // Re-enable page scrolling
  document.body.classList.remove('drag-active')
  
  // Get element under finger
  const touch = event.changedTouches[0]
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
  
  // Find drop zone
  const dropZone = elementBelow?.closest('[data-status]')
  
  if (dropZone) {
    const newStatus = dropZone.getAttribute('data-status')
    if (newStatus && newStatus !== props.task.status) {
      // Emit status change
      emit('updateStatus', props.task.id, newStatus)
    }
  }
  
  // Clean up
  removeDragPreview()
  emit('dragEnd', props.task)
  
  // Reset touch data
  touchData.value.isDragging = false
}

const createDragPreview = (element, x, y) => {
  // Create a clone of the element for preview
  const preview = element.cloneNode(true)
  preview.style.position = 'fixed'
  preview.style.left = `${x - 150}px`
  preview.style.top = `${y - 50}px`
  preview.style.width = '300px'
  preview.style.pointerEvents = 'none'
  preview.style.zIndex = '9999'
  preview.style.opacity = '0.8'
  preview.style.transform = 'rotate(5deg)'
  preview.classList.add('touch-drag-preview')
  
  document.body.appendChild(preview)
  touchData.value.dragPreview = preview
}

const removeDragPreview = () => {
  if (touchData.value.dragPreview) {
    document.body.removeChild(touchData.value.dragPreview)
    touchData.value.dragPreview = null
  }
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

.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
  transition: all 0.2s ease;
}

:global(.touch-drag-preview) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  background: white;
  transform: rotate(5deg) scale(0.95);
}
</style>
