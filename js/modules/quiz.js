/**
 * Módulo de Quiz - Sistema de Gamificação
 *
 * Este módulo implementa um sistema de quiz interativo para testar
 * conhecimentos sobre a tabela periódica com diferentes níveis de dificuldade.
 */

class QuizSystem {
  constructor(elements) {
    this.elements = elements
    this.currentQuestion = 0
    this.score = 0
    this.totalQuestions = 10
    this.difficulty = 'easy'
    this.questions = []
    this.isActive = false
    this.streak = 0
    this.bestScore = this.loadBestScore()

    this.initializeQuiz()
  }

  /**
   * Inicializa o sistema de quiz
   */
  initializeQuiz() {
    this.createQuizModal()
    this.bindEvents()
  }

  /**
   * Cria o modal do quiz
   */
  createQuizModal() {
    const modalHTML = `
      <div id="quizModal" class="modal quiz-modal">
        <div class="modal-content quiz-content">
          <div class="quiz-header">
            <span class="close" id="closeQuiz"><i class="fas fa-times"></i></span>
            <h2><i class="fas fa-question-circle"></i> Quiz da Tabela Periódica</h2>
            <div class="quiz-stats">
              <span class="score">Pontuação: <span id="quizScore">0</span></span>
              <span class="streak">Sequência: <span id="quizStreak">0</span> 🔥</span>
              <span class="progress">Questão <span id="currentQuestionNum">1</span>/<span id="totalQuestions">10</span></span>
            </div>
          </div>
          
          <div class="quiz-body">
            <div class="difficulty-selector">
              <h3>Escolha a dificuldade:</h3>
              <div class="difficulty-buttons">
                <button class="difficulty-btn active" data-difficulty="easy">
                  <i class="fas fa-star"></i> Fácil
                </button>
                <button class="difficulty-btn" data-difficulty="medium">
                  <i class="fas fa-star"></i><i class="fas fa-star"></i> Médio
                </button>
                <button class="difficulty-btn" data-difficulty="hard">
                  <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> Difícil
                </button>
              </div>
            </div>
            
            <div class="quiz-start" id="quizStart">
              <div class="quiz-intro">
                <i class="fas fa-graduation-cap"></i>
                <h3>Teste seus conhecimentos!</h3>
                <p>Responda perguntas sobre elementos químicos e veja como você se sai.</p>
                <ul>
                  <li>✅ 10 perguntas por rodada</li>
                  <li>🎯 Diferentes níveis de dificuldade</li>
                  <li>🏆 Compare seus resultados</li>
                  <li>📊 Acompanhe seu progresso</li>
                </ul>
              </div>
              <button class="btn btn-primary start-quiz-btn" id="startQuizBtn">
                <i class="fas fa-play"></i> Começar Quiz
              </button>
            </div>
            
            <div class="quiz-question" id="quizQuestion" style="display: none;">
              <div class="question-content">
                <h3 id="questionText"></h3>
                <div class="question-options" id="questionOptions"></div>
              </div>
              <div class="question-feedback" id="questionFeedback" style="display: none;">
                <div class="feedback-content">
                  <i class="feedback-icon"></i>
                  <p class="feedback-text"></p>
                  <div class="feedback-explanation"></div>
                </div>
                <button class="btn btn-primary next-question-btn" id="nextQuestionBtn">
                  Próxima Questão <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            
            <div class="quiz-results" id="quizResults" style="display: none;">
              <div class="results-content">
                <h3><i class="fas fa-trophy"></i> Resultados do Quiz</h3>
                <div class="score-display">
                  <div class="final-score">
                    <span class="score-number" id="finalScore">0</span>
                    <span class="score-max">/ 10</span>
                  </div>
                  <div class="score-percentage" id="scorePercentage">0%</div>
                </div>
                <div class="performance-indicators">
                  <div class="indicator">
                    <i class="fas fa-fire"></i>
                    <span>Maior sequência: <span id="maxStreak">0</span></span>
                  </div>
                  <div class="indicator">
                    <i class="fas fa-medal"></i>
                    <span>Melhor pontuação: <span id="bestScoreDisplay">0</span></span>
                  </div>
                </div>
                <div class="performance-message" id="performanceMessage"></div>
              </div>
              <div class="results-actions">
                <button class="btn btn-primary" id="retryQuizBtn">
                  <i class="fas fa-redo"></i> Tentar Novamente
                </button>
                <button class="btn btn-secondary" id="shareResultsBtn">
                  <i class="fas fa-share"></i> Compartilhar
                </button>
                <button class="btn btn-outline" id="closeQuizResultsBtn">
                  <i class="fas fa-times"></i> Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
  }

  /**
   * Vincula eventos do quiz
   */
  bindEvents() {
    // Botões de dificuldade
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        this.setDifficulty(e.target.dataset.difficulty)
      })
    })

    // Botão iniciar quiz
    document.getElementById('startQuizBtn').addEventListener('click', () => {
      this.startQuiz()
    })

    // Botão próxima questão
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
      this.nextQuestion()
    })

    // Botões de resultado
    document.getElementById('retryQuizBtn').addEventListener('click', () => {
      this.retryQuiz()
    })

    document.getElementById('shareResultsBtn').addEventListener('click', () => {
      this.shareResults()
    })

    document
      .getElementById('closeQuizResultsBtn')
      .addEventListener('click', () => {
        this.closeQuiz()
      })

    // Fechar modal
    document.getElementById('closeQuiz').addEventListener('click', () => {
      this.closeQuiz()
    })

    // Fechar ao clicar fora
    document.getElementById('quizModal').addEventListener('click', e => {
      if (e.target.id === 'quizModal') {
        this.closeQuiz()
      }
    })
  }

  /**
   * Define a dificuldade do quiz
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty

    // Atualizar botões
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document
      .querySelector(`[data-difficulty="${difficulty}"]`)
      .classList.add('active')
  }

  /**
   * Inicia o quiz
   */
  startQuiz() {
    this.isActive = true
    this.currentQuestion = 0
    this.score = 0
    this.streak = 0
    this.questions = this.generateQuestions()

    this.updateStats()
    this.showQuestion()

    // Esconder tela inicial
    document.getElementById('quizStart').style.display = 'none'
    document.getElementById('quizQuestion').style.display = 'block'
  }

  /**
   * Gera perguntas baseadas na dificuldade
   */
  generateQuestions() {
    const questions = []
    const shuffledElements = [...this.elements].sort(() => Math.random() - 0.5)

    for (let i = 0; i < this.totalQuestions; i++) {
      const element = shuffledElements[i]
      const questionTypes = this.getQuestionTypes()
      const questionType =
        questionTypes[Math.floor(Math.random() * questionTypes.length)]

      const question = this.createQuestion(element, questionType)
      questions.push(question)
    }

    return questions
  }

  /**
   * Retorna tipos de perguntas baseados na dificuldade
   */
  getQuestionTypes() {
    switch (this.difficulty) {
      case 'easy':
        return ['symbol', 'name', 'atomicNumber', 'category']
      case 'medium':
        return [
          'symbol',
          'name',
          'atomicNumber',
          'category',
          'group',
          'period',
          'block'
        ]
      case 'hard':
        return [
          'symbol',
          'name',
          'atomicNumber',
          'category',
          'group',
          'period',
          'block',
          'properties',
          'applications'
        ]
      default:
        return ['symbol', 'name', 'atomicNumber']
    }
  }

  /**
   * Cria uma pergunta específica
   */
  createQuestion(element, type) {
    const question = {
      element: element,
      type: type,
      correctAnswer: null,
      options: [],
      question: '',
      explanation: ''
    }

    switch (type) {
      case 'symbol':
        question.question = `Qual é o símbolo do elemento ${element.name}?`
        question.correctAnswer = element.symbol
        question.options = this.generateSymbolOptions(element)
        question.explanation = `${element.name} tem o símbolo ${element.symbol} e número atômico ${element.atomicNumber}.`
        break

      case 'name':
        question.question = `Qual é o nome do elemento com símbolo ${element.symbol}?`
        question.correctAnswer = element.name
        question.options = this.generateNameOptions(element)
        question.explanation = `O elemento ${element.symbol} é o ${element.name}, com número atômico ${element.atomicNumber}.`
        break

      case 'atomicNumber':
        question.question = `Qual é o número atômico do ${element.name} (${element.symbol})?`
        question.correctAnswer = element.atomicNumber.toString()
        question.options = this.generateNumberOptions(element.atomicNumber)
        question.explanation = `${element.name} tem número atômico ${element.atomicNumber}, o que significa que possui ${element.atomicNumber} prótons.`
        break

      case 'category':
        question.question = `A qual categoria pertence o ${element.name} (${element.symbol})?`
        question.correctAnswer = this.getCategoryName(element.category)
        question.options = this.generateCategoryOptions(element.category)
        question.explanation = `${
          element.name
        } é classificado como ${this.getCategoryName(element.category)}.`
        break

      case 'group':
        question.question = `A qual grupo pertence o ${element.name} (${element.symbol})?`
        question.correctAnswer = element.group.toString()
        question.options = this.generateGroupOptions(element.group)
        question.explanation = `${element.name} pertence ao grupo ${element.group} da tabela periódica.`
        break

      case 'period':
        question.question = `Em qual período está localizado o ${element.name} (${element.symbol})?`
        question.correctAnswer = element.period.toString()
        question.options = this.generatePeriodOptions(element.period)
        question.explanation = `${element.name} está localizado no período ${element.period}.`
        break

      case 'block':
        question.question = `A qual bloco pertence o ${element.name} (${element.symbol})?`
        question.correctAnswer = element.block.toUpperCase()
        question.options = this.generateBlockOptions(element.block)
        question.explanation = `${
          element.name
        } pertence ao bloco ${element.block.toUpperCase()}.`
        break

      case 'properties':
        const properties = [
          'density',
          'meltingPoint',
          'boilingPoint',
          'electronegativity'
        ]
        const property =
          properties[Math.floor(Math.random() * properties.length)]
        question.question = this.generatePropertyQuestion(element, property)
        question.correctAnswer = this.getPropertyValue(element, property)
        question.options = this.generatePropertyOptions(element, property)
        question.explanation = this.getPropertyExplanation(element, property)
        break

      case 'applications':
        if (element.applications && element.applications.length > 0) {
          const application =
            element.applications[
              Math.floor(Math.random() * element.applications.length)
            ]
          question.question = `Qual das seguintes é uma aplicação do ${element.name}?`
          question.correctAnswer = application
          question.options = this.generateApplicationOptions(element)
          question.explanation = `${application} é uma das principais aplicações do ${element.name}.`
        } else {
          // Fallback para outra pergunta se não houver aplicações
          return this.createQuestion(element, 'symbol')
        }
        break
    }

    return question
  }

  /**
   * Gera opções para perguntas de símbolo
   */
  generateSymbolOptions(correctElement) {
    const options = [correctElement.symbol]
    const otherElements = this.elements.filter(
      e => e.symbol !== correctElement.symbol
    )

    while (options.length < 4) {
      const randomElement =
        otherElements[Math.floor(Math.random() * otherElements.length)]
      if (!options.includes(randomElement.symbol)) {
        options.push(randomElement.symbol)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de nome
   */
  generateNameOptions(correctElement) {
    const options = [correctElement.name]
    const otherElements = this.elements.filter(
      e => e.name !== correctElement.name
    )

    while (options.length < 4) {
      const randomElement =
        otherElements[Math.floor(Math.random() * otherElements.length)]
      if (!options.includes(randomElement.name)) {
        options.push(randomElement.name)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas numéricas
   */
  generateNumberOptions(correctNumber) {
    const options = [correctNumber.toString()]

    while (options.length < 4) {
      const randomNumber = Math.floor(Math.random() * 118) + 1
      if (!options.includes(randomNumber.toString())) {
        options.push(randomNumber.toString())
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de categoria
   */
  generateCategoryOptions(correctCategory) {
    const categories = [
      'Não Metais',
      'Metais Alcalinos',
      'Metais Alcalinos Terrosos',
      'Metais de Transição',
      'Metais de Pós-Transição',
      'Semimetais',
      'Halogênios',
      'Gases Nobres',
      'Lantanídeos',
      'Actinídeos'
    ]

    const options = [this.getCategoryName(correctCategory)]

    while (options.length < 4) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)]
      if (!options.includes(randomCategory)) {
        options.push(randomCategory)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de grupo
   */
  generateGroupOptions(correctGroup) {
    const options = [correctGroup.toString()]

    while (options.length < 4) {
      const randomGroup = Math.floor(Math.random() * 18) + 1
      if (!options.includes(randomGroup.toString())) {
        options.push(randomGroup.toString())
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de período
   */
  generatePeriodOptions(correctPeriod) {
    const options = [correctPeriod.toString()]

    while (options.length < 4) {
      const randomPeriod = Math.floor(Math.random() * 7) + 1
      if (!options.includes(randomPeriod.toString())) {
        options.push(randomPeriod.toString())
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de bloco
   */
  generateBlockOptions(correctBlock) {
    const blocks = ['S', 'P', 'D', 'F']
    const options = [correctBlock.toUpperCase()]

    while (options.length < 4) {
      const randomBlock = blocks[Math.floor(Math.random() * blocks.length)]
      if (!options.includes(randomBlock)) {
        options.push(randomBlock)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera perguntas sobre propriedades
   */
  generatePropertyQuestion(element, property) {
    const propertyNames = {
      density: 'densidade',
      meltingPoint: 'ponto de fusão',
      boilingPoint: 'ponto de ebulição',
      electronegativity: 'eletronegatividade'
    }

    return `Qual é a ${propertyNames[property]} do ${element.name} (${element.symbol})?`
  }

  /**
   * Gera opções para perguntas de propriedades
   */
  generatePropertyOptions(element, property) {
    const correctValue = this.getPropertyValue(element, property)
    const options = [correctValue]

    // Gerar valores próximos para opções realistas
    const baseValue = parseFloat(correctValue.replace(/[^\d.-]/g, ''))
    const unit = correctValue.replace(/[\d.-]/g, '')

    while (options.length < 4) {
      const variation = (Math.random() - 0.5) * 2 // Variação de ±100%
      const randomValue = Math.max(0, baseValue * (1 + variation))
      const formattedValue = this.formatPropertyValue(
        randomValue,
        property,
        unit
      )

      if (!options.includes(formattedValue)) {
        options.push(formattedValue)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Gera opções para perguntas de aplicações
   */
  generateApplicationOptions(element) {
    const correctApplication =
      element.applications[
        Math.floor(Math.random() * element.applications.length)
      ]
    const options = [correctApplication]

    // Buscar aplicações de outros elementos
    const allApplications = this.elements
      .filter(e => e.applications && e.applications.length > 0)
      .flatMap(e => e.applications)
      .filter(app => app !== correctApplication)

    while (options.length < 4) {
      const randomApp =
        allApplications[Math.floor(Math.random() * allApplications.length)]
      if (!options.includes(randomApp)) {
        options.push(randomApp)
      }
    }

    return this.shuffleArray(options)
  }

  /**
   * Obtém o valor formatado de uma propriedade
   */
  getPropertyValue(element, property) {
    switch (property) {
      case 'density':
        return element.density ? `${element.density.toFixed(4)} g/cm³` : 'N/A'
      case 'meltingPoint':
        return element.meltingPoint
          ? `${element.meltingPoint.toFixed(1)} K`
          : 'N/A'
      case 'boilingPoint':
        return element.boilingPoint
          ? `${element.boilingPoint.toFixed(1)} K`
          : 'N/A'
      case 'electronegativity':
        return element.electronegativity
          ? `${element.electronegativity.toFixed(2)}`
          : 'N/A'
      default:
        return 'N/A'
    }
  }

  /**
   * Formata valor de propriedade
   */
  formatPropertyValue(value, property, unit) {
    switch (property) {
      case 'density':
        return `${value.toFixed(4)} g/cm³`
      case 'meltingPoint':
      case 'boilingPoint':
        return `${value.toFixed(1)} K`
      case 'electronegativity':
        return `${value.toFixed(2)}`
      default:
        return `${value} ${unit}`
    }
  }

  /**
   * Obtém explicação de propriedade
   */
  getPropertyExplanation(element, property) {
    const propertyNames = {
      density: 'densidade',
      meltingPoint: 'ponto de fusão',
      boilingPoint: 'ponto de ebulição',
      electronegativity: 'eletronegatividade'
    }

    return `A ${propertyNames[property]} do ${
      element.name
    } é ${this.getPropertyValue(element, property)}.`
  }

  /**
   * Obtém nome da categoria
   */
  getCategoryName(category) {
    const categoryNames = {
      'não-metal': 'Não Metais',
      'metal-alcalino': 'Metais Alcalinos',
      'metal-alcalino-terroso': 'Metais Alcalinos Terrosos',
      'metal-transição': 'Metais de Transição',
      'metal-pos-transicao': 'Metais de Pós-Transição',
      semimetal: 'Semimetais',
      halogenio: 'Halogênios',
      'gás-nobre': 'Gases Nobres',
      lantanídeo: 'Lantanídeos',
      actinídeo: 'Actinídeos'
    }

    return categoryNames[category] || category
  }

  /**
   * Mostra a questão atual
   */
  showQuestion() {
    const question = this.questions[this.currentQuestion]

    document.getElementById('questionText').textContent = question.question
    document.getElementById('currentQuestionNum').textContent =
      this.currentQuestion + 1

    const optionsContainer = document.getElementById('questionOptions')
    optionsContainer.innerHTML = ''

    question.options.forEach((option, index) => {
      const optionBtn = document.createElement('button')
      optionBtn.className = 'quiz-option'
      optionBtn.textContent = option
      optionBtn.dataset.answer = option

      optionBtn.addEventListener('click', () => {
        this.checkAnswer(option)
      })

      optionsContainer.appendChild(optionBtn)
    })

    // Esconder feedback
    document.getElementById('questionFeedback').style.display = 'none'
  }

  /**
   * Verifica a resposta do usuário
   */
  checkAnswer(selectedAnswer) {
    const question = this.questions[this.currentQuestion]
    const isCorrect = selectedAnswer === question.correctAnswer

    // Desabilitar todas as opções
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true
      if (btn.dataset.answer === question.correctAnswer) {
        btn.classList.add('correct')
      } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
        btn.classList.add('incorrect')
      }
    })

    // Atualizar pontuação
    if (isCorrect) {
      this.score++
      this.streak++
    } else {
      this.streak = 0
    }

    this.updateStats()

    // Mostrar feedback
    this.showFeedback(isCorrect, question)
  }

  /**
   * Mostra feedback da questão
   */
  showFeedback(isCorrect, question) {
    const feedback = document.getElementById('questionFeedback')
    const icon = feedback.querySelector('.feedback-icon')
    const text = feedback.querySelector('.feedback-text')
    const explanation = feedback.querySelector('.feedback-explanation')

    if (isCorrect) {
      icon.className = 'feedback-icon fas fa-check-circle correct'
      text.textContent = 'Correto! 🎉'
      text.className = 'feedback-text correct'
    } else {
      icon.className = 'feedback-icon fas fa-times-circle incorrect'
      text.textContent = `Incorreto. A resposta correta é: ${question.correctAnswer}`
      text.className = 'feedback-text incorrect'
    }

    explanation.textContent = question.explanation
    feedback.style.display = 'block'
  }

  /**
   * Avança para a próxima questão
   */
  nextQuestion() {
    this.currentQuestion++

    if (this.currentQuestion >= this.totalQuestions) {
      this.showResults()
    } else {
      this.showQuestion()
    }
  }

  /**
   * Mostra os resultados finais
   */
  showResults() {
    const percentage = Math.round((this.score / this.totalQuestions) * 100)
    const maxStreak = Math.max(this.streak, this.loadMaxStreak())

    // Atualizar melhor pontuação se necessário
    if (this.score > this.bestScore) {
      this.bestScore = this.score
      this.saveBestScore(this.score)
    }

    // Salvar sequência máxima
    this.saveMaxStreak(maxStreak)

    // Atualizar display
    document.getElementById('finalScore').textContent = this.score
    document.getElementById('scorePercentage').textContent = `${percentage}%`
    document.getElementById('maxStreak').textContent = maxStreak
    document.getElementById('bestScoreDisplay').textContent = this.bestScore

    // Mensagem de performance
    const message = this.getPerformanceMessage(percentage)
    document.getElementById('performanceMessage').innerHTML = message

    // Esconder questão e mostrar resultados
    document.getElementById('quizQuestion').style.display = 'none'
    document.getElementById('quizResults').style.display = 'block'
  }

  /**
   * Obtém mensagem de performance baseada na pontuação
   */
  getPerformanceMessage(percentage) {
    if (percentage >= 90) {
      return '<div class="performance-excellent">🏆 Excelente! Você é um mestre da química!</div>'
    } else if (percentage >= 80) {
      return '<div class="performance-great">🌟 Muito bem! Você tem ótimos conhecimentos!</div>'
    } else if (percentage >= 70) {
      return '<div class="performance-good">👍 Bom trabalho! Continue estudando!</div>'
    } else if (percentage >= 60) {
      return '<div class="performance-average">📚 Não foi mal, mas há espaço para melhorar!</div>'
    } else {
      return '<div class="performance-needs-improvement">📖 Continue estudando a tabela periódica!</div>'
    }
  }

  /**
   * Reinicia o quiz
   */
  retryQuiz() {
    document.getElementById('quizResults').style.display = 'none'
    document.getElementById('quizStart').style.display = 'block'
  }

  /**
   * Compartilha resultados
   */
  shareResults() {
    const percentage = Math.round((this.score / this.totalQuestions) * 100)
    const text = `Acabei de fazer ${percentage}% no Quiz da Tabela Periódica! 🧪⚗️ Teste seus conhecimentos em: ${window.location.href}`

    if (navigator.share) {
      navigator.share({
        title: 'Quiz da Tabela Periódica',
        text: text,
        url: window.location.href
      })
    } else {
      // Fallback para copiar para clipboard
      navigator.clipboard.writeText(text).then(() => {
        // Mostrar notificação de sucesso
        if (window.showNotification) {
          window.showNotification(
            'Resultados copiados para a área de transferência!',
            'success'
          )
        }
      })
    }
  }

  /**
   * Fecha o quiz
   */
  closeQuiz() {
    document.getElementById('quizModal').classList.remove('active')
    this.isActive = false
  }

  /**
   * Abre o quiz
   */
  openQuiz() {
    document.getElementById('quizModal').classList.add('active')
  }

  /**
   * Atualiza estatísticas na tela
   */
  updateStats() {
    document.getElementById('quizScore').textContent = this.score
    document.getElementById('quizStreak').textContent = this.streak
  }

  /**
   * Carrega melhor pontuação do localStorage
   */
  loadBestScore() {
    return parseInt(localStorage.getItem('quizBestScore')) || 0
  }

  /**
   * Salva melhor pontuação no localStorage
   */
  saveBestScore(score) {
    localStorage.setItem('quizBestScore', score.toString())
  }

  /**
   * Carrega sequência máxima do localStorage
   */
  loadMaxStreak() {
    return parseInt(localStorage.getItem('quizMaxStreak')) || 0
  }

  /**
   * Salva sequência máxima no localStorage
   */
  saveMaxStreak(streak) {
    localStorage.setItem('quizMaxStreak', streak.toString())
  }

  /**
   * Embaralha array
   */
  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// Exportar para uso global
window.QuizSystem = QuizSystem
