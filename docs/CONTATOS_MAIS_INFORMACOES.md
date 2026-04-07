# Contatos: “Mais informações” e dados adicionais

Este documento explica, em linguagem simples, o que foi feito na tela de **Contatos** em torno do link **“Mais informações”**, do **modal** de campos extras e dos **avisos (toasts)**. Serve para onboarding da equipe e para quem for continuar a integração com API depois.

---

## O problema que resolvemos

O formulário principal de contato fica na coluna esquerda. Alguns campos **não couberam** aí ou são “complementares” (indicação, categoria eleitoral, etc.). Eles foram colocados num **segundo formulário** que abre num **modal** quando o usuário clica em **“Mais informações”**.

Porém existem **dois lugares** onde o usuário pode “salvar”:

1. O botão principal do formulário (**“Salvar alterações”** / **“Cadastrar contato”**).
2. O botão dentro do modal (**“Salvar informações adicionais”**).

A equipe precisava deixar claro:

- Quando os dados **extras** ainda **não** foram “confirmados” no fluxo da sessão.
- Quando o usuário salva só o **formulário principal** mas ainda há **informações adicionais** pendentes.

Por isso implementamos **estado compartilhado**, **ícone de atenção**, **tooltips acessíveis** e **toasts** com mensagens diferentes.

---

## Conceitos rápidos

| Termo | O que significa aqui |
|--------|----------------------|
| **Estado (state)** | Dados guardados no React que mudam com o tempo (texto dos campos, se o modal está aberto, etc.). |
| **Estado “lifted” (elevado)** | Em vez de cada componente guardar seus próprios dados sozinhos, o **pai** (`Contatos.jsx`) guarda tudo e **passa para baixo** via props. Assim o formulário principal e o modal **enxergam os mesmos dados**. |
| **Snapshot salvo** | Uma **cópia** dos valores extras **na última vez** que o usuário clicou em **“Salvar informações adicionais”**. Serve para saber se algo mudou depois disso. |
| **Dirty (sujo)** | Significa “**há diferença** entre o que está na tela agora e o que foi salvo no snapshot”. Se estiver dirty, mostramos o ícone de atenção e podemos avisar no toast ao salvar só o principal. |
| **Toast** | Pequena mensagem que aparece no canto da tela (sucesso, aviso, erro). |

---

## Arquivos principais

| Arquivo | Papel |
|---------|--------|
| [`frontend/src/components/Contatos.jsx`](../frontend/src/components/Contatos.jsx) | “Cérebro” da página: guarda `maisInfoValues`, snapshot, calcula se está dirty, mostra toasts, repassa props para o formulário e o modal. |
| [`frontend/src/components/ContatosContactForm.jsx`](../frontend/src/components/ContatosContactForm.jsx) | Formulário principal; ao enviar, chama o callback do pai; mostra ícone + dica no link “Mais informações” quando necessário. |
| [`frontend/src/components/ContatosMaisInformacoesModal.jsx`](../frontend/src/components/ContatosMaisInformacoesModal.jsx) | Modal **controlado**: não guarda os valores sozinho; recebe `values` e `onMaisInfoChange` do pai; tem o botão **“Salvar informações adicionais”**. |
| [`frontend/src/components/ContatosFormPrimitives.jsx`](../frontend/src/components/ContatosFormPrimitives.jsx) | Grade e células reutilizáveis (mesma ideia visual da coluna esquerda do layout). |
| [`frontend/src/components/Toast.jsx`](../frontend/src/components/Toast.jsx) | Componente de toast; ganhou a variante **`warning`** (fundo/borda em tom de aviso). |

---

## Fluxo resumido (passo a passo)

1. O usuário preenche campos no **modal** → os valores vão para `maisInfoValues` no `Contatos.jsx`.
2. Comparamos `maisInfoValues` com `maisInfoSavedSnapshot` (JSON). Se forem diferentes → **dirty = true**.
3. Se **dirty**, mostramos o **ícone de atenção** ao lado de “Mais informações” e um texto de ajuda (tooltip + leitores de tela).
4. Quando o usuário clica **“Salvar informações adicionais”**, copiamos os valores atuais para o **snapshot**, fechamos o modal e mostramos toast de **sucesso**.
5. Quando o usuário envia o **formulário principal**:
   - Se ainda houver dados extras **dirty** → toast **warning** lembrando de salvar também as informações adicionais.
   - Se **não** houver diferença → toast de **sucesso** só dos dados principais.
6. Ao trocar **Todos / Novo** (pill), **zeramos** valores extras e snapshot (novo “contexto” de edição).

---

## Detalhes de UX que implementamos

### Ícone de atenção

- Arquivo: [`frontend/assets/img/attention-icon.svg`](../frontend/assets/img/attention-icon.svg).
- Só aparece quando `showMaisInfoAttention` é verdadeiro (no código: quando `maisInfoDirty`).
- Além do visual, há **`title`** (dica ao passar o mouse) e **`aria-describedby`** com texto escondido visualmente mas lido por leitores de tela — boa prática de acessibilidade.

### Toasts

- **Sucesso** (verde): dados principais OK sem pendências extras, ou informações adicionais salvas.
- **Warning** (âmbar): dados principais “salvos” no fluxo atual, mas **ainda há** alterações extras não refletidas no snapshot.

O componente `Toast` foi estendido com **`variant="warning"`** usando as cores de aviso do tema (`warningBg`, `warningText`, etc.).

### Largura do modal

O modal usa uma largura máxima calculada para ficar **alinhada à ideia** da coluna esquerda do layout em desktop; em mobile, usa quase a largura útil da tela. Isso está comentado no próprio componente do modal.

---

## Integração com o webhook (n8n)

A URL está em **`CONFIG.API_ENDPOINTS.contatos`** ([`frontend/src/config/constants.js`](../frontend/src/config/constants.js)). O envio usa **`POST`** com JSON e o header **`Authorization`** quando o usuário tem sessão (mesmo padrão Basic dos outros webhooks do app).

Serviço: [`frontend/src/services/contatosApi.js`](../frontend/src/services/contatosApi.js) (`postContatos`).

**Corpo enviado no formulário principal (“Salvar alterações” / “Cadastrar contato”):**

- `modo`: `"todos"` ou `"novo"` (pill da página).
- `dadosPrincipais`: objeto com os campos do formulário principal (nome, WhatsApp, CEP, endereço, etc.).
- `informacoesAdicionais`: **último snapshot salvo** das informações adicionais (não inclui edições ainda não confirmadas no modal). Assim o aviso de “salve também as informações adicionais” continua fazendo sentido quando há diferença entre o que está no modal e o snapshot.

**Corpo enviado em “Salvar informações adicionais”:**

- `modo`: mesmo pill.
- `informacoesAdicionais`: valores atuais do modal.

Em caso de erro HTTP, um toast **vermelho** mostra a mensagem retornada ou um texto genérico.

O fluxo de **snapshot** no navegador continua valendo para UX (ícone e toasts); o servidor pode evoluir depois (ex.: retornar ID do contato, merge no n8n).

---

## Dúvidas frequentes

**Por que não deixar o estado só dentro do modal?**  
Porque o **formulário principal** precisa saber se há pendências **sem** abrir o modal — por exemplo, para o toast e o ícone.

**Por que `JSON.stringify` para comparar?**  
É uma forma simples de comparar objetos planos com as mesmas chaves. Para dados muito grandes ou tipos especiais, no futuro pode valer um `deepEqual` dedicado ou comparação campo a campo.

**O botão “Salvar informações adicionais” está dentro de um `<form>` no modal?**  
Sim, mas o botão é `type="button"` para **não** disparar submit acidental do form de forma inesperada; o clique chama a função `onSaveInformacoesAdicionais` passada pelo pai.

---

## Referência rápida das props (para devs)

- **`ContatosContactForm`**: `onMainFormSave`, `showMaisInfoAttention`, `maisInfoAttentionHint`, além de `onMaisInformacoesClick` e `mode`.
- **`ContatosMaisInformacoesModal`**: `values`, `onMaisInfoChange`, `onSaveInformacoesAdicionais`, `isOpen`, `onClose`.
- Função exportada **`createInitialMaisInfoValues()`**: objeto inicial vazio dos campos extras (usado no reset e no estado inicial).

---

*Documento gerado para acompanhamento da feature “Mais informações” / dados adicionais na superfície Contatos.*
