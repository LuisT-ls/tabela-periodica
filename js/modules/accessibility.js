/**
 * Módulo de Acessibilidade
 *
 * Este módulo implementa funcionalidades avançadas de acessibilidade
 * para tornar a aplicação mais inclusiva para todos os usuários.
 */

class AccessibilityManager {
  constructor() {
    this.isHighContrast = false
    this.isReducedMotion = false
    this.fontSize = 100 // porcentagem
    this.isScreenReaderMode = false
    this.keyboardNavigation = false
    this.focusVisible = false

    this.initializeAccessibility()
  }

  /**
   * Inicializa o sistema de acessibilidade
   */
  initializeAccessibility() {
    this.createAccessibilityPanel()
    this.bindEvents()
    this.loadPreferences()
    this.setupKeyboardNavigation()
    this.setupScreenReaderSupport()
    this.setupFocusManagement()
  }

  /**
   * Cria o painel de acessibilidade
   */
  createAccessibilityPanel() {
    const panelHTML = `
      <div id="accessibilityPanel" class="accessibility-panel">
        <div class="accessibility-header">
          <h3><i class="fas fa-universal-access"></i> Acessibilidade</h3>
          <button class="close-accessibility" id="closeAccessibility">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="accessibility-content">
          <div class="accessibility-section">
            <h4><i class="fas fa-eye"></i> Visual</h4>
            
            <div class="accessibility-option">
              <label for="highContrastToggle">
                <i class="fas fa-adjust"></i> Alto Contraste
              </label>
              <input type="checkbox" id="highContrastToggle" class="accessibility-toggle">
            </div>
            
            <div class="accessibility-option">
              <label for="reducedMotionToggle">
                <i class="fas fa-pause"></i> Reduzir Animação
              </label>
              <input type="checkbox" id="reducedMotionToggle" class="accessibility-toggle">
            </div>
            
            <div class="accessibility-option">
              <label for="fontSizeSlider">
                <i class="fas fa-text-height"></i> Tamanho da Fonte
              </label>
              <div class="font-size-controls">
                <button class="font-size-btn" data-action="decrease" aria-label="Diminuir fonte">
                  <i class="fas fa-minus"></i>
                </button>
                <span id="fontSizeDisplay">100%</span>
                <button class="font-size-btn" data-action="increase" aria-label="Aumentar fonte">
                  <i class="fas fa-plus"></i>
                </button>
                <button class="font-size-btn" data-action="reset" aria-label="Tamanho padrão">
                  <i class="fas fa-undo"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="accessibility-section">
            <h4><i class="fas fa-keyboard"></i> Navegação</h4>
            
            <div class="accessibility-option">
              <label for="keyboardNavToggle">
                <i class="fas fa-keyboard"></i> Navegação por Teclado
              </label>
              <input type="checkbox" id="keyboardNavToggle" class="accessibility-toggle">
            </div>
            
            <div class="accessibility-option">
              <label for="focusVisibleToggle">
                <i class="fas fa-crosshairs"></i> Indicador de Foco
              </label>
              <input type="checkbox" id="focusVisibleToggle" class="accessibility-toggle">
            </div>
          </div>
          
          <div class="accessibility-section">
            <h4><i class="fas fa-volume-up"></i> Áudio</h4>
            
            <div class="accessibility-option">
              <label for="screenReaderToggle">
                <i class="fas fa-headphones"></i> Modo Leitor de Tela
              </label>
              <input type="checkbox" id="screenReaderToggle" class="accessibility-toggle">
            </div>
            
            <div class="accessibility-option">
              <label for="audioDescriptionsToggle">
                <i class="fas fa-microphone"></i> Descrições de Áudio
              </label>
              <input type="checkbox" id="audioDescriptionsToggle" class="accessibility-toggle">
            </div>
          </div>
          
          <div class="accessibility-section">
            <h4><i class="fas fa-cog"></i> Atalhos</h4>
            <div class="shortcuts-list">
              <div class="shortcut-item">
                <kbd>Tab</kbd> <span>Navegar entre elementos</span>
              </div>
              <div class="shortcut-item">
                <kbd>Enter</kbd> <span>Ativar elemento</span>
              </div>
              <div class="shortcut-item">
                <kbd>Esc</kbd> <span>Fechar modais</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + +</kbd> <span>Aumentar fonte</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + -</kbd> <span>Diminuir fonte</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + 0</kbd> <span>Fonte padrão</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="accessibility-footer">
          <button class="btn btn-primary" id="resetAccessibility">
            <i class="fas fa-undo"></i> Restaurar Padrões
          </button>
          <button class="btn btn-secondary" id="saveAccessibility">
            <i class="fas fa-save"></i> Salvar Preferências
          </button>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', panelHTML)
  }

  /**
   * Vincula eventos de acessibilidade
   */
  bindEvents() {
    // Botão para abrir painel
    const accessibilityBtn = document.createElement('button')
    accessibilityBtn.className = 'btn-icon accessibility-toggle'
    accessibilityBtn.setAttribute(
      'aria-label',
      'Configurações de acessibilidade'
    )
    accessibilityBtn.innerHTML = '<i class="fas fa-universal-access"></i>'
    accessibilityBtn.addEventListener('click', () => this.togglePanel())

    // Adicionar ao header
    const headerControls = document.querySelector('.header-controls')
    if (headerControls) {
      headerControls.appendChild(accessibilityBtn)
    }

    // Fechar painel
    document
      .getElementById('closeAccessibility')
      .addEventListener('click', () => {
        this.togglePanel()
      })

    // Toggles de acessibilidade
    document
      .getElementById('highContrastToggle')
      .addEventListener('change', e => {
        this.toggleHighContrast(e.target.checked)
      })

    document
      .getElementById('reducedMotionToggle')
      .addEventListener('change', e => {
        this.toggleReducedMotion(e.target.checked)
      })

    document
      .getElementById('keyboardNavToggle')
      .addEventListener('change', e => {
        this.toggleKeyboardNavigation(e.target.checked)
      })

    document
      .getElementById('focusVisibleToggle')
      .addEventListener('change', e => {
        this.toggleFocusVisible(e.target.checked)
      })

    document
      .getElementById('screenReaderToggle')
      .addEventListener('change', e => {
        this.toggleScreenReaderMode(e.target.checked)
      })

    document
      .getElementById('audioDescriptionsToggle')
      .addEventListener('change', e => {
        this.toggleAudioDescriptions(e.target.checked)
      })

    // Controles de tamanho de fonte
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const action = e.target.closest('.font-size-btn').dataset.action
        this.changeFontSize(action)
      })
    })

    // Botões de ação
    document
      .getElementById('resetAccessibility')
      .addEventListener('click', () => {
        this.resetToDefaults()
      })

    document
      .getElementById('saveAccessibility')
      .addEventListener('click', () => {
        this.savePreferences()
      })

    // Atalhos de teclado globais
    document.addEventListener('keydown', e => {
      this.handleKeyboardShortcuts(e)
    })
  }

  /**
   * Carrega preferências salvas
   */
  loadPreferences() {
    const preferences = JSON.parse(
      localStorage.getItem('accessibilityPreferences') || '{}'
    )

    this.isHighContrast = preferences.highContrast || false
    this.isReducedMotion = preferences.reducedMotion || false
    this.fontSize = preferences.fontSize || 100
    this.isScreenReaderMode = preferences.screenReaderMode || false
    this.keyboardNavigation = preferences.keyboardNavigation || false
    this.focusVisible = preferences.focusVisible || false

    // Aplicar preferências
    this.applyPreferences()
  }

  /**
   * Aplica as preferências carregadas
   */
  applyPreferences() {
    // Alto contraste
    if (this.isHighContrast) {
      document.body.classList.add('high-contrast')
      document.getElementById('highContrastToggle').checked = true
    }

    // Reduzir animação
    if (this.isReducedMotion) {
      document.body.classList.add('reduced-motion')
      document.getElementById('reducedMotionToggle').checked = true
    }

    // Tamanho da fonte
    this.setFontSize(this.fontSize)
    document.getElementById('fontSizeDisplay').textContent = `${this.fontSize}%`

    // Navegação por teclado
    if (this.keyboardNavigation) {
      this.enableKeyboardNavigation()
      document.getElementById('keyboardNavToggle').checked = true
    }

    // Indicador de foco
    if (this.focusVisible) {
      this.enableFocusVisible()
      document.getElementById('focusVisibleToggle').checked = true
    }

    // Modo leitor de tela
    if (this.isScreenReaderMode) {
      this.enableScreenReaderMode()
      document.getElementById('screenReaderToggle').checked = true
    }
  }

  /**
   * Alterna o painel de acessibilidade
   */
  togglePanel() {
    const panel = document.getElementById('accessibilityPanel')
    panel.classList.toggle('active')
  }

  /**
   * Alterna modo alto contraste
   */
  toggleHighContrast(enabled) {
    this.isHighContrast = enabled
    document.body.classList.toggle('high-contrast', enabled)
  }

  /**
   * Alterna redução de movimento
   */
  toggleReducedMotion(enabled) {
    this.isReducedMotion = enabled
    document.body.classList.toggle('reduced-motion', enabled)
  }

  /**
   * Alterna navegação por teclado
   */
  toggleKeyboardNavigation(enabled) {
    this.keyboardNavigation = enabled
    if (enabled) {
      this.enableKeyboardNavigation()
    } else {
      this.disableKeyboardNavigation()
    }
  }

  /**
   * Alterna indicador de foco
   */
  toggleFocusVisible(enabled) {
    this.focusVisible = enabled
    if (enabled) {
      this.enableFocusVisible()
    } else {
      this.disableFocusVisible()
    }
  }

  /**
   * Alterna modo leitor de tela
   */
  toggleScreenReaderMode(enabled) {
    this.isScreenReaderMode = enabled
    if (enabled) {
      this.enableScreenReaderMode()
    } else {
      this.disableScreenReaderMode()
    }
  }

  /**
   * Alterna descrições de áudio
   */
  toggleAudioDescriptions(enabled) {
    // Implementar descrições de áudio
    if (enabled) {
      this.enableAudioDescriptions()
    } else {
      this.disableAudioDescriptions()
    }
  }

  /**
   * Altera tamanho da fonte
   */
  changeFontSize(action) {
    switch (action) {
      case 'increase':
        this.fontSize = Math.min(this.fontSize + 10, 200)
        break
      case 'decrease':
        this.fontSize = Math.max(this.fontSize - 10, 50)
        break
      case 'reset':
        this.fontSize = 100
        break
    }

    this.setFontSize(this.fontSize)
    document.getElementById('fontSizeDisplay').textContent = `${this.fontSize}%`
  }

  /**
   * Define o tamanho da fonte
   */
  setFontSize(size) {
    document.documentElement.style.fontSize = `${size}%`
  }

  /**
   * Habilita navegação por teclado
   */
  enableKeyboardNavigation() {
    // Adicionar atributos de navegação
    document
      .querySelectorAll('button, a, input, select, textarea')
      .forEach(element => {
        element.setAttribute('tabindex', '0')
      })

    // Adicionar listeners para teclas
    document.addEventListener(
      'keydown',
      this.handleKeyboardNavigation.bind(this)
    )
  }

  /**
   * Desabilita navegação por teclado
   */
  disableKeyboardNavigation() {
    // Remover atributos de navegação
    document.querySelectorAll('[tabindex="0"]').forEach(element => {
      element.removeAttribute('tabindex')
    })
  }

  /**
   * Habilita indicador de foco
   */
  enableFocusVisible() {
    document.body.classList.add('focus-visible')
  }

  /**
   * Desabilita indicador de foco
   */
  disableFocusVisible() {
    document.body.classList.remove('focus-visible')
  }

  /**
   * Habilita modo leitor de tela
   */
  enableScreenReaderMode() {
    document.body.classList.add('screen-reader-mode')

    // Adicionar atributos ARIA
    this.addARIAAttributes()

    // Adicionar descrições para elementos
    this.addScreenReaderDescriptions()
  }

  /**
   * Desabilita modo leitor de tela
   */
  disableScreenReaderMode() {
    document.body.classList.remove('screen-reader-mode')

    // Remover atributos ARIA extras
    this.removeARIAAttributes()
  }

  /**
   * Habilita descrições de áudio
   */
  enableAudioDescriptions() {
    // Implementar sistema de descrições de áudio
    console.log('Descrições de áudio habilitadas')
  }

  /**
   * Desabilita descrições de áudio
   */
  disableAudioDescriptions() {
    // Implementar sistema de descrições de áudio
    console.log('Descrições de áudio desabilitadas')
  }

  /**
   * Configura navegação por teclado
   */
  setupKeyboardNavigation() {
    // Adicionar suporte a navegação por teclado na tabela periódica
    const periodicTable = document.getElementById('periodicTable')
    if (periodicTable) {
      this.setupPeriodicTableNavigation(periodicTable)
    }
  }

  /**
   * Configura navegação na tabela periódica
   */
  setupPeriodicTableNavigation(table) {
    const elements = table.querySelectorAll('.element')

    elements.forEach((element, index) => {
      element.setAttribute('tabindex', '0')
      element.setAttribute('role', 'button')

      element.addEventListener('keydown', e => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault()
            element.click()
            break
          case 'ArrowRight':
            e.preventDefault()
            this.focusNextElement(elements, index)
            break
          case 'ArrowLeft':
            e.preventDefault()
            this.focusPreviousElement(elements, index)
            break
          case 'ArrowDown':
            e.preventDefault()
            this.focusElementBelow(elements, index)
            break
          case 'ArrowUp':
            e.preventDefault()
            this.focusElementAbove(elements, index)
            break
        }
      })
    })
  }

  /**
   * Foca no próximo elemento
   */
  focusNextElement(elements, currentIndex) {
    const nextIndex = (currentIndex + 1) % elements.length
    elements[nextIndex].focus()
  }

  /**
   * Foca no elemento anterior
   */
  focusPreviousElement(elements, currentIndex) {
    const prevIndex =
      currentIndex === 0 ? elements.length - 1 : currentIndex - 1
    elements[prevIndex].focus()
  }

  /**
   * Foca no elemento abaixo
   */
  focusElementBelow(elements, currentIndex) {
    // Implementar lógica para focar elemento abaixo
    const nextIndex = Math.min(currentIndex + 18, elements.length - 1)
    elements[nextIndex].focus()
  }

  /**
   * Foca no elemento acima
   */
  focusElementAbove(elements, currentIndex) {
    // Implementar lógica para focar elemento acima
    const prevIndex = Math.max(currentIndex - 18, 0)
    elements[prevIndex].focus()
  }

  /**
   * Configura suporte a leitor de tela
   */
  setupScreenReaderSupport() {
    // Adicionar landmarks ARIA
    this.addARIALandmarks()

    // Adicionar labels para elementos interativos
    this.addInteractiveLabels()
  }

  /**
   * Adiciona landmarks ARIA
   */
  addARIALandmarks() {
    const header = document.querySelector('header')
    const main =
      document.querySelector('main') ||
      document.querySelector('.periodic-container')
    const footer = document.querySelector('footer')
    const nav = document.querySelector('nav')

    if (header) header.setAttribute('role', 'banner')
    if (main) main.setAttribute('role', 'main')
    if (footer) footer.setAttribute('role', 'contentinfo')
    if (nav) nav.setAttribute('role', 'navigation')
  }

  /**
   * Adiciona labels para elementos interativos
   */
  addInteractiveLabels() {
    // Adicionar labels para botões sem texto
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      const icon = button.querySelector('i')
      if (icon && !button.textContent.trim()) {
        const iconClass = icon.className
        let label = ''

        if (iconClass.includes('fa-moon')) label = 'Alternar modo escuro'
        else if (iconClass.includes('fa-info')) label = 'Informações'
        else if (iconClass.includes('fa-bars')) label = 'Menu'
        else if (iconClass.includes('fa-star')) label = 'Favoritos'
        else if (iconClass.includes('fa-search')) label = 'Buscar'
        else if (iconClass.includes('fa-times')) label = 'Fechar'

        if (label) {
          button.setAttribute('aria-label', label)
        }
      }
    })
  }

  /**
   * Configura gerenciamento de foco
   */
  setupFocusManagement() {
    // Gerenciar foco em modais
    this.setupModalFocusManagement()

    // Gerenciar foco em dropdowns
    this.setupDropdownFocusManagement()
  }

  /**
   * Configura gerenciamento de foco em modais
   */
  setupModalFocusManagement() {
    document.querySelectorAll('.modal').forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, a, input, select, textarea'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (firstElement && lastElement) {
        // Trap focus dentro do modal
        lastElement.addEventListener('keydown', e => {
          if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault()
            firstElement.focus()
          }
        })

        firstElement.addEventListener('keydown', e => {
          if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault()
            lastElement.focus()
          }
        })
      }
    })
  }

  /**
   * Configura gerenciamento de foco em dropdowns
   */
  setupDropdownFocusManagement() {
    document.querySelectorAll('select').forEach(select => {
      select.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          select.blur()
        }
      })
    })
  }

  /**
   * Adiciona atributos ARIA
   */
  addARIAAttributes() {
    // Adicionar roles e estados ARIA
    document.querySelectorAll('.element').forEach(element => {
      element.setAttribute('role', 'button')
      element.setAttribute('aria-pressed', 'false')
    })
  }

  /**
   * Remove atributos ARIA extras
   */
  removeARIAAttributes() {
    // Remover atributos ARIA adicionados pelo modo leitor de tela
    document.querySelectorAll('.element').forEach(element => {
      element.removeAttribute('aria-pressed')
    })
  }

  /**
   * Adiciona descrições para leitor de tela
   */
  addScreenReaderDescriptions() {
    document.querySelectorAll('.element').forEach(element => {
      const symbol = element.querySelector('.element-symbol')
      const name = element.querySelector('.element-name')
      const number = element.querySelector('.element-number')

      if (symbol && name && number) {
        const description = `${name.textContent}, símbolo ${symbol.textContent}, número atômico ${number.textContent}`
        element.setAttribute('aria-label', description)
      }
    })
  }

  /**
   * Manipula atalhos de teclado
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + teclas
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault()
          this.changeFontSize('increase')
          break
        case '-':
          e.preventDefault()
          this.changeFontSize('decrease')
          break
        case '0':
          e.preventDefault()
          this.changeFontSize('reset')
          break
      }
    }

    // Teclas simples
    switch (e.key) {
      case 'Escape':
        this.closeAllModals()
        break
      case 'F1':
        e.preventDefault()
        this.togglePanel()
        break
    }
  }

  /**
   * Manipula navegação por teclado
   */
  handleKeyboardNavigation(e) {
    // Implementar navegação por teclado específica
    if (e.key === 'Tab') {
      this.handleTabNavigation(e)
    }
  }

  /**
   * Manipula navegação por Tab
   */
  handleTabNavigation(e) {
    // Adicionar indicador visual de foco
    document.body.classList.add('keyboard-navigation')

    // Remover classe após um tempo
    setTimeout(() => {
      document.body.classList.remove('keyboard-navigation')
    }, 1000)
  }

  /**
   * Fecha todos os modais
   */
  closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active')
    })
  }

  /**
   * Restaura configurações padrão
   */
  resetToDefaults() {
    this.isHighContrast = false
    this.isReducedMotion = false
    this.fontSize = 100
    this.isScreenReaderMode = false
    this.keyboardNavigation = false
    this.focusVisible = false

    // Remover classes
    document.body.classList.remove(
      'high-contrast',
      'reduced-motion',
      'screen-reader-mode',
      'focus-visible'
    )

    // Resetar controles
    document.getElementById('highContrastToggle').checked = false
    document.getElementById('reducedMotionToggle').checked = false
    document.getElementById('keyboardNavToggle').checked = false
    document.getElementById('focusVisibleToggle').checked = false
    document.getElementById('screenReaderToggle').checked = false
    document.getElementById('audioDescriptionsToggle').checked = false

    // Resetar fonte
    this.setFontSize(100)
    document.getElementById('fontSizeDisplay').textContent = '100%'

    // Desabilitar funcionalidades
    this.disableKeyboardNavigation()
    this.disableFocusVisible()
    this.disableScreenReaderMode()
  }

  /**
   * Salva preferências
   */
  savePreferences() {
    const preferences = {
      highContrast: this.isHighContrast,
      reducedMotion: this.isReducedMotion,
      fontSize: this.fontSize,
      screenReaderMode: this.isScreenReaderMode,
      keyboardNavigation: this.keyboardNavigation,
      focusVisible: this.focusVisible
    }

    localStorage.setItem(
      'accessibilityPreferences',
      JSON.stringify(preferences)
    )

    // Mostrar notificação
    if (window.showNotification) {
      window.showNotification(
        'Preferências de acessibilidade salvas!',
        'success'
      )
    }
  }

  /**
   * Anuncia mudança para leitores de tela
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Exportar para uso global
window.AccessibilityManager = AccessibilityManager
