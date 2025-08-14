import { ref, watch } from 'vue'

export function useMessages() {
    const errorMessage = ref('')
    const successMessage = ref('')
    const infoMessage = ref('')
    
    // Timeouts para cada tipo de mensagem
    let errorTimeout = null
    let successTimeout = null
    let infoTimeout = null
    
    // Configuração de timeouts (em milissegundos)
    const TIMEOUT_DURATION = {
        error: 7000,    // 7 segundos para erros
        success: 5000,  // 5 segundos para sucessos
        info: 4000      // 4 segundos para informações
    }
    
    // Função para limpar timeouts
    const clearTimeouts = () => {
        if (errorTimeout) {
            clearTimeout(errorTimeout)
            errorTimeout = null
        }
        if (successTimeout) {
            clearTimeout(successTimeout)
            successTimeout = null
        }
        if (infoTimeout) {
            clearTimeout(infoTimeout)
            infoTimeout = null
        }
    }
    
    // Watchers para auto-dismiss das mensagens
    watch(errorMessage, (newValue) => {
        if (errorTimeout) clearTimeout(errorTimeout)
        
        if (newValue) {
            errorTimeout = setTimeout(() => {
                errorMessage.value = ''
            }, TIMEOUT_DURATION.error)
        }
    })
    
    watch(successMessage, (newValue) => {
        if (successTimeout) clearTimeout(successTimeout)
        
        if (newValue) {
            successTimeout = setTimeout(() => {
                successMessage.value = ''
            }, TIMEOUT_DURATION.success)
        }
    })
    
    watch(infoMessage, (newValue) => {
        if (infoTimeout) clearTimeout(infoTimeout)
        
        if (newValue) {
            infoTimeout = setTimeout(() => {
                infoMessage.value = ''
            }, TIMEOUT_DURATION.info)
        }
    })
    
    // Funções para definir mensagens
    const setError = (message) => {
        clearMessages() // Limpa outras mensagens
        errorMessage.value = message
    }
    
    const setSuccess = (message) => {
        clearMessages() // Limpa outras mensagens
        successMessage.value = message
    }
    
    const setInfo = (message) => {
        clearMessages() // Limpa outras mensagens
        infoMessage.value = message
    }
    
    // Função para limpar todas as mensagens
    const clearMessages = () => {
        errorMessage.value = ''
        successMessage.value = ''
        infoMessage.value = ''
        clearTimeouts()
    }
    
    // Função para limpar uma mensagem específica
    const clearMessage = (type) => {
        switch (type) {
            case 'error':
                errorMessage.value = ''
                if (errorTimeout) {
                    clearTimeout(errorTimeout)
                    errorTimeout = null
                }
                break
            case 'success':
                successMessage.value = ''
                if (successTimeout) {
                    clearTimeout(successTimeout)
                    successTimeout = null
                }
                break
            case 'info':
                infoMessage.value = ''
                if (infoTimeout) {
                    clearTimeout(infoTimeout)
                    infoTimeout = null
                }
                break
        }
    }
    
    return {
        errorMessage,
        successMessage,
        infoMessage,
        setError,
        setSuccess,
        setInfo,
        clearMessages,
        clearMessage,
        timeouts: TIMEOUT_DURATION
    }
}
