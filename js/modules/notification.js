/**
 * Módulo de notificações
 *
 * Este módulo gerencia as notificações exibidas para o usuário.
 */

let notificationElement
let notificationMessage
let notificationClose
let notificationTimeout

/**
 * Inicializa o módulo de notificações ao ser importado
 */
;(function init() {
  // Obter referências aos elementos DOM
  notificationElement = document.getElementById('notification')
  notificationMessage = document.getElementById('notificationMessage')
  notificationClose = document.getElementById('notificationClose')

  // Verificar se os elementos existem
  if (!notificationElement || !notificationMessage || !notificationClose) {
    console.error('Elementos de notificação não encontrados')
    return
  }

  // Configurar evento de fechar
  notificationClose.addEventListener('click', hideNotification)
})()

/**
 * Exibe uma notificação para o usuário
 * @param {string} message Mensagem a ser exibida
 * @param {string} type Tipo de notificação ('info', 'success', 'warning', 'error')
 * @param {number} duration Duração em milissegundos (padrão: 5000ms)
 */
export function showNotification(message, type = 'info', duration = 5000) {
  if (!notificationElement || !notificationMessage) {
    console.error('Elementos de notificação não inicializados')
    return
  }

  // Limpar timeout anterior
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }

  // Definir a mensagem
  notificationMessage.textContent = message

  // Remover classes de tipo anteriores
  notificationElement.classList.remove(
    'notification-info',
    'notification-success',
    'notification-warning',
    'notification-error'
  )

  // Adicionar classe de tipo atual
  notificationElement.classList.add(`notification-${type}`)

  // Mostrar a notificação
  notificationElement.classList.add('show')
  notificationElement.classList.remove('hide')

  // Configurar timeout para esconder automaticamente
  if (duration > 0) {
    notificationTimeout = setTimeout(() => {
      hideNotification()
    }, duration)
  }
}

/**
 * Esconde a notificação atual
 */
function hideNotification() {
  if (!notificationElement) return

  // Adicionar classe de ocultar com animação
  notificationElement.classList.add('hide')
  notificationElement.classList.remove('show')

  // Limpar timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}
