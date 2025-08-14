import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase.js'
import { translateAuthError } from '../utils/errorMessages.js'

const user = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  // Estado computado para verificar se está logado
  const isAuthenticated = computed(() => !!user.value)

  // Função para fazer login
  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) {
        throw signInError
      }
      
      user.value = data.user
      return { user: data.user, error: null }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { user: null, error: translatedError }
    } finally {
      loading.value = false
    }
  }

  // Função para fazer registro
  const signUp = async (email, password, fullName = '') => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (signUpError) {
        throw signUpError
      }
      
      return { 
        user: data.user, 
        error: null,
        needsConfirmation: !data.session 
      }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { user: null, error: translatedError, needsConfirmation: false }
    } finally {
      loading.value = false
    }
  }

  // Função para fazer logout
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }
      
      user.value = null
      return { error: null }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { error: translatedError }
    } finally {
      loading.value = false
    }
  }

  // Função para recuperar sessão atual
  const getCurrentUser = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }
      
      user.value = session?.user || null
      return session?.user || null
    } catch (err) {
      console.error('Erro ao recuperar usuário:', err)
      user.value = null
      return null
    }
  }

  // Função para escutar mudanças de autenticação
  const initAuth = () => {
    // Recupera usuário atual ao inicializar
    getCurrentUser()
    
    // Escuta mudanças no estado de autenticação
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
      
      if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })
  }

  // Função para resetar senha
  const resetPassword = async (email) => {
    try {
      loading.value = true
      error.value = null
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (resetError) {
        throw resetError
      }
      
      return { error: null }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { error: translatedError }
    } finally {
      loading.value = false
    }
  }

  // Função para atualizar senha
  const updatePassword = async (newPassword) => {
    try {
      loading.value = true
      error.value = null
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) {
        throw updateError
      }
      
      return { error: null }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { error: translatedError }
    } finally {
      loading.value = false
    }
  }

  // Função para atualizar perfil
  const updateProfile = async (updates) => {
    try {
      loading.value = true
      error.value = null
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (updateError) {
        throw updateError
      }
      
      return { error: null }
    } catch (err) {
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { error: translatedError }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    initAuth,
    resetPassword,
    updatePassword,
    updateProfile
  }
}
