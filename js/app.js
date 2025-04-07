/**
 * Tabela Periódica Interativa - Arquivo principal
 *
 * Este é o arquivo principal que inicializa a aplicação e carrega todos os módulos necessários.
 */

// Importação de módulos
import { loadElements } from './modules/data-loader.js'
import { renderPeriodicTable } from './modules/table-renderer.js'
import { setupElementModal } from './modules/element-modal.js'
import { setupSearch } from './modules/search.js'
import { setupFilters } from './modules/filters.js'
import { setupDarkMode } from './modules/dark-mode.js'
import { setupFavorites } from './modules/favorites.js'
import { setupTrends } from './modules/trends.js'
import { setupComparison } from './modules/comparison.js'
import { setupMobileMenu } from './modules/mobile-menu.js'
import { showNotification } from './modules/notification.js'
import { setupElectronAnimation } from './modules/electron-animation.js'

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Carregar dados dos elementos
    const elements = await loadElements()
    if (!elements || elements.length === 0) {
      throw new Error('Falha ao carregar dados dos elementos')
    }

    // Renderizar a tabela periódica
    renderPeriodicTable(elements)

    // Configurar todas as funcionalidades
    setupElementModal(elements)
    setupSearch(elements)
    setupFilters(elements)
    setupDarkMode()
    setupFavorites(elements)
    setupTrends(elements)
    setupComparison(elements)
    setupMobileMenu()
    setupElectronAnimation()

    // Configurar legendas
    setupLegend()

    // Conectar botões de informações e modal sobre
    setupInfoButtons()

    // Exibir notificação de boas-vindas
    setTimeout(() => {
      showNotification('Bem-vindo à Tabela Periódica Interativa!', 'info')
    }, 1000)
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error)
    showNotification(
      'Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.',
      'error'
    )
  }
})

/**
 * Configura a legenda das categorias de elementos
 */
function setupLegend() {
  const legendItems = document.getElementById('legendItems')
  if (!legendItems) return

  const categories = [
    { name: 'Não Metais', class: 'não-metal' },
    { name: 'Metais Alcalinos', class: 'metal-alcalino' },
    { name: 'Metais Alcalinos Terrosos', class: 'metal-alcalino-terroso' },
    { name: 'Metais de Transição', class: 'metal-transição' },
    { name: 'Metais de Pós-Transição', class: 'metal-pos-transicao' },
    { name: 'Semimetais', class: 'semimetal' },
    { name: 'Halogênios', class: 'halogenio' },
    { name: 'Gases Nobres', class: 'gás-nobre' },
    { name: 'Lantanídeos', class: 'lantanídeo' },
    { name: 'Actinídeos', class: 'actinídeo' }
  ]

  categories.forEach(category => {
    const legendItem = document.createElement('div')
    legendItem.className = 'legend-item'

    const colorBox = document.createElement('div')
    colorBox.className = `legend-color element ${category.class}`

    const label = document.createElement('span')
    label.textContent = category.name

    legendItem.appendChild(colorBox)
    legendItem.appendChild(label)
    legendItems.appendChild(legendItem)
  })
}

/**
 * Configura botões de informações e o modal sobre
 */
function setupInfoButtons() {
  const aboutModal = document.getElementById('aboutModal')
  const aboutLink = document.getElementById('aboutLink')
  const aboutFooterLink = document.getElementById('aboutFooterLink')
  const infoToggle = document.getElementById('infoToggle')
  const closeButtons = document.querySelectorAll('.modal .close')

  // Função para abrir o modal sobre
  const openAboutModal = () => {
    if (aboutModal) {
      aboutModal.classList.add('active')
    }
  }

  // Configurar botões que abrem o modal
  if (aboutLink) aboutLink.addEventListener('click', openAboutModal)
  if (aboutFooterLink) aboutFooterLink.addEventListener('click', openAboutModal)
  if (infoToggle) infoToggle.addEventListener('click', openAboutModal)

  // Configurar botões para fechar modais
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal')
      if (modal) {
        modal.classList.remove('active')
      }
    })
  })

  // Fechar modais ao clicar fora do conteúdo
  document.addEventListener('click', event => {
    if (
      event.target.classList.contains('modal') &&
      event.target.classList.contains('active')
    ) {
      event.target.classList.remove('active')
    }
  })
}
