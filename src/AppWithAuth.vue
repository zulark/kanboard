<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Mostrar form de reset de senha se estiver em modo de reset -->
        <PasswordReset v-if="isResetMode" 
                      @reset-success="handleResetSuccess" 
                      @cancel-reset="handleCancelReset" />
        
        <!-- Mostrar form de autenticação se não estiver logado e não estiver em reset -->
        <AuthForm v-else-if="!isAuthenticated" @authenticated="handleAuthenticated" />

        <!-- App principal se estiver logado -->
        <div v-else>
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div></div>
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-600">
                                Olá, {{ userName }}
                            </span>
                            <button @click="showTaskForm = true" class="btn-primary flex items-center gap-2">
                                <PlusIcon class="h-5 w-5" />
                                Nova Tarefa
                            </button>
                            <button @click="handleSignOut" class="btn-secondary">
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span class="ml-2 text-gray-600">Carregando tarefas...</span>
            </div>

            <!-- Main Content -->
            <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <!-- Stats Section -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-gray-900">{{ taskStats.total }}</div>
                        <div class="text-sm text-gray-600">Total de Tarefas</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-purple-600">{{ taskStats.totalHours }}h</div>
                        <div class="text-sm text-gray-600">Total Estimado</div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-if="error" class="rounded-md bg-red-50 p-4 mb-6">
                    <div class="flex">
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">
                                Erro: {{ error }}
                            </h3>
                        </div>
                    </div>
                </div>

                <!-- Kanban Board -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div v-for="status in statuses" :key="status" class="p-4 min-h-[400px]">
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

                        <div class="space-y-3 min-h-[300px] p-2 rounded-lg transition-all duration-200 drop-zone"
                            :class="{ 'bg-white/20 border-2 border-dashed border-gray-300': tasksByStatus[status].length === 0 }"
                            @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter"
                            @dragleave="handleDragLeave" @drop="handleDrop($event, status)" :data-status="status">
                            <TaskCard v-for="task in tasksByStatus[status]" :key="task.id" :task="task" @edit="editTask"
                                @delete="handleDeleteTask" @updateStatus="handleUpdateTaskStatus" />

                            <!-- Empty state -->
                            <div v-if="tasksByStatus[status].length === 0"
                                class="flex items-center justify-center h-32 text-gray-400 text-sm">
                                <div class="text-center">
                                    <div class="text-2xl mb-2">📋</div>
                                    <div>Arraste tarefas aqui</div>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAuth } from './composables/useAuth.js'
import { usePasswordReset } from './composables/usePasswordReset.js'
import { useTasks } from './composables/useTasksSupabase.js'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'
import AuthForm from './components/AuthForm.vue'
import PasswordReset from './components/PasswordReset.vue'

// Autenticação
const { user, isAuthenticated, signOut, initAuth } = useAuth()

// Sistema de reset de senha
const { isResetMode, checkForResetTokens, exitResetMode } = usePasswordReset()

console.log(user)
// Computed para extrair o nome do usuário
const userName = computed(() => {
    if (!user.value) return ''
    
    // Tenta pegar o nome completo dos metadados primeiro
    const fullName = user.value.user_metadata?.full_name || 
                    user.value.identities?.[0]?.identity_data?.full_name
    
    if (fullName) {
        return fullName
    }
    
    // Se não tiver nome, usa o email
    return user.value.email || 'Usuário'
})
// Tarefas
const {
    tasks,
    taskTypes,
    priorities,
    statuses,
    tasksByStatus,
    taskStats,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks
} = useTasks()

// Estado local
const showTaskForm = ref(false)
const currentTask = ref(null)

// Funções de autenticação
const handleAuthenticated = () => {
    // Usuário foi autenticado, o watcher no useTasks já carregará as tarefas
}

const handleSignOut = async () => {
    await signOut()
}

// Funções de reset de senha
const handleResetSuccess = () => {
    // Após sucesso do reset, volta para tela normal
    exitResetMode()
}

const handleCancelReset = () => {
    // Se usuário cancelar reset, volta para login
    exitResetMode()
}

// Funções de tarefas
const editTask = (task) => {
    currentTask.value = { ...task }
    showTaskForm.value = true
}

const handleSaveTask = async (taskData) => {
    let result

    if (currentTask.value?.id) {
        result = await updateTask(currentTask.value.id, taskData)
    } else {
        result = await addTask(taskData)
    }

    if (result.success) {
        handleCancelTask()
    }
}

const handleCancelTask = () => {
    showTaskForm.value = false
    currentTask.value = null
}

const handleUpdateTaskStatus = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus })
}

const handleDeleteTask = async (taskId) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        await deleteTask(taskId)
    }
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
    if (!event.currentTarget.contains(event.relatedTarget)) {
        event.currentTarget.classList.remove('drop-zone-active')
    }
}

const handleDrop = async (event, newStatus) => {
    event.preventDefault()
    event.currentTarget.classList.remove('drop-zone-active')

    try {
        const taskData = JSON.parse(event.dataTransfer.getData('application/json'))
        if (taskData && taskData.id) {
            if (taskData.status !== newStatus) {
                // Mudança de status - move para nova coluna
                await updateTask(taskData.id, { status: newStatus })
            } else {
                // Reordenação dentro da mesma coluna
                const dropIndex = getDropIndex(event, newStatus)
                const currentIndex = tasksByStatus.value[newStatus].findIndex(t => t.id === taskData.id)

                if (currentIndex !== -1 && currentIndex !== dropIndex) {
                    await reorderTasks(newStatus, currentIndex, dropIndex)
                }
            }
        }
    } catch (error) {
        console.error('Erro ao processar drop:', error)
    }
}

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

// Inicializar autenticação
onMounted(async () => {
    // Primeiro verifica se há tokens de reset na URL
    const hasResetTokens = await checkForResetTokens()
    
    // Se não há tokens de reset, inicializa a autenticação normal
    if (!hasResetTokens) {
        initAuth()
    }
})
</script>
