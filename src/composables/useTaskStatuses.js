import { ref, computed } from 'vue'
import { supabase, TABLES } from '../lib/supabase.js'
import { useAuth } from './useAuth.js'

// Estado global compartilhado (singleton pattern)
let globalState = null

export function useTaskStatuses() {
  // Se já existe uma instância, retorna ela
  if (globalState) {
    return globalState
  }

  const { user } = useAuth()
  // Status padrão do sistema
  const defaultStatuses = [
    {
      id: 'a-fazer',
      name: 'A Fazer',
      color: '#3b82f6', // blue-500
      bgColor: '#dbeafe', // blue-100
      bgColorDark: '#1e3a8a', // blue-900
      borderColor: '#93c5fd', // blue-300
      order: 1,
      isDefault: true
    },
    {
      id: 'desenvolvimento',
      name: 'Desenvolvimento',
      color: '#eab308', // yellow-500
      bgColor: '#fef3c7', // yellow-100
      bgColorDark: '#854d0e', // yellow-900
      borderColor: '#fde047', // yellow-300
      order: 2,
      isDefault: true
    },
    {
      id: 'feito',
      name: 'Feito',
      color: '#22c55e', // green-500
      bgColor: '#dcfce7', // green-100
      bgColorDark: '#166534', // green-900
      borderColor: '#86efac', // green-300
      order: 3,
      isDefault: true
    }
  ]

  const statuses = ref([...defaultStatuses])
  const loading = ref(false)
  const error = ref(null)
  const statusChangeCallbacks = ref([])

  // Sistema de callbacks para notificar mudanças
  const onStatusChange = (callback) => {
    statusChangeCallbacks.value.push(callback)
    // Retornar função para remover o callback
    return () => {
      const index = statusChangeCallbacks.value.indexOf(callback)
      if (index > -1) {
        statusChangeCallbacks.value.splice(index, 1)
      }
    }
  }

  const notifyStatusChange = (action, status = null) => {
    statusChangeCallbacks.value.forEach(callback => {
      try {
        callback({ action, status, statuses: statuses.value })
      } catch (err) {
        console.error('Erro no callback de status:', err)
      }
    })
  }
  const colorOptions = [
    { name: 'Azul', value: '#3b82f6', bg: '#dbeafe', bgDark: '#1e3a8a', border: '#93c5fd' },
    { name: 'Verde', value: '#22c55e', bg: '#dcfce7', bgDark: '#166534', border: '#86efac' },
    { name: 'Amarelo', value: '#eab308', bg: '#fef3c7', bgDark: '#854d0e', border: '#fde047' },
    { name: 'Vermelho', value: '#ef4444', bg: '#fee2e2', bgDark: '#991b1b', border: '#fca5a5' },
    { name: 'Roxo', value: '#8b5cf6', bg: '#ede9fe', bgDark: '#5b21b6', border: '#c4b5fd' },
    { name: 'Rosa', value: '#ec4899', bg: '#fce7f3', bgDark: '#9d174d', border: '#f9a8d4' },
    { name: 'Laranja', value: '#f97316', bg: '#fed7aa', bgDark: '#9a3412', border: '#fdba74' },
    { name: 'Teal', value: '#14b8a6', bg: '#ccfbf1', bgDark: '#0f766e', border: '#7dd3fc' },
    { name: 'Cinza', value: '#6b7280', bg: '#f3f4f6', bgDark: '#374151', border: '#d1d5db' },
    { name: 'Indigo', value: '#6366f1', bg: '#e0e7ff', bgDark: '#4338ca', border: '#c7d2fe' }
  ]

  // Computed para nomes dos status (para compatibilidade)
  const statusNames = computed(() => statuses.value.map(s => s.name))

  // Computed para organizar status por ordem
  const sortedStatuses = computed(() => 
    [...statuses.value].sort((a, b) => a.order - b.order)
  )

  // Buscar status por nome ou ID
  const getStatusById = (id) => statuses.value.find(s => s.id === id)
  const getStatusByName = (name) => statuses.value.find(s => s.name === name)

  // Carregar status do banco de dados
  const loadStatuses = async () => {
    try {
      loading.value = true
      error.value = null


      if (!user.value) {
        statuses.value = [...defaultStatuses]
        return
      }

      const { data: userStatuses, error: dbError } = await supabase
        .from(TABLES.STATUS)
        .select('*')
        .eq('user_id', user.value.id)
        .order('order_index')

      if (dbError) {
        console.warn('⚠️ Erro ao carregar status do banco:', dbError.message)
        
        // Verificar se é erro de tabela não existir
        if (dbError.message.includes('relation') && dbError.message.includes('does not exist')) {
          console.warn('🚨 TABELA task_statuses NÃO EXISTE!')
          
          // Tentar carregar do localStorage como fallback
          const tempStatuses = JSON.parse(localStorage.getItem('temp_custom_statuses') || '[]')
          if (tempStatuses.length > 0) {
            statuses.value = [...defaultStatuses, ...tempStatuses]
            return
          }
        }
        
        statuses.value = [...defaultStatuses]
        return
      }

      if (userStatuses && userStatuses.length > 0) {
        // Mapear dados do banco para o formato esperado
        statuses.value = userStatuses.map(status => ({
          id: status.id,
          name: status.name,
          color: status.color,
          bgColor: status.bg_color,
          bgColorDark: status.bg_color_dark,
          borderColor: status.border_color,
          order: status.order_index,
          is_default: status.is_default || false
        }))
      } else {
        await initializeDefaultStatuses()
      }
    } catch (err) {
      console.error('❌ Erro ao carregar status:', err)
      error.value = 'Erro ao carregar status'
      statuses.value = [...defaultStatuses]
    } finally {
      loading.value = false
    }
  }

  // Inicializar status padrão no banco
  const initializeDefaultStatuses = async () => {
    try {
      if (!user.value) return

      const statusesToInsert = defaultStatuses.map(status => ({
        id: `${status.id}-${user.value.id}`,
        user_id: user.value.id,
        name: status.name,
        color: status.color,
        bg_color: status.bgColor,
        bg_color_dark: status.bgColorDark,
        border_color: status.borderColor,
        order_index: status.order,
        is_default: status.isDefault
      }))

      const { error: insertError } = await supabase
        .from(TABLES.STATUS)
        .insert(statusesToInsert)

      if (insertError) {
        console.error('❌ Erro ao inicializar status padrão:', insertError)
        statuses.value = [...defaultStatuses]
        return
      }

      statuses.value = [...defaultStatuses]
    } catch (err) {
      console.error('❌ Erro ao inicializar status padrão:', err)
      statuses.value = [...defaultStatuses]
    }
  }

  // Salvar status no banco
  const saveStatusToDb = async (status) => {
    try {
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }


      const statusData = {
        id: status.id,
        user_id: user.value.id,
        name: status.name,
        color: status.color,
        bg_color: status.bgColor,
        bg_color_dark: status.bgColorDark,
        border_color: status.borderColor,
        order_index: status.order,
        is_default: status.isDefault || false
      }

      const { error: saveError } = await supabase
        .from(TABLES.STATUS)
        .upsert(statusData)

      if (saveError) {
        console.error('💥 Erro de banco:', saveError)
        
        // Verificar se é erro de tabela não existir
        if (saveError.message.includes('relation') && saveError.message.includes('does not exist')) {
          console.warn('🚨 TABELA task_statuses NÃO EXISTE!')
          
          // Armazenar temporariamente no localStorage como fallback
          const localStatuses = JSON.parse(localStorage.getItem('temp_custom_statuses') || '[]')
          const existingIndex = localStatuses.findIndex(s => s.id === status.id)
          
          if (existingIndex >= 0) {
            localStatuses[existingIndex] = status
          } else {
            localStatuses.push(status)
          }
          
          localStorage.setItem('temp_custom_statuses', JSON.stringify(localStatuses))
          
          return { success: true, isTemporary: true }
        }
        
        throw saveError
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao salvar status no banco:', err)
      return { success: false, error: err.message }
    }
  }

  // Adicionar novo status
  const addStatus = async (statusData) => {
    try {
      loading.value = true
      

      // Validar nome único
      if (statuses.value.some(s => s.name.toLowerCase() === statusData.name.toLowerCase())) {
        throw new Error('Já existe um status com este nome')
      }

      const maxOrder = statuses.value.length > 0 
        ? Math.max(...statuses.value.map(s => s.order)) 
        : 0

      const newStatus = {
        id: `status-${Date.now()}`,
        name: statusData.name,
        color: statusData.color,
        bgColor: statusData.bgColor,
        bgColorDark: statusData.bgColorDark,
        borderColor: statusData.borderColor,
        order: maxOrder + 1,
        isDefault: false,
        ...statusData
      }


      // Salvar no banco primeiro
      const saveResult = await saveStatusToDb(newStatus)
      if (!saveResult.success) {
        throw new Error(saveResult.error)
      }

      statuses.value.push(newStatus)
      
      // Notificar mudança
      notifyStatusChange('create', newStatus)
      
      
      return { success: true, status: newStatus }
    } catch (err) {
      console.error('❌ Erro ao adicionar status:', err)
      error.value = 'Erro ao adicionar status'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Atualizar status existente
  const updateStatus = async (id, updates) => {
    try {
      loading.value = true
      const index = statuses.value.findIndex(s => s.id === id)
      if (index === -1) {
        throw new Error('Status não encontrado')
      }

      // Validar nome único (se estiver mudando o nome)
      if (updates.name && updates.name !== statuses.value[index].name) {
        if (statuses.value.some(s => s.id !== id && s.name.toLowerCase() === updates.name.toLowerCase())) {
          throw new Error('Já existe um status com este nome')
        }
      }

      const updatedStatus = { 
        ...statuses.value[index], 
        ...updates 
      }

      // Salvar no banco primeiro
      const saveResult = await saveStatusToDb(updatedStatus)
      if (!saveResult.success) {
        throw new Error(saveResult.error)
      }

      statuses.value[index] = updatedStatus

      // Notificar mudança
      notifyStatusChange('update', updatedStatus)

      return { success: true, status: updatedStatus }
    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err)
      error.value = 'Erro ao atualizar status'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Deletar status (apenas se não for padrão e não tiver tarefas)
  const deleteStatus = async (id, forceMigrate = false, newStatusId = null) => {
    try {
      loading.value = true
      
      // Validar se existe pelo menos dois status (não pode deletar se só tem 1)
      if (statuses.value.length <= 1) {
        throw new Error('Deve existir pelo menos um status')
      }

      const statusToDelete = statuses.value.find(s => s.id === id)
      if (!statusToDelete) {
        throw new Error('Status não encontrado')
      }

      if (statusToDelete.isDefault && !forceMigrate) {
        throw new Error('Não é possível excluir um status padrão')
      }

      // Se force migrate, precisa de um novo status
      if (forceMigrate && !newStatusId) {
        throw new Error('Status de destino é necessário para migração')
      }

      // TODO: Migrar tarefas se necessário
      if (forceMigrate && newStatusId) {
        await migrateTasksToNewStatus(id, newStatusId)
      }

      // Deletar do banco
      const { error: deleteError } = await supabase
        .from(TABLES.STATUS)
        .delete()
        .eq('id', id)
        .eq('user_id', user.value.id)

      if (deleteError) {
        throw deleteError
      }

      // Remover da lista local
      const index = statuses.value.findIndex(s => s.id === id)
      statuses.value.splice(index, 1)

      // Notificar mudança
      notifyStatusChange('delete', statusToDelete)

      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao deletar status:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Migrar tarefas para novo status
  const migrateTasksToNewStatus = async (oldStatusId, newStatusId) => {
    try {
      const oldStatus = getStatusById(oldStatusId)
      const newStatus = getStatusById(newStatusId)
      
      if (!oldStatus || !newStatus) {
        throw new Error('Status não encontrado para migração')
      }

      // Atualizar todas as tarefas que usam o status antigo
      const { error: updateError } = await supabase
        .from(TABLES.TASKS)
        .update({ status: newStatus.name })
        .eq('status', oldStatus.name)

      if (updateError) {
        throw updateError
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao migrar tarefas:', err)
      throw err
    }
  }

  // Reordenar status
  const reorderStatuses = async (fromIndex, toIndex) => {
    try {
      loading.value = true
      const statusList = [...sortedStatuses.value]
      const [movedStatus] = statusList.splice(fromIndex, 1)
      statusList.splice(toIndex, 0, movedStatus)

      // Atualizar ordens
      const updates = []
      statusList.forEach((status, index) => {
        const statusInArray = statuses.value.find(s => s.id === status.id)
        if (statusInArray) {
          statusInArray.order = index + 1
          updates.push(statusInArray)
        }
      })

      // Salvar todas as mudanças no banco
      for (const status of updates) {
        const saveResult = await saveStatusToDb(status)
        if (!saveResult.success) {
          throw new Error(`Erro ao salvar status ${status.name}`)
        }
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao reordenar status:', err)
      error.value = 'Erro ao reordenar status'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Resetar para status padrão
  const resetToDefault = async () => {
    try {
      loading.value = true
      
      if (!user.value) {
        statuses.value = [...defaultStatuses]
        return { success: true }
      }
      
      // Deletar todos os status existentes do usuário
      const { error: deleteError } = await supabase
        .from(TABLES.STATUS)
        .delete()
        .eq('user_id', user.value.id)

      if (deleteError) {
        console.warn('⚠️ Erro ao limpar status:', deleteError)
      }

      // Reinicializar com status padrão
      await initializeDefaultStatuses()
      
      // Notificar mudança
      notifyStatusChange('reset', null)
      
      return { success: true }
    } catch (err) {
      console.error('❌ Erro ao resetar status:', err)
      error.value = 'Erro ao resetar status'
      statuses.value = [...defaultStatuses]
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const api = {
    statuses,
    sortedStatuses,
    statusNames,
    colorOptions,
    loading,
    error,
    getStatusById,
    getStatusByName,
    loadStatuses,
    addStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
    resetToDefault,
    onStatusChange
  }

  // Criar a instância global na primeira chamada
  globalState = api

  return api
}
