/**
 * Módulo de Exportação e Compartilhamento
 *
 * Este módulo permite exportar dados dos elementos e compartilhar
 * informações através de diferentes formatos e plataformas.
 */

class ExportManager {
  constructor(elements) {
    this.elements = elements
    this.initializeExport()
  }

  /**
   * Inicializa o sistema de exportação
   */
  initializeExport() {
    this.createExportModal()
    this.bindEvents()
  }

  /**
   * Cria o modal de exportação
   */
  createExportModal() {
    const modalHTML = `
      <div id="exportModal" class="modal export-modal">
        <div class="modal-content export-content">
          <div class="modal-header">
            <span class="close" id="closeExport"><i class="fas fa-times"></i></span>
            <h2><i class="fas fa-download"></i> Exportar Dados</h2>
          </div>
          
          <div class="export-body">
            <div class="export-section">
              <h3><i class="fas fa-filter"></i> Selecionar Elementos</h3>
              <div class="export-filters">
                <div class="filter-group">
                  <label for="exportCategory">Categoria:</label>
                  <select id="exportCategory">
                    <option value="all">Todos os Elementos</option>
                    <option value="favorites">Apenas Favoritos</option>
                    <option value="custom">Seleção Personalizada</option>
                  </select>
                </div>
                
                <div class="filter-group">
                  <label for="exportFormat">Formato:</label>
                  <select id="exportFormat">
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
                
                <div class="filter-group">
                  <label for="exportFields">Campos:</label>
                  <div class="field-selector">
                    <label><input type="checkbox" value="basic" checked> Básicos</label>
                    <label><input type="checkbox" value="properties" checked> Propriedades</label>
                    <label><input type="checkbox" value="applications"> Aplicações</label>
                    <label><input type="checkbox" value="compounds"> Compostos</label>
                    <label><input type="checkbox" value="electron"> Eletrônico</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="export-section">
              <h3><i class="fas fa-share-alt"></i> Compartilhamento</h3>
              <div class="share-options">
                <button class="share-btn" data-platform="whatsapp">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="share-btn" data-platform="telegram">
                  <i class="fab fa-telegram"></i> Telegram
                </button>
                <button class="share-btn" data-platform="email">
                  <i class="fas fa-envelope"></i> Email
                </button>
                <button class="share-btn" data-platform="copy">
                  <i class="fas fa-copy"></i> Copiar Link
                </button>
                <button class="share-btn" data-platform="qr">
                  <i class="fas fa-qrcode"></i> QR Code
                </button>
              </div>
            </div>
            
            <div class="export-section">
              <h3><i class="fas fa-cog"></i> Opções Avançadas</h3>
              <div class="advanced-options">
                <label>
                  <input type="checkbox" id="includeImages"> Incluir imagens
                </label>
                <label>
                  <input type="checkbox" id="includeCharts"> Incluir gráficos
                </label>
                <label>
                  <input type="checkbox" id="includeMetadata"> Incluir metadados
                </label>
                <label>
                  <input type="checkbox" id="compressData"> Comprimir dados
                </label>
              </div>
            </div>
          </div>
          
          <div class="export-footer">
            <button class="btn btn-primary" id="exportData">
              <i class="fas fa-download"></i> Exportar
            </button>
            <button class="btn btn-secondary" id="previewExport">
              <i class="fas fa-eye"></i> Visualizar
            </button>
            <button class="btn btn-outline" id="cancelExport">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
  }

  /**
   * Vincula eventos de exportação
   */
  bindEvents() {
    // Fechar modal
    document.getElementById('closeExport').addEventListener('click', () => {
      this.closeExportModal()
    })

    // Botão cancelar
    document.getElementById('cancelExport').addEventListener('click', () => {
      this.closeExportModal()
    })

    // Botão exportar
    document.getElementById('exportData').addEventListener('click', () => {
      this.exportData()
    })

    // Botão visualizar
    document.getElementById('previewExport').addEventListener('click', () => {
      this.previewExport()
    })

    // Botões de compartilhamento
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const platform = e.target.closest('.share-btn').dataset.platform
        this.shareData(platform)
      })
    })

    // Mudança de categoria
    document.getElementById('exportCategory').addEventListener('change', e => {
      this.updateExportOptions(e.target.value)
    })

    // Fechar ao clicar fora
    document.getElementById('exportModal').addEventListener('click', e => {
      if (e.target.id === 'exportModal') {
        this.closeExportModal()
      }
    })
  }

  /**
   * Abre o modal de exportação
   */
  openExportModal() {
    document.getElementById('exportModal').classList.add('active')
  }

  /**
   * Fecha o modal de exportação
   */
  closeExportModal() {
    document.getElementById('exportModal').classList.remove('active')
  }

  /**
   * Atualiza opções de exportação baseado na categoria
   */
  updateExportOptions(category) {
    const customSelection = document.querySelector('.custom-selection')

    if (category === 'custom') {
      if (!customSelection) {
        this.createCustomSelection()
      }
    } else {
      if (customSelection) {
        customSelection.remove()
      }
    }
  }

  /**
   * Cria seleção personalizada de elementos
   */
  createCustomSelection() {
    const filterGroup = document.querySelector('.filter-group')
    const customSelection = document.createElement('div')
    customSelection.className = 'custom-selection'
    customSelection.innerHTML = `
      <div class="element-selector">
        <h4>Selecionar Elementos:</h4>
        <div class="element-grid">
          ${this.elements
            .map(
              element => `
            <label class="element-checkbox">
              <input type="checkbox" value="${element.atomicNumber}" checked>
              <span class="element-label">${element.symbol}</span>
            </label>
          `
            )
            .join('')}
        </div>
        <div class="selection-actions">
          <button class="btn btn-sm" onclick="this.selectAll()">Selecionar Todos</button>
          <button class="btn btn-sm" onclick="this.deselectAll()">Desmarcar Todos</button>
        </div>
      </div>
    `

    filterGroup.appendChild(customSelection)
  }

  /**
   * Exporta os dados
   */
  async exportData() {
    const format = document.getElementById('exportFormat').value
    const category = document.getElementById('exportCategory').value
    const fields = this.getSelectedFields()
    const options = this.getExportOptions()

    try {
      const data = await this.prepareExportData(category, fields, options)

      switch (format) {
        case 'json':
          this.exportJSON(data)
          break
        case 'csv':
          this.exportCSV(data)
          break
        case 'pdf':
          await this.exportPDF(data)
          break
        case 'excel':
          await this.exportExcel(data)
          break
        case 'html':
          this.exportHTML(data)
          break
      }

      if (window.showNotification) {
        window.showNotification('Dados exportados com sucesso!', 'success')
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      if (window.showNotification) {
        window.showNotification('Erro ao exportar dados', 'error')
      }
    }
  }

  /**
   * Prepara dados para exportação
   */
  async prepareExportData(category, fields, options) {
    let elements = []

    switch (category) {
      case 'all':
        elements = this.elements
        break
      case 'favorites':
        elements = this.getFavoriteElements()
        break
      case 'custom':
        elements = this.getCustomSelectedElements()
        break
    }

    // Filtrar campos
    const filteredElements = elements.map(element => {
      const filtered = {}

      if (fields.includes('basic')) {
        filtered.atomicNumber = element.atomicNumber
        filtered.symbol = element.symbol
        filtered.name = element.name
        filtered.atomicMass = element.atomicMass
        filtered.category = element.category
        filtered.group = element.group
        filtered.period = element.period
        filtered.block = element.block
      }

      if (fields.includes('properties')) {
        filtered.density = element.density
        filtered.meltingPoint = element.meltingPoint
        filtered.boilingPoint = element.boilingPoint
        filtered.electronegativity = element.electronegativity
        filtered.atomicRadius = element.atomicRadius
        filtered.ionizationEnergy = element.ionizationEnergy
      }

      if (fields.includes('applications')) {
        filtered.applications = element.applications
      }

      if (fields.includes('compounds')) {
        filtered.compounds = element.compounds
      }

      if (fields.includes('electron')) {
        filtered.electronConfiguration = element.electronConfiguration
      }

      return filtered
    })

    return {
      metadata: {
        exportDate: new Date().toISOString(),
        totalElements: filteredElements.length,
        fields: fields,
        options: options
      },
      elements: filteredElements
    }
  }

  /**
   * Obtém campos selecionados
   */
  getSelectedFields() {
    const checkboxes = document.querySelectorAll(
      '.field-selector input:checked'
    )
    return Array.from(checkboxes).map(cb => cb.value)
  }

  /**
   * Obtém opções de exportação
   */
  getExportOptions() {
    return {
      includeImages: document.getElementById('includeImages').checked,
      includeCharts: document.getElementById('includeCharts').checked,
      includeMetadata: document.getElementById('includeMetadata').checked,
      compressData: document.getElementById('compressData').checked
    }
  }

  /**
   * Obtém elementos favoritos
   */
  getFavoriteElements() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    return this.elements.filter(element =>
      favorites.includes(element.atomicNumber)
    )
  }

  /**
   * Obtém elementos selecionados customizadamente
   */
  getCustomSelectedElements() {
    const checkboxes = document.querySelectorAll(
      '.custom-selection input:checked'
    )
    const selectedNumbers = Array.from(checkboxes).map(cb => parseInt(cb.value))
    return this.elements.filter(element =>
      selectedNumbers.includes(element.atomicNumber)
    )
  }

  /**
   * Exporta como JSON
   */
  exportJSON(data) {
    const jsonString = JSON.stringify(data, null, 2)
    this.downloadFile(jsonString, 'tabela-periodica.json', 'application/json')
  }

  /**
   * Exporta como CSV
   */
  exportCSV(data) {
    const csvContent = this.convertToCSV(data.elements)
    this.downloadFile(csvContent, 'tabela-periodica.csv', 'text/csv')
  }

  /**
   * Converte dados para CSV
   */
  convertToCSV(elements) {
    if (elements.length === 0) return ''

    const headers = Object.keys(elements[0])
    const csvRows = [headers.join(',')]

    elements.forEach(element => {
      const row = headers.map(header => {
        const value = element[header]
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`
        }
        return `"${value || ''}"`
      })
      csvRows.push(row.join(','))
    })

    return csvRows.join('\n')
  }

  /**
   * Exporta como PDF
   */
  async exportPDF(data) {
    // Implementar geração de PDF
    const pdfContent = this.generatePDFContent(data)
    this.downloadFile(pdfContent, 'tabela-periodica.pdf', 'application/pdf')
  }

  /**
   * Gera conteúdo PDF
   */
  generatePDFContent(data) {
    // Implementar geração de PDF usando jsPDF ou similar
    return 'PDF content would be generated here'
  }

  /**
   * Exporta como Excel
   */
  async exportExcel(data) {
    // Implementar exportação para Excel
    const excelContent = this.generateExcelContent(data)
    this.downloadFile(
      excelContent,
      'tabela-periodica.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  }

  /**
   * Gera conteúdo Excel
   */
  generateExcelContent(data) {
    // Implementar geração de Excel usando SheetJS ou similar
    return 'Excel content would be generated here'
  }

  /**
   * Exporta como HTML
   */
  exportHTML(data) {
    const htmlContent = this.generateHTMLContent(data)
    this.downloadFile(htmlContent, 'tabela-periodica.html', 'text/html')
  }

  /**
   * Gera conteúdo HTML
   */
  generateHTMLContent(data) {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tabela Periódica - Dados Exportados</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tabela Periódica - Dados Exportados</h1>
          <p>Exportado em: ${new Date().toLocaleString('pt-BR')}</p>
          <p>Total de elementos: ${data.elements.length}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              ${Object.keys(data.elements[0] || {})
                .map(key => `<th>${key}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${data.elements
              .map(
                element => `
              <tr>
                ${Object.values(element)
                  .map(
                    value =>
                      `<td>${
                        Array.isArray(value) ? value.join(', ') : value || ''
                      }</td>`
                  )
                  .join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `
  }

  /**
   * Faz download do arquivo
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  /**
   * Visualiza exportação
   */
  previewExport() {
    const format = document.getElementById('exportFormat').value
    const category = document.getElementById('exportCategory').value
    const fields = this.getSelectedFields()

    this.prepareExportData(category, fields, {}).then(data => {
      this.showPreview(data, format)
    })
  }

  /**
   * Mostra preview da exportação
   */
  showPreview(data, format) {
    const previewModal = document.createElement('div')
    previewModal.className = 'modal preview-modal active'
    previewModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i>
          </span>
          <h3>Preview - ${format.toUpperCase()}</h3>
        </div>
        <div class="modal-body">
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    `

    document.body.appendChild(previewModal)
  }

  /**
   * Compartilha dados
   */
  shareData(platform) {
    const url = window.location.href
    const title = 'Tabela Periódica Interativa'
    const text = 'Confira esta incrível tabela periódica interativa!'

    switch (platform) {
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        )
        break
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`
        )
        break
      case 'email':
        window.open(
          `mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(text + '\n\n' + url)}`
        )
        break
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          if (window.showNotification) {
            window.showNotification(
              'Link copiado para a área de transferência!',
              'success'
            )
          }
        })
        break
      case 'qr':
        this.generateQRCode(url)
        break
    }
  }

  /**
   * Gera QR Code
   */
  generateQRCode(url) {
    // Implementar geração de QR Code
    const qrModal = document.createElement('div')
    qrModal.className = 'modal qr-modal active'
    qrModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i>
          </span>
          <h3>QR Code</h3>
        </div>
        <div class="modal-body">
          <div class="qr-code-placeholder">
            <i class="fas fa-qrcode"></i>
            <p>QR Code seria gerado aqui</p>
            <p>URL: ${url}</p>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(qrModal)
  }

  /**
   * Exporta dados específicos de um elemento
   */
  exportElement(element) {
    const data = {
      element: element,
      exportDate: new Date().toISOString(),
      source: 'Tabela Periódica Interativa'
    }

    const jsonString = JSON.stringify(data, null, 2)
    this.downloadFile(
      jsonString,
      `${element.symbol}-${element.name}.json`,
      'application/json'
    )
  }

  /**
   * Exporta comparação de elementos
   */
  exportComparison(elements) {
    const data = {
      comparison: elements,
      exportDate: new Date().toISOString(),
      source: 'Tabela Periódica Interativa'
    }

    const jsonString = JSON.stringify(data, null, 2)
    this.downloadFile(
      jsonString,
      'comparacao-elementos.json',
      'application/json'
    )
  }
}

// Exportar para uso global
window.ExportManager = ExportManager
