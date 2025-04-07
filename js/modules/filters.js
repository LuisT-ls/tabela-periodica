/**
 * Módulo de filtros da tabela periódica
 *
 * Este módulo gerencia os filtros de categoria e bloco
 * para exibição seletiva de elementos na tabela periódica.
 */

import { getElementsByCategory, getElementsByBlock } from './data-loader.js'
import { filterElements, resetElementsView } from './table-renderer.js'

let elementsData = []
let categoryFilter
let blockFilter
let currentFilters = {
  category: 'todos',
  block: 'todos'
}

/**
 * Configura os filtros de categoria e bloco
 * @param {Array} elements Array com os dados dos elementos
 */
export function setupFilters(elements) {
  elementsData = elements

  categoryFilter = document.getElementById('categoryFilter')
  blockFilter = document.getElementById('blockFilter')

  if (!categoryFilter || !blockFilter) {
    console.error('Elementos de filtro não encontrados')
    return
  }

  // Configurar eventos de mudança dos filtros
  categoryFilter.addEventListener('change', () => {
    currentFilters.category = categoryFilter.value
    applyFilters()
  })

  blockFilter.addEventListener('change', () => {
    currentFilters.block = blockFilter.value
    applyFilters()
  })
}

/**
 * Aplica os filtros atualmente selecionados
 */
function applyFilters() {
  // Se ambos os filtros estiverem em "todos", restaurar a visualização normal
  if (currentFilters.category === 'todos' && currentFilters.block === 'todos') {
    resetElementsView()
    return
  }

  // Aplicar filtro de categoria
  let filteredElements = elementsData

  if (currentFilters.category !== 'todos') {
    filteredElements = getElementsByCategory(
      filteredElements,
      currentFilters.category
    )
  }

  // Aplicar filtro de bloco
  if (currentFilters.block !== 'todos') {
    filteredElements = getElementsByBlock(
      filteredElements,
      currentFilters.block
    )
  }

  // Atualizar a visualização com os elementos filtrados
  filterElements(filteredElements)
}

/**
 * Redefine todos os filtros para os valores padrão
 */
export function resetFilters() {
  categoryFilter.value = 'todos'
  blockFilter.value = 'todos'
  currentFilters = {
    category: 'todos',
    block: 'todos'
  }
  resetElementsView()
}

/**
 * Aplica um filtro específico programaticamente
 * @param {string} filterType Tipo de filtro ('category' ou 'block')
 * @param {string} filterValue Valor do filtro
 */
export function applyFilter(filterType, filterValue) {
  if (filterType === 'category' && categoryFilter) {
    categoryFilter.value = filterValue
    currentFilters.category = filterValue
  } else if (filterType === 'block' && blockFilter) {
    blockFilter.value = filterValue
    currentFilters.block = filterValue
  }

  applyFilters()
}
