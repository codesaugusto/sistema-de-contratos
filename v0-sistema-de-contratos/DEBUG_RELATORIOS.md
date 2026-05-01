# 🔍 Debug: Acompanhando a Requisição Passo a Passo

## Como Ver o que Está Acontecendo?

### 1️⃣ Abra o DevTools (F12)

Na aba **Console**, você verá logs como:

```
[API] GET http://localhost:8080/api/v1/dashboard/stats
[API] Headers: { Authorization: Bearer eyJhbGc..., Content-Type: application/json }
[API] Token enviado (primeiros 30 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[API] Resposta recebida: Status 200
```

**O que cada linha significa:**

| Log                                   | Significado                    |
| ------------------------------------- | ------------------------------ |
| `[API] GET http://...`                | Requisição sendo enviada       |
| `[API] Headers: {...}`                | Headers HTTP (token JWT aqui!) |
| `[API] Resposta recebida: Status 200` | ✅ Sucesso!                    |
| `[API Error] Status: 401`             | ❌ Token expirado              |
| `[API Error] Status: 500`             | ❌ Erro no servidor            |

---

## 2️⃣ Abra a Aba **Network**

1. F12 → **Network**
2. Recarregue a página (F5)
3. Procure por `dashboard` na lista

**Você verá uma requisição como:**

```
GET /api/v1/dashboard/stats - Status 200 - 120ms
```

**Clique nela e veja:**

**Aba "Response":**

```json
{
  "totalContratos": 150,
  "contratosAtivos": 120,
  "contratosVencidos": 15,
  "contratosExpirando": 30,
  "valorTotal": 500000.0,
  "proximosVencimentos": [
    {
      "id": "uuid-1",
      "titulo": "Contrato XYZ",
      "motorista": "João Silva",
      "empresa": "Transportadora ABC",
      "dataInicio": "2025-01-15",
      "dataVencimento": "2026-01-15",
      "valor": 5000.0,
      "status": "ATIVO"
    }
  ],
  "alertasNaoLidos": 3
}
```

**Aba "Headers":**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: access_token=eyJhbGci...; Path=/; HttpOnly; Secure
```

---

## 3️⃣ Veja o Estado do React

Instale a extensão **React DevTools** (Chrome/Firefox):

1. Abra DevTools (F12)
2. Aba **Components**
3. Procure por `Relatorios`

**Você verá:**

```
Relatorios
  ├─ state: stats
  │  └─ {
  │     "totalContratos": 150,
  │     "contratosAtivos": 120,
  │     ...
  │  }
  ├─ state: loading → false
  └─ state: error → null
```

Quando carrega:

```
Relatorios
  ├─ state: loading → true  ← Mudança detectada!
```

Quando retorna:

```
Relatorios
  ├─ state: loading → false  ← Mudança detectada!
  ├─ state: stats → {...}    ← Mudança detectada!
```

---

## 🧪 Teste: Simulando Erro

### Teste 1: Desligue a Internet

1. Abra a página de relatórios
2. Clique em DevTools (F12) → **Network**
3. Clique em "Offline" ❌
4. Clique em "Recarregar"

**Resultado esperado:**

- Spinner aparece
- Depois de alguns segundos, aparece o card vermelho de erro
- Console mostra: `[API Error] Status: 0` ou `Failed to fetch`

---

### Teste 2: Token Expirado

1. Abra Console (F12)
2. Digite: `localStorage.removeItem("@contratos:token")`
3. Recarregue a página
4. Clique em "Recarregar dados"

**Resultado esperado:**

- Spinner aparece
- Depois de alguns segundos, redireciona para `/login`
- Console mostra: `[API] Token inválido/expirado (401)`

---

## 📈 Como Acompanhar o Fluxo Completo

Adicione este código temporariamente para debugar:

```tsx
// app/relatorios/page.tsx - logo no início da função

export default function Relatorios() {
  // ... imports ...

  const { stats: apiStats, loading, error, refetch } = useRelatorioDashboard();

  // 🔍 DEBUG: Log cada mudança de estado
  useEffect(() => {
    console.log("🔄 Estado do hook mudou:");
    console.log("  loading:", loading);
    console.log("  error:", error);
    console.log("  stats:", apiStats);
  }, [loading, error, apiStats]);

  // resto do código...
}
```

**Agora, toda vez que os dados mudam, você verá no console:**

```
🔄 Estado do hook mudou:
  loading: true
  error: null
  stats: null

🔄 Estado do hook mudou:
  loading: false
  error: null
  stats: {
    totalContratos: 150,
    contratosAtivos: 120,
    ...
  }
```

---

## 📊 Cenários de Teste

### ✅ Cenário 1: Carregamento Normal

```
[Usuário abre página]
  ↓
[loading = true] → mostra spinner
  ↓
[API request: GET /dashboard/stats]
  ↓
[Response: 200 OK] com dados
  ↓
[loading = false, stats = {...}] → mostra dados
```

**Console esperado:**

```
[API] GET http://localhost:8080/api/v1/dashboard/stats
[API] Resposta recebida: Status 200
```

---

### ⚠️ Cenário 2: Conexão Lenta

```
[Usuário abre página]
  ↓
[loading = true] → mostra spinner (por muito tempo)
  ↓
[API request: GET /dashboard/stats] (lento...)
  ↓
[Response: 200 OK] depois de 5 segundos
  ↓
[loading = false, stats = {...}] → dados aparecem
```

**Console esperado:**

```
[API] GET http://localhost:8080/api/v1/dashboard/stats
[depois de 5 segundos]
[API] Resposta recebida: Status 200
```

---

### ❌ Cenário 3: Erro 401 (Token Expirado)

```
[Usuário abre página]
  ↓
[loading = true] → mostra spinner
  ↓
[API request: GET /dashboard/stats com token antigo]
  ↓
[Response: 401 Unauthorized]
  ↓
[Redireciona para /login]
```

**Console esperado:**

```
[API] GET http://localhost:8080/api/v1/dashboard/stats
[API] Token inválido/expirado (401)
[window.location.href = "/login"]
```

---

### ❌ Cenário 4: Erro 500 (Servidor)

```
[Usuário abre página]
  ↓
[loading = true] → mostra spinner
  ↓
[API request: GET /dashboard/stats]
  ↓
[Response: 500 Internal Server Error]
  ↓
[loading = false, error = "Erro 500: ..."] → mostra card vermelho
```

**Console esperado:**

```
[API] GET http://localhost:8080/api/v1/dashboard/stats
[API Error] Status: 500
[API Error] Message: Internal Server Error
```

---

## 🎯 Checklist de Debugging

Use este checklist para debugar problemas:

- [ ] DevTools aberto (F12)?
- [ ] Console limpo (Ctrl+L)?
- [ ] Você vê logs `[API]` quando abre a página?
- [ ] Network tab mostra requisição com Status 200?
- [ ] Response contém JSON válido?
- [ ] React DevTools mostra `stats` com dados?
- [ ] Página renderiza os cards com números?
- [ ] Gráficos aparecem?
- [ ] Tabela de vencimentos tem dados?
- [ ] Botão "Recarregar" funciona?

Se algum falhar, veja qual é o problema:

| Problema         | Solução                                      |
| ---------------- | -------------------------------------------- |
| Sem logs `[API]` | O hook não foi chamado. Verifique import     |
| Status 401       | Token expirado. Faça login novamente         |
| Status 500       | Erro no backend. Verifique servidor Java     |
| Response vazio   | API não retornou dados. Backend está online? |
| Página em branco | Erro de render. Veja Console para exceções   |
| Gráficos vazios  | `dataStatus` é array vazio. Verifique dados  |

---

## 💡 Dicas Profissionais

### 1️⃣ Use o Console para testar

```javascript
// Teste a função de formatação
new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
}).format(500000);

// Resultado: "R$ 500.000,00"
```

### 2️⃣ Clone os dados da API

1. Console → Network → `dashboard`
2. Aba "Response"
3. Clique com direito → Copy
4. Cole em um arquivo `.json` para inspecionar estrutura

### 3️⃣ Simule dados no localStorage

```javascript
// Se quiser testar com dados hardcoded:
localStorage.setItem(
  "@contratos:debug",
  JSON.stringify({
    totalContratos: 100,
    contratosAtivos: 80,
    // ...
  }),
);
```

### 4️⃣ Inspecione Headers

Network → `dashboard` → Headers → Compare:

- O token está sendo enviado? ✅
- Está no formato Bearer? ✅
- Começa com `eyJ`? ✅

---

## 🎓 Próxima Lição

Agora que entende como debugar:

1. Tente quebrar algo propositalmente (ex: remova token)
2. Veja o que acontece no console
3. Conserte
4. Veja como ficou correto

**Aprender debugando é a melhor forma!** 🚀
