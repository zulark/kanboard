import { ref, computed, watch } from 'vue'

export function useTasks() {
  const tasks = ref([
    {
      id: 1,
      title: 'Implementar autenticação de usuário',
      description: 'Criar sistema de login e registro com validação de formulários',
      type: 'Story',
      priority: 'Alta',
      status: 'To Do',
      estimatedHours: 8,
      assignee: 'João Silva',
      createdAt: new Date('2024-01-15'),
      order: 1
    },
    {
      id: 2,
      title: 'Corrigir bug no carrinho de compras',
      description: 'Items duplicados aparecem quando usuário clica rapidamente no botão adicionar',
      type: 'Bug',
      priority: 'Crítica',
      status: 'In Progress',
      estimatedHours: 4,
      assignee: 'Maria Santos',
      createdAt: new Date('2024-01-16'),
      order: 1
    },
    {
      id: 3,
      title: 'Otimizar performance da página inicial',
      description: 'Reduzir tempo de carregamento implementando lazy loading e cache',
      type: 'Task',
      priority: 'Média',
      status: 'In Progress',
      estimatedHours: 12,
      assignee: 'Pedro Costa',
      createdAt: new Date('2024-01-14'),
      order: 2
    },
    {
      id: 4,
      title: 'Documentar API REST',
      description: 'Criar documentação completa dos endpoints com Swagger',
      type: 'Task',
      priority: 'Baixa',
      status: 'To Do',
      estimatedHours: 6,
      assignee: 'Ana Oliveira',
      createdAt: new Date('2024-01-17'),
      order: 2
    },
    {
      id: 5,
      title: 'Implementar dashboard analytics',
      description: 'Criar gráficos e métricas para acompanhamento de vendas',
      type: 'Epic',
      priority: 'Alta',
      status: 'Done',
      estimatedHours: 20,
      assignee: 'Carlos Mendes',
      createdAt: new Date('2024-01-10'),
      order: 1
    }
  ])

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
