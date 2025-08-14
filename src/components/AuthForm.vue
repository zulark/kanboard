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
                                src="/src/assets/heroimage.png"
                                class="w-full h-full object-contain mx-auto"
                            />
                        </div>
                        
                        <!-- Hero Text -->
                        <h1 class="text-black text-4xl font-bold mb-4">
                            {{ isLogin ? 'Bem-vindo de volta!' : 'Junte-se a nós!' }}
                        </h1>
                        <p class="text-xl text-slate-700 mb-8 leading-relaxed">
                            {{ isLogin 
                                ? 'Acesse sua conta e continue gerenciando seus projetos Scrum de forma eficiente.' 
                                : 'Crie sua conta e comece a organizar suas tarefas como um verdadeiro desenvolvedor ágil.' 
                            }}
                        </p>
                        
                        <!-- Features List -->
                        <!-- <div class="text-left space-y-3">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="text-slate-700">Kanban Board intuitivo</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="text-slate-700">Metodologia Scrum completa</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="text-slate-700">Drag & Drop nativo</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="text-slate-700">Dashboard com métricas</span>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>

            <!-- Form Section - Right Side -->
            <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div class="mx-auto w-full max-w-sm lg:w-96">
                    <!-- Mobile Hero Image -->
                    <div class="lg:hidden text-center mb-8">
                        <img 
                            :src="isLogin ? '/src/assets/undraw_authentication_tbfc.png' : '/src/assets/undraw_coding_joxb.png'" 
                            :alt="isLogin ? 'Autenticação' : 'Desenvolvimento'" 
                            class="w-40 h-32 object-contain mx-auto"
                        />
                    </div>
                    
                    <!-- Form Header -->
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">
                            {{ isLogin ? 'Entre na sua conta' : 'Crie sua conta' }}
                        </h2>
                        <p class="text-sm text-gray-600">
                            {{ isLogin 
                                ? 'Acesse suas tarefas e projetos' 
                                : 'Comece a organizar seus projetos hoje' 
                            }}
                        </p>
                    </div>

                    <!-- Form -->

                    <!-- Form -->
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <!-- Nome completo (apenas no registro) -->
                            <div v-if="!isLogin">
                                <label for="fullName" class="block text-sm font-medium text-gray-700">
                                    Nome Completo
                                </label>
                                <input 
                                    id="fullName" 
                                    v-model="form.fullName" 
                                    type="text" 
                                    :required="!isLogin"
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Seu nome completo" 
                                />
                            </div>

                            <!-- Email -->
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input 
                                    id="email" 
                                    v-model="form.email" 
                                    type="email"
                                    required
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="seu@email.com" 
                                />
                            </div>

                            <!-- Senha -->
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <input 
                                    id="password" 
                                    v-model="form.password" 
                                    type="password"
                                    required
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    :placeholder="isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'"
                                    :minlength="!isLogin ? 6 : undefined" 
                                />
                            </div>

                            <!-- Confirmar senha (apenas no registro) -->
                            <div v-if="!isLogin">
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                                    Confirmar Senha
                                </label>
                                <input 
                                    id="confirmPassword" 
                                    v-model="form.confirmPassword" 
                                    type="password" 
                                    :required="!isLogin"
                                    class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirme sua senha" 
                                />
                            </div>
                        </div>

                        <!-- Mensagens de erro -->
                        <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
                            <div class="flex">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">
                                        {{ errorMessage }}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <!-- Mensagem de sucesso -->
                        <div v-if="successMessage" class="rounded-lg bg-green-50 p-4">
                            <div class="flex">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-green-800">
                                        {{ successMessage }}
                                    </h3>
                                </div>
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
                                {{ loading ? (isLogin ? loadingMessages.signIn : loadingMessages.signUp) : (isLogin ? 'Entrar' : 'Cadastrar') }}
                            </button>
                        </div>

                        <!-- Links adicionais -->
                        <div class="text-center space-y-4">
                            <p class="text-sm text-gray-600">
                                {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
                                <button 
                                    type="button"
                                    @click="toggleMode" 
                                    class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                                >
                                    {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
                                </button>
                            </p>
                            
                            <div v-if="isLogin">
                                <button 
                                    type="button" 
                                    @click="handleForgotPassword"
                                    class="text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200"
                                >
                                    Esqueceu sua senha?
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { successMessages, loadingMessages } from '../utils/errorMessages.js'

const emit = defineEmits(['authenticated'])

const { signIn, signUp, resetPassword, loading, error } = useAuth()

const isLogin = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
})

const toggleMode = () => {
    isLogin.value = !isLogin.value
    errorMessage.value = ''
    successMessage.value = ''
    form.value = {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    }
}

const validateForm = () => {
    if (!isLogin.value) {
        if (form.value.password !== form.value.confirmPassword) {
            errorMessage.value = 'As senhas não coincidem'
            return false
        }
        if (form.value.password.length < 6) {
            errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
            return false
        }
        if (!form.value.fullName.trim()) {
            errorMessage.value = 'Nome completo é obrigatório'
            return false
        }
    }
    return true
}

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!validateForm()) return

    try {
        if (isLogin.value) {
            // Login
            const { error } = await signIn(form.value.email, form.value.password)

            if (error) {
                errorMessage.value = error
            } else {
                successMessage.value = successMessages.signIn
                emit('authenticated')
            }
        } else {
            // Registro
            const { error, needsConfirmation } = await signUp(
                form.value.email,
                form.value.password,
                form.value.fullName
            )

            if (error) {
                errorMessage.value = error
            } else if (needsConfirmation) {
                successMessage.value = successMessages.signUpConfirmation
            } else {
                successMessage.value = successMessages.signUp
                emit('authenticated')
            }
        }
    } catch (err) {
        errorMessage.value = 'Erro inesperado. Tente novamente.'
        console.error(err)
    }
}

const handleForgotPassword = async () => {
    if (!form.value.email) {
        errorMessage.value = 'Digite seu email primeiro'
        return
    }

    const { error } = await resetPassword(form.value.email)

    if (error) {
        errorMessage.value = error
    } else {
        successMessage.value = successMessages.passwordReset
    }
}
</script>
