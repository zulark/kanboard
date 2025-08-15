<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div></div>
                    <button @click="showTaskForm = true" class="btn-primary flex items-center gap-2">
                        <PlusIcon class="h-5 w-5" />
                        Nova Tarefa
                    </button>
                </div>
            </div>
        </header>

        <!-- Stats Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div class="card text-center">
                    <div class="text-2xl font-bold text-gray-900">{{ taskStats.total }}</div>
                    <div class="text-sm text-gray-600">Total de Tarefas</div>
                </div>
                <div class="card text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ taskStats.todo }}</div>
                    <div class="text-sm text-gray-600">To do</div>
                </div>
                <div class="card text-center">
                    <div class="text-2xl font-bold text-yellow-600">{{ taskStats.inProgress }}</div>
                    <div class="text-sm text-gray-600">In Progress</div>
                </div>
                <div class="card text-center">
                    <div class="text-2xl font-bold text-green-600">{{ taskStats.done }}</div>
                    <div class="text-sm text-gray-600">Done</div>
                </div>
                <div class="card text-center">
                    <div class="text-2xl font-bold text-purple-600">{{ taskStats.totalHours }}h</div>
                    <div class="text-sm text-gray-600">Total Estimado</div>
                </div>
            </div>

            <!-- Kanban Board -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div v-for="status in statuses" :key="status" 
                     class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full" :class="{
                                'bg-blue-500': status === 'To Do',
                                'bg-yellow-500': status === 'In Progress',
                                'bg-green-500': status === 'Done'
                            }"></span>
                            {{ status }}
                        </h3>
                        <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm">
                            {{ tasksByStatus[status]?.length || 0 }}
                        </span>
                    </div>

                    <div 
                        class="space-y-3 min-h-[300px] p-2 rounded-lg transition-all duration-200 drop-zone"
                        :class="{ 'bg-white/20 border-2 border-dashed border-gray-300': tasksByStatus[status].length === 0 }"
                        @dragover.prevent="handleDragOver"
                        @dragenter.prevent="handleDragEnter"
                        @dragleave="handleDragLeave"
                        @drop="handleDrop($event, status)"
                        :data-status="status"
                    >
                        <TaskCard 
                            v-for="task in tasksByStatus[status]" 
                            :key="task.id"
                            :task="task" 
                            @edit="editTask"
                            @delete="deleteTask" 
                            @updateStatus="updateTaskStatus" 
                        />
                        
                        <!-- Empty state -->
                        <div v-if="tasksByStatus[status].length === 0" 
                             class="flex items-center justify-center h-32 text-gray-400 text-sm">
                            <div class="text-center">
                                <div class="text-2xl mb-2">📋</div>
                                <div>Nenhuma tarefa</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Form Modal -->
        <TaskForm v-if="showTaskForm" :task="currentTask" :task-types="taskTypes" :priorities="priorities"
            :statuses="statuses" @save="handleSaveTask" @cancel="handleCancelTask" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useTasks } from './composables/useTasks.js'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'

const { 
    tasks, 
    taskTypes, 
    priorities, 
    statuses, 
    tasksByStatus, 
    taskStats,
    addTask, 
    updateTask, 
    deleteTask,
    reorderTasks,
    syncTasksFromStatus
} = useTasks()

const showTaskForm = ref(false)
const currentTask = ref(null)
const draggedTask = ref(null)
const dragOverIndex = ref(-1)

const editTask = (task) => {
    currentTask.value = { ...task }
    showTaskForm.value = true
}

const handleSaveTask = (taskData) => {
    if (currentTask.value?.id) {
        updateTask(currentTask.value.id, taskData)
    } else {
        addTask(taskData)
    }
    handleCancelTask()
}

const handleCancelTask = () => {
    showTaskForm.value = false
    currentTask.value = null
}

const updateTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
}

// Funções para Drag and Drop nativo
const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
}

const handleDragEnter = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add('drop-zone-active')
}

const handleDragLeave = (event) => {
    // Só remove a classe se estamos realmente saindo da drop zone
    if (!event.currentTarget.contains(event.relatedTarget)) {
        event.currentTarget.classList.remove('drop-zone-active')
    }
}

const handleDrop = (event, newStatus) => {
    event.preventDefault()
    event.currentTarget.classList.remove('drop-zone-active')
    
    try {
        const taskData = JSON.parse(event.dataTransfer.getData('application/json'))
        if (taskData && taskData.id) {
            if (taskData.status !== newStatus) {
                // Mudança de status - move para nova coluna
                updateTask(taskData.id, { status: newStatus })
            } else {
                // Reordenação dentro da mesma coluna
                const dropIndex = getDropIndex(event, newStatus)
                const currentIndex = tasksByStatus.value[newStatus].findIndex(t => t.id === taskData.id)
                
                if (currentIndex !== -1 && currentIndex !== dropIndex) {
                    reorderTasks(newStatus, currentIndex, dropIndex)
                }
            }
        }
    } catch (error) {
        console.error('Erro ao processar drop:', error)
    }
    
    dragOverIndex.value = -1
}

// Função para calcular o índice de drop baseado na posição do mouse
const getDropIndex = (event, status) => {
    const dropZone = event.currentTarget
    const taskCards = Array.from(dropZone.querySelectorAll('.task-card'))
    
    if (taskCards.length === 0) return 0
    
    const mouseY = event.clientY
    
    for (let i = 0; i < taskCards.length; i++) {
        const rect = taskCards[i].getBoundingClientRect()
        const cardMiddle = rect.top + rect.height / 2
        
        if (mouseY < cardMiddle) {
            return i
        }
    }
    
    return taskCards.length
}
</script>
