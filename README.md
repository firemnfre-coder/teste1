# Drogaria Paulinho Farma — site inicial

## Arquivos
- `app/page.js`: página da loja, busca, filtros por categoria e carrinho demonstrativo.
- `app/layout.js`: layout obrigatório do Next.js.
- `app/globals.css`: estilos responsivos.
- `package.json`: dependências e comandos.

## Publicar pelo GitHub
Envie o conteúdo desta pasta para a raiz do repositório GitHub, mantendo a pasta `app` e o `package.json` na raiz. Não envie a pasta externa `drogaria-paulinho-farma-completo` como uma pasta dentro do repositório; envie os arquivos que estão dentro dela.

Na Vercel, importe o repositório como Next.js. O site deve funcionar sem configurar o Supabase, usando produtos de demonstração.

## Conectar Supabase (opcional nesta primeira etapa)
Na Vercel > Settings > Environment Variables, configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use apenas a URL do projeto e a chave pública/anon/publishable. Nunca use a chave `service_role` ou uma chave secreta no navegador.
A tabela `produtos` precisa ter os campos `id`, `created_at`, `nome`, `descricao`, `preco`, `estoque`, `categoria`, `imagem`, `ativo`.
Configure políticas de leitura adequadas no Supabase antes de conectar o catálogo.

## Importante
Este é um catálogo inicial: o carrinho funciona localmente no navegador, mas ainda não envia pedidos, não reserva estoque e não processa pagamentos. Produtos de medicamentos devem ser vendidos e anunciados conforme as regras aplicáveis; confirme os requisitos regulatórios e operacionais antes de habilitar pedidos online.
