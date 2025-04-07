/**
 * Módulo de busca de elementos
 *
 * Este módulo gerencia a funcionalidade de busca de elementos
 * por nome, símbolo ou número atômico.
 */

import { searchElements } from './data-loader.js'
import { highlightElements, resetElementsView } from './table-renderer.js'
import { showNotification } from './notification.js'

let elementsData = []
let searchInput
let clearButton
let searchTimeout

/**
 * Configura a funcionalidade de busca
 * @param {Array} elements Array com os dados dos elementos
 */
export function setupSearch(elements) {
  elementsData = elements

  searchInput = document.getElementById('searchElement')
  clearButton = document.getElementById('clearSearch')

  if (!searchInput || !clearButton) {
    console.error('Elementos de busca não encontrados')
    return
  }

  // Configurar evento de busca (com debounce)
  searchInput.addEventListener('input', () => {
    // Limpar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Configurar novo timeout para debounce (300ms)
    searchTimeout = setTimeout(() => {
      performSearch(searchInput.value)
    }, 300)
  })

  // Configurar evento para tecla Enter
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      clearTimeout(searchTimeout)
      performSearch(searchInput.value)
    }
  })

  // Configurar botão para limpar busca
  clearButton.addEventListener('click', clearSearch)

  // Configurar evento para link no menu mobile
  const searchLink = document.getElementById('searchLink')
  if (searchLink) {
    searchLink.addEventListener('click', () => {
      searchInput.focus()

      // Fechar menu mobile se estiver aberto
      const mobileMenu = document.getElementById('mobileMenu')
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active')
      }
    })
  }
}

/**
 * Realiza a busca de elementos
 * @param {string} searchText Texto de busca
 */
function performSearch(searchText) {
  // Se a busca estiver vazia, restaurar a visualização normal
  if (!searchText || searchText.trim() === '') {
    resetElementsView()
    return
  }

  // Realizar a busca
  const results = searchElements(elementsData, searchText)

  // Atualizar a visualização
  if (results.length > 0) {
    highlightElements(results)

    // Rolar para o primeiro resultado se houver muitos elementos
    if (results.length === 1) {
      const elementNode = document.querySelector(
        `.element[data-atomic-number="${results[0].atomicNumber}"]`
      )
      if (elementNode) {
        elementNode.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    // Mostrar notificação se encontrar mais de um resultado
    if (results.length > 1) {
      showNotification(`Encontrados ${results.length} elementos`, 'info')
    }
  } else {
    // Caso não encontre nenhum resultado
    resetElementsView()
    showNotification('Nenhum elemento encontrado', 'warning')
  }
}

/**
 * Limpa a busca e restaura a visualização normal
 */
function clearSearch() {
  searchInput.value = ''
  searchInput.focus()
  resetElementsView()
}

/**
 * Executa uma busca específica programaticamente
 * @param {string} searchText Texto de busca
 */
export function executeSearch(searchText) {
  searchInput.value = searchText
  performSearch(searchText)
}
