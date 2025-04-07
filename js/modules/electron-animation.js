/**
 * Módulo de animação dos elétrons
 *
 * Este módulo cria uma animação visual da configuração
 * eletrônica de um elemento químico.
 */

/**
 * Configuração inicial da animação de elétrons
 */
export function setupElectronAnimation() {
  // Esta função é chamada uma vez durante a inicialização
  console.log('Configuração da animação de elétrons inicializada')
}

/**
 * Cria a animação dos elétrons para um elemento específico
 * @param {Object} element Dados do elemento
 */
export function createElectronAnimation(element) {
  const container = document.getElementById('electronAnimation')
  if (!container) return

  // Limpar o container
  container.innerHTML = ''

  // Extrair informações da configuração eletrônica
  const shellData = parseElectronConfiguration(element.electronConfiguration)

  // Criar o núcleo
  const nucleus = document.createElement('div')
  nucleus.className = 'nucleus'
  nucleus.textContent = element.symbol
  container.appendChild(nucleus)

  // Criar as camadas eletrônicas e elétrons
  createShells(container, shellData)
}

/**
 * Analisa a configuração eletrônica e extrai informações sobre as camadas
 * @param {string} config String de configuração eletrônica (ex: "1s² 2s² 2p⁶")
 * @returns {Array} Array com informações sobre as camadas eletrônicas
 */
function parseElectronConfiguration(config) {
  if (!config) return []

  const shellsData = []
  const shellPattern = /(\d)([spdf])([¹²³⁴⁵⁶⁷⁸⁹⁺]+)/g

  // Converter superscripts Unicode para números
  const superscriptMap = {
    '¹': 1,
    '²': 2,
    '³': 3,
    '⁴': 4,
    '⁵': 5,
    '⁶': 6,
    '⁷': 7,
    '⁸': 8,
    '⁹': 9,
    '⁺': 10
  }

  let match
  while ((match = shellPattern.exec(config)) !== null) {
    const shellNumber = parseInt(match[1], 10)
    const subshell = match[2]
    const electronCount = Array.from(match[3]).reduce(
      (sum, char) => sum + (superscriptMap[char] || 0),
      0
    )

    // Verificar se a camada já existe no array
    let shell = shellsData.find(s => s.number === shellNumber)
    if (!shell) {
      shell = { number: shellNumber, subshells: [], totalElectrons: 0 }
      shellsData.push(shell)
    }

    // Adicionar subshell
    shell.subshells.push({
      type: subshell,
      electrons: electronCount
    })

    // Atualizar contagem total de elétrons
    shell.totalElectrons += electronCount
  }

  // Ordenar as camadas pelo número
  return shellsData.sort((a, b) => a.number - b.number)
}

/**
 * Cria as camadas eletrônicas e os elétrons na animação
 * @param {HTMLElement} container Container da animação
 * @param {Array} shellsData Dados das camadas eletrônicas
 */
function createShells(container, shellsData) {
  const containerSize = Math.min(container.offsetWidth, 300)
  const centerX = containerSize / 2
  const centerY = containerSize / 2
  const maxShells = shellsData.length

  // Raio base para a primeira camada
  const baseRadius = 40
  const radiusIncrement = 25

  // Criar cada camada eletrônica
  shellsData.forEach((shell, index) => {
    const radius = baseRadius + index * radiusIncrement

    // Criar a órbita
    const orbit = document.createElement('div')
    orbit.className = 'electron-orbit'
    orbit.style.width = `${radius * 2}px`
    orbit.style.height = `${radius * 2}px`
    container.appendChild(orbit)

    // Criar os elétrons na órbita
    createElectronsInOrbit(
      container,
      centerX,
      centerY,
      radius,
      shell.totalElectrons,
      index
    )
  })
}

/**
 * Cria os elétrons em uma órbita específica
 * @param {HTMLElement} container Container da animação
 * @param {number} centerX Coordenada X do centro
 * @param {number} centerY Coordenada Y do centro
 * @param {number} radius Raio da órbita
 * @param {number} electronCount Número de elétrons na órbita
 * @param {number} shellIndex Índice da camada (para velocidade da animação)
 */
function createElectronsInOrbit(
  container,
  centerX,
  centerY,
  radius,
  electronCount,
  shellIndex
) {
  // Limitar o número de elétrons para visualização (no máximo 8 por camada)
  const visibleElectrons = Math.min(electronCount, 8)

  // Ângulo entre cada elétron
  const angleStep = (2 * Math.PI) / visibleElectrons

  // Velocidade da animação baseada no índice da camada
  const speedClass = `orbit-speed-${Math.min(shellIndex + 1, 4)}`

  for (let i = 0; i < visibleElectrons; i++) {
    // Calcular o ângulo inicial do elétron
    const startAngle = i * angleStep

    // Criar container do elétron com animação
    const electronContainer = document.createElement('div')
    electronContainer.className = `electron-orbit ${speedClass}`
    electronContainer.style.width = `${radius * 2}px`
    electronContainer.style.height = `${radius * 2}px`
    container.appendChild(electronContainer)

    // Criar o elétron
    const electron = document.createElement('div')
    electron.className = 'electron'

    // Posicionar o elétron na órbita
    const x = Math.cos(startAngle) * radius + radius
    const y = Math.sin(startAngle) * radius + radius
    electron.style.left = `${x}px`
    electron.style.top = `${y}px`

    electronContainer.appendChild(electron)
  }
}
