# Táxi Seu Valdir

Landing page baseada em `Styleguide_Design_Seu_Valdir.md`, feita somente com HTML, CSS e JavaScript puro. Sem frameworks, dependências, fontes externas ou compilação.

## Abrir localmente

Abra `index.html` no navegador. Todos os recursos usam caminhos relativos, compatíveis com subpastas do GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie `index.html`, `styles.css`, `script.js`, `favicon.svg` e `.nojekyll` para a raiz da branch `main`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione **main**, pasta **/ (root)**, e clique em **Save**.
5. Aguarde a publicação. O endereço aparecerá nessa mesma tela, normalmente `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.

Não é necessário configurar domínio, instalar pacotes ou executar comandos de build. O styleguide e este README são documentação e não são necessários para exibir o site.

## Comportamento

- Percurso fixo de 8 km e 20 minutos; sem GPS ou detecção do veículo.
- Tarifas iniciais ilustrativas de R$ 3,00/km e R$ 0,60/min: total de R$ 36,00.
- Calcular inicia o estado EM TRAJETO e bloqueia tarifas e adicionais.
- Parar libera os controles. Cada pedágio acrescenta R$ 6,50; cada espera acrescenta 5 minutos pela tarifa calculada.
- O guia não informa um valor de espera: o incremento de 5 minutos é uma decisão desta demonstração, explicitada na interface.
- Recalcular aplica as tarifas editadas e preserva os adicionais. Retomar apenas muda o estado, mantendo os valores já calculados.
- Limpar restaura o estado inicial e as tarifas ilustrativas.
- Valores aceitam vírgula ou ponto decimal, até duas casas, entre R$ 0,01 e R$ 9.999,99, sem separador de milhar.
- Tema acompanha a preferência do sistema na primeira visita e salva a escolha localmente, quando o navegador permite.

## Acessibilidade e layout

HTML semântico, campos rotulados, foco visível, mensagens de erro, resultado anunciado por leitores de tela, movimento reduzido e layout responsivo. A leitura sob luz forte deve ser avaliada em aparelho real.

## Arquivos

- `index.html`: conteúdo e estrutura.
- `styles.css`: identidade visual, temas e responsividade.
- `script.js`: cálculo em centavos, estados e tema.
- `favicon.svg`: ícone da aba.
- `.nojekyll`: publicação direta dos arquivos estáticos.
