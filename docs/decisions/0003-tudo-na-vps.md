# ADR-0003 · Tudo na VPS com Kubernetes, sem CDN na frente

Status: Proposto · Data: 8 de novembro de 2026 · Origem: [RFC-001](../rfcs/0001-arquitetura-tecnica.md) · Arquivo: `docs/decisions/0003-tudo-na-vps.md`

## Contexto

O desenvolvedor já tem uma VPS com Kubernetes e quer, no início, gastar só com a VPS e o domínio.

## Decisão

Rodar tudo no cluster da VPS: Nginx com o site estático, a API, o PostgreSQL com CloudNativePG e as tarefas agendadas (fábrica de temas, desafios do dia, contagem de partidas). HTTPS com cert-manager e Let's Encrypt. Sem CDN na frente: a VPS recebe o tráfego direto, com DNS no provedor do domínio, compressão e cache longo no navegador, limite de requisições no Nginx e firewall só com as portas necessárias. Publicação manual no cluster pelo desenvolvedor (ADR-0009).

## Alternativas descartadas

- **Hospedagem gerenciada (Vercel, Netlify ou similar):** sem servidor para cuidar, mas fora da regra de gastar só com VPS e domínio, e com o código espalhado por outro fornecedor.
- **Cloudflare gratuita na frente da VPS:** traria cache perto do jogador e proteção contra tráfego abusivo sem custo, mas foi descartada pelo dono do produto em 8 de novembro de 2026.

## Consequências

- Custo fixo só de VPS e domínio.
- A VPS é ponto único de falha: backup diário fora dela, restauração testada todo mês e monitor de quedas são obrigatórios.
- Atualizações do sistema e do cluster ficam com o desenvolvedor.
- Limites de memória e CPU por serviço, para um não derrubar os outros.
- Sem CDN, quem está longe da VPS recebe as páginas mais devagar, e um pico de tráfego chega inteiro ao servidor. Se os Core Web Vitals medidos por país ficarem ruins, esta decisão deve ser reaberta num novo ADR.
