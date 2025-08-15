import { ref, computed, watch } from 'vue'
import { supabase, TABLES } from '../lib/supabase.js'
import { useAuth } from './useAuth.js'
import { useTaskStatuses } from './useTaskStatuses.js'

export function useTasks() {
  const { user } = useAuth()
  const { sortedStatuses, statusNames, loadStatuses, onStatusChange } = useTaskStatuses()
  
  const loading = ref(false)
  const error = ref(null)
  const tasks = ref([])

  const taskTypes = ref(['Story', 'Task', 'Bug', 'Epic'])
  const priorities = ref(['Baixa', 'Média', 'Alta', 'Crítica'])
  
  // Usar status do sistema de status personalizáveis
  const statuses = computed(() => statusNames.value)

  // Inicializar status quando houver usuário autenticado
  watch(user, async (newUser) => {
    if (newUser) {
      await loadStatuses()
    }
  }, { immediate: true })

  // Listener para mudanças nos status - força re-sync das tarefas
  onStatusChange(async (event) => {
    console.log('🔄 Status mudou (local):', event.action, event.status?.name)
    // Re-sincronizar tasksByStatus com os novos status
    syncTasksByStatus()
  })

  const addTask = (task) => {
    // Calcular a próxima ordem para o status
    const tasksInStatus = tasks.value.filter(t => t.status === task.status)
    const maxOrder = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.order)) : 0
    
    const newTask = {
      id: Date.now(),
      ...task,
      createdAt: new Date(),
      order: maxOrder + 1
    }
    tasks.value.push(newTask)
  }

  const updateTask = (id, updates) => {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }
  }

  const deleteTask = (id) => {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  const tasksByStatus = ref({})

  // Função para sincronizar tasksByStatus com tasks
  const syncTasksByStatus = () => {
    // Criar objeto dinâmico baseado nos status atuais
    const newTasksByStatus = {}
    
    sortedStatuses.value.forEach(status => {
      newTasksByStatus[status.name] = tasks.value
        .filter(task => task.status === status.name)
        .sort((a, b) => a.order - b.order)
    })
    
    tasksByStatus.value = newTasksByStatus
  }

  // Watcher para atualizar tasksByStatus quando os status mudarem
  watch([tasks, sortedStatuses], syncTasksByStatus, { deep: true, immediate: true })

  // Função para atualizar tasks quando tasksByStatus mudar (para drag and drop)
  const syncTasksFromStatus = () => {
    const allTasks = []
    Object.keys(tasksByStatus.value).forEach(status => {
      tasksByStatus.value[status].forEach((task, index) => {
        if (task.status !== status) {
          task.status = status
        }
        // Atualizar ordem baseada na posição na lista
        task.order = index + 1
        allTasks.push(task)
      })
    })
    tasks.value = allTasks
  }

  // Função para reordenar tarefas dentro do mesmo status
  const reorderTasks = (status, fromIndex, toIndex) => {
    const statusTasks = [...tasksByStatus.value[status]]
    const [movedTask] = statusTasks.splice(fromIndex, 1)
    statusTasks.splice(toIndex, 0, movedTask)
    
    // Atualizar as ordens
    statusTasks.forEach((task, index) => {
      task.order = index + 1
    })
    
    tasksByStatus.value[status] = statusTasks
    syncTasksFromStatus()
  }

  const totalEstimatedHours = computed(() => {
    return tasks.value.reduce((total, task) => total + task.estimatedHours, 0)
  })

  const taskStats = computed(() => {
    const stats = { total: tasks.value.length, totalHours: totalEstimatedHours.value }
    
    // Adicionar estatísticas dinâmicas baseadas nos status atuais
    sortedStatuses.value.forEach(status => {
      const statusKey = status.name.toLowerCase().replace(/\s+/g, '')
      stats[statusKey] = tasks.value.filter(t => t.status === status.name).length
    })
    
    // Manter compatibilidade com os nomes antigos
    stats.todo = tasks.value.filter(t => t.status === 'To Do').length
    stats.inProgress = tasks.value.filter(t => t.status === 'In Progress').length
    stats.done = tasks.value.filter(t => t.status === 'Done').length
    
    return stats
  })

  return {
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
    syncTasksFromStatus,
    // Exportar também os status com cores para a UI
    sortedStatuses
  }
}
