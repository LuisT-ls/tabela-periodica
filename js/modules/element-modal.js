/**
 * Módulo do modal de detalhes do elemento
 *
 * Este módulo é responsável por gerenciar o modal que exibe
 * informações detalhadas sobre um elemento químico.
 */

import { showNotification } from './notification.js'
import { getElementById } from './data-loader.js'
import { toggleFavorite, isFavorite } from './favorites.js'
import { setupElectronAnimation } from './electron-animation.js'

let elementsData = []

/**
 * Configura o modal de elemento e seus eventos
 * @param {Array} elements Array com os dados de todos os elementos
 */
export function setupElementModal(elements) {
  elementsData = elements

  // Listener para abrir o modal quando um elemento é clicado
  document.addEventListener('element-clicked', event => {
    openElementModal(event.detail.atomicNumber)
  })

  // Configurar tabs do modal
  setupModalTabs()

  // Configurar botão de fechar
  const closeButton = document.querySelector('#elementModal .close')
  if (closeButton) {
    closeButton.addEventListener('click', closeElementModal)
  }

  // Fechar modal quando clicar fora do conteúdo
  document.getElementById('elementModal').addEventListener('click', event => {
    if (event.target.id === 'elementModal') {
      closeElementModal()
    }
  })

  // Configurar botão de favorito
  const favoriteBtn = document.getElementById('favoriteBtn')
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', () => {
      const atomicNumber = parseInt(favoriteBtn.dataset.atomicNumber, 10)
      if (atomicNumber) {
        const element = getElementById(elementsData, atomicNumber)
        if (element) {
          toggleFavorite(element)
          updateFavoriteButton(element)
        }
      }
    })
  }

  // Configurar botão de comparação
  const compareBtn = document.getElementById('compareBtn')
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      const atomicNumber = parseInt(compareBtn.dataset.atomicNumber, 10)
      if (atomicNumber) {
        // Enviar evento para o módulo de comparação
        document.dispatchEvent(
          new CustomEvent('start-comparison', {
            detail: { atomicNumber }
          })
        )

        closeElementModal()
      }
    })
  }
}

/**
 * Abre o modal com as informações de um elemento específico
 * @param {number} atomicNumber Número atômico do elemento a ser exibido
 */
export function openElementModal(atomicNumber) {
  const element = getElementById(elementsData, atomicNumber)
  if (!element) {
    showNotification('Elemento não encontrado', 'error')
    return
  }

  // Preencher o modal com as informações do elemento
  fillElementModal(element)

  // Mostrar o modal
  const modal = document.getElementById('elementModal')
  modal.classList.add('active')

  // Ativar a primeira tab
  document.querySelector('.tab-btn[data-tab="basics"]').click()

  // Inicializar a animação dos elétrons (será feita no módulo electron-animation.js)
  setupElectronAnimation(element)
}

/**
 * Fecha o modal de elemento
 */
export function closeElementModal() {
  const modal = document.getElementById('elementModal')
  modal.classList.remove('active')
}

/**
 * Preenche o modal com as informações do elemento
 * @param {Object} element Dados do elemento a ser exibido
 */
function fillElementModal(element) {
  // Configurar o cabeçalho do modal
  document.getElementById('elementName').textContent = element.name
  document.getElementById(
    'elementNumber'
  ).textContent = `(${element.atomicNumber})`

  const symbolElement = document.querySelector('.element-symbol')
  symbolElement.textContent = element.symbol
  symbolElement.className = `element-symbol ${element.category}`

  // Configurar o botão de favorito
  const favoriteBtn = document.getElementById('favoriteBtn')
  favoriteBtn.dataset.atomicNumber = element.atomicNumber
  updateFavoriteButton(element)

  // Informações básicas
  document.getElementById('atomicNumber').textContent = element.atomicNumber
  document.getElementById('atomicMass').textContent = element.formattedMass
  document.getElementById('category').textContent = formatCategory(
    element.category
  )
  document.getElementById('discovery').textContent = element.discoveryYear
  document.getElementById('discoveredBy').textContent = element.discoveredBy
  document.getElementById('elementDescription').textContent =
    element.description

  // Propriedades físicas e químicas
  document.getElementById('density').textContent = element.formattedDensity
  document.getElementById('meltingPoint').textContent = element.meltingPoint
  document.getElementById('boilingPoint').textContent = element.boilingPoint
  document.getElementById('electronegativity').textContent =
    element.formattedElectronegativity
  document.getElementById('atomicRadius').textContent =
    element.atomicRadius || 'N/A'
  document.getElementById('ionizationEnergy').textContent =
    element.ionizationEnergy || 'N/A'
  document.getElementById('group').textContent = element.group || 'N/A'
  document.getElementById('period').textContent = element.period || 'N/A'

  // Configuração eletrônica
  document.getElementById('electronConfig').textContent =
    element.electronConfiguration
  document.getElementById('block').textContent = element.block.toUpperCase()

  // Aplicações
  const applicationsContainer = document.getElementById('elementApplications')
  applicationsContainer.innerHTML = ''

  if (element.applications && element.applications.length > 0) {
    const appList = document.createElement('ul')
    element.applications.forEach(app => {
      const listItem = document.createElement('li')
      listItem.textContent = app
      appList.appendChild(listItem)
    })
    applicationsContainer.appendChild(appList)
  } else {
    applicationsContainer.textContent = 'Informações não disponíveis'
  }

  // Compostos relacionados
  const compoundsContainer = document.getElementById('relatedCompounds')
  compoundsContainer.innerHTML = ''

  if (element.compounds && element.compounds.length > 0) {
    element.compounds.forEach(compound => {
      const compoundItem = document.createElement('div')
      compoundItem.className = 'compound-item'

      const formula = document.createElement('div')
      formula.className = 'compound-formula chemical-formula'
      formula.innerHTML = formatChemicalFormula(compound.formula)

      const name = document.createElement('div')
      name.className = 'compound-name'
      name.textContent = compound.name

      compoundItem.appendChild(formula)
      compoundItem.appendChild(name)
      compoundsContainer.appendChild(compoundItem)
    })
  } else {
    compoundsContainer.textContent = 'Informações não disponíveis'
  }

  // Configurar botão de comparação
  const compareBtn = document.getElementById('compareBtn')
  compareBtn.dataset.atomicNumber = element.atomicNumber
}

/**
 * Atualiza o estado do botão de favorito com base no elemento
 * @param {Object} element Elemento a ser verificado
 */
function updateFavoriteButton(element) {
  const favoriteBtn = document.getElementById('favoriteBtn')
  const isFav = isFavorite(element.atomicNumber)

  if (isFav) {
    favoriteBtn.innerHTML = '<i class="fas fa-star"></i>'
    favoriteBtn.classList.add('active')
  } else {
    favoriteBtn.innerHTML = '<i class="far fa-star"></i>'
    favoriteBtn.classList.remove('active')
  }
}

/**
 * Configura as tabs do modal de elemento
 */
function setupModalTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover a classe active de todos os botões e conteúdos
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabContents.forEach(content => content.classList.remove('active'))

      // Adicionar a classe active ao botão clicado e conteúdo correspondente
      button.classList.add('active')
      const tabId = button.dataset.tab
      document.getElementById(tabId).classList.add('active')
    })
  })
}

/**
 * Formata o nome da categoria para exibição
 * @param {string} category Categoria do elemento
 * @returns {string} Nome formatado da categoria
 */
function formatCategory(category) {
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
 * Formata fórmulas químicas com subscritos HTML
 * @param {string} formula Fórmula química a ser formatada
 * @returns {string} Fórmula HTML com subscritos
 */
function formatChemicalFormula(formula) {
  // Substituir dígitos por tags <sub>
  return formula.replace(/(\d+)/g, '<sub>$1</sub>')
}
