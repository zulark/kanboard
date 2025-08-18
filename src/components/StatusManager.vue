<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="handleBackdropClick">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ editingStatus ? 'Editar Status' : 'Gerenciar Status da Board' }}
                </h3>
                <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Conteúdo Principal -->
            <div class="mt-6">
                <!-- Lista de Status Existentes (se não estiver editando) -->
                <div v-if="!editingStatus" class="mb-6">
                    <h4 class="text-md font-medium text-gray-900 dark:text-gray-200 mb-4">Status Atuais</h4>
                    <div class="space-y-3 max-h-60 overflow-y-auto">
                        <div 
                            v-for="status in sortedStatuses" 
                            :key="status.id"
                            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            <div class="flex items-center space-x-3">
                                <!-- Indicador de cor -->
                                <div 
                                    class="w-4 h-4 rounded-full border-2"
                                    :style="{ 
                                        backgroundColor: status.color,
                                        borderColor: status.borderColor 
                                    }"
                                ></div>
                                
                                <!-- Nome e informações -->
                                <div>
                                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ status.name }}</span>
                                    <span v-if="status.isDefault" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                        Padrão
                                    </span>
                                </div>
                            </div>

                            <!-- Ações -->
                            <div class="flex items-center space-x-2">
                                <button 
                                    @click="startEditing(status)"
                                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                >
                                    Editar
                                </button>
                                <button 
                                    v-if="!status.isDefault"
                                    @click="confirmDelete(status)"
                                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulário de Novo/Editar Status -->
                <div v-if="showForm" class="border-t pt-6 dark:border-gray-700">
                    <h4 class="text-md font-medium text-gray-900 dark:text-gray-200 mb-4">
                        {{ editingStatus ? 'Editar Status' : 'Novo Status' }}
                    </h4>
                    
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <!-- Nome do Status -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome do Status
                            </label>
                            <input 
                                v-model="form.name"
                                type="text" 
                                required
                                maxlength="30"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Ex: Em Revisão, Aguardando Deploy..."
                            />
                        </div>

                        <!-- Seletor de Cor -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cor do Status (Tema Claro)
                            </label>
                            <div class="grid grid-cols-5 gap-2">
                                <button 
                                    v-for="color in colorOptions" 
                                    :key="color.value"
                                    type="button"
                                    @click="selectColor(color, 'light')"
                                    class="relative w-12 h-12 rounded-lg border-2 hover:scale-105 transition-transform"
                                    :class="{ 
                                        'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800': form.color === color.value 
                                    }"
                                    :style="{ backgroundColor: color.value }"
                                    :title="color.name"
                                >
                                    <span v-if="form.color === color.value" class="absolute inset-0 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Seletor de Cor (Tema Escuro) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cor de Fundo do Card (Tema Escuro)
                            </label>
                            <div class="grid grid-cols-5 gap-2">
                                <button 
                                    v-for="color in colorOptions" 
                                    :key="color.bgDark"
                                    type="button"
                                    @click="selectColor(color, 'dark')"
                                    class="relative w-12 h-12 rounded-lg border-2 hover:scale-105 transition-transform"
                                    :class="{ 
                                        'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800': form.bgColorDark === color.bgDark
                                    }"
                                    :style="{ backgroundColor: color.bgDark }"
                                    :title="color.name"
                                >
                                    <span v-if="form.bgColorDark === color.bgDark" class="absolute inset-0 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Preview do Status -->
                        <div v-if="form.name || form.color">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preview
                            </label>
                            <div class="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div class="flex items-center space-x-3">
                                    <div 
                                        class="w-3 h-3 rounded-full"
                                        :style="{ backgroundColor: form.color }"
                                    ></div>
                                    <span class="font-semibold text-gray-900 dark:text-gray-100">
                                        {{ form.name || 'Nome do Status' }}
                                    </span>
                                    <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm dark:bg-gray-700 dark:text-gray-300">
                                        0
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Botões do Formulário -->
                        <div class="flex justify-end space-x-3 pt-4">
                            <button 
                                type="button"
                                @click="cancelForm"
                                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                :disabled="!form.name || !form.color || loading"
                                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {{ loading ? 'Salvando...' : (editingStatus ? 'Atualizar' : 'Criar Status') }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Botão para mostrar formulário (se não estiver editando) -->
                <div v-if="!editingStatus && !showForm" class="flex justify-between my-5">
                    <div></div>
                    <button 
                        @click="showForm = true"
                        class="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors dark:bg-sky-700 dark:hover:bg-sky-800"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span>Novo Status</span>
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="!editingStatus && !showForm" class="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                    @click="confirmReset"
                    class="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    Resetar para Padrão
                </button>
                <button 
                    @click="$emit('cancel')"
                    class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStatuses } from '../composables/useTaskStatuses.js'

const emit = defineEmits(['save', 'cancel', 'delete', 'reset'])

const { 
    sortedStatuses, 
    colorOptions, 
    loading, 
    error,
    addStatus, 
    updateStatus, 
    deleteStatus, 
    resetToDefault 
} = useTaskStatuses()

const editingStatus = ref(null)
const showForm = ref(false)

const form = ref({
    name: '',
    color: '',
    bgColor: '',
    borderColor: '',
    bgColorDark: ''
})

// Limpar formulário
const clearForm = () => {
    form.value = {
        name: '',
        color: '',
        bgColor: '',
        borderColor: '',
        bgColorDark: ''
    }
}

// Selecionar cor
const selectColor = (color, theme) => {
    if (theme === 'light') {
        form.value.color = color.value
        form.value.bgColor = color.bg
        form.value.borderColor = color.border
    } else {
        form.value.bgColorDark = color.bgDark
    }
}

// Iniciar edição
const startEditing = (status) => {
    editingStatus.value = status
    form.value = {
        name: status.name,
        color: status.color,
        bgColor: status.bgColor,
        borderColor: status.borderColor,
        bgColorDark: status.bgColorDark
    }
    showForm.value = true
}

// Cancelar formulário
const cancelForm = () => {
    editingStatus.value = null
    showForm.value = false
    clearForm()
}

// Submeter formulário
const handleSubmit = async () => {
    try {
        let result

        if (editingStatus.value) {
            // Atualizar status existente
            result = await updateStatus(editingStatus.value.id, form.value)
        } else {
            // Criar novo status
            result = await addStatus(form.value)
        }

        if (result.success) {
            emit('save', result.status)
            cancelForm()
            // Fechar o modal após salvar
            setTimeout(() => {
                emit('cancel')
            }, 100)
        } else {
            console.error('Erro ao salvar status:', result.error)
            alert('Erro ao salvar status: ' + result.error)
        }
    } catch (err) {
        console.error('Erro ao salvar status:', err)
        alert('Erro inesperado ao salvar status')
    }
}

// Confirmar exclusão
const confirmDelete = async (status) => {
    if (confirm(`Tem certeza que deseja excluir o status "${status.name}"?\n\nEsta ação não pode ser desfeita.`)) {
        try {
            const result = await deleteStatus(status.id)
            if (result.success) {
                emit('delete', status)
            } else {
                console.error('Erro ao deletar status:', result.error)
                alert('Erro ao deletar status: ' + result.error)
            }
        } catch (err) {
            console.error('Erro ao deletar status:', err)
            alert('Erro inesperado ao deletar status')
        }
    }
}

// Confirmar reset
const confirmReset = async () => {
    if (confirm('Tem certeza que deseja resetar todos os status para o padrão?\n\nTodos os status personalizados serão perdidos.')) {
        try {
            const result = await resetToDefault()
            if (result.success) {
                emit('reset')
            } else {
                console.error('Erro ao resetar status:', result.error)
                alert('Erro ao resetar status: ' + result.error)
            }
        } catch (err) {
            console.error('Erro ao resetar status:', err)
            alert('Erro inesperado ao resetar status')
        }
    }
}

// Fechar modal ao clicar no backdrop
const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
        emit('cancel')
    }
}

// Limpar formulário ao montar
onMounted(() => {
    clearForm()
})
</script>
