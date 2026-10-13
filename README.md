# Portfólio RPG — Henrique Santos de Souza

Portfólio interativo em formato de RPG de castelo, com uma jornada por cinco salas que apresentam formação, habilidades, projetos, certificações e contato profissional.

![Tela inicial do castelo com efeito de vento em WebGL](src/assets/castle.jpg)

---

## Demo

```
https://henriquessouzas.github.io/portfolio-rpg
```

---

## Funcionalidades

- **Tela do castelo** — imagem com efeito de vento em WebGL (foliagem e bandeiras animadas via shader GLSL); degradê suave para a entrada.
- **Mapa do castelo** — planta SVG vetorial com cinco salas navegáveis; herói animado percorre rotas calculadas por grafo (Dijkstra simplificado).
- **Salas mobiliadas** — cada sala tem móveis desenhados em SVG pixel art; o herói caminha até o objeto selecionado via pathfinding A\* em grid 20×14.
- **Estante da biblioteca** — livros clicáveis com painel de detalhes; categorias Cursos, Certificados e Projetos.
- **Versão simples** — modo sem animações, acessível via botão "Pular o jogo", com todo o conteúdo em HTML semântico.
- **Reduced motion** — detecta `prefers-reduced-motion: reduce` e substitui todas as animações por transições instantâneas.
- **Acessibilidade** — foco gerenciado entre telas, `aria-live` para anúncios de navegação, `aria-label` em todos os controles interativos, navegação por teclado completa (setas no mapa, Enter para entrar em sala, Escape para voltar).

---

## Arquitetura

```
main.tsx
  └── App.tsx
        └── Portfolio (src/components/rpg/portfolio.tsx)
              ├── WindScene          — WebGL sobre castle.jpg
              ├── CastleMap          — SVG da planta do castelo
              │     ├── RoomFurnishings (por sala)
              │     └── Furniture primitives
              ├── RoomScene          — sala mobiliada + herói
              │     ├── Furniture    — móveis SVG por tipo
              │     └── Hero / ObjectArt (art.tsx)
              └── ShelfView          — estante de livros
```

**Fluxo de estado** — `Portfolio` gerencia tudo com `useState`. Não há store global. As transições de tela são controladas por um token de operação (`useRef<number>`) que cancela animações assíncronas ao trocar de tela ou desmontar o componente.

**Roteamento no mapa** — `planRoute` em `castle-plan.ts` usa um grafo de nós (centros de salas + centros de portas) com Dijkstra para encontrar a sequência de waypoints. `sampleRoute` divide a rota em passos de tamanho fixo para animar o herói a 80 ms/passo.

**Pathfinding nas salas** — `roomGrid` em `room-layouts.ts` gera um grid 20×14 de strings com `#` nos móveis e `.` no piso. `findPath` em `portfolio-data.ts` usa `PF.AStarFinder` (pacote `pathfinding`) para calcular o caminho do herói até o objeto clicado.

---

## Estrutura de pastas

```
portfolio-rpg/
├── public/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── App.tsx              # Ponto de entrada React
│   │   ├── App.test.tsx         # Smoke test: renderiza "HENRIQUE"
│   │   └── main.tsx             # createRoot + import styles.css
│   ├── assets/
│   │   └── castle.jpg           # Imagem do castelo (1536×1024)
│   ├── components/
│   │   └── rpg/
│   │       ├── map/
│   │       │   ├── castle-map.tsx        # SVG da planta completa
│   │       │   ├── castle-map.test.tsx   # Testa renderização das salas
│   │       │   ├── furniture.tsx         # Primitivos SVG reutilizáveis
│   │       │   ├── palette.ts            # Cores das salas
│   │       │   └── room-furnishings.tsx  # Um componente por sala
│   │       ├── ui/
│   │       │   └── button.tsx            # Button com CVA (pixel/parchment/scene/artifact…)
│   │       ├── art.tsx                   # Hero, ObjectArt (20+ ícones), Crest
│   │       ├── portfolio.tsx             # Componente principal (toda a lógica de tela)
│   │       ├── room-scene.tsx            # Sala mobiliada + herói posicionado
│   │       ├── shelf-view.tsx            # Estante de livros clicáveis
│   │       ├── shelf-view.test.tsx       # Testa geração das prateleiras
│   │       └── wind-scene.tsx            # Efeito WebGL de vento
│   ├── lib/
│   │   ├── castle-plan.ts        # Coordenadas SVG, grafo de rotas, moveBy, sampleRoute
│   │   ├── castle-plan.test.ts   # Testa walkability e stand points
│   │   ├── portfolio-data.ts     # Tipos, mapa ASCII, findPath (A*), rooms[]
│   │   ├── portfolio-data.test.ts# Testa pathfinding entre todas as salas
│   │   ├── room-layouts.ts       # Fixtures por sala, roomGrid, roomEntrance
│   │   ├── room-layouts.test.ts  # Testa alcançabilidade de todos os objetos
│   │   └── utils.ts              # cn() — clsx + tailwind-merge
│   ├── test/
│   │   └── setup.ts              # jest-dom + mocks de matchMedia e scrollTo
│   └── styles.css                # Tailwind v4 + design tokens + classes do portfólio
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
└── package.json
```

---

## Pré-requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10

---

## Instalação e uso

```bash
# 1. Clone o repositório
git clone https://github.com/henriquessouzas/portfolio-rpg.git
cd portfolio-rpg

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:5173` no navegador. Clique em **Entrar no castelo**, navegue pelo mapa e explore as salas.

### Build de produção

```bash
npm run build     # gera dist/
npm run preview   # serve dist/ localmente para inspeção
```

---

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR (Vite) |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Checagem de tipos sem emitir arquivos |
| `npm run lint` | ESLint em `src/` |
| `npm run format` | Prettier em `src/` |
| `npm run test` | Vitest em modo run (CI) |
| `npm run test:watch` | Vitest em modo watch (desenvolvimento) |

---

## Stack e dependências

### Runtime

| Pacote | Versão | Uso |
|---|---|---|
| `react` + `react-dom` | ^19 | UI |
| `tailwindcss` | ^4.3 | Estilos utilitários |
| `class-variance-authority` | ^0.7 | Variantes do Button |
| `clsx` + `tailwind-merge` | ^2 / ^3 | Utilitário `cn()` |
| `@radix-ui/react-slot` | ^1.2 | `asChild` no Button |
| `lucide-react` | ^0.575 | Ícones |
| `pathfinding` | ^0.4 | A\* nas salas |

### Dev

| Pacote | Versão | Uso |
|---|---|---|
| `vite` | ^8 | Bundler |
| `@vitejs/plugin-react` | ^6 | JSX transform (Oxc) |
| `@tailwindcss/vite` | ^4.3 | Plugin Tailwind para Vite 8 |
| `typescript` | ~6.0 | Tipagem estática |
| `eslint` + `typescript-eslint` | ^10 / ^8 | Lint |
| `eslint-plugin-react-hooks` | ^7 | Regras de hooks |
| `prettier` | ^3 | Formatação |
| `vitest` | ^5 | Testes unitários |
| `@testing-library/react` | ^16 | Render em testes |
| `jsdom` | ^30 | Ambiente DOM nos testes |

---

## Personalização do conteúdo

Todo o conteúdo do portfólio está centralizado em **`src/lib/portfolio-data.ts`**. Edite o array `rooms` para atualizar as cinco salas:

```ts
// src/lib/portfolio-data.ts
export const rooms: [Room, Room, Room, Room, Room] = [
  {
    id: 'B',           // Biblioteca — Cursos, Certificados, Projetos
    name: 'Biblioteca',
    objects: [
      {
        name: 'Cursos',
        title: 'O conhecimento é uma aventura',
        description: '...',
        tags: ['Estudos'],
        art: 'book',
        books: [
          {
            title: 'Nome do curso',
            subtitle: 'Curso',
            description: 'Plataforma, carga horária e o que você construiu.',
            tags: ['React'],
            color: 'ember',   // ember | forest | mana | gold | royal
          },
        ],
      },
    ],
  },
  // T — Sala do trono (história pessoal e contato)
  // A — Aposentos (além do código)
  // R — Arsenal (habilidades técnicas)
  // L — Laboratório (experimentos e projetos em andamento)
];
```

**Campos de cada `Room`:**

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `'B' \| 'T' \| 'A' \| 'R' \| 'L'` | Identificador da sala |
| `name` | `string` | Nome exibido no mapa e no HUD |
| `category` | `string` | Subtítulo da categoria (ex.: "Habilidades") |
| `subtitle` | `string` | Frase exibida abaixo do nome da sala |
| `objects` | `[Artifact, ...Artifact[]]` | Ao menos um objeto interativo |

**Campos de cada `Artifact`:**

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Nome do objeto no mapa da sala |
| `title` | `string` | Título no painel de detalhes |
| `description` | `string` | Texto descritivo |
| `tags` | `string[]` | Tags exibidas como badges |
| `art` | `string` | Ícone SVG (ver lista abaixo) |
| `books?` | `Book[]` | Se presente, abre a estante de livros |

**Ícones disponíveis** (`art`): `sword`, `shield`, `bow`, `anvil`, `book`, `books`, `scroll`, `throne`, `trophy`, `letter`, `bed`, `desk`, `poster`, `chest`, `potion`, `flask`, `cauldron`.

---

## Acessibilidade

- Navegação por teclado completa: **setas** movem o herói no mapa, **Enter** entra na sala sob o herói, **Escape** volta à tela anterior.
- Foco movido programaticamente para o `<h1>` de cada nova tela via `heading.current?.focus()`.
- `role="status"` com `aria-live="polite"` anuncia destinos e objetos selecionados para leitores de tela.
- `aria-label` em todos os botões de sala, objeto e controles de navegação.
- `aria-pressed` nos botões de sala do mapa indica a sala de destino atual.
- Modo **Pular o jogo** expõe todo o conteúdo em HTML semântico sem animações.
- `prefers-reduced-motion: reduce` desativa o shader WebGL, as animações do herói e as transições de tela.

---

## Decisões técnicas

### WebGL para o efeito de vento
O shader GLSL em `wind-scene.tsx` aplica deslocamento de textura localizado: foliagem e bandeiras têm máscaras independentes (`patch` e `cloth`), enquanto a alvenaria permanece estática. O canvas só é exibido após o primeiro frame renderizado (`element.dataset['ready']`), evitando flash. Em caso de perda de contexto WebGL, o canvas é ocultado e a imagem estática permanece visível.

### Pathfinding em dois níveis
O projeto usa dois sistemas de pathfinding distintos:
- **Mapa do castelo** (`castle-plan.ts`) — grafo de nós com Dijkstra. Adequado para o espaço contínuo do SVG 640×520 com poucas salas e portas.
- **Interior das salas** (`portfolio-data.ts` + `room-layouts.ts`) — grid 20×14 com A\* (`pathfinding` npm). Adequado para o espaço discreto com móveis como obstáculos.

### Token de operação para cancelamento assíncrono
Funções como `goToRoom` e `pickObject` são `async` e executam loops de animação com `await pause()`. Um `useRef<number>` incrementado a cada nova operação permite que qualquer iteração verifique `token !== operation.current` e abandone silenciosamente se uma operação mais recente foi iniciada — sem `AbortController` e sem vazamento de estado.

### Tailwind v4 com Vite 8
`@tailwindcss/vite` v4.2.x não suporta Vite 8. A versão mínima compatível é **v4.3.3** (`peer vite: "^5.2.0 || ^6 || ^7 || ^8"`).

### TypeScript 6 e `baseUrl`
`baseUrl` está deprecado no TypeScript 6 quando usado junto com `paths`. O projeto usa `"ignoreDeprecations": "6.0"` para manter a configuração funcional enquanto a toolchain não migra para a nova sintaxe de `paths` sem `baseUrl`.

---

## Problemas conhecidos

### Testes falham com `Cannot read properties of undefined (reading 'config')`

Todos os arquivos `.test.{ts,tsx}` falham com este erro ao rodar `npm test`. A causa é uma incompatibilidade entre **Vitest 5**, **Vite 8** e **`@vitejs/plugin-react` v6 (Oxc)**. O erro ocorre na chamada de `describe()`, antes de qualquer código de teste ser executado.

Este é um bug não resolvido na combinação dessas versões. Os testes estão escritos e corretos — o problema é exclusivamente de ambiente de execução. Opções de contorno:

- Fazer downgrade para `@vitejs/plugin-react` v4 + Vite 6 + Vitest 3 (quebra outras dependências).
- Aguardar correção upstream no plugin Oxc ou no Vitest 5.
- Migrar para `@vitejs/plugin-react-swc` (não testado com esta combinação).

O build de produção (`npm run build`) e a checagem de tipos (`npm run typecheck`) funcionam normalmente.

---

## Licença

MIT © 2026 Henrique Santos de Souza
