<template>
    <div class="min-h-screen bg-indigo-200">
        <div class="min-h-screen flex">
            <!-- Hero Section - Left Side -->
            <div class="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-[#ffffff] relative overflow-hidden">
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
                        <h1 class="text-black text-4xl font-bold mb-4">
                            {{ isResetMode ? 'Redefina sua senha' : 'Recupere sua conta' }}
                        </h1>
                        <p class="text-xl text-slate-700 mb-8 leading-relaxed">
                            {{ isResetMode 
                                ? 'Digite sua nova senha para acessar sua conta novamente.' 
                                : 'Digite seu email e enviaremos um link para redefinir sua senha.' 
                            }}
                        </p>
                        
                        <!-- Features List -->
                        <div class="text-left space-y-3">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700">Processo seguro e confiável</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700">Criptografia de ponta a ponta</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="text-slate-700">Acesso rápido em minutos</span>
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
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">
                            {{ isResetMode ? 'Nova Senha' : 'Recuperar Senha' }}
                        </h2>
                        <p class="text-sm text-gray-600">
                            {{ isResetMode 
                                ? 'Digite sua nova senha abaixo' 
                                : 'Digite seu email para receber o link de recuperação' 
                            }}
                        </p>
                    </div>

                    <!-- Mensagens de erro -->
                    <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 mb-6 transition-all duration-300">
                        <div class="flex">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-red-800">
                                    {{ errorMessage }}
                                </h3>
                            </div>
                            <button @click="clearMessage('error')" class="ml-3 text-red-400 hover:text-red-600">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Mensagem de sucesso -->
                    <div v-if="successMessage" class="rounded-lg bg-green-50 p-4 mb-6 transition-all duration-300">
                        <div class="flex">
                            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-green-800">
                                    {{ successMessage }}
                                </h3>
                            </div>
                            <button @click="clearMessage('success')" class="ml-3 text-green-400 hover:text-green-600">
                                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Form -->
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <!-- Email (apenas no modo de envio) -->
                            <div v-if="!isResetMode">
                                <label for="email" class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input 
                                    id="email" 
                                    v-model="form.email" 
                                    type="email"
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Seu Email" 
                                />
                            </div>

                            <!-- Nova Senha (apenas no modo de reset) -->
                            <div v-if="isResetMode">
                                <label for="newPassword" class="block text-sm font-medium text-gray-700">
                                    Nova Senha
                                </label>
                                <input 
                                    id="newPassword" 
                                    v-model="form.newPassword" 
                                    type="password"
                                    minlength="6"
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Mínimo 6 caracteres" 
                                />
                            </div>

                            <!-- Confirmar Nova Senha (apenas no modo de reset) -->
                            <div v-if="isResetMode">
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                                    Confirmar Nova Senha
                                </label>
                                <input 
                                    id="confirmPassword" 
                                    v-model="form.confirmPassword" 
                                    type="password"
                                    minlength="6"
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
                                {{ loading ? loadingMessages.passwordReset : (isResetMode ? 'Redefinir Senha' : 'Enviar Link') }}
                            </button>
                        </div>

                        <!-- Links adicionais -->
                        <div class="text-center space-y-4">
                            <p class="text-sm text-gray-600">
                                Lembrou da senha?
                                <button 
                                    type="button"
                                    @click="handleBackToLogin" 
                                    class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                                >
                                    Voltar ao Login
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useMessages } from '../composables/useMessages.js'
import { successMessages, loadingMessages } from '../utils/errorMessages.js'

const emit = defineEmits(['back-to-login', 'recovery-success'])

const { resetPassword, updatePassword, loading } = useAuth()
const { errorMessage, successMessage, setError, setSuccess, clearMessages, clearMessage } = useMessages()

// Determina se está em modo de redefinição (com token na URL)
const urlParams = new URLSearchParams(window.location.search)
const accessToken = urlParams.get('access_token')
const refreshToken = urlParams.get('refresh_token')
const isResetMode = ref(!!accessToken)

const form = ref({
    email: '',
    newPassword: '',
    confirmPassword: ''
})

// Limpa mensagens ao montar o componente
onMounted(() => {
    clearMessages()
})

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validateForm = () => {
    if (isResetMode.value) {
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
    } else {
        // Validação para solicitação de recuperação
        if (!form.value.email) {
            setError('Email é obrigatório')
            return false
        }
        if (!validateEmail(form.value.email)) {
            setError('Digite um email válido')
            return false
        }
    }
    return true
}

const handleSubmit = async () => {
    clearMessages()
    
    if (!validateForm()) return

    try {
        if (isResetMode.value) {
            // Redefinir senha
            const { error } = await updatePassword(form.value.newPassword)
            
            if (error) {
                setError(error)
            } else {
                setSuccess('Senha atualizada com sucesso!')
                setTimeout(() => {
                    emit('recovery-success')
                }, 2000)
            }
        } else {
            // Solicitar recuperação
            const { error } = await resetPassword(form.value.email)
            
            if (error) {
                setError(error)
            } else {
                setSuccess(successMessages.passwordReset)
                emit('recovery-success')
            }
        }
    } catch (err) {
        setError('Erro inesperado. Tente novamente.')
        console.error(err)
    }
}

const handleBackToLogin = () => {
    clearMessages()
    emit('back-to-login')
}
</script>
