// Elementos e estado global
let elements = []
let favoriteElements = new Set()
let currentElement = null
let comparisonElement = null

// Cores para categorias
const categoryColors = {
  'não-metal': '#77dd77',
  'metal-alcalino': '#ff6961',
  'metal-alcalino-terroso': '#fdfd96',
  'metal-transição': '#84b6f4',
  'metal-pós-transição': '#c2b180',
  semimetal: '#fdcae1',
  halogênio: '#77dd77',
  'gás-nobre': '#ff9999',
  lantanídeo: '#dcd0ff',
  actinídeo: '#b0c4de'
}

// Carregar dados dos elementos
async function loadElements() {
  try {
    const response = await fetch('elements.json')
    const data = await response.json()
    elements = data.elements
    initializePeriodicTable()
    createLegend()
  } catch (error) {
    console.error('Erro ao carregar elementos:', error)
  }
}

// Inicializar tabela periódica
function initializePeriodicTable() {
  const table = document.querySelector('.periodic-table')
  const lanthanideSeries = document.getElementById('lanthanide-series')
  const actinideSeries = document.getElementById('actinide-series')

  table.innerHTML = ''
  lanthanideSeries.innerHTML = ''
  actinideSeries.innerHTML = ''

  elements.forEach(element => {
    const elementBox = createElementBox(element)

    if (element.category === 'lantanídeo') {
      lanthanideSeries.appendChild(elementBox)
    } else if (element.category === 'actinídeo') {
      actinideSeries.appendChild(elementBox)
    } else {
      elementBox.style.gridColumn = element.group
      elementBox.style.gridRow = element.period
      table.appendChild(elementBox)
    }
  })
}

// Criar caixa do elemento
function createElementBox(element) {
  const box = document.createElement('div')
  box.className = 'element'
  box.setAttribute('data-atomic-number', element.atomicNumber)
  box.style.backgroundColor = categoryColors[element.category]

  box.innerHTML = `
    <div class="atomic-number">${element.atomicNumber}</div>
    <div class="symbol">${element.symbol}</div>
    <div class="name">${element.name}</div>
    <div class="mass">${parseFloat(element.atomicMass).toFixed(2)}</div>
  `

  box.addEventListener('click', () => showElementModal(element))
  return box
}

// Modal do elemento
function showElementModal(element) {
  currentElement = element
  const modal = document.getElementById('elementModal')

  // Preencher informações básicas
  document.getElementById('elementName').textContent = element.name
  document.querySelector('.element-symbol').textContent = element.symbol
  document.getElementById('atomicNumber').textContent = element.atomicNumber
  document.getElementById('atomicMass').textContent = parseFloat(
    element.atomicMass
  ).toFixed(3)
  document.getElementById('category').textContent = formatCategory(
    element.category
  )
  document.getElementById('discovery').textContent = element.discovery
  document.getElementById('elementDescription').textContent =
    element.description

  // Preencher propriedades
  document.getElementById('density').textContent = element.density
  document.getElementById('meltingPoint').textContent = element.meltingPoint
  document.getElementById('boilingPoint').textContent = element.boilingPoint
  document.getElementById('block').textContent = element.block.toUpperCase()
  document.getElementById('electronConfig').textContent =
    element.electronConfiguration

  // Preencher aplicações
  const applicationsContainer = document.getElementById('elementApplications')
  if (element.applications && element.applications.length > 0) {
    applicationsContainer.innerHTML = element.applications
      .map(app => `<div class="application-item">${app}</div>`)
      .join('')
  } else {
    applicationsContainer.innerHTML =
      '<p>Informações de aplicações não disponíveis.</p>'
  }

  // Preencher compostos importantes
  const compoundsContainer = document.getElementById('relatedCompounds')
  if (element.compounds && element.compounds.length > 0) {
    compoundsContainer.innerHTML = element.compounds
      .map(compound => `<div class="compound-item">${compound}</div>`)
      .join('')
  } else {
    compoundsContainer.innerHTML =
      '<p>Compostos importantes não encontrados.</p>'
  }

  // Atualizar botão de favoritos
  updateFavoriteButton()

  modal.style.display = 'flex'
}

// Gerenciar favoritos
function updateFavoriteButton() {
  const btn = document.getElementById('favoriteBtn')
  const isFavorite = favoriteElements.has(currentElement.atomicNumber)

  btn.innerHTML = `<i class="fa${isFavorite ? 's' : 'r'} fa-star"></i>`
  updateFavoritesList()
}

function toggleFavorite() {
  if (favoriteElements.has(currentElement.atomicNumber)) {
    favoriteElements.delete(currentElement.atomicNumber)
  } else {
    favoriteElements.add(currentElement.atomicNumber)
  }
  updateFavoriteButton()
  saveFavorites()
}

function updateFavoritesList() {
  const favoritesList = document.querySelector('.favorites-list')
  favoritesList.innerHTML = ''

  favoriteElements.forEach(atomicNumber => {
    const element = elements.find(e => e.atomicNumber === atomicNumber)
    const favItem = document.createElement('div')
    favItem.className = 'favorite-item'
    favItem.style.backgroundColor = categoryColors[element.category]
    favItem.innerHTML = `
      <span>${element.symbol}</span>
      <button onclick="removeFavorite(${atomicNumber})">
        <i class="fas fa-times"></i>
      </button>
    `
    favoritesList.appendChild(favItem)
  })
}

// Pesquisa e filtros
function setupSearchAndFilters() {
  const searchInput = document.getElementById('searchElement')
  const categoryFilter = document.getElementById('categoryFilter')
  const blockFilter = document.getElementById('blockFilter')
  const trendFilter = document.getElementById('trendFilter')

  searchInput.addEventListener('input', filterElements)
  categoryFilter.addEventListener('change', filterElements)
  blockFilter.addEventListener('change', filterElements)
  trendFilter.addEventListener('change', applyTrendVisualization)
}

function filterElements() {
  const searchTerm = document
    .getElementById('searchElement')
    .value.toLowerCase()
  const categoryValue = document.getElementById('categoryFilter').value
  const blockValue = document.getElementById('blockFilter').value

  document.querySelectorAll('.element').forEach(elementBox => {
    const element = elements.find(
      e => e.atomicNumber === parseInt(elementBox.dataset.atomicNumber)
    )

    const matchesSearch =
      element.name.toLowerCase().includes(searchTerm) ||
      element.symbol.toLowerCase().includes(searchTerm) ||
      element.atomicNumber.toString().includes(searchTerm)

    const matchesCategory =
      categoryValue === 'todos' || element.category === categoryValue
    const matchesBlock = blockValue === 'todos' || element.block === blockValue

    elementBox.style.display =
      matchesSearch && matchesCategory && matchesBlock ? 'flex' : 'none'
  })
}

// Visualização de tendências
function applyTrendVisualization() {
  const trendType = document.getElementById('trendFilter').value

  if (trendType === 'none') {
    resetElementColors()
    return
  }

  // Mapeamento de tendências para as propriedades corretas
  const trendPropertyMap = {
    electronegativity: 'electronegativity',
    atomicRadius: 'atomicRadius',
    ionizationEnergy: 'ionizationEnergy'
  }

  const property = trendPropertyMap[trendType]

  if (!property) {
    console.error('Propriedade de tendência inválida')
    return
  }

  const values = elements
    .map(element => parseFloat(element[property]) || 0)
    .filter(value => value !== 0)

  const max = Math.max(...values)
  const min = Math.min(...values)

  elements.forEach(element => {
    const value = parseFloat(element[property]) || 0
    const elementBox = document.querySelector(
      `[data-atomic-number="${element.atomicNumber}"]`
    )

    if (elementBox) {
      if (value === 0) {
        // Se não tiver valor, manter a cor original da categoria
        elementBox.style.backgroundColor = categoryColors[element.category]
      } else {
        // Calcular intensidade baseada no valor normalizado
        const intensity = ((value - min) / (max - min)) * 100

        // Cores diferentes para cada tendência
        const colorSchemes = {
          electronegativity: `hsl(120, ${intensity}%, 50%)`, // Verde a verde escuro
          atomicRadius: `hsl(240, ${intensity}%, 50%)`, // Azul a azul escuro
          ionizationEnergy: `hsl(0, ${intensity}%, 50%)` // Vermelho a vermelho escuro
        }

        elementBox.style.backgroundColor = colorSchemes[trendType]
      }
    }
  })
}

// Garantir que a função seja chamada na inicialização
document.addEventListener('DOMContentLoaded', () => {
  const trendFilter = document.getElementById('trendFilter')
  if (trendFilter) {
    trendFilter.addEventListener('change', applyTrendVisualization)
  }
})

function resetElementColors() {
  document.querySelectorAll('.element').forEach(elementBox => {
    const element = elements.find(
      e => e.atomicNumber === parseInt(elementBox.dataset.atomicNumber)
    )
    elementBox.style.backgroundColor = categoryColors[element.category]
  })
}

// Utilitários
function formatCategory(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function createLegend() {
  const legendContainer = document.querySelector('.legend-items')

  Object.entries(categoryColors).forEach(([category, color]) => {
    const legendItem = document.createElement('div')
    legendItem.className = 'legend-item'
    legendItem.innerHTML = `
      <div class="color-box" style="background-color: ${color}"></div>
      <span>${formatCategory(category)}</span>
    `
    legendContainer.appendChild(legendItem)
  })
}

// Modo noturno
function setupDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle')
  const isDarkMode = localStorage.getItem('darkMode') === 'true'

  if (isDarkMode) {
    document.body.classList.add('dark-mode')
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
    localStorage.setItem(
      'darkMode',
      document.body.classList.contains('dark-mode')
    )
  })
}

// Event Listeners e Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadElements()
  setupSearchAndFilters()
  setupDarkMode()

  // Modal listeners
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none'
    })
  })

  document
    .getElementById('favoriteBtn')
    .addEventListener('click', toggleFavorite)

  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', e => {
      const tabId = e.target.dataset.tab

      document
        .querySelectorAll('.tab-btn')
        .forEach(btn => btn.classList.remove('active'))
      document
        .querySelectorAll('.tab-content')
        .forEach(content => content.classList.remove('active'))

      e.target.classList.add('active')
      document.getElementById(tabId).classList.add('active')
    })
  })
})
