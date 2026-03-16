# Central de Newsletter - Agencia de Viagens

Painel administrativo para montar newsletter semanal de turismo com template padrao:

- contatos (`nome + email + whatsapp`) via cadastro manual e planilha
- template fixo com 2 banners full-width
- 3 cards por secao (`destinations`, `hotels`, `packages`, `reviews`)
- upload de imagens no Supabase Storage
- preview HTML profissional e leve para email
- disparo direto por SMTP da Brevo

## Arquitetura

- Frontend/Admin: Next.js + App Router
- Dados: Supabase Postgres (`contacts`, `app_state`, `campaign_logs`)
- Midia: Supabase Storage bucket `newsletter-assets`
- Autenticacao do painel: login/senha (credenciais de ambiente)
- Envio: endpoint do app -> SMTP Brevo
- Integracao n8n: exporta payload completo (HTML + texto + contatos)

## Setup rapido

1) Instale dependencias

```bash
npm install
```

2) Configure variaveis

```bash
cp .env.example .env.local
```

Preencha `.env.local` com Supabase, credenciais admin e SMTP Brevo.

3) Crie schema no Supabase

- Abra SQL Editor e execute `supabase/schema.sql`

4) Rode o app

```bash
npm run dev
```

Abra `http://localhost:3000/login`.

## Fluxo operacional

1. **Contatos**: importar planilha/cadastrar manual.
2. **Promocoes**: preencher hero, banners e cards do template e subir imagens.
3. **Preview**: revisar HTML final da newsletter.
4. **Envio**: acionar envio teste ou semanal (SMTP Brevo).
5. **n8n**: enviar payload para webhook com `html`, `text` e `contacts`.

## Endpoints principais

- `GET/POST /api/contacts`
- `POST /api/contacts/import`
- `GET/PUT /api/newsletter`
- `GET /api/newsletter/html`
- `POST /api/n8n/push`
- `POST /api/assets/upload`
- `POST /api/send`
- `GET /api/campaigns`
- `GET /api/dashboard`

## Checklist de producao

- Configurar SPF, DKIM e DMARC no dominio de envio
- Manter `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor
- Manter `BREVO_SMTP_PASS` apenas no servidor
- Fazer warm-up gradual da base antes de escalar disparos
