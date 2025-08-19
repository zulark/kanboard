<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <!-- Mostrar form de reset de senha se estiver em modo de reset -->
        <PasswordReset v-if="isResetMode" @reset-success="handleResetSuccess" @cancel-reset="handleCancelReset" />

        <!-- Mostrar form de autenticação se não estiver logado e não estiver em reset -->
        <AuthForm v-else-if="!isAuthenticated" @authenticated="handleAuthenticated" />

        <!-- App principal se estiver logado -->
        <div v-else>
            <!-- Header -->
            <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div class="mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center space-x-2">
                            <img class="h-8 w-8 sm:h-10 sm:w-10" src="/logo.png" alt="Logo" />
                            <span class="font-montserrat text-lg sm:text-xl font-semibold">Konboard</span>
                        </div>

                        <!-- Desktop Menu -->
                        <div class="hidden md:flex items-center gap-3">
                            <span class="text-sm text-gray-600 dark:text-gray-300">
                                Olá, {{ userName }}
                            </span>
                            <button @click="showStatusManager = true" class="btn-secondary flex items-center gap-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                                    </path>
                                </svg>
                                Status
                                <span
                                    class="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full ml-1">
                                    {{ sortedStatuses.length }}
                                </span>
                            </button>
                            <button @click="showTaskForm = true" class="btn-primary flex items-center gap-2">
                                <PlusIcon class="h-5 w-5" />
                                Nova Tarefa
                            </button>
                            <button @click="toggleTheme" class="btn-secondary">
                                <SunIcon v-if="theme === 'light'" class="h-5 w-5" />
                                <MoonIcon v-else class="h-5 w-5" />
                            </button>
                            <button @click="handleSignOut" class="btn-secondary">
                                Sair
                            </button>
                        </div>

                        <!-- Mobile Menu Button -->
                        <div class="md:hidden flex items-center gap-2">
                            <button @click="showTaskForm = true" class="btn-primary p-2">
                                <PlusIcon class="h-5 w-5" />
                            </button>
                            <button @click="showMobileMenu = !showMobileMenu" class="btn-secondary p-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Menu -->
                    <div v-if="showMobileMenu" class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
                        <div class="space-y-4">
                            <div class="px-4 text-sm text-gray-600 dark:text-gray-300">
                                Olá, {{ userName }}
                            </div>
                            <button @click="showStatusManager = true; showMobileMenu = false" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                                    </path>
                                </svg>
                                Gerenciar Status ({{ sortedStatuses.length }})
                            </button>
                            <button @click="toggleTheme; showMobileMenu = false" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                <SunIcon v-if="theme === 'light'" class="h-5 w-5" />
                                <MoonIcon v-else class="h-5 w-5" />
                                {{ theme === 'light' ? 'Modo Escuro' : 'Modo Claro' }}
                            </button>
                            <button @click="handleSignOut" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">Carregando tarefas...</span>
            </div>

            <!-- Main Content -->
            <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <!-- Stats Section com scroll horizontal -->
                <div class="overflow-x-auto pb-2 mb-6 sm:mb-8">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 min-w-max">
                        <div class="card text-center min-w-[140px] sm:min-w-[160px] dark:bg-gray-800 dark:border-gray-700">
                            <div class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.total }}</div>
                            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total de Tarefas</div>
                        </div>
                        <div class="card text-center min-w-[140px] sm:min-w-[160px] dark:bg-gray-800 dark:border-gray-700">
                            <div class="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{{ taskStats.totalHours }}h</div>
                            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Horas Totais de Tickets</div>
                        </div>
                        <!-- Seção para estatísticas de status pode ser adicionada aqui -->
                    </div>
                </div>

                <!-- Alerta para muitos status -->
                <div v-if="sortedStatuses.length > 8"
                    class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-amber-400 dark:text-amber-500" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-amber-800 dark:text-amber-300">
                                Muitos status detectados ({{ sortedStatuses.length }})
                            </h3>
                            <div class="mt-2 text-sm text-amber-700 dark:text-amber-400">
                                <p>Para melhor usabilidade, recomendamos manter entre 3-6 status ativos. Use o scroll
                                    horizontal para navegar ou considere consolidar alguns status.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                    <div class="flex">
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                                Erro: {{ error }}
                            </h3>
                        </div>
                    </div>
                </div>

                <!-- Kanban Board -->
                <div class="relative">
                    <!-- Indicadores de scroll para desktop -->
                    <div v-if="sortedStatuses.length > 2 && sortedStatuses.length > 4"
                        class="hidden sm:block absolute right-0 top-0 z-10 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent w-8 h-full pointer-events-none">
                    </div>
                    <div v-if="sortedStatuses.length > 2 && sortedStatuses.length > 4"
                        class="hidden sm:block absolute left-0 top-0 z-10 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent w-8 h-full pointer-events-none">
                    </div>

                    <!-- Botões de navegação para desktop -->
                    <div v-if="sortedStatuses.length > 4" class="hidden sm:flex absolute top-4 right-12 z-20 gap-2">
                        <button @click="scrollKanban('left')"
                            class="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 shadow-md rounded-full p-2 transition-all">
                            <svg class="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <button @click="scrollKanban('right')"
                            class="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 shadow-md rounded-full p-2 transition-all">
                            <svg class="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <div ref="kanbanContainer" class="overflow-x-auto pb-4 scroll-smooth" @scroll="updateScrollPosition"
                        @scrollend="handleScrollEnd"
                        :class="{ 'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800': sortedStatuses.length > 4 }">
                        <div class="flex gap-3 sm:gap-6 min-w-max">
                            <div v-for="status in sortedStatuses" :key="status.id"
                                class="min-h-[400px] w-[280px] sm:w-80 flex-shrink-0">
                                <!-- Header da coluna com cores dinâmicas -->
                                <div class="p-4 rounded-t-lg border-2 border-b-0" :style="{
                                    backgroundColor: status.bgColor,
                                    borderColor: status.borderColor
                                }">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                                            <span class="w-3 h-3 rounded-full border" :style="{
                                                backgroundColor: status.color,
                                                borderColor: status.borderColor
                                            }"></span>
                                            {{ status.name }}
                                        </h3>
                                        <span
                                            class="text-sm text-gray-600 bg-white/80 dark:bg-gray-700/80 dark:text-gray-300 px-2 py-1 rounded-full shadow-sm">
                                            {{ tasksByStatus[status.name]?.length || 0 }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Área de tarefas -->
                                <div class="space-y-3 min-h-[300px] p-4 rounded-b-lg border-2 border-t-0 transition-all duration-200 drop-zone bg-white/50 dark:bg-gray-800/50"
                                    :style="{
                                        borderColor: status.borderColor,
                                        backgroundColor: tasksByStatus[status.name]?.length === 0 ? status.bgColor + '20' : 'transparent'
                                    }" @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter"
                                    @dragleave="handleDragLeave" @drop="handleDrop($event, status.name)"
                                    :data-status="status.name">

                                    <TaskCard v-for="task in tasksByStatus[status.name]" :key="task.id" :task="task"
                                        :status-color="status.color" :status-bg-color="status.bgColor"
                                        :status-border-color="status.borderColor" @edit="editTask"
                                        @delete="handleDeleteTask" @updateStatus="handleUpdateTaskStatus" />

                                    <!-- Empty state -->
                                    <div v-if="tasksByStatus[status.name]?.length === 0"
                                        class="flex items-center justify-center h-32 text-gray-400 text-sm">
                                        <div class="text-center">
                                            <div class="text-2xl mb-2 opacity-50">📋</div>
                                            <div>Arraste tarefas aqui</div>
                                            <div class="text-xs mt-1 opacity-75">{{ status.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Task Form Modal -->
                <TaskForm v-if="showTaskForm" :task="currentTask" :task-types="taskTypes" :priorities="priorities"
                    :statuses="statuses" @save="handleSaveTask" @cancel="handleCancelTask" />

                <!-- Status Manager Modal -->
                <StatusManager v-if="showStatusManager" @save="handleStatusSave" @cancel="handleStatusCancel"
                    @delete="handleStatusDelete" @reset="handleStatusReset" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth.js'
import { usePasswordReset } from './composables/usePasswordReset.js'
import { useTasks } from './composables/useTasks.js'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'
import AuthForm from './components/AuthForm.vue'
import PasswordReset from './components/PasswordReset.vue'
import StatusManager from './components/StatusManager.vue'

// Theme management
const { theme, toggleTheme } = useTheme()

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
    reorderTasks,
    sortedStatuses
} = useTasks()

// Estado local
const showTaskForm = ref(false)
const showStatusManager = ref(false)
const showMobileMenu = ref(false)
const currentTask = ref(null)
const kanbanContainer = ref(null)
const scrollPosition = ref(0)

// Função para scroll horizontal do Kanban
const scrollKanban = (direction) => {
    if (!kanbanContainer.value) return

    const scrollAmount = 320 // largura de uma coluna + gap
    const currentScroll = kanbanContainer.value.scrollLeft

    if (direction === 'left') {
        kanbanContainer.value.scrollTo({
            left: Math.max(0, currentScroll - scrollAmount),
            behavior: 'smooth'
        })
    } else {
        kanbanContainer.value.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        })
    }
}

// Monitorar posição do scroll
const updateScrollPosition = () => {
    if (!kanbanContainer.value) return
    const { scrollLeft, scrollWidth, clientWidth } = kanbanContainer.value
    scrollPosition.value = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0
}

// Snap scroll para mostrar colunas completas
let scrollTimeout = null
const handleScrollEnd = () => {
    if (!kanbanContainer.value || sortedStatuses.value.length <= 4) return

    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
        const container = kanbanContainer.value
        const columnWidth = 320 + 24 // largura + gap
        const currentScroll = container.scrollLeft
        const nearestColumn = Math.round(currentScroll / columnWidth)

        container.scrollTo({
            left: nearestColumn * columnWidth,
            behavior: 'smooth'
        })
    }, 150)
}

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

// Funções de gerenciamento de status
const handleStatusSave = async (status) => {
    console.log('✅ Status salvo:', status)
    // Fechar o modal após salvar (recarregamento automático via callback)
    showStatusManager.value = false
}

const handleStatusCancel = () => {
    showStatusManager.value = false
}

const handleStatusDelete = async (status) => {
    console.log('🗑️ Status deletado:', status.name)
    // Modal já está fechado pelo componente (recarregamento automático via callback)
}

const handleStatusReset = async () => {
    console.log('�� Status resetados para padrão')
    // Modal já está fechado pelo componente (recarregamento automático via callback)
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

    // Adicionar atalhos de teclado
    const handleKeyboard = (event) => {
        // Alt + Setas esquerda/direita para navegar colunas
        if (event.altKey && sortedStatuses.value.length > 4) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                scrollKanban('left')
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                scrollKanban('right')
            }
        }

        // Ctrl/Cmd + N para nova tarefa
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault()
            showTaskForm.value = true
        }

        // Ctrl/Cmd + S para gerenciar status
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            showStatusManager.value = true
        }
    }

    window.addEventListener('keydown', handleKeyboard)

    // Cleanup
    return () => {
        window.removeEventListener('keydown', handleKeyboard)
    }
})
</script>
