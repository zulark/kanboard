/**
 * Dicionário de tradução para mensagens de erro do Supabase Auth
 */
export const authErrorMessages = {
  // Erros de Login
  'Invalid login credentials': 'Email ou senha inválidos',
  'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
  'Invalid email or password': 'Email ou senha inválidos',
  'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos',
  'Account not found': 'Conta não encontrada',
  'Missing email or phone': 'Email é obrigatório',
  'Missing email': 'Email é obrigatório',
  'Missing phone': 'Telefone é obrigatório',
  
  // Erros de Registro
  'User already registered': 'Usuário já cadastrado com este email',
  'Signup not allowed for this instance': 'Cadastro não permitido nesta instância',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
  'Unable to validate email address: invalid format': 'Formato de email inválido',
  'Email address not authorized': 'Endereço de email não autorizado',
  
  // Erros de Email/Confirmação
  'Email link is invalid or has expired': 'Link do email inválido ou expirado',
  'Token has expired or is invalid': 'Token expirado ou inválido',
  'Email rate limit exceeded': 'Limite de emails excedido. Tente novamente mais tarde',
  'Confirmation token not found': 'Token de confirmação não encontrado',
  'For security purposes, you can only request this after 8 seconds.': 'Por segurança, aguarde alguns segundos antes de tentar novamente',
  
  // Erros de Senha
  'New password should be different from the old password': 'A nova senha deve ser diferente da senha atual',
  'New password should be different from the old password.': 'A nova senha deve ser diferente da senha atual',
  'Password is too weak': 'Senha muito fraca. Use uma senha mais forte',
  'Same password': 'A nova senha deve ser diferente da atual',
  
  // Erros de Reset de Senha
  'Password reset not allowed': 'Reset de senha não permitido',
  'Unable to send password reset email': 'Não foi possível enviar o email de reset de senha',
  
  // Erros de Sessão
  'Session not found': 'Sessão não encontrada. Faça login novamente',
  'Refresh token not found': 'Token de refresh não encontrado',
  'Invalid refresh token': 'Token de refresh inválido',
  'The user is already registered': 'O usuário já está registrado',
  
  // Erros de Rede/Servidor
  'Network request failed': 'Falha na conexão. Verifique sua internet',
  'Internal server error': 'Erro interno do servidor. Tente novamente',
  'Service unavailable': 'Serviço indisponível. Tente novamente mais tarde',
  'Bad gateway': 'Erro de conexão com o servidor',
  
  // Erros de Configuração
  'Invalid API key': 'Chave da API inválida',
  'Invalid JWT': 'Token JWT inválido',
  'JWT expired': 'Token JWT expirado',
  
  // Erros Genéricos
  'Unauthorized': 'Não autorizado',
  'Forbidden': 'Acesso negado',
  'Not found': 'Recurso não encontrado',
  'Conflict': 'Conflito de dados',
  'Unprocessable entity': 'Dados inválidos',
  
  // Erros específicos do fluxo
  'Email sending failed': 'Falha no envio do email',
  'Invalid verification code': 'Código de verificação inválido',
  'Verification code expired': 'Código de verificação expirado',
  'Account locked': 'Conta bloqueada temporariamente',
  'Account suspended': 'Conta suspensa',
  
  // Erros de validação
  'Invalid email': 'Email inválido',
  'Invalid password': 'Senha inválida',
  'Missing email': 'Email é obrigatório',
  'Missing password': 'Senha é obrigatória',
  'Weak password': 'Senha muito fraca',
  
  // Erros de OAuth/Providers externos
  'Provider not supported': 'Provedor não suportado',
  'OAuth error': 'Erro na autenticação externa',
  'Provider email not found': 'Email não encontrado no provedor externo'
}

/**
 * Traduz uma mensagem de erro do Supabase para português
 * @param {string} errorMessage - Mensagem de erro original
 * @returns {string} - Mensagem traduzida ou mensagem original se não encontrada
 */
export function translateAuthError(errorMessage) {
  if (!errorMessage) return 'Erro desconhecido'
  
  // Busca tradução exata
  if (authErrorMessages[errorMessage]) {
    return authErrorMessages[errorMessage]
  }
  
  // Busca por palavras-chave se não encontrar tradução exata
  const message = errorMessage.toLowerCase()
  
  // Detecta mensagens de limite de tempo com números variáveis
  if (message.includes('for security purposes') && message.includes('you can only request this after')) {
    // Extrai o número de segundos da mensagem (ex: "after 8 seconds")
    const secondsMatch = message.match(/after (\d+) seconds?/)
    if (secondsMatch) {
      const seconds = secondsMatch[1]
      return `Por segurança, aguarde ${seconds} segundos antes de tentar novamente`
    }
    return 'Por segurança, aguarde alguns segundos antes de tentar novamente'
  }
  
  // Detecta diferentes variações da mensagem de senha diferente
  if (message.includes('new password should be different') || 
      message.includes('same password') || 
      (message.includes('password') && message.includes('different'))) {
    return 'A nova senha deve ser diferente da senha atual'
  }
  
  if (message.includes('invalid') && message.includes('credentials')) {
    return 'Credenciais inválidas'
  }
  
  if (message.includes('email') && message.includes('not') && message.includes('confirmed')) {
    return 'Email não confirmado'
  }
  
  if (message.includes('too many')) {
    return 'Muitas tentativas. Tente novamente mais tarde'
  }
  
  if (message.includes('already registered') || message.includes('user already')) {
    return 'Usuário já cadastrado'
  }
  
  if (message.includes('missing email') || (message.includes('missing') && message.includes('email'))) {
    return 'Email é obrigatório'
  }
  
  if (message.includes('missing password') || (message.includes('missing') && message.includes('password'))) {
    return 'Senha é obrigatória'
  }
  
  if (message.includes('missing') && (message.includes('phone') || message.includes('email or phone'))) {
    return 'Email ou telefone é obrigatório'
  }
  
  if (message.includes('password') && message.includes('weak')) {
    return 'Senha muito fraca'
  }
  
  if (message.includes('network') || message.includes('connection')) {
    return 'Erro de conexão. Verifique sua internet'
  }
  
  if (message.includes('server error') || message.includes('internal')) {
    return 'Erro interno. Tente novamente'
  }
  
  if (message.includes('expired')) {
    return 'Token ou sessão expirados'
  }
  
  if (message.includes('invalid') && message.includes('format')) {
    return 'Formato inválido'
  }
  
  // Se não encontrar nenhuma tradução, retorna a mensagem original
  // mas com primeira letra maiúscula
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
}

/**
 * Mensagens de sucesso traduzidas
 */
export const successMessages = {
  'signIn': 'Login realizado com sucesso!',
  'signUp': 'Conta criada com sucesso!',
  'signUpConfirmation': 'Verifique seu email para confirmar a conta!',
  'passwordReset': 'Email de recuperação enviado com sucesso!',
  'passwordUpdate': 'Senha atualizada com sucesso!',
  'emailUpdate': 'Email atualizado com sucesso!',
  'profileUpdate': 'Perfil atualizado com sucesso!',
  'signOut': 'Logout realizado com sucesso!'
}

/**
 * Mensagens de carregamento
 */
export const loadingMessages = {
  'signIn': 'Fazendo login...',
  'signUp': 'Criando conta...',
  'passwordReset': 'Enviando email...',
  'passwordUpdate': 'Atualizando senha...',
  'emailUpdate': 'Atualizando email...',
  'profileUpdate': 'Atualizando perfil...',
  'signOut': 'Saindo...',
  'loading': 'Carregando...'
}
