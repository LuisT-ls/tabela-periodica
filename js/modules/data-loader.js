/**
 * Módulo de carregamento de dados dos elementos
 *
 * Este módulo é responsável por carregar dados dos elementos da tabela periódica
 * a partir do arquivo JSON e prepará-los para uso na aplicação.
 */

/**
 * Carrega os dados dos elementos a partir do arquivo JSON
 * @returns {Promise<Array>} Promise que resolve para um array de elementos
 */
export async function loadElements() {
  try {
    const response = await fetch('/data/elements.json')

    if (!response.ok) {
      throw new Error(
        `Falha ao carregar elementos: ${response.status} ${response.statusText}`
      )
    }

    const elements = await response.json()

    // Processar e enriquecer os dados
    return processElementsData(elements)
  } catch (error) {
    console.error('Erro ao carregar os elementos:', error)
    throw error
  }
}

/**
 * Processa os dados dos elementos para adicionar propriedades calculadas
 * e preparar para renderização
 * @param {Array} elements Array de elementos da tabela periódica
 * @returns {Array} Array de elementos processados
 */
function processElementsData(elements) {
  return elements.map(element => {
    // Determinar a posição no grid da tabela (para elementos com grupo e período definidos)
    if (element.group && element.period) {
      element.gridColumn = element.group
      element.gridRow = element.period
    }

    // Formatação da massa atômica
    element.formattedMass = element.atomicMass.toFixed(4)

    // Classificar por série
    if (element.atomicNumber >= 57 && element.atomicNumber <= 71) {
      element.series = 'lanthanide'
      // Calcular posição na série de lantanídeos
      element.seriesPosition = element.atomicNumber - 56
    } else if (element.atomicNumber >= 89 && element.atomicNumber <= 103) {
      element.series = 'actinide'
      // Calcular posição na série de actinídeos
      element.seriesPosition = element.atomicNumber - 88
    } else {
      element.series = 'main'
    }

    // Formatações adicionais para exibição
    element.formattedElectronegativity =
      element.electronegativity !== null
        ? element.electronegativity.toFixed(2)
        : 'N/A'

    element.formattedDensity =
      element.density !== null
        ? element.density < 0.01
          ? element.density.toExponential(2)
          : element.density.toFixed(4)
        : 'N/A'

    // Propriedade para verificar se o elemento é favorito (será utilizada depois)
    element.isFavorite = false

    return element
  })
}

/**
 * Busca um elemento pelo número atômico
 * @param {Array} elements Array de elementos
 * @param {number} atomicNumber Número atômico do elemento
 * @returns {Object|null} Elemento encontrado ou null
 */
export function getElementById(elements, atomicNumber) {
  return elements.find(element => element.atomicNumber === atomicNumber) || null
}

/**
 * Busca elementos por categoria
 * @param {Array} elements Array de elementos
 * @param {string} category Categoria dos elementos
 * @returns {Array} Array de elementos da categoria especificada
 */
export function getElementsByCategory(elements, category) {
  if (category === 'todos') {
    return elements
  }
  return elements.filter(element => element.category === category)
}

/**
 * Busca elementos por bloco
 * @param {Array} elements Array de elementos
 * @param {string} block Bloco dos elementos (s, p, d, f)
 * @returns {Array} Array de elementos do bloco especificado
 */
export function getElementsByBlock(elements, block) {
  if (block === 'todos') {
    return elements
  }
  return elements.filter(element => element.block === block)
}

/**
 * Busca elementos por texto (nome, símbolo ou número atômico)
 * @param {Array} elements Array de elementos
 * @param {string} searchText Texto para busca
 * @returns {Array} Array de elementos que correspondem à busca
 */
export function searchElements(elements, searchText) {
  if (!searchText || searchText.trim() === '') {
    return elements
  }

  const normalizedSearch = searchText.trim().toLowerCase()

  return elements.filter(element => {
    return (
      element.name.toLowerCase().includes(normalizedSearch) ||
      element.symbol.toLowerCase().includes(normalizedSearch) ||
      element.atomicNumber.toString().includes(normalizedSearch)
    )
  })
}
