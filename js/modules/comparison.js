/**
 * Módulo de comparação de elementos
 *
 * Este módulo gerencia a funcionalidade de comparação entre
 * dois elementos químicos, exibindo suas similaridades e diferenças.
 */

import { getElementById } from './data-loader.js'
import { showNotification } from './notification.js'

let elementsData = []
let comparisonModal
let element1Select
let element2Select
let comparisonGrid
let firstElementId = null

// Propriedades a serem comparadas
const properties = [
  { name: 'Categoria', key: 'category', formatter: formatCategory },
  {
    name: 'Massa Atômica',
    key: 'atomicMass',
    unit: 'u',
    formatter: formatDecimal
  },
  {
    name: 'Densidade',
    key: 'density',
    unit: 'g/cm³',
    formatter: formatDensity
  },
  {
    name: 'Eletronegatividade',
    key: 'electronegativity',
    unit: 'Pauling',
    formatter: formatDecimal
  },
  {
    name: 'Raio Atômico',
    key: 'atomicRadius',
    unit: 'pm',
    formatter: formatInteger
  },
  {
    name: 'Energia de Ionização',
    key: 'ionizationEnergy',
    unit: 'eV',
    formatter: formatDecimal
  },
  {
    name: 'Ponto de Fusão',
    key: 'meltingPoint',
    unit: 'K',
    formatter: formatInteger
  },
  {
    name: 'Ponto de Ebulição',
    key: 'boilingPoint',
    unit: 'K',
    formatter: formatInteger
  },
  {
    name: 'Configuração Eletrônica',
    key: 'electronConfiguration',
    formatter: formatText
  },
  { name: 'Bloco', key: 'block', formatter: formatBlock },
  { name: 'Estado Natural', key: 'state', formatter: formatState }
]

/**
 * Configura a funcionalidade de comparação de elementos
 * @param {Array} elements Array com os dados dos elementos
 */
export function setupComparison(elements) {
  elementsData = elements

  comparisonModal = document.getElementById('comparisonModal')
  element1Select = document.getElementById('element1Select')
  element2Select = document.getElementById('element2Select')
  comparisonGrid = document.getElementById('comparisonGrid')

  if (
    !comparisonModal ||
    !element1Select ||
    !element2Select ||
    !comparisonGrid
  ) {
    console.error('Elementos de comparação não encontrados')
    return
  }

  // Preencher os selects com os elementos
  populateElementSelects()

  // Configurar eventos para os selects
  element1Select.addEventListener('change', updateComparison)
  element2Select.addEventListener('change', updateComparison)

  // Configurar evento para o botão de comparação
  document.addEventListener('start-comparison', event => {
    const atomicNumber = event.detail.atomicNumber
    if (atomicNumber) {
      startComparison(atomicNumber)
    }
  })

  // Configurar botão para fechar o modal
  const closeButton = comparisonModal.querySelector('.close')
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeComparisonModal()
    })
  }

  // Fechar modal quando clicar fora do conteúdo
  comparisonModal.addEventListener('click', event => {
    if (event.target === comparisonModal) {
      closeComparisonModal()
    }
  })
}

/**
 * Preenche os selects com a lista de elementos
 */
function populateElementSelects() {
  // Limpar selects primeiro
  element1Select.innerHTML = ''
  element2Select.innerHTML = ''

  // Opção padrão
  const defaultOption1 = document.createElement('option')
  defaultOption1.value = ''
  defaultOption1.textContent = 'Selecione um elemento'
  defaultOption1.disabled = true
  defaultOption1.selected = true
  element1Select.appendChild(defaultOption1)

  const defaultOption2 = document.createElement('option')
  defaultOption2.value = ''
  defaultOption2.textContent = 'Selecione um elemento'
  defaultOption2.disabled = true
  defaultOption2.selected = true
  element2Select.appendChild(defaultOption2)

  // Agrupar elementos por categoria
  const categories = {}
  elementsData.forEach(element => {
    if (!categories[element.category]) {
      categories[element.category] = []
    }
    categories[element.category].push(element)
  })

  // Adicionar elementos agrupados por categoria
  Object.keys(categories)
    .sort()
    .forEach(category => {
      const group1 = document.createElement('optgroup')
      group1.label = formatCategory(category)

      const group2 = document.createElement('optgroup')
      group2.label = formatCategory(category)

      // Ordenar elementos por número atômico
      categories[category]
        .sort((a, b) => a.atomicNumber - b.atomicNumber)
        .forEach(element => {
          const option1 = document.createElement('option')
          option1.value = element.atomicNumber
          option1.textContent = `${element.name} (${element.symbol})`
          group1.appendChild(option1)

          const option2 = document.createElement('option')
          option2.value = element.atomicNumber
          option2.textContent = `${element.name} (${element.symbol})`
          group2.appendChild(option2)
        })

      element1Select.appendChild(group1)
      element2Select.appendChild(group2)
    })
}

/**
 * Inicia a comparação com um elemento específico
 * @param {number} atomicNumber Número atômico do elemento a ser comparado
 */
export function startComparison(atomicNumber) {
  // Verificar se o elemento existe
  if (!getElementById(elementsData, atomicNumber)) {
    showNotification('Elemento não encontrado', 'error')
    return
  }

  // Verificar se já há um elemento inicial definido
  if (firstElementId === null) {
    // Primeiro elemento selecionado
    firstElementId = atomicNumber
    showNotification('Selecione o segundo elemento para comparação', 'info')

    // Abrir o modal de comparação
    openComparisonModal()

    // Definir os valores dos selects
    element1Select.value = atomicNumber
    updateComparison()
  } else {
    // Segundo elemento selecionado
    element2Select.value = atomicNumber
    updateComparison()

    // Resetar o primeiro elemento
    firstElementId = null
  }
}

/**
 * Atualiza a comparação com base nos elementos selecionados
 */
function updateComparison() {
  const element1Id = parseInt(element1Select.value, 10)
  const element2Id = parseInt(element2Select.value, 10)

  // Verificar se ambos os elementos foram selecionados
  if (isNaN(element1Id) || isNaN(element2Id)) {
    return
  }

  const element1 = getElementById(elementsData, element1Id)
  const element2 = getElementById(elementsData, element2Id)

  if (!element1 || !element2) {
    showNotification('Elemento não encontrado', 'error')
    return
  }

  // Atualizar detalhes dos elementos
  updateElementDetails('element1', element1)
  updateElementDetails('element2', element2)

  // Atualizar a grade de comparação
  updateComparisonGrid(element1, element2)
}

/**
 * Atualiza os detalhes de um elemento na interface
 * @param {string} containerId ID do contêiner
 * @param {Object} element Dados do elemento
 */
function updateElementDetails(containerId, element) {
  const container = document.getElementById(containerId)
  if (!container) return

  const detailsContainer = container.querySelector(
    '.element-comparison-details'
  )
  if (!detailsContainer) return

  // Atualizar cabeçalho e detalhes do elemento
  detailsContainer.innerHTML = `
    <div class="element-comparison-header">
      <div class="element-comparison-symbol ${element.category}">${element.symbol}</div>
      <div class="element-comparison-info">
        <h3>${element.name}</h3>
        <p>Número Atômico: ${element.atomicNumber}</p>
      </div>
    </div>
  `
}

/**
 * Atualiza a grade de comparação entre os elementos
 * @param {Object} element1 Primeiro elemento
 * @param {Object} element2 Segundo elemento
 */
function updateComparisonGrid(element1, element2) {
  if (!comparisonGrid) return

  // Limpar a grade
  comparisonGrid.innerHTML = ''

  // Adicionar itens para cada propriedade
  properties.forEach(property => {
    const value1 = element1[property.key]
    const value2 = element2[property.key]

    if (value1 === undefined && value2 === undefined) {
      return // Pular propriedades sem dados
    }

    const comparisonItem = document.createElement('div')
    comparisonItem.className = 'comparison-item'

    // Cabeçalho do item
    const header = document.createElement('div')
    header.className = 'comparison-item-header'
    header.textContent = property.name
    comparisonItem.appendChild(header)

    // Conteúdo do item
    const content = document.createElement('div')
    content.className = 'comparison-item-content'

    // Valor para o primeiro elemento
    const valueElem1 = document.createElement('div')
    valueElem1.className = 'comparison-value'
    valueElem1.innerHTML = `
      <strong>${property.formatter(value1)}</strong>
      ${property.unit ? `<span>${property.unit}</span>` : ''}
    `
    content.appendChild(valueElem1)

    // Divisor
    const divider = document.createElement('div')
    divider.className = 'comparison-divider'
    content.appendChild(divider)

    // Valor para o segundo elemento
    const valueElem2 = document.createElement('div')
    valueElem2.className = 'comparison-value'
    valueElem2.innerHTML = `
      <strong>${property.formatter(value2)}</strong>
      ${property.unit ? `<span>${property.unit}</span>` : ''}
    `
    content.appendChild(valueElem2)

    comparisonItem.appendChild(content)

    // Diferença (apenas para propriedades numéricas)
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      const diff = value2 - value1
      const diffPercentage =
        value1 !== 0 ? ((diff / value1) * 100).toFixed(1) : 'N/A'

      const difference = document.createElement('div')
      difference.className = 'comparison-difference'

      let diffText = ''
      let diffClass = ''

      if (diff > 0) {
        diffText = `${diff > 0 ? '+' : ''}${formatDecimal(
          diff
        )} (${diffPercentage}%)`
        diffClass = 'difference-higher'
      } else if (diff < 0) {
        diffText = `${formatDecimal(diff)} (${diffPercentage}%)`
        diffClass = 'difference-lower'
      } else {
        diffText = 'Sem diferença'
        diffClass = 'difference-equal'
      }

      difference.innerHTML = `
        <i class="fas ${
          diff > 0 ? 'fa-arrow-up' : diff < 0 ? 'fa-arrow-down' : 'fa-equals'
        }"></i>
        <span>${diffText}</span>
      `
      difference.classList.add(diffClass)

      comparisonItem.appendChild(difference)
    }

    comparisonGrid.appendChild(comparisonItem)
  })
}

/**
 * Formata um valor decimal para exibição
 * @param {number} value Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatDecimal(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  return typeof value === 'number' ? value.toFixed(2) : value
}

/**
 * Formata um valor inteiro para exibição
 * @param {number} value Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatInteger(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  return typeof value === 'number' ? value.toString() : value
}

/**
 * Formata um valor de densidade para exibição
 * @param {number} value Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatDensity(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  return typeof value === 'number'
    ? value < 0.01
      ? value.toExponential(2)
      : value.toFixed(4)
    : value
}

/**
 * Formata uma categoria para exibição
 * @param {string} category Categoria a ser formatada
 * @returns {string} Categoria formatada
 */
function formatCategory(category) {
  if (!category) {
    return 'Desconhecido'
  }

  const categoryMap = {
    'não-metal': 'Não Metal',
    'metal-alcalino': 'Metal Alcalino',
    'metal-alcalino-terroso': 'Metal Alcalino Terroso',
    'metal-transição': 'Metal de Transição',
    'metal-pos-transicao': 'Metal de Pós-Transição',
    semimetal: 'Semimetal',
    halogenio: 'Halogênio',
    'gás-nobre': 'Gás Nobre',
    lantanídeo: 'Lantanídeo',
    actinídeo: 'Actinídeo'
  }

  return categoryMap[category] || category
}

/**
 * Formata um texto simples para exibição
 * @param {string} text Texto a ser formatado
 * @returns {string} Texto formatado
 */
function formatText(text) {
  if (!text) {
    return 'N/A'
  }
  return text
}

/**
 * Formata um bloco para exibição
 * @param {string} block Bloco a ser formatado
 * @returns {string} Bloco formatado
 */
function formatBlock(block) {
  if (!block) {
    return 'N/A'
  }
  return block.toUpperCase()
}

/**
 * Formata o estado natural para exibição
 * @param {string} state Estado a ser formatado
 * @returns {string} Estado formatado
 */
function formatState(state) {
  if (!state) {
    return 'N/A'
  }

  const stateMap = {
    solid: 'Sólido',
    liquid: 'Líquido',
    gas: 'Gasoso',
    unknown: 'Desconhecido'
  }

  return stateMap[state] || state
}

/**
 * Abre o modal de comparação
 */
function openComparisonModal() {
  if (comparisonModal.tagName === 'DIALOG') {
    comparisonModal.showModal()
  } else {
    comparisonModal.classList.add('active')
  }
}

/**
 * Fecha o modal de comparação
 */
function closeComparisonModal() {
  if (comparisonModal.tagName === 'DIALOG') {
    comparisonModal.close()
  } else {
    comparisonModal.classList.remove('active')
  }
  firstElementId = null
}
