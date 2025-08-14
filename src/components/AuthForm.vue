<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Entre na sua conta' : 'Crie sua conta' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
          <button 
            @click="toggleMode" 
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
          </button>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
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
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Seu Email"
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
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>

        <!-- Mensagens de erro -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Mensagem de sucesso -->
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
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
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </span>
            {{ loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar') }}
          </button>
        </div>

        <!-- Link para recuperar senha -->
        <div v-if="isLogin" class="text-center">
          <button 
            type="button"
            @click="handleForgotPassword"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

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
        successMessage.value = 'Login realizado com sucesso!'
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
        successMessage.value = 'Verifique seu email para confirmar a conta!'
      } else {
        successMessage.value = 'Conta criada com sucesso!'
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
    successMessage.value = 'Email de recuperação enviado!'
  }
}
</script>
