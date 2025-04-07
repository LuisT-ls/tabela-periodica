/**
 * Módulo de modo escuro
 *
 * Este módulo gerencia a funcionalidade de alternância entre
 * os temas claro e escuro da aplicação.
 */

import { showNotification } from './notification.js'

// Chave para armazenamento da preferência do usuário no localStorage
const THEME_STORAGE_KEY = 'tabla-periodica-theme'

/**
 * Configura a funcionalidade de modo escuro
 */
export function setupDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle')

  if (!darkModeToggle) {
    console.error('Botão de modo escuro não encontrado')
    return
  }

  // Verificar preferência salva
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  // Verificar preferência do sistema operacional
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

  // Configurar tema inicial
  if (savedTheme) {
    // Usar preferência salva
    document.documentElement.setAttribute('data-theme', savedTheme)
    updateDarkModeButton(savedTheme === 'dark')
  } else if (prefersDarkScheme.matches) {
    // Usar preferência do sistema se não houver preferência salva
    document.documentElement.setAttribute('data-theme', 'dark')
    updateDarkModeButton(true)
  }

  // Configurar evento de clique
  darkModeToggle.addEventListener('click', toggleDarkMode)

  // Configurar evento para mudanças na preferência do sistema
  prefersDarkScheme.addEventListener('change', event => {
    // Só mudar automaticamente se o usuário não tiver uma preferência salva
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      const newTheme = event.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      updateDarkModeButton(event.matches)
    }
  })
}

/**
 * Alterna entre os modos claro e escuro
 */
function toggleDarkMode() {
  const currentTheme =
    document.documentElement.getAttribute('data-theme') || 'light'
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'

  // Aplicar novo tema
  document.documentElement.setAttribute('data-theme', newTheme)

  // Salvar preferência
  localStorage.setItem(THEME_STORAGE_KEY, newTheme)

  // Atualizar ícone do botão
  updateDarkModeButton(newTheme === 'dark')

  // Mostrar notificação
  const message =
    newTheme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'

  showNotification(message, 'info')
}

/**
 * Atualiza o ícone do botão de modo escuro
 * @param {boolean} isDarkMode Indica se o modo escuro está ativo
 */
function updateDarkModeButton(isDarkMode) {
  const darkModeToggle = document.getElementById('darkModeToggle')

  if (!darkModeToggle) return

  // Limpar conteúdo atual
  darkModeToggle.innerHTML = ''

  // Adicionar ícones para a animação de transição
  if (isDarkMode) {
    darkModeToggle.innerHTML = `
      <i class="fas fa-sun"></i>
      <i class="fas fa-moon"></i>
    `
  } else {
    darkModeToggle.innerHTML = `
      <i class="fas fa-moon"></i>
      <i class="fas fa-sun"></i>
    `
  }
}

/**
 * Retorna o tema atual
 * @returns {string} 'dark' ou 'light'
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}

/**
 * Define o tema manualmente
 * @param {string} theme 'dark' ou 'light'
 */
export function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') {
    console.error('Tema inválido:', theme)
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  updateDarkModeButton(theme === 'dark')
}
