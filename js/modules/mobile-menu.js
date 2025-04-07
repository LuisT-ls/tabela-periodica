/**
 * Módulo de menu móvel
 *
 * Este módulo gerencia o comportamento do menu móvel
 * para dispositivos com tela pequena.
 */

let mobileMenu
let menuToggle

/**
 * Configura o menu móvel
 */
export function setupMobileMenu() {
  mobileMenu = document.getElementById('mobileMenu')
  menuToggle = document.getElementById('menuToggle')

  if (!mobileMenu || !menuToggle) {
    console.error('Elementos do menu móvel não encontrados')
    return
  }

  // Configurar evento para alternar o menu
  menuToggle.addEventListener('click', toggleMobileMenu)

  // Configurar evento para fechar o menu ao clicar fora
  document.addEventListener('click', event => {
    if (
      mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      toggleMobileMenu()
    }
  })

  // Configurar evento para fechar o menu ao pressionar Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMobileMenu()
    }
  })
}

/**
 * Alterna a visibilidade do menu móvel
 */
function toggleMobileMenu() {
  if (!mobileMenu) return

  mobileMenu.classList.toggle('active')

  // Atualizar ícone do botão
  if (menuToggle) {
    const icon = menuToggle.querySelector('i')
    if (icon) {
      if (mobileMenu.classList.contains('active')) {
        icon.className = 'fas fa-times'
      } else {
        icon.className = 'fas fa-bars'
      }
    }
  }

  // Impedir rolagem do fundo quando o menu estiver aberto
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}
