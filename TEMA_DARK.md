# Sistema de Tema Dark

## Visão Geral

O sistema foi configurado com suporte completo para tema dark/light usando `next-themes` com TailwindCSS v4.

## Como Funciona

### 1. **ThemeProvider** (`components/theme-provider.tsx`)
- Utiliza `next-themes` para gerenciar o estado do tema
- Detecta automaticamente a preferência do sistema
- Persiste a escolha do usuário no localStorage

### 2. **ThemeToggle** (`components/theme-toggle.tsx`)
- Componente client que permite alternar entre temas
- Mostra ícone de Sun (modo light) e Moon (modo dark)
- Com animação suave de transição

### 3. **Header** (`components/header.tsx`)
- Barra de navegação sticky no topo
- Integra o `ThemeToggle`
- Componentes de navegação destacados baseado na página atual
- Responsivo para mobile

### 4. **Design Tokens** (`app/globals.css`)
Os tokens de cor estão definidos em variáveis CSS:

```css
/* Modo Light (padrão) */
:root {
  --background: oklch(1 0 0);  /* Branco */
  --foreground: oklch(0.145 0 0);  /* Escuro */
  /* ... mais cores */
}

/* Modo Dark */
.dark {
  --background: oklch(0.145 0 0);  /* Escuro */
  --foreground: oklch(0.985 0 0);  /* Branco */
  /* ... mais cores */
}
```

## Como Usar

### Aplicando Tema em Componentes

Use as classes de tema do Tailwind automaticamente:

```tsx
<div className="bg-background text-foreground">
  Meu conteúdo muda com o tema
</div>
```

### Acessando o Tema Dinamicamente

Se você precisa da lógica do tema em um componente:

```tsx
'use client'

import { useTheme } from 'next-themes'

export function MeuComponente() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Alternar tema
    </button>
  )
}
```

## Cores por Tema

### Modo Light
- **Background**: Branco
- **Foreground**: Preto/Cinza escuro
- **Primary**: Azul escuro
- **Cards**: Branco
- **Borders**: Cinza claro

### Modo Dark
- **Background**: Cinza escuro/Preto
- **Foreground**: Branco
- **Primary**: Branco/Azul claro
- **Cards**: Cinza escuro
- **Borders**: Cinza intermediário

## Boas Práticas

1. **Use variáveis de design token**: Evite cores hardcoded
   - ✅ `bg-background text-foreground`
   - ❌ `bg-white text-black`

2. **Teste em ambos os temas**: Certifique-se que tudo funciona
   - Use o toggle de tema no header
   - Verifique contraste e legibilidade

3. **Componentes transparentes**: Alguns elementos devem manter aparência consistente
   - Use `bg-background/50` para transparências respeitosas

## Estrutura de Arquivos

```
components/
├── theme-provider.tsx    # Configura next-themes
├── theme-toggle.tsx      # Botão para alternar tema
├── header.tsx            # Header com navegação
└── layout-wrapper.tsx    # Wrapper do layout (opcional)

app/
├── layout.tsx            # Root layout com ThemeProvider
└── globals.css           # Variáveis CSS e design tokens
```

## Browsers Suportados

O tema dark é suportado em:
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Troubleshooting

### Tema não persiste
- Verifique se o `localStorage` está habilitado
- Verifique se `suppressHydrationWarning` está no `<html>`

### Ícones não animam corretamente
- Certifique-se que `dark:` modifier está aplicado corretamente
- Verifique transições CSS em `theme-toggle.tsx`

### Contraste baixo
- Revise as cores em `globals.css`
- Teste com ferramentas de contraste WCAG
