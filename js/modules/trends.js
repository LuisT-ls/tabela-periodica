/**
 * Módulo de tendências periódicas
 *
 * Este módulo gerencia a visualização das tendências periódicas,
 * como eletronegatividade, raio atômico, etc.
 */

import { resetElementsView } from './table-renderer.js'
import { showNotification } from './notification.js'

let elementsData = []
let trendFilter
let chartArea
let comparisonDetails
let closeChartButton

// Tendências disponíveis
const availableTrends = {
  electronegativity: {
    name: 'Eletronegatividade',
    property: 'electronegativity',
    unit: 'Escala de Pauling',
    description:
      'A eletronegatividade é a capacidade de um átomo atrair elétrons em uma ligação química.',
    reverse: false,
    colorScale: [
      '#E8F8F5',
      '#D1F2EB',
      '#A3E4D7',
      '#76D7C4',
      '#48C9B0',
      '#1ABC9C',
      '#17A589',
      '#148F77',
      '#117864',
      '#0E6251'
    ]
  },
  atomicRadius: {
    name: 'Raio Atômico',
    property: 'atomicRadius',
    unit: 'pm',
    description:
      'O raio atômico é metade da distância entre os núcleos de dois átomos adjacentes do mesmo elemento.',
    reverse: true,
    colorScale: [
      '#FEF9E7',
      '#FCF3CF',
      '#F9E79F',
      '#F7DC6F',
      '#F4D03F',
      '#F1C40F',
      '#D4AC0D',
      '#B7950B',
      '#9A7D0A',
      '#7D6608'
    ]
  },
  ionizationEnergy: {
    name: 'Energia de Ionização',
    property: 'ionizationEnergy',
    unit: 'eV',
    description:
      'A energia de ionização é a energia mínima necessária para remover um elétron de um átomo gasoso no estado fundamental.',
    reverse: false,
    colorScale: [
      '#EBDEF0',
      '#D7BDE2',
      '#C39BD3',
      '#AF7AC5',
      '#9B59B6',
      '#8E44AD',
      '#7D3C98',
      '#6C3483',
      '#5B2C6F',
      '#4A235A'
    ]
  },
  meltingPoint: {
    name: 'Ponto de Fusão',
    property: 'meltingPoint',
    unit: 'K',
    description:
      'O ponto de fusão é a temperatura na qual um sólido se transforma em líquido.',
    reverse: false,
    colorScale: [
      '#FADBD8',
      '#F5B7B1',
      '#F1948A',
      '#EC7063',
      '#E74C3C',
      '#CB4335',
      '#B03A2E',
      '#943126',
      '#78281F',
      '#5C1F1F'
    ]
  },
  density: {
    name: 'Densidade',
    property: 'density',
    unit: 'g/cm³',
    description:
      'A densidade é a massa por unidade de volume de uma substância.',
    reverse: false,
    colorScale: [
      '#D6EAF8',
      '#AED6F1',
      '#85C1E9',
      '#5DADE2',
      '#3498DB',
      '#2E86C1',
      '#2874A6',
      '#21618C',
      '#1B4F72',
      '#154360'
    ]
  }
}

/**
 * Configura a funcionalidade de tendências periódicas
 * @param {Array} elements Array com os dados dos elementos
 */
export function setupTrends(elements) {
  elementsData = elements

  trendFilter = document.getElementById('trendFilter')
  chartArea = document.getElementById('chartArea')
  comparisonDetails = document.getElementById('comparisonDetails')
  closeChartButton = document.getElementById('closeChart')

  if (!trendFilter || !chartArea || !comparisonDetails || !closeChartButton) {
    console.error('Elementos de tendências não encontrados')
    return
  }

  // Configurar evento de mudança do filtro de tendências
  trendFilter.addEventListener('change', () => {
    const selectedTrend = trendFilter.value

    if (selectedTrend === 'none') {
      hideTrendView()
      resetElementsView()
    } else {
      showTrendView(selectedTrend)
    }
  })

  // Configurar botão para fechar o gráfico
  closeChartButton.addEventListener('click', () => {
    chartArea.classList.remove('active')
  })
}

/**
 * Exibe a visualização de uma tendência específica
 * @param {string} trendKey Chave da tendência a ser exibida
 */
function showTrendView(trendKey) {
  const trend = availableTrends[trendKey]

  if (!trend) {
    console.error('Tendência não encontrada:', trendKey)
    return
  }

  // Limpar visualização anterior
  resetElementsView()

  // Calcular os valores máximo e mínimo da propriedade
  const validElements = elementsData.filter(
    element =>
      element[trend.property] !== null && element[trend.property] !== undefined
  )

  if (validElements.length === 0) {
    showNotification('Não há dados suficientes para esta tendência', 'warning')
    return
  }

  const values = validElements.map(element => element[trend.property])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue

  // Adicionar classe de modo de tendência aos contêineres
  const periodicTable = document.getElementById('periodicTable')
  const lanthanideSeries = document.getElementById('lanthanide-series')
  const actinideSeries = document.getElementById('actinide-series')

  ;[periodicTable, lanthanideSeries, actinideSeries].forEach(container => {
    if (container) {
      container.classList.add('trend-mode')

      // Adicionar classe de tendência reversa se aplicável
      if (trend.reverse) {
        container.classList.add('trend-reverse')
      } else {
        container.classList.remove('trend-reverse')
      }
    }
  })

  // Aplicar classes de tendência a cada elemento
  elementsData.forEach(element => {
    const value = element[trend.property]
    const elementNodes = document.querySelectorAll(
      `.element[data-atomic-number="${element.atomicNumber}"]`
    )

    elementNodes.forEach(node => {
      if (value !== null && value !== undefined) {
        // Calcular o nível de tendência (1-5)
        let level

        if (trend.reverse) {
          // Tendência reversa (maior valor = menor nível)
          level = Math.ceil(5 - ((value - minValue) / range) * 5)
        } else {
          // Tendência normal (maior valor = maior nível)
          level = Math.ceil(((value - minValue) / range) * 5)
        }

        // Garantir que o nível esteja entre 1 e 5
        level = Math.max(1, Math.min(5, level))

        // Adicionar classe de nível de tendência
        node.classList.add(`trend-level-${level}`)

        // Adicionar tooltip com o valor
        node.title = `${trend.name}: ${value} ${trend.unit}`
      } else {
        // Elemento sem dados disponíveis
        node.classList.add('trend-unknown')
        node.title = `${trend.name}: Não disponível`
      }
    })
  })

  // Criar e exibir o gráfico
  createTrendChart(trend, validElements)

  // Mostrar informações sobre a tendência
  showTrendInfo(trend)

  // Mostrar notificação
  showNotification(`Visualizando tendência periódica: ${trend.name}`, 'info')
}

/**
 * Esconde a visualização de tendências
 */
function hideTrendView() {
  // Remover classes de tendência
  resetElementsView()

  // Esconder gráfico
  chartArea.classList.remove('active')

  // Limpar informações
  comparisonDetails.innerHTML = ''
}

/**
 * Cria um gráfico para visualizar a tendência
 * @param {Object} trend Dados da tendência
 * @param {Array} elements Elementos válidos para a tendência
 */
function createTrendChart(trend, elements) {
  const chartContainer = document.querySelector('.chart-container')
  if (!chartContainer) return

  // Limpar gráfico anterior
  chartContainer.innerHTML = '<canvas id="elementComparisonChart"></canvas>'

  // Mostrar área do gráfico
  chartArea.classList.add('active')

  // Obter o canvas
  const canvas = document.getElementById('elementComparisonChart')
  if (!canvas) return

  // Filtrar apenas elementos dos grupos principais para uma visualização mais clara
  const mainGroupElements = elements.filter(
    element =>
      (element.group === 1 ||
        element.group === 2 ||
        (element.group >= 13 && element.group <= 18)) &&
      element.period <= 7
  )

  // Organizar por período para visualização de tendências
  const periods = [1, 2, 3, 4, 5, 6, 7]
  const chartData = periods
    .map(period => {
      // Filtrar elementos do período atual
      const periodElements = mainGroupElements.filter(
        el => el.period === period
      )

      // Ordenar por grupo
      periodElements.sort((a, b) => a.group - b.group)

      // Mapear para formato do gráfico
      return {
        label: `Período ${period}`,
        data: periodElements.map(el => ({
          x: el.group,
          y: el[trend.property],
          element: el
        })),
        borderColor: getColorForPeriod(period),
        backgroundColor: getColorForPeriod(period, 0.2),
        pointBackgroundColor: periodElements.map(el =>
          document
            .querySelector(`.element[data-atomic-number="${el.atomicNumber}"]`)
            ?.classList.contains('trend-unknown')
            ? '#ccc'
            : getColorForPeriod(period)
        ),
        pointRadius: 6,
        tension: 0.2
      }
    })
    .filter(dataset => dataset.data.length > 0)

  // Criar o gráfico com Chart.js
  const ctx = canvas.getContext('2d')

  // Verificar se Chart.js está disponível
  if (typeof Chart === 'undefined') {
    console.error('Chart.js não está disponível')
    comparisonDetails.innerHTML =
      '<p>Não foi possível carregar a biblioteca de gráficos.</p>'
    return
  }

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: chartData
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Grupo'
          },
          min: 0,
          max: 19,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              return value > 0 && value <= 18 ? value : ''
            }
          }
        },
        y: {
          title: {
            display: true,
            text: `${trend.name} (${trend.unit})`
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.raw
              return `${point.element.name} (${point.element.symbol}): ${point.y} ${trend.unit}`
            }
          }
        },
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: `Tendência Periódica: ${trend.name}`
        }
      }
    }
  })
}

/**
 * Exibe informações sobre a tendência
 * @param {Object} trend Dados da tendência
 */
function showTrendInfo(trend) {
  comparisonDetails.innerHTML = `
    <h3>${trend.name}</h3>
    <p>${trend.description}</p>
    
    <div class="trend-direction">
      <div class="trend-direction-item">
        <i class="fas fa-arrow-right"></i>
        <span>Da esquerda para a direita: ${
          trend.reverse ? 'Diminui' : 'Aumenta'
        }</span>
      </div>
      <div class="trend-direction-item">
        <i class="fas fa-arrow-down"></i>
        <span>De cima para baixo: ${
          trend.reverse ? 'Aumenta' : 'Diminui'
        }</span>
      </div>
    </div>
    
    <div class="trend-legend">
      <span class="trend-legend-label">Intensidade:</span>
      <div class="trend-legend-scale">
        ${Array(5)
          .fill()
          .map(
            (_, i) =>
              `<div class="trend-legend-item trend-level-${
                trend.reverse ? 5 - i : i + 1
              }">
            <span>${i === 0 ? 'Menor' : i === 4 ? 'Maior' : ''}</span>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `
}

/**
 * Obtém uma cor para representar um período no gráfico
 * @param {number} period Número do período
 * @param {number} alpha Opacidade (0-1)
 * @returns {string} Cor em formato CSS
 */
function getColorForPeriod(period, alpha = 1) {
  const colors = [
    'rgba(231, 76, 60, ALPHA)', // Vermelho
    'rgba(241, 196, 15, ALPHA)', // Amarelo
    'rgba(46, 204, 113, ALPHA)', // Verde
    'rgba(52, 152, 219, ALPHA)', // Azul
    'rgba(155, 89, 182, ALPHA)', // Roxo
    'rgba(230, 126, 34, ALPHA)', // Laranja
    'rgba(149, 165, 166, ALPHA)' // Cinza
  ]

  return colors[(period - 1) % colors.length].replace('ALPHA', alpha)
}

/**
 * Aplica uma tendência específica programaticamente
 * @param {string} trendKey Chave da tendência a ser aplicada
 */
export function applyTrend(trendKey) {
  if (trendFilter) {
    trendFilter.value = trendKey

    if (trendKey === 'none') {
      hideTrendView()
      resetElementsView()
    } else {
      showTrendView(trendKey)
    }
  }
}
