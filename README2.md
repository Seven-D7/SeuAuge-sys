# Fluxo de Aquisição de Planos

Este documento descreve o processo de escolha e compra de planos dentro do **Meu Auge**.

## Tela de Planos

1. Acesse `Planos` no menu lateral.
2. São exibidos os planos A, B e C, com preço e lista de benefícios.
3. O plano atual do usuário é destacado. Opções de upgrade aparecem somente para planos superiores.
4. Ao clicar em **Adquirir**, o usuário é levado para a tela de pagamento (`/payment?plan=X`).

## Pagamento

1. Na tela de pagamento são apresentadas as formas de pagamento (PIX, cartão e boleto).
2. O botão **Realizar Pagamento** abre o gateway externo definido em `VITE_PAYMENT_URL`.
3. Após concluir o pagamento, o usuário retorna e clica em **Já paguei**.
4. O sistema registra o novo plano via endpoint `/plan`, atualiza o token do Firebase e redireciona para a tela de planos.

## Liberação de Conteúdo

Com o token atualizado, o `PlanGuard` libera o acesso a páginas restritas conforme o plano adquirido. Planos superiores têm acesso a mais vídeos e funcionalidades.
