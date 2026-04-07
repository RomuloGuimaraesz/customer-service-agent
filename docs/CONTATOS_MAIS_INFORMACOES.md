# Contatos: “Mais informações” e dados adicionais

Este documento explica, em linguagem simples, o que foi feito na tela de **Contatos** em torno do link **“Mais informações”**, do **modal** de campos extras e dos **avisos (toasts)**. Serve para onboarding da equipe e para quem for continuar a integração com API depois.

---

## O problema que resolvemos

O formulário principal de contato fica na coluna esquerda. Alguns campos **não couberam** aí ou são “complementares” (indicação, categoria eleitoral, etc.). Eles foram colocados num **segundo formulário** que abre num **modal** quando o usuário clica em **“Mais informações”**.

Para reduzir fricção e evitar duplicidade, o fluxo foi simplificado para **um único ponto de persistência**:

1. O botão principal do formulário (**“Salvar alterações”** / **“Cadastrar contato”**) é o único que envia para a API.
2. O botão do modal agora é **“Concluir”** e serve apenas para fechar o modal (edição local).

Assim, os dados extras continuam no estado compartilhado e são enviados junto com os dados principais no submit final.

---

## Conceitos rápidos

| Termo | O que significa aqui |
|--------|----------------------|
| **Estado (state)** | Dados guardados no React que mudam com o tempo (texto dos campos, se o modal está aberto, etc.). |
| **Estado “lifted” (elevado)** | Em vez de cada componente guardar seus próprios dados sozinhos, o **pai** (`Contatos.jsx`) guarda tudo e **passa para baixo** via props. Assim o formulário principal e o modal **enxergam os mesmos dados**. |
| **Draft local** | Valores das informações adicionais mantidos no estado do React enquanto o usuário edita. |
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
2. Ao clicar **“Concluir”**, o modal fecha e os valores permanecem em memória (sem chamada de API).
3. Quando o usuário envia o **formulário principal**, a tela envia **dados principais + informações adicionais atuais** em uma única operação.
4. Ao trocar **Todos / Novo** (pill), os valores extras são resetados para o estado inicial do contexto atual.

---

## Detalhes de UX que implementamos

### Toasts

- **Sucesso** (verde): dados principais registrados; ao concluir o modal, o usuário também recebe confirmação de que as informações adicionais estão prontas para envio no submit principal.
- **Erro** (vermelho): falha de integração no envio para a API.

O componente `Toast` foi estendido com **`variant="warning"`** usando as cores de aviso do tema (`warningBg`, `warningText`, etc.).

### Largura do modal

O modal usa uma largura máxima calculada para ficar **alinhada à ideia** da coluna esquerda do layout em desktop; em mobile, usa quase a largura útil da tela. Isso está comentado no próprio componente do modal.

---

## Integração com o webhook (n8n)

A URL está em **`CONFIG.API_ENDPOINTS.contatos`** ([`frontend/src/config/constants.js`](../frontend/src/config/constants.js)). O envio usa **`POST`** com JSON e o header **`Authorization`** quando o usuário tem sessão (mesmo padrão Basic dos outros webhooks do app).

Serviço: [`frontend/src/services/contatosApi.js`](../frontend/src/services/contatosApi.js) (`postContatos`).

**Corpo enviado no formulário principal (“Salvar alterações” / “Cadastrar contato”)**:

- `modo`: `"todos"` ou `"novo"` (pill da página).
- `dadosPrincipais`: objeto com os campos do formulário principal (nome, WhatsApp, CEP, endereço, etc.).
- `informacoesAdicionais`: valores **atuais** de `maisInfoValues` (estado compartilhado do modal).

**Observação**: o botão **“Concluir”** no modal não envia para API; ele apenas fecha o modal e mantém os dados no estado local até o submit principal.

Em caso de erro HTTP, um toast **vermelho** mostra a mensagem retornada ou um texto genérico.

Com isso, o modo **Novo** evita criação duplicada por dois cliques de salvar em superfícies diferentes.

---

## Dúvidas frequentes

**Por que não deixar o estado só dentro do modal?**  
Porque o **formulário principal** precisa enviar as informações adicionais no submit único.

**O botão “Concluir” está dentro de um `<form>` no modal?**  
Sim, mas o botão é `type="button"` para **não** disparar submit acidental do form de forma inesperada.

---

## Referência rápida das props (para devs)

- **`ContatosContactForm`**: `onMainFormSave`, além de `onMaisInformacoesClick` e `mode`.
- **`ContatosMaisInformacoesModal`**: `values`, `onMaisInfoChange`, `onSaveInformacoesAdicionais`, `isOpen`, `onClose`.
- Função exportada **`createInitialMaisInfoValues()`**: objeto inicial vazio dos campos extras (usado no reset e no estado inicial).

---

*Documento gerado para acompanhamento da feature “Mais informações” / dados adicionais na superfície Contatos.*
