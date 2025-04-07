/**
 * Módulo de renderização da tabela periódica
 *
 * Este módulo é responsável por criar e renderizar a tabela periódica
 * e as séries separadas de lantanídeos e actinídeos.
 */

/**
 * Renderiza a tabela periódica completa com todos os elementos
 * @param {Array} elements Array com os dados dos elementos
 */
export function renderPeriodicTable(elements) {
  const tableContainer = document.getElementById('periodicTable')
  const lanthanideContainer = document.getElementById('lanthanide-series')
  const actinideContainer = document.getElementById('actinide-series')

  if (!tableContainer || !lanthanideContainer || !actinideContainer) {
    console.error('Containers da tabela periódica não encontrados')
    return
  }

  // Limpar containers antes de renderizar
  tableContainer.innerHTML = ''
  lanthanideContainer.innerHTML = ''
  actinideContainer.innerHTML = ''

  // Criar o layout vazio da tabela principal
  createTableLayout(tableContainer)

  // Renderizar os elementos nas posições corretas
  elements.forEach(element => {
    const elementNode = createElementNode(element)

    if (element.series === 'main') {
      // Elementos principais na tabela principal
      if (elementNode && element.gridColumn && element.gridRow) {
        elementNode.style.gridColumn = element.gridColumn
        elementNode.style.gridRow = element.gridRow
        tableContainer.appendChild(elementNode)
      }
    } else if (element.series === 'lanthanide') {
      // Lantanídeos na série separada
      if (elementNode && element.seriesPosition) {
        elementNode.style.gridColumn = element.seriesPosition
        lanthanideContainer.appendChild(elementNode)
      }
    } else if (element.series === 'actinide') {
      // Actinídeos na série separada
      if (elementNode && element.seriesPosition) {
        elementNode.style.gridColumn = element.seriesPosition
        actinideContainer.appendChild(elementNode)
      }
    }
  })

  // Atualizar as posições dos elementos dos grupos 3 no período 6 e 7
  updateLanthanideActinidePositions(tableContainer)
}

/**
 * Cria o layout básico da tabela periódica com placeholders para lantanídeos e actinídeos
 * @param {HTMLElement} container Container onde a tabela será renderizada
 */
function createTableLayout(container) {
  // Criar placeholders para células vazias
  for (let row = 1; row <= 7; row++) {
    for (let col = 1; col <= 18; col++) {
      // Pular espaços vazios conhecidos da tabela periódica
      if (
        (row === 1 && col > 1 && col < 18) ||
        (row <= 2 && col > 2 && col < 13) ||
        (row === 6 && col === 3) ||
        (row === 7 && col === 3)
      ) {
        const placeholder = document.createElement('div')
        placeholder.className = 'element-placeholder'
        placeholder.style.gridColumn = col
        placeholder.style.gridRow = row
        container.appendChild(placeholder)
      }
    }
  }
}

/**
 * Atualiza a posição dos elementos dos grupos 3 no período 6 e 7 para mostrar indicadores de lantanídeos e actinídeos
 * @param {HTMLElement} container Container da tabela periódica
 */
function updateLanthanideActinidePositions(container) {
  // Criar placeholders especiais para Lantanídeos e Actinídeos
  const createSeriesPlaceholder = (row, text) => {
    const placeholder = document.createElement('div')
    placeholder.className = 'element'
    placeholder.style.gridColumn = 3
    placeholder.style.gridRow = row
    placeholder.innerHTML = `
      <div class="element-number">...</div>
      <div class="element-symbol">${text}</div>
      <div class="element-name">Bloco f</div>
    `
    placeholder.addEventListener('click', () => {
      const seriesContainer = document.querySelector(
        row === 6 ? '.lanthanides' : '.actinides'
      )
      if (seriesContainer) {
        seriesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return placeholder
  }

  // Adicionar placeholders para lantanídeos e actinídeos
  container.appendChild(createSeriesPlaceholder(6, 'La-Lu'))
  container.appendChild(createSeriesPlaceholder(7, 'Ac-Lr'))
}

/**
 * Cria um elemento HTML para representar um elemento químico na tabela
 * @param {Object} element Dados do elemento químico
 * @returns {HTMLElement} Elemento HTML representando o elemento químico
 */
function createElementNode(element) {
  const elementNode = document.createElement('div')
  elementNode.className = `element ${element.category}`
  elementNode.dataset.atomicNumber = element.atomicNumber

  elementNode.innerHTML = `
    <div class="element-number">${element.atomicNumber}</div>
    <div class="element-symbol">${element.symbol}</div>
    <div class="element-name">${element.name}</div>
    <div class="element-mass">${element.formattedMass}</div>
  `

  // Adicionar evento de clique para abrir o modal
  elementNode.addEventListener('click', () => {
    const event = new CustomEvent('element-clicked', {
      detail: { atomicNumber: element.atomicNumber }
    })
    document.dispatchEvent(event)
  })

  return elementNode
}

/**
 * Atualiza a visualização de um elemento específico
 * @param {Object} element Dados atualizados do elemento
 */
export function updateElementView(element) {
  const elementNodes = document.querySelectorAll(
    `.element[data-atomic-number="${element.atomicNumber}"]`
  )

  elementNodes.forEach(node => {
    // Atualizar classe para favoritos
    if (element.isFavorite) {
      node.classList.add('favorite')
    } else {
      node.classList.remove('favorite')
    }
  })
}

/**
 * Aplica destaque visual aos elementos encontrados na busca
 * @param {Array} elements Array de elementos a serem destacados
 */
export function highlightElements(elements) {
  // Primeiro, remover todos os destaques
  document.querySelectorAll('.element.highlight').forEach(el => {
    el.classList.remove('highlight')
  })

  // Depois, aplicar destaque aos elementos encontrados
  elements.forEach(element => {
    const elementNodes = document.querySelectorAll(
      `.element[data-atomic-number="${element.atomicNumber}"]`
    )
    elementNodes.forEach(node => {
      node.classList.add('highlight')
    })
  })
}

/**
 * Filtrar a visualização dos elementos por categoria ou bloco
 * @param {Array} visibleElements Array de elementos que devem estar visíveis
 */
export function filterElements(visibleElements) {
  // Obter todos os IDs dos elementos visíveis
  const visibleIds = new Set(visibleElements.map(el => el.atomicNumber))

  // Aplicar filtro a todos os elementos
  document
    .querySelectorAll('.element:not(.element-placeholder)')
    .forEach(node => {
      const atomicNumber = parseInt(node.dataset.atomicNumber, 10)

      if (visibleIds.has(atomicNumber)) {
        node.style.opacity = '1'
        node.style.pointerEvents = 'auto'
      } else {
        node.style.opacity = '0.3'
        node.style.pointerEvents = 'none'
      }
    })
}

/**
 * Restaura a visualização normal de todos os elementos
 */
export function resetElementsView() {
  document.querySelectorAll('.element').forEach(node => {
    node.style.opacity = '1'
    node.style.pointerEvents = 'auto'
    node.classList.remove('highlight')

    // Remover classes de tendência
    const trendClasses = Array.from(node.classList).filter(
      className =>
        className.startsWith('trend-level-') || className === 'trend-unknown'
    )

    trendClasses.forEach(className => {
      node.classList.remove(className)
    })
  })

  // Remover classe de modo de tendência da tabela
  const tableContainer = document.getElementById('periodicTable')
  if (tableContainer) {
    tableContainer.classList.remove('trend-mode', 'trend-reverse')
  }

  const lanthanideContainer = document.getElementById('lanthanide-series')
  if (lanthanideContainer) {
    lanthanideContainer.classList.remove('trend-mode', 'trend-reverse')
  }

  const actinideContainer = document.getElementById('actinide-series')
  if (actinideContainer) {
    actinideContainer.classList.remove('trend-mode', 'trend-reverse')
  }
}
