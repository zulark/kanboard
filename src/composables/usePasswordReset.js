import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase.js'
import { translateAuthError } from '../utils/errorMessages.js'

const isResetMode = ref(false)
const resetSession = ref(null)
const loading = ref(false)
const error = ref(null)

export function usePasswordReset() {
  // Função para detectar tokens de reset na URL
  const checkForResetTokens = async () => {
    try {
      // Verifica se há tokens de reset no hash da URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')
      const errorParam = hashParams.get('error')
      const errorCode = hashParams.get('error_code')
      const errorDescription = hashParams.get('error_description')

      // Ou verifica nos query params (dependendo da configuração do Supabase)
      const urlParams = new URLSearchParams(window.location.search)
      const accessTokenQuery = urlParams.get('access_token')
      const refreshTokenQuery = urlParams.get('refresh_token')
      const typeQuery = urlParams.get('type')

      // Determina se é um reset de senha (com tokens válidos ou com erro)
      const isPasswordRecovery = type === 'recovery' || typeQuery === 'recovery'
      const hasTokens = (accessToken && refreshToken) || (accessTokenQuery && refreshTokenQuery)
      const hasResetError = errorParam || errorCode || errorDescription

      // Se há erro na URL de reset, também é considerado modo reset
      if (hasResetError || (isPasswordRecovery && window.location.pathname.includes('reset'))) {
        console.log('🔐 Link de reset detectado na URL (com erro ou válido)')
        
        // Se há erro, define a mensagem de erro
        if (hasResetError) {
          let errorMsg = 'Link de recuperação inválido ou expirado'
          
          if (errorCode === 'otp_expired') {
            errorMsg = 'O link de recuperação expirou. Solicite um novo link.'
          } else if (errorParam === 'access_denied') {
            errorMsg = 'Link de recuperação inválido. Solicite um novo link.'
          } else if (errorDescription) {
            errorMsg = translateAuthError(decodeURIComponent(errorDescription))
          }
          
          error.value = errorMsg
        }
        
        isResetMode.value = true
        
        // Limpa a URL dos parâmetros por segurança
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
        
        return true
      }

      // Se há tokens válidos, tenta configurar a sessão
      if (isPasswordRecovery && hasTokens) {
        console.log('🔐 Tokens de reset válidos detectados na URL')
        
        // Configura a sessão com os tokens de reset
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken || accessTokenQuery,
          refresh_token: refreshToken || refreshTokenQuery
        })

        if (sessionError) {
          console.error('❌ Erro ao configurar sessão de reset:', sessionError)
          error.value = 'Erro ao processar link de recuperação. Solicite um novo link.'
          isResetMode.value = true
          
          // Limpa a URL dos tokens por segurança
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
          
          return true
        }

        if (data.session) {
          console.log('✅ Sessão de reset configurada com sucesso')
          isResetMode.value = true
          resetSession.value = data.session
          
          // Limpa a URL dos tokens por segurança
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
          
          return true
        }
      }

      return false
    } catch (err) {
      console.error('❌ Erro ao verificar tokens de reset:', err)
      error.value = translateAuthError(err.message)
      return false
    }
  }

  // Função para atualizar a senha
  const updatePassword = async (newPassword) => {
    try {
      loading.value = true
      error.value = null

      if (!resetSession.value) {
        throw new Error('Sessão de reset não encontrada')
      }

      console.log('🔄 Atualizando senha...')
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        throw updateError
      }

      console.log('✅ Senha atualizada com sucesso')
      
      // Limpa o estado de reset
      isResetMode.value = false
      resetSession.value = null
      
      return { error: null }
    } catch (err) {
      console.error('❌ Erro ao atualizar senha:', err)
      const translatedError = translateAuthError(err.message)
      error.value = translatedError
      return { error: translatedError }
    } finally {
      loading.value = false
    }
  }

  // Função para sair do modo de reset
  const exitResetMode = async () => {
    try {
      await supabase.auth.signOut()
      isResetMode.value = false
      resetSession.value = null
      error.value = null
    } catch (err) {
      console.error('❌ Erro ao sair do modo reset:', err)
    }
  }

  return {
    isResetMode,
    resetSession,
    loading,
    error,
    checkForResetTokens,
    updatePassword,
    exitResetMode
  }
}
