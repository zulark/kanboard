<template>
    <div class="min-h-screen bg-indigo-200 dark:bg-gray-900">
        <div class="min-h-screen flex">
            <!-- Hero Section - Left Side -->
            <div class="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-[#ffffff] dark:bg-gray-800 relative overflow-hidden">
                <!-- Background Pattern -->
                <div class="absolute inset-0"></div>
                <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;4&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                
                <!-- Hero Content -->
                <div class="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div class="max-w-lg text-center">
                        <!-- Hero Image -->
                        <div class="mb-8">
                            <img 
                                src="/src/assets/heroimage2.png" 
                                alt="Recuperação de senha" 
                                class="w-full h-full object-contain mx-auto"
                            />
                        </div>
                        
                        <!-- Hero Text -->
                        <h1 class="text-black dark:text-white text-4xl font-bold mb-4">
                            {{ hasResetError ? 'Link Expirado' : 'Redefina sua senha' }}
                        </h1>
                        <p class="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                            {{ hasResetError 
                                ? 'O link de recuperação não é mais válido. Solicite um novo link para continuar.' 
                                : 'Digite sua nova senha para acessar sua conta novamente.' 
                            }}
                        </p>
                        
                        <!-- Features List -->
                        <div class="text-left space-y-3">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700 dark:text-slate-300">Processo seguro e confiável</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700 dark:text-slate-300">Criptografia de ponta a ponta</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700 dark:text-slate-300">Acesso rápido em minutos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Section - Right Side -->
            <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div class="mx-auto w-full max-w-sm lg:w-96">
                    <!-- Mobile Hero Image -->
                    <div class="lg:hidden text-center mb-8">
                        <img 
                            src="/src/assets/heroimage2.png" 
                            alt="Recuperação de senha" 
                            class="w-40 h-32 object-contain mx-auto"
                        />
                    </div>
                    
                    <!-- Form Header -->
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {{ hasResetError ? 'Link Inválido' : 'Nova Senha' }}
                        </h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ hasResetError 
                                ? 'Solicite um novo link de recuperação de senha' 
                                : 'Digite sua nova senha para continuar' 
                            }}
                        </p>
                    </div>

                    <!-- Mostrar mensagem de erro do reset automaticamente -->
                    <div v-if="resetError" class="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-all duration-300">
                        <div class="flex">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                                    {{ resetError }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Mensagens de erro do formulário -->
                    <div v-if="errorMessage" class="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6 transition-all duration-300">
                        <div class="flex">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                                    {{ errorMessage }}
                                </h3>
                            </div>
                            <button @click="clearMessage('error')" class="ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Mensagem de sucesso -->
                    <div v-if="successMessage" class="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 mb-6 transition-all duration-300">
                        <div class="flex">
                            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-green-800 dark:text-green-300">
                                    {{ successMessage }}
                                </h3>
                            </div>
                            <button @click="clearMessage('success')" class="ml-3 text-green-400 hover:text-green-600 dark:hover:text-green-300">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Form (apenas se não houver erro de reset) -->
                    <form v-if="!hasResetError" class="space-y-6" @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <!-- Nova Senha -->
                            <div>
                                <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nova Senha
                                </label>
                                <input 
                                    id="newPassword" 
                                    v-model="form.newPassword" 
                                    type="password"
                                    minlength="6"
                                    required
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Mínimo 6 caracteres" 
                                />
                            </div>

                            <!-- Confirmar Nova Senha -->
                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmar Nova Senha
                                </label>
                                <input 
                                    id="confirmPassword" 
                                    v-model="form.confirmPassword" 
                                    type="password"
                                    minlength="6"
                                    required
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Confirme sua nova senha" 
                                />
                            </div>
                        </div>

                        <!-- Botão de submit -->
                        <div>
                            <button 
                                type="submit" 
                                :disabled="loading"
                                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                </span>
                                {{ loading ? loadingMessages.passwordUpdate : 'Redefinir Senha' }}
                            </button>
                        </div>
                    </form>

                    <!-- Botão para solicitar novo link (se houver erro) -->
                    <div v-if="hasResetError" class="space-y-4">
                        <button 
                            @click="handleRequestNewLink"
                            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                        >
                            Solicitar Novo Link
                        </button>
                    </div>

                    <!-- Links adicionais -->
                    <div class="text-center space-y-4 mt-6">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Lembrou da senha?
                            <button 
                                type="button"
                                @click="handleBackToLogin" 
                                class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                            >
                                Voltar ao Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePasswordReset } from '../composables/usePasswordReset.js'
import { useAuth } from '../composables/useAuth.js'
import { useMessages } from '../composables/useMessages.js'
import { successMessages, loadingMessages } from '../utils/errorMessages.js'

const emit = defineEmits(['reset-success', 'cancel-reset'])

const { updatePassword, loading: resetLoading, error: resetError } = usePasswordReset()
const { resetPassword, loading: emailLoading } = useAuth()
const { errorMessage, successMessage, setError, setSuccess, clearMessages, clearMessage } = useMessages()

const loading = computed(() => resetLoading.value || emailLoading.value)
const hasResetError = computed(() => !!resetError.value)

const form = ref({
    newPassword: '',
    confirmPassword: ''
})

// Limpa mensagens ao montar o componente
onMounted(() => {
    clearMessages()
})

const validateForm = () => {
    // Validação para redefinição de senha
    if (!form.value.newPassword) {
        setError('Nova senha é obrigatória')
        return false
    }
    if (form.value.newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return false
    }
    if (form.value.newPassword !== form.value.confirmPassword) {
        setError('As senhas não coincidem')
        return false
    }
    return true
}

const handleSubmit = async () => {
    clearMessages()
    
    if (!validateForm()) return

    try {
        // Redefinir senha
        const { error } = await updatePassword(form.value.newPassword)
        
        if (error) {
            setError(error)
        } else {
            setSuccess('Senha atualizada com sucesso!')
            setTimeout(() => {
                emit('reset-success')
            }, 2000)
        }
    } catch (err) {
        setError('Erro inesperado. Tente novamente.')
        console.error(err)
    }
}

const handleRequestNewLink = () => {
    // Volta para o login em modo de recuperação
    emit('cancel-reset')
}

const handleBackToLogin = () => {
    clearMessages()
    emit('cancel-reset')
}
</script>
