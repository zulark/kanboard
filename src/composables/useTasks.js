import { ref, computed, watch } from 'vue'
import { supabase, TABLES } from '../lib/supabase.js'
import { useAuth } from './useAuth.js'

export function useTasks() {
  const { user } = useAuth()
  
  const loading = ref(false)
  const error = ref(null)
  const tasks = ref([])

  const taskTypes = ref(['Story', 'Task', 'Bug', 'Epic'])
  const priorities = ref(['Baixa', 'Média', 'Alta', 'Crítica'])
  const statuses = ref(['To Do', 'In Progress', 'Done'])

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

  const tasksByStatus = ref({
    'To Do': [],
    'In Progress': [],
    'Done': []
  })

  // Função para sincronizar tasksByStatus com tasks
  const syncTasksByStatus = () => {
    statuses.value.forEach(status => {
      tasksByStatus.value[status] = tasks.value
        .filter(task => task.status === status)
        .sort((a, b) => a.order - b.order)
    })
  }

  // Watcher para manter sincronizado
  watch(tasks, syncTasksByStatus, { deep: true, immediate: true })

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
    return {
      total: tasks.value.length,
      todo: tasks.value.filter(t => t.status === 'To Do').length,
      inProgress: tasks.value.filter(t => t.status === 'In Progress').length,
      done: tasks.value.filter(t => t.status === 'Done').length,
      totalHours: totalEstimatedHours.value
    }
  })

  return {
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
  }
}
