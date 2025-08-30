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

// Importação dos novos módulos
import './modules/quiz.js'
import './modules/accessibility.js'
import './modules/export.js'

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

    // Configurar novos módulos
    setupQuiz(elements)
    setupAccessibility()
    setupExport(elements)

    // Configurar legendas
    setupLegend()

    // Conectar botões de informações e modal sobre
    setupInfoButtons()

    // Conectar novos botões
    setupNewButtons()

    // Configurar PWA
    setupPWA()

    // Exibir notificação de boas-vindas
    setTimeout(() => {
      showNotification('Bem-vindo à Tabela Periódica Interativa! 🧪⚗️', 'info')
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
 * Configura o sistema de quiz
 */
function setupQuiz(elements) {
  if (window.QuizSystem) {
    window.quizSystem = new QuizSystem(elements)

    // Adicionar botão de quiz ao menu
    const quizLink = document.createElement('li')
    quizLink.innerHTML =
      '<a href="#" id="quizLink"><i class="fas fa-question-circle"></i> Quiz</a>'
    quizLink.addEventListener('click', e => {
      e.preventDefault()
      window.quizSystem.openQuiz()
    })

    const menuList = document.querySelector('.menu-list')
    if (menuList) {
      menuList.appendChild(quizLink)
    }
  }
}

/**
 * Configura o sistema de acessibilidade
 */
function setupAccessibility() {
  if (window.AccessibilityManager) {
    window.accessibilityManager = new AccessibilityManager()
  }
}

/**
 * Configura o sistema de exportação
 */
function setupExport(elements) {
  if (window.ExportManager) {
    window.exportManager = new ExportManager(elements)

    // Adicionar botão de exportação ao menu
    const exportLink = document.createElement('li')
    exportLink.innerHTML =
      '<a href="#" id="exportLink"><i class="fas fa-download"></i> Exportar</a>'
    exportLink.addEventListener('click', e => {
      e.preventDefault()
      window.exportManager.openExportModal()
    })

    const menuList = document.querySelector('.menu-list')
    if (menuList) {
      menuList.appendChild(exportLink)
    }
  }
}

/**
 * Configura a PWA
 */
function setupPWA() {
  // Verificar se é PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('pwa-mode')
  }

  // Detectar mudanças de conectividade
  window.addEventListener('online', () => {
    showNotification('Conexão restaurada!', 'success')
  })

  window.addEventListener('offline', () => {
    showNotification(
      'Você está offline. Algumas funcionalidades podem não estar disponíveis.',
      'warning'
    )
  })
}

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

/**
 * Configura os novos botões da aplicação
 */
function setupNewButtons() {
  // Botão de quiz
  const quizToggle = document.getElementById('quizToggle')
  if (quizToggle && window.quizSystem) {
    quizToggle.addEventListener('click', () => {
      window.quizSystem.openQuiz()
    })
  }

  // Botão de exportação
  const exportToggle = document.getElementById('exportToggle')
  if (exportToggle && window.exportManager) {
    exportToggle.addEventListener('click', () => {
      window.exportManager.openExportModal()
    })
  }

  // Botão de acessibilidade
  const accessibilityLink = document.getElementById('accessibilityLink')
  if (accessibilityLink && window.accessibilityManager) {
    accessibilityLink.addEventListener('click', e => {
      e.preventDefault()
      window.accessibilityManager.togglePanel()
    })
  }
}
