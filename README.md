# ContratoBus - Sistema de Gerenciamento de Contratos para Motoristas

Um SaaS moderno e intuitivo para motoristas de ônibus gerenciarem seus contratos de forma eficiente, com histórico completo, notificações automáticas e relatórios detalhados.

## Funcionalidades

### 1. Dashboard
- Visão geral com estatísticas em tempo real
- Cards informativos mostrando:
  - Total de contratos
  - Contratos ativos
  - Próximos vencimentos
  - Contratos pendentes
- Acesso rápido para principais ações

### 2. Gerenciamento de Contratos (CRUD)
- **Criar**: Adicione novos contratos com dados completos
- **Visualizar**: Veja todos os detalhes do contrato
- **Editar**: Atualize informações quando necessário
- **Deletar**: Remova contratos cancelados
- **Filtrar**: Busque por título, empresa ou motorista
- **Status automático**: Contratos marcam automaticamente como vencidos

### 3. Histórico com Versionagem
- Rastreie todas as alterações em cada contrato
- Visualize o antes e depois de cada mudança
- Timeline visual de eventos
- Tipos de eventos:
  - Contrato Criado
  - Contrato Atualizado
  - Contrato Vencido
  - Contrato Cancelado
- Histórico global de todos os contratos
- Histórico individual por contrato

### 4. Notificações Inteligentes
- **Alertas automáticos** para contratos vencendo
- Três níveis de urgência:
  - Critico: Vencendo em até 7 dias
  - Aviso: Vencendo em até 30 dias
  - Lembrete: Vencendo em até 60 dias
- Marque notificações como lidas
- Filtrar por status de leitura
- Acesso direto ao contrato a partir da notificação

### 5. Relatórios Avançados
- **Gráficos interativos**:
  - Distribuição por status (Pizza)
  - Valor por status (Barras)
  - Contratos por empresa (Barras)
- **Resumo executivo** com KPIs
- **Próximos vencimentos** ordenados por urgência
- **Exportar relatório** em JSON

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Armazenamento**: localStorage (dados locais)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Linguagem**: TypeScript

## Estrutura de Dados

### Contrato
```typescript
{
  id: string                      // ID único
  titulo: string                  // Nome do contrato
  descricao: string              // Detalhes adicionais
  dataInicio: string             // Data de início (YYYY-MM-DD)
  dataVencimento: string         // Data de vencimento (YYYY-MM-DD)
  valor: number                  // Valor em reais
  status: 'ativo' | 'vencido' | 'pendente' | 'cancelado'
  empresa: string                // Nome da empresa
  motorista: string              // Nome do motorista
  documentos: string[]           // Links de documentos (futuro)
  criadoEm: string              // Data de criação
  atualizadoEm: string          // Última atualização
}
```

### Histórico
```typescript
{
  id: string                     // ID único do evento
  contratoId: string            // ID do contrato
  acao: 'criado' | 'atualizado' | 'vencido' | 'cancelado'
  alteracoes: Record<string, any> // Dados das mudanças
  dataAlteracao: string         // Quando ocorreu
}
```

## Rotas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard principal |
| `/contratos` | Lista de contratos |
| `/contratos/novo` | Criar novo contrato |
| `/contratos/[id]` | Detalhes do contrato |
| `/contratos/[id]/editar` | Editar contrato |
| `/contratos/[id]/historico` | Histórico do contrato |
| `/historico` | Histórico global |
| `/notificacoes` | Central de notificações |
| `/relatorios` | Relatórios e análises |

## Como Usar

### 1. Criar um Contrato
1. Clique em "Novo Contrato" no Dashboard ou em Contratos
2. Preencha os dados obrigatórios:
   - Título do contrato
   - Empresa
   - Motorista (seu nome)
   - Data de início
   - Data de vencimento
   - Valor
3. Adicione descrição se desejar
4. Clique em "Salvar Contrato"

### 2. Gerenciar Contratos
1. Acesse a página "Contratos"
2. Use a barra de busca para filtrar
3. Clique nos botões de ação:
   - Olho: Visualizar detalhes
   - Lápis: Editar
   - Lixeira: Deletar

### 3. Acompanhar Histórico
- **Global**: Menu → Histórico
- **Por Contrato**: Detalhes do contrato → "Ver Histórico"
- Visualize todas as alterações realizadas

### 4. Receber Notificações
1. Acesse o menu → Notificações
2. Sistema gera alertas automáticos para:
   - Contratos vencendo em até 30 dias
   - Contratos vencidos
3. Marque como lida ou delete a notificação

### 5. Gerar Relatórios
1. Acesse o menu → Relatórios
2. Visualize gráficos e estatísticas
3. Clique em "Exportar" para baixar relatório em JSON

## Backup de Dados

Os dados são armazenados no localStorage do navegador. Para fazer backup:

1. Abra o DevTools (F12)
2. Console → Digite:
```javascript
copy(localStorage.getItem('contratos'))
```
3. Cole em um arquivo de texto para salvar

Para restaurar:
1. No Console, digite:
```javascript
localStorage.setItem('contratos', 'COLE_AQUI_O_JSON_SALVO')
```

## Próximas Melhorias

- [ ] Autenticação de usuário
- [ ] Banco de dados (Supabase, Neon, etc.)
- [ ] Upload de documentos
- [ ] Notificações por email
- [ ] Assinatura digital de contratos
- [ ] Integração com calendário
- [ ] Modo escuro aprimorado
- [ ] Aplicativo mobile
- [ ] Exportar para PDF
- [ ] Múltiplos usuários e equipes

## Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador para erros
2. Dados salvos em localStorage
3. Estado dos gráficos e filtros

## Licença

Criado com v0 - MIT License

---

**ContratoBus** - Seu sistema inteligente de contratos ao alcance de um clique!
