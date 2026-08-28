# Natal Social Lens

Crie a estrutura inicial de uma aplicação web responsiva para análise e visualização dos dados do Cadastro Único do Município de Natal/RN.

IMPORTANTE SOBRE ESTE PROJETO

Estou utilizando o plano gratuito do Lovable.

Por isso, nesta primeira versão:

priorize a criação da estrutura principal da aplicação;

crie componentes reutilizáveis;

não implemente funcionalidades excessivamente complexas;

não faça integrações externas desnecessárias;

não tente criar dezenas de gráficos de uma só vez;

não implemente autenticação neste momento;

não implemente Supabase nesta etapa;

utilize inicialmente dados fictícios/mockados para demonstrar o funcionamento;

deixe o código organizado para posteriormente substituir os dados fictícios pelos meus dados reais;

priorize uma arquitetura que eu consiga expandir manualmente depois.

O objetivo desta primeira versão é criar um MVP visual e funcional do dashboard.

1. OBJETIVO DO SISTEMA

Construir um dashboard chamado:

Observatório do Cadastro Único — Natal/RN

O sistema deverá permitir visualizar indicadores sociais das famílias e pessoas cadastradas no Cadastro Único do município de Natal.

O público-alvo será formado principalmente por:

gestores públicos;

técnicos da assistência social;

equipes de planejamento;

pesquisadores;

gestores de CRAS e CREAS;

equipes responsáveis pela elaboração de diagnósticos socioterritoriais;

equipes responsáveis por planos municipais e políticas públicas.

A aplicação deverá transmitir uma aparência de:

sistema institucional;

ferramenta de inteligência de dados;

observatório social;

painel de apoio à tomada de decisão.

2. TECNOLOGIA

Utilize a estrutura padrão recomendada pelo Lovable, preferencialmente:

React;

TypeScript;

Tailwind CSS;

componentes reutilizáveis;

gráficos com Recharts;

ícones Lucide.

Crie uma arquitetura limpa e simples.

Organize os componentes para que posteriormente seja fácil conectar o sistema ao Supabase.

3. IDENTIDADE VISUAL

Criar um design institucional moderno.

Utilizar:

fundo geral muito claro;

cards brancos;

bordas suaves;

sombras discretas;

cantos levemente arredondados;

bastante espaço entre os elementos;

tipografia limpa;

visual profissional.

Utilizar azul, azul-petróleo e tons neutros como base visual.

Evitar excesso de cores.

Utilizar cores diferentes apenas quando forem importantes para interpretar indicadores.

O sistema deve funcionar muito bem em:

desktop;

notebook;

tablet;

celular.

4. LAYOUT PRINCIPAL

Criar uma sidebar lateral esquerda.

No topo da sidebar mostrar:

Observatório Social
Cadastro Único — Natal/RN

Criar as seguintes opções de menu:

Visão Geral

Famílias

Perfil da População

Renda e Vulnerabilidade

Domicílios

Educação

Trabalho e Renda

Pessoas com Deficiência

Crianças e Adolescentes

Benefícios Sociais

Grupos Específicos

Situação de Rua

Rede Socioassistencial

Não é necessário desenvolver todas as páginas completamente.

Nesta primeira versão, desenvolver:

Visão Geral

Famílias

Renda e Vulnerabilidade

Para as demais páginas, criar apenas o componente/página básica contendo título e mensagem:

"Este módulo será desenvolvido nas próximas versões."

5. CABEÇALHO

No topo da área principal incluir:

Cadastro Único de Natal/RN

Subtítulo:

"Painel de indicadores socioeconômicos das famílias e pessoas cadastradas."

À direita mostrar:

"Última atualização dos dados"

e uma data fictícia.

Posteriormente essa informação virá do banco de dados.

6. FILTROS GLOBAIS

Logo abaixo do cabeçalho criar uma área de filtros.

Adicionar os filtros:

Região / Zona

Exemplos:

Todas

Norte

Sul

Leste

Oeste

Localidade / Bairro

Criar dropdown.

CRAS / CREAS

Criar dropdown.

Faixa de renda per capita

Criar dropdown.

Programa Bolsa Família

Opções:

Todos

Beneficiários

Não beneficiários

Adicionar botão:

Limpar filtros

Os filtros precisam estar visualmente funcionais usando dados fictícios.

Organize a lógica para posteriormente os filtros influenciarem todos os gráficos simultaneamente.

7. PÁGINA — VISÃO GERAL

Esta será a página principal do dashboard.

Cards principais

Criar seis cards.

Pessoas cadastradas

Exemplo:

235.482

Texto auxiliar:

"Pessoas registradas no Cadastro Único"

Famílias cadastradas

Exemplo:

94.218

Beneficiários do Bolsa Família

Exemplo:

62.541 famílias

Renda média per capita

Exemplo:

R$ 487,32

Pessoas com deficiência

Exemplo:

18.430

Famílias em situação de risco social

Exemplo:

12.742

Utilizar ícones discretos nos cards.

8. INDICADORES DA VISÃO GERAL

Abaixo dos cards criar uma grade responsiva com gráficos.

Gráfico 1 — População por faixa etária

Gráfico de barras.

Categorias fictícias:

0 a 5 anos

6 a 11 anos

12 a 17 anos

18 a 29 anos

30 a 59 anos

60 anos ou mais

Mostrar número de pessoas.

Gráfico 2 — Distribuição por sexo

Gráfico de donut.

Categorias:

Feminino

Masculino

Gráfico 3 — Cor ou raça

Gráfico horizontal.

Categorias de exemplo:

Parda

Branca

Preta

Amarela

Indígena

Não informado

Gráfico 4 — Faixa de renda familiar per capita

Gráfico de barras.

Categorias fictícias:

Até R$ 218

R$ 219 a R$ 706

R$ 707 a 1/2 salário mínimo

Acima de 1/2 salário mínimo

Deixe as categorias configuráveis para que eu possa alterar posteriormente.

9. DESTAQUES SOCIAIS

Criar uma seção chamada:

Indicadores de Vulnerabilidade

Utilizar cards menores apresentando:

Famílias em extrema pobreza

Famílias em pobreza

Pessoas em situação de rua

Pessoas com deficiência

Pessoas com marcação de trabalho infantil

Famílias em insegurança alimentar

Famílias com risco social associado à violação de direitos

Cada card deve mostrar:

indicador;

quantidade;

percentual;

ícone.

10. TERRITÓRIO

Criar uma seção chamada:

Distribuição Territorial

Nesta primeira versão NÃO é necessário implementar mapa geográfico real.

Criar um espaço reservado com aparência de mapa contendo:

"Mapa dos bairros de Natal"

e abaixo:

"Visualização territorial será integrada posteriormente."

Ao lado do mapa criar:

Bairros com maior número de famílias cadastradas

Exemplo:

Nossa Senhora da Apresentação

Lagoa Azul

Felipe Camarão

Pajuçara

Planalto

Apresentar barras horizontais representando o total de famílias.

Deixe esse componente preparado para futuramente utilizar GeoJSON ou shapefile convertido para GeoJSON.

11. PÁGINA — FAMÍLIAS

Criar uma página específica para indicadores familiares.

Cards:

Total de famílias

Média de pessoas por família

Famílias beneficiárias do Bolsa Família

Famílias com cadastro atualizado

Famílias com cadastro desatualizado

Criar os gráficos:

Famílias por região de Natal

Barras horizontais.

Quantidade de pessoas por domicílio

Gráfico de barras.

Exemplo:

1 pessoa

2 pessoas

3 pessoas

4 pessoas

5 pessoas

6 ou mais

Tempo desde a última atualização cadastral

Utilizar categorias:

Até 12 meses

13 a 24 meses

25 a 36 meses

Mais de 36 meses

Estado cadastral da família

Utilizar gráfico donut.

12. PÁGINA — RENDA E VULNERABILIDADE

Criar uma página dedicada à renda.

Cards:

Renda média familiar

Renda média per capita

Famílias em extrema pobreza

Famílias em pobreza

Famílias beneficiárias do PBF

Adicionar:

Distribuição das famílias por renda per capita

Gráfico de barras.

Renda média por Região/Zona

Gráfico de barras horizontais.

Principais despesas das famílias

Gráfico de barras utilizando:

alimentação;

energia;

água;

gás;

transporte;

aluguel;

medicamentos.

Beneficiários e não beneficiários do Programa Bolsa Família

Gráfico donut.

13. ESTRUTURA PARA FUTUROS MÓDULOS

Apesar de não desenvolver completamente estes módulos, deixe a estrutura preparada.

Domicílios

Futuramente deverá apresentar indicadores relacionados a:

situação do domicílio;

espécie do domicílio;

quantidade de cômodos;

quantidade de dormitórios;

material do piso;

material das paredes;

água canalizada;

abastecimento de água;

banheiro;

esgotamento sanitário;

coleta de lixo;

iluminação;

calçamento.

Educação

Indicadores futuros:

alfabetização;

frequência escolar;

curso frequentado;

série;

grau de instrução;

escolas frequentadas;

escola localizada no município.

Trabalho e Renda

Indicadores futuros:

situação de trabalho;

trabalho na semana anterior;

meses trabalhados;

atividade principal;

remuneração;

trabalho remunerado nos últimos 12 meses;

seguro-desemprego;

aposentadoria;

pensão;

outras fontes de renda.

Pessoas com Deficiência

Indicadores futuros:

pessoas com deficiência;

cegueira;

baixa visão;

surdez;

deficiência física;

deficiência intelectual;

síndrome de Down;

transtorno ou doença mental;

tipo de auxílio recebido.

Grupos específicos

Indicadores futuros:

famílias indígenas;

famílias quilombolas;

povos indígenas;

comunidades quilombolas;

grupos populacionais tradicionais e específicos.

Situação de Rua

Indicadores futuros:

pessoas em situação de rua;

tempo vivendo na rua;

onde dormem;

motivos da situação de rua;

vínculos familiares;

atividades econômicas;

atendimento por serviços públicos.

Rede Socioassistencial

Indicadores futuros relacionados a:

CRAS;

CREAS;

Centro POP;

instituições governamentais;

instituições não governamentais;

hospitais e clínicas.

14. TABELA DE DADOS

Na página Visão Geral criar ao final uma seção:

Consulta de Indicadores

Criar uma tabela fictícia contendo:

Região

Localidade

Famílias

Pessoas

Renda per capita

Beneficiários PBF

Pessoas com deficiência

Adicionar:

campo de pesquisa;

ordenação;

paginação simples.

Não implemente exportação nesta versão.

A estrutura deve permitir que posteriormente eu adicione exportação para Excel e CSV.

15. ESTRUTURA DOS DADOS

Meu banco possui informações tanto no nível da família quanto no nível da pessoa.

Alguns campos disponíveis são:

Identificação e território

código IBGE do município

código familiar

data de cadastramento

data da última atualização

estado cadastral da família

região/zona

localidade

CEP

unidade territorial local

Renda

renda familiar per capita

faixa de renda familiar per capita

renda total da família

recebimento de Programa Bolsa Família

Domicílio

situação do domicílio

espécie do domicílio

quantidade de cômodos

dormitórios

material do piso

material das paredes

água canalizada

abastecimento de água

banheiro

esgotamento sanitário

lixo

iluminação

calçamento

Características da família

quantidade de pessoas no domicílio

quantidade de famílias no domicílio

despesas familiares

CRAS/CREAS de referência

risco social

insegurança alimentar

Pessoa

sexo

data de nascimento

faixa etária

relação de parentesco

cor ou raça

pessoa com deficiência

educação

trabalho

remuneração

Programa Bolsa Família

situação de rua.

16. PRIVACIDADE DOS DADOS

O dashboard deverá trabalhar somente com informações agregadas.

Não apresentar:

nomes;

CPF;

NIS;

endereço individual;

código familiar individual;

qualquer informação que permita identificar diretamente uma pessoa ou família.

O sistema deverá ser pensado para divulgação de estatísticas agregadas.

17. COMPONENTES REUTILIZÁVEIS

Crie componentes genéricos para evitar duplicação de código.

Exemplos:

MetricCard

FilterBar

ChartCard

BarChartCard

DonutChartCard

DashboardHeader

Sidebar

DataTable

EmptyMapPlaceholder

Quero posteriormente poder criar novos indicadores apenas reutilizando esses componentes.

18. DADOS MOCKADOS

Crie apenas um pequeno arquivo de dados fictícios.

Não crie centenas de registros.

Utilize dados suficientes apenas para demonstrar:

cards;

gráficos;

filtros;

tabela.

Centralize os dados fictícios em um único arquivo para facilitar a substituição posterior.

Por exemplo:

src/data/mockData.ts

19. ORGANIZAÇÃO DO CÓDIGO

Organize o projeto aproximadamente em:

src/
  components/
    dashboard/
  pages/
  data/
    mockData.ts
  types/
  utils/


Evite criar arquivos desnecessários.

20. PREPARAÇÃO PARA BANCO DE DADOS

NÃO conecte ao Supabase nesta etapa.

Entretanto, organize o código considerando que posteriormente os dados serão carregados do Supabase.

Evite colocar os dados diretamente dentro dos componentes gráficos.

Os componentes devem receber os dados através de props.

21. RESULTADO ESPERADO DESTA PRIMEIRA ENTREGA

Quero principalmente:

layout profissional;

sidebar;

cabeçalho;

filtros globais;

cards de indicadores;

página Visão Geral funcionando;

página Famílias funcionando;

página Renda e Vulnerabilidade funcionando;

gráficos com dados fictícios;

tabela de indicadores;

espaço reservado para mapa;

páginas básicas para os demais módulos;

aplicação responsiva;

código simples de expandir.

Não utilize muitos créditos tentando implementar funcionalidades avançadas.

Priorize a fundação do dashboard.

Ao terminar esta primeira estrutura, não faça novas funcionalidades automaticamente.

A partir desta base eu continuarei desenvolvendo os módulos individualmente em novos prompts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3aa0fac9-0588-42e9-8a08-497b6a7cc772).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
