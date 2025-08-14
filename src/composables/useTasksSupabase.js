import { ref, computed, watch } from 'vue'
import { supabase, TABLES, TASK_TYPES, TASK_PRIORITIES, TASK_STATUSES } from '../lib/supabase.js'
import { useAuth } from './useAuth.js'

export function useTasks() {
  const { user } = useAuth()
  
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const taskTypes = ref(TASK_TYPES)
  const priorities = ref(TASK_PRIORITIES)
  const statuses = ref(TASK_STATUSES)

  // Função para carregar tarefas do usuário
  const loadTasks = async () => {
    if (!user.value) {
      tasks.value = []
      return
    }

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .eq('user_id', user.value.id)
        .order('order_index', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      // Converter campos do banco para formato do frontend
      tasks.value = (data || []).map(task => ({
        ...task,
        estimatedHours: task.estimated_hours,
        createdAt: new Date(task.created_at),
        order: task.order_index
      }))
    } catch (err) {
      error.value = err.message
      console.error('Erro ao carregar tarefas:', err)
    } finally {
      loading.value = false
    }
  }

  // Função para adicionar nova tarefa
  const addTask = async (taskData) => {
    if (!user.value) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      loading.value = true
      error.value = null

      // Calcular a próxima ordem para o status
      const tasksInStatus = tasks.value.filter(t => t.status === taskData.status)
      const maxOrder = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.order)) : 0

      const newTask = {
        user_id: user.value.id,
        title: taskData.title,
        description: taskData.description || '',
        type: taskData.type,
        priority: taskData.priority,
        status: taskData.status,
        estimated_hours: taskData.estimatedHours || 1,
        assignee: taskData.assignee || '',
        order_index: maxOrder + 1
      }

      const { data, error: insertError } = await supabase
        .from(TABLES.TASKS)
        .insert([newTask])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Converter e adicionar à lista local
      const formattedTask = {
        ...data,
        estimatedHours: data.estimated_hours,
        createdAt: new Date(data.created_at),
        order: data.order_index
      }
      
      tasks.value.push(formattedTask)
      return { success: true, data: formattedTask }
    } catch (err) {
      error.value = err.message
      console.error('Erro ao criar tarefa:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Função para atualizar tarefa
  const updateTask = async (taskId, updates) => {
    if (!user.value) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      loading.value = true
      error.value = null

      // Converter nomes de propriedades se necessário
      const dbUpdates = { ...updates }
      
      if (updates.estimatedHours !== undefined) {
        dbUpdates.estimated_hours = updates.estimatedHours
        delete dbUpdates.estimatedHours
      }

      if (updates.order !== undefined) {
        dbUpdates.order_index = updates.order
        delete dbUpdates.order
      }

      const { data, error: updateError } = await supabase
        .from(TABLES.TASKS)
        .update(dbUpdates)
        .eq('id', taskId)
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Atualizar localmente
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = {
          ...data,
          estimatedHours: data.estimated_hours,
          createdAt: new Date(data.created_at),
          order: data.order_index
        }
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Erro ao atualizar tarefa:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Função para deletar tarefa
  const deleteTask = async (taskId) => {
    if (!user.value) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      loading.value = true
      error.value = null

      const { error: deleteError } = await supabase
        .from(TABLES.TASKS)
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.value.id)

      if (deleteError) {
        throw deleteError
      }

      // Remover localmente
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Erro ao deletar tarefa:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Função para reordenar tarefas
  const reorderTasks = async (status, fromIndex, toIndex) => {
    if (!user.value) {
      error.value = 'Usuário não autenticado'
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const statusTasks = tasksByStatus.value[status]
      const tasksCopy = [...statusTasks]
      
      // Mover item localmente
      const [movedTask] = tasksCopy.splice(fromIndex, 1)
      tasksCopy.splice(toIndex, 0, movedTask)
      
      // Atualizar ordens no banco
      const updates = tasksCopy.map((task, index) => ({
        id: task.id,
        order_index: index + 1
      }))

      for (const update of updates) {
        await supabase
          .from(TABLES.TASKS)
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('user_id', user.value.id)
      }

      // Recarregar tarefas para sincronizar
      await loadTasks()
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Erro ao reordenar tarefas:', err)
      return { success: false, error: err.message }
    }
  }

  // Computadas
  const tasksByStatus = computed(() => {
    return statuses.value.reduce((acc, status) => {
      acc[status] = tasks.value
        .filter(task => task.status === status)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      return acc
    }, {})
  })

  const totalEstimatedHours = computed(() => {
    return tasks.value.reduce((total, task) => total + (task.estimatedHours || 0), 0)
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

  // Watcher para carregar tarefas quando usuário mudar
  watch(user, (newUser) => {
    if (newUser) {
      loadTasks()
    } else {
      tasks.value = []
    }
  }, { immediate: true })

  return {
    tasks,
    taskTypes,
    priorities,
    statuses,
    tasksByStatus,
    taskStats,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks
  }
}
