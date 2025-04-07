/**
 * Módulo de elementos favoritos
 *
 * Este módulo gerencia a funcionalidade de favoritos,
 * permitindo que os usuários marquem e acessem seus elementos preferidos.
 */

import { getElementById } from './data-loader.js'
import { updateElementView } from './table-renderer.js'
import { showNotification } from './notification.js'
import { openElementModal } from './element-modal.js'

// Chave para armazenamento dos favoritos no localStorage
const FAVORITES_STORAGE_KEY = 'tabla-periodica-favorites'

let elementsData = []
let favoritesPanel
let favoritesList
let emptyFavorites
let favoritesButton
let closeFavoritesButton
let favoritesLinkButton

// Array para armazenar os números atômicos dos elementos favoritos
let favoriteElements = []

/**
 * Configura a funcionalidade de favoritos
 * @param {Array} elements Array com os dados dos elementos
 */
export function setupFavorites(elements) {
  elementsData = elements

  // Obter referências para os elementos DOM
  favoritesPanel = document.getElementById('favorites')
  favoritesList = document.getElementById('favoritesList')
  emptyFavorites = document.getElementById('emptyFavorites')
  closeFavoritesButton = document.getElementById('closeFavorites')
  favoritesLinkButton = document.getElementById('favoritesLink')

  // Verificar se os elementos DOM existem
  if (!favoritesPanel || !favoritesList || !emptyFavorites) {
    console.error('Elementos de favoritos não encontrados')
    return
  }

  // Carregar favoritos salvos no localStorage
  loadFavorites()

  // Configurar eventos
  if (closeFavoritesButton) {
    closeFavoritesButton.addEventListener('click', toggleFavoritesPanel)
  }

  if (favoritesLinkButton) {
    favoritesLinkButton.addEventListener('click', event => {
      event.preventDefault()
      toggleFavoritesPanel()

      // Fechar menu mobile se estiver aberto
      const mobileMenu = document.getElementById('mobileMenu')
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active')
      }
    })
  }

  // Renderizar lista inicial de favoritos
  renderFavoritesList()
}

/**
 * Carrega os favoritos salvos no localStorage
 */
function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (savedFavorites) {
      favoriteElements = JSON.parse(savedFavorites)

      // Atualizar a propriedade isFavorite nos elementos
      elementsData.forEach(element => {
        element.isFavorite = favoriteElements.includes(element.atomicNumber)
      })
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error)
    favoriteElements = []
  }
}

/**
 * Salva os favoritos no localStorage
 */
function saveFavorites() {
  try {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteElements)
    )
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error)
    showNotification('Erro ao salvar favoritos', 'error')
  }
}

/**
 * Adiciona ou remove um elemento dos favoritos
 * @param {Object} element Elemento a ser adicionado/removido dos favoritos
 */
export function toggleFavorite(element) {
  const index = favoriteElements.indexOf(element.atomicNumber)

  if (index === -1) {
    // Adicionar aos favoritos
    favoriteElements.push(element.atomicNumber)
    element.isFavorite = true
    showNotification(`${element.name} adicionado aos favoritos`, 'success')
  } else {
    // Remover dos favoritos
    favoriteElements.splice(index, 1)
    element.isFavorite = false
    showNotification(`${element.name} removido dos favoritos`, 'info')
  }

  // Atualizar a visualização do elemento na tabela
  updateElementView(element)

  // Salvar alterações
  saveFavorites()

  // Atualizar a lista de favoritos
  renderFavoritesList()
}

/**
 * Verifica se um elemento está nos favoritos
 * @param {number} atomicNumber Número atômico do elemento
 * @returns {boolean} Verdadeiro se o elemento estiver nos favoritos
 */
export function isFavorite(atomicNumber) {
  return favoriteElements.includes(atomicNumber)
}

/**
 * Renderiza a lista de elementos favoritos
 */
function renderFavoritesList() {
  if (!favoritesList || !emptyFavorites) return

  // Limpar lista atual
  favoritesList.innerHTML = ''

  // Verificar se há favoritos
  if (favoriteElements.length === 0) {
    favoritesList.style.display = 'none'
    emptyFavorites.style.display = 'flex'
    return
  }

  // Mostrar lista e esconder mensagem vazia
  favoritesList.style.display = 'grid'
  emptyFavorites.style.display = 'none'

  // Renderizar cada elemento favorito
  favoriteElements.forEach(atomicNumber => {
    const element = getElementById(elementsData, atomicNumber)
    if (element) {
      const favoriteElement = createFavoriteElement(element)
      favoritesList.appendChild(favoriteElement)
    }
  })
}

/**
 * Cria um elemento HTML para representar um elemento favorito
 * @param {Object} element Dados do elemento químico
 * @returns {HTMLElement} Elemento HTML para a lista de favoritos
 */
function createFavoriteElement(element) {
  const favoriteElement = document.createElement('div')
  favoriteElement.className = `favorite-element ${element.category}`

  favoriteElement.innerHTML = `
    <div class="favorite-symbol">${element.symbol}</div>
    <div class="favorite-name">${element.name}</div>
    <div class="favorite-info">${element.atomicNumber}</div>
    <button class="favorite-remove" title="Remover dos favoritos">
      <i class="fas fa-times"></i>
    </button>
  `

  // Configurar evento de clique para abrir o modal do elemento
  favoriteElement.addEventListener('click', event => {
    // Verificar se o clique foi no botão de remover
    if (!event.target.closest('.favorite-remove')) {
      openElementModal(element.atomicNumber)
    }
  })

  // Configurar evento para remover dos favoritos
  const removeButton = favoriteElement.querySelector('.favorite-remove')
  if (removeButton) {
    removeButton.addEventListener('click', event => {
      event.stopPropagation()
      toggleFavorite(element)
    })
  }

  return favoriteElement
}

/**
 * Abre/Fecha o painel de favoritos
 */
export function toggleFavoritesPanel() {
  if (!favoritesPanel) return

  // Alternar classe 'active'
  favoritesPanel.classList.toggle('active')

  // Atualizar lista de favoritos se o painel estiver sendo aberto
  if (favoritesPanel.classList.contains('active')) {
    renderFavoritesList()
  }
}

/**
 * Obtém a lista de elementos favoritos
 * @returns {Array} Array de elementos favoritos
 */
export function getFavoriteElements() {
  return favoriteElements
    .map(atomicNumber => getElementById(elementsData, atomicNumber))
    .filter(Boolean)
}
