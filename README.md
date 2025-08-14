# Scrum Task Manager

Uma plataforma web moderna para controle pessoal de tarefas no estilo Scrum, desenvolvida especificamente para programadores.

## 🚀 Características

- **Interface Kanban**: Visualização clara das tarefas em colunas To Do, In Progress e Done
- **Tipagem Scrum**: Classifique tarefas como Story, Task, Bug ou Epic
- **Prioridades**: Defina prioridades (Baixa, Média, Alta, Crítica) com cores visuais
- **Estimativas**: Adicione estimativas de tempo em horas para cada tarefa
- **Responsáveis**: Atribua tarefas a diferentes membros da equipe
- **Estatísticas**: Dashboard com métricas em tempo real
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🎨 Design

- **Cores por Status**: Cada coluna do Kanban tem cores distintas:
  - 🔵 **To Do**: Azul (planejamento)
  - 🟡 **In Progress**: Amarelo (desenvolvimento)
  - 🟢 **Done**: Verde (concluído)
- **Cards Coloridos**: Bordas laterais coloridas nos cards para identificação rápida
- **Interface Moderna**: Design limpo usando Tailwind CSS

## 🛠️ Tecnologias

- **Vue.js 3**: Framework reativo com Composition API
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **Heroicons**: Ícones SVG modernos
- **Vite**: Build tool rápido para desenvolvimento

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Funcionalidades

### Gestão de Tarefas
- ✅ Criar novas tarefas com formulário detalhado
- ✅ Editar tarefas existentes
- ✅ Excluir tarefas
- ✅ Mover tarefas entre colunas (status)

### Tipos de Tarefa (Scrum)
- **Story**: Funcionalidades do ponto de vista do usuário
- **Task**: Tarefas técnicas e operacionais
- **Bug**: Correções de defeitos
- **Epic**: Grandes funcionalidades que podem ser divididas

### Prioridades
- **Baixa**: Tarefas que podem aguardar
- **Média**: Tarefas importantes mas não urgentes
- **Alta**: Tarefas importantes e urgentes
- **Crítica**: Tarefas bloqueantes que precisam atenção imediata

### Dashboard
- Total de tarefas
- Distribuição por status
- Soma total de horas estimadas
- Contadores em tempo real

## 🖱️ Drag and Drop

A aplicação agora suporte **arrastar e soltar** tarefas entre as colunas do Kanban Board!

### Como usar:
1. **Clique e segure** em qualquer card de tarefa
2. **Arraste** o card para a coluna desejada (To Do, In Progress, ou Done)
3. **Solte** o card na nova coluna
4. O status da tarefa será automaticamente atualizado

### Recursos visuais:
- **Cursor grab**: O cursor muda para uma "mãozinha" quando você passa sobre um card
- **Animações suaves**: Cards fazem animações durante o arraste
- **Feedback visual**: Cards ficam semi-transparentes durante o arraste
- **Drop zones**: Áreas vazias mostram onde você pode soltar os cards
- **Efeitos de hover**: Cards aumentam levemente quando selecionados

### Compatibilidade:
- ✅ Desktop (mouse)
- ✅ Touch devices (tablets e smartphones)
- ✅ Teclado (acessibilidade)

## 📱 Interface

A aplicação possui:
- Header com título e botão para nova tarefa
- Seção de estatísticas com cards informativos
- Board Kanban com três colunas coloridas
- Modal para criação/edição de tarefas
- Cards de tarefa com informações detalhadas

## 🎯 Próximos Passos

Esta é uma versão estática (frontend-only) da aplicação. Para uma versão completa, considere:

- Integração com backend/API REST
- Persistência de dados em banco de dados
- Autenticação de usuários
- Colaboração em tempo real
- Relatórios e analytics avançados
- Integração com ferramentas de desenvolvimento (Git, JIRA, etc.)

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstrativos.
