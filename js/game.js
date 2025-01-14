import { wordList } from './words.js';

class HangmanGame {
  constructor() {
    this.word = '';
    this.category = '';
    this.hint = '';
    this.guessedLetters = new Set();
    this.remainingTries = 6;
    this.gameOver = false;
    
    // DOM Elements
    this.wordElement = document.getElementById('word');
    this.categoryElement = document.getElementById('category');
    this.lettersElement = document.getElementById('letters');
    this.hintBtn = document.getElementById('hintBtn');
    this.hintElement = document.getElementById('hint');
    this.messageElement = document.getElementById('message');
    this.resetBtn = document.getElementById('resetBtn');
    
    this.initializeGame();
    this.setupEventListeners();
  }

  initializeGame() {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    this.word = randomWord.word;
    this.category = randomWord.category;
    this.hint = randomWord.hint;
    this.guessedLetters.clear();
    this.remainingTries = 6;
    this.gameOver = false;
    
    this.categoryElement.textContent = `Categoría: ${this.category}`;
    this.hintElement.textContent = '';
    this.messageElement.textContent = '';
    this.messageElement.className = 'message';
    
    this.createLetterButtons();
    this.updateWordDisplay();
    this.resetHangman();
  }

  createLetterButtons() {
    this.lettersElement.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const button = document.createElement('button');
      button.textContent = letter;
      button.className = 'letter-btn';
      button.dataset.letter = letter;
      this.lettersElement.appendChild(button);
    }
  }

  updateWordDisplay() {
    this.wordElement.innerHTML = this.word
      .split('')
      .map(letter => `
        <div class="letter-box ${this.guessedLetters.has(letter.toUpperCase()) ? 'pop' : ''}">
          ${this.guessedLetters.has(letter.toUpperCase()) ? letter : ''}
        </div>
      `)
      .join('');
  }

  resetHangman() {
    document.querySelectorAll('.hangman-part').forEach(part => {
      if (part.dataset.part) {
        part.classList.add('hide');
        part.classList.remove('show');
      }
    });
  }

  showHangmanPart() {
    const parts = ['rope', 'head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    const partToShow = parts[6 - this.remainingTries];
    if (partToShow) {
      const part = document.querySelector(`[data-part="${partToShow}"]`);
      part.classList.remove('hide');
      part.classList.add('show');
    }
  }

  checkWin() {
    return this.word.split('').every(letter => this.guessedLetters.has(letter.toUpperCase()));
  }

  handleGuess(letter) {
    if (this.gameOver || this.guessedLetters.has(letter)) return;

    this.guessedLetters.add(letter);
    const button = document.querySelector(`[data-letter="${letter}"]`);
    
    if (this.word.includes(letter)) {
      button.classList.add('correct');
      if (this.checkWin()) {
        this.endGame(true);
      }
    } else {
      button.classList.add('wrong');
      this.remainingTries--;
      this.showHangmanPart();
      
      if (this.remainingTries === 0) {
        this.endGame(false);
      }
    }
    
    button.classList.add('used');
    this.updateWordDisplay();
  }

  showHint() {
    this.hintElement.textContent = `Pista: ${this.hint}`;
    this.hintElement.classList.remove('reveal');
    void this.hintElement.offsetWidth; // Force reflow
    this.hintElement.classList.add('reveal');
  }

  endGame(won) {
    this.gameOver = true;
    this.messageElement.textContent = won ? 
      '¡Felicitaciones! ¡Has ganado!' : 
      `¡Game Over! La palabra era: ${this.word}`;
    this.messageElement.className = `message ${won ? 'win' : 'lose'}`;
    
    // Add show class after a small delay for animation
    setTimeout(() => {
      this.messageElement.classList.add('show');
    }, 100);
  }

  setupEventListeners() {
    this.lettersElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('letter-btn')) {
        this.handleGuess(e.target.dataset.letter);
      }
    });

    this.hintBtn.addEventListener('click', () => this.showHint());
    this.resetBtn.addEventListener('click', () => this.initializeGame());

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        this.handleGuess(key);
      }
    });

    // Add touch event handling
    this.lettersElement.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('letter-btn')) {
        e.preventDefault(); // Prevent double-firing on mobile devices
        this.handleGuess(e.target.dataset.letter);
      }
    }, { passive: false });

    // Prevent zoom on double tap
    document.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.target.click();
    }, { passive: false });
  }
}

// Initialize the game
new HangmanGame();