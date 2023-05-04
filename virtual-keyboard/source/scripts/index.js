import '../css/styles.scss';

const codes = {
  1: [['Backquote'], ['Digit1'], ['Digit2'], ['Digit3'], ['Digit4'], ['Digit5'], ['Digit6'], ['Digit7'], ['Digit8'], ['Digit9'], ['Digit0'], ['Minus'], ['Equal'], ['Backspace']],
  2: [['Tab'], ['KeyQ'], ['KeyW'], ['KeyE'], ['KeyR'], ['KeyT'], ['KeyY'], ['KeyU'], ['KeyI'], ['KeyO'], ['KeyP'], ['BracketLeft'], ['BracketRight'], ['Backslash'], ['Delete']],
  3: [['CapsLock'], ['KeyA'], ['KeyS'], ['KeyD'], ['KeyF'], ['KeyG'], ['KeyH'], ['KeyJ'], ['KeyK'], ['KeyL'], ['Semicolon'], ['Quote'], ['Enter']],
  4: [['ShiftLeft'], ['IntlBackslash'], ['KeyZ'], ['KeyX'], ['KeyC'], ['KeyV'], ['KeyB'], ['KeyN'], ['KeyM'], ['Comma'], ['Period'], ['Slash'], ['inner_up'], ['ShiftRight']],
  5: [['ControlLeft'], ['MetaLeft'], ['AltLeft'], ['Space'], ['AltRight'], ['ControlRight'], ['inner_left'], ['inner_down'], ['inner_right']],
};

const ru = {
  1: [['ё'], ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['Backspace']],
  2: [['Tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '|'], ['Del']],
  3: [['Caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['Enter']],
  4: [['Shift'], ['\\', '|'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['inner_up'], ['Shift']],
  5: [['Ctrl'], ['Win'], ['Alt'], ['space'], ['Alt'], ['Ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

const en = {
  1: [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['Backspace']],
  2: [['Tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['Del']],
  3: [['Caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ["'", '"'], ['Enter']],
  4: [['Shift'], ['\\', '|'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['inner_up'], ['Shift']],
  5: [['Ctrl'], ['Win'], ['Alt'], ['space'], ['Alt'], ['Ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

let alph = localStorage.getItem('alph') ? localStorage.getItem('alph') : navigator.language.slice(0, 2).toLowerCase();
let textValue = '';
let ctrl = false;
let alt = false;
let shift = false;
let caps = false;

window.addEventListener('beforeunload', () => localStorage.setItem('alph', alph));

class Keyboard {
  constructor() {
    this.alph = alph === 'ru' ? ru : en;
  }

  // Создает узел с указанными классами
  static createNode(elem, ...classes) {
    const node = document.createElement(elem);
    node.classList.add(...classes);
    return node;
  }

  // Вставляет текст в узел или элемент в узел
  static insertNode(parent, child) {
    const parentNode = parent;
    if (typeof child === 'string') {
      parentNode.textContent = child;
    } else {
      parentNode.append(child);
    }
  }

  build() {
    this.createElements();
    this.insertElements();
    this.bindEvents();
    this.textArea.focus();
  }

  // Функция для генерации кнопок, их data атрибута, текстового значения и классов
  createButtons() {
    const buttonsLines = [];

    Object.keys(this.alph).forEach((line) => {
      const keyboardLine = Keyboard.createNode('div', 'keyboard__line');

      this.alph[line].forEach((el, index) => {
        const inner = Keyboard.createNode('div', 'btn__inner');
        const btn = Keyboard.createNode('div', 'btn');

        // Вставляет текст в зависимости от того какая это будет кнопка
        // и определяет dataset для " и \
        if (el[1]) {
          Keyboard.insertNode(btn, el[1]);
        }
        if (el[0].length && !el[0].match(/(inner|^space$)/)) {
          if (el[0].length > 1) {
            Keyboard.insertNode(inner, el[0]);
          } else {
            Keyboard.insertNode(inner, el[0].toUpperCase());
          }
        }

        // Устанавливает dataset для поиска элементов при нажатии клавиши
        [btn.dataset.value] = codes[line][index];

        // Добавляет классы для стрелочек и боковых элеметов
        if ((el[0].length > 1 || el === this.alph[1][0]) && el[0] !== 'space') {
          btn.classList.add('btn_bordered');
        }
        if (el[0].match(/inner/)) {
          inner.classList.add(`btn__${el[0]}`);
        }

        // Добавляет классы для специальных кнопок
        if (el[0] === 'Tab') {
          btn.classList.add('btn_tab');
        } else if (el[0] === 'Caps lock') {
          btn.classList.add('btn_caps');
          if (caps) btn.classList.add('btn_caps_active');
        } else if (el[0] === 'Ctrl') {
          if (this.alph[line].indexOf(el) > 0) {
            btn.classList.add('btn_rctrl');
          } else {
            btn.classList.add('btn_lctrl');
          }
        } else if (el[0] === 'Win') {
          btn.classList.add('btn_win');
        } else if (el[0] === 'Alt') {
          if (this.alph[line].indexOf(el) > 2) {
            btn.classList.add('btn_rAlt');
          } else {
            btn.classList.add('btn_lAlt');
          }
        } else if (el[0] === 'Shift') {
          if (this.alph[line].indexOf(el) > 0) {
            btn.classList.add('btn_rshift');
          } else {
            btn.classList.add('btn_lshift');
          }
        } else if (el[0] === 'space') {
          btn.classList.add('btn_space');
        } else if (el[0] === 'Backspace') {
          btn.classList.add('btn_backspace');
        } else if (el[0] === 'Enter') {
          btn.classList.add('btn_enter');
        } else if (el[0] === 'Del') {
          btn.classList.add('btn_del');
        }

        Keyboard.insertNode(btn, inner);
        Keyboard.insertNode(keyboardLine, btn);
      });
      buttonsLines.push(keyboardLine);
    });
    return buttonsLines;
  }

  // Функция создающая все элементы клавиатуры
  createElements() {
    this.buttons = this.createButtons();
    this.main = Keyboard.createNode('main', 'wrapper');
    this.textArea = Keyboard.createNode('textarea', 'wrapper__input');
    this.textArea.value = textValue;
    this.keyboard = Keyboard.createNode('div', 'keyboard');
    this.footer = Keyboard.createNode('footer', 'footer');
    this.footerText = Keyboard.createNode('p', 'footer__text');
    this.footerBtn = Keyboard.createNode('button', 'footer__btn');
  }

  // Функция вставляющая нужный текст или элементы
  insertElements() {
    // prettier-ignore
    this.text = alph === 'en'
      ? 'The keyboard was created for windows. To change the language, press the button below or the key combination left shift + left alt'
      : 'Клавиатура была создана для windows. Для смены языка нажмите кнопку снизу или комбинацию клавиш левый shift + левый alt';

    Keyboard.insertNode(this.footerBtn, alph.slice(0, 1).toUpperCase() + alph.slice(1));
    Keyboard.insertNode(this.footerText, this.text);
    Keyboard.insertNode(this.footer, this.footerText);
    Keyboard.insertNode(this.footer, this.footerBtn);
    this.buttons.forEach((line) => Keyboard.insertNode(this.keyboard, line));
    Keyboard.insertNode(this.main, this.textArea);
    Keyboard.insertNode(this.main, this.keyboard);
    Keyboard.insertNode(document.body, this.main);
    Keyboard.insertNode(document.body, this.footer);
  }

  // Функция привязывает метод класса к контексту этого класса и добавляет на элементы
  // обрабочкики событий.
  bindEvents() {
    const switchLang = Keyboard.switchLang.bind(this);
    const clickDown = Keyboard.clickDown.bind(this);
    const clickUp = Keyboard.clickUp.bind(this);
    const mouseOut = Keyboard.mouseOut.bind(this);
    const pressDown = Keyboard.pressDown.bind(this);
    const pressUp = Keyboard.pressUp.bind(this);

    this.footerBtn.addEventListener('click', switchLang);

    this.main.addEventListener('mousedown', clickDown);
    this.main.addEventListener('mouseup', clickUp);
    this.main.addEventListener('mouseout', mouseOut);

    this.main.addEventListener('keydown', pressDown);
    this.main.addEventListener('keyup', pressUp);

    this.textArea.addEventListener('focusout', (e) => {
      e.preventDefault();
      e.target.focus();
    });
  }

  /// Функции для обработчкиков ///////////////////////////////////////////////

  // Меняет язык путем удаления элемента и его повторной генерации с новым языком
  static switchLang() {
    document.body.innerHTML = '';
    alph = alph === 'en' ? 'ru' : 'en';
    textValue = this.textArea.value;
    const switchedKeyboard = new Keyboard();
    switchedKeyboard.build();
  }

  // Логика при событии mousedown
  static clickDown(e) {
    let btn;
    let inner;
    if (e.target.closest('.btn')) {
      btn = e.target.closest('.btn');
      inner = btn.querySelector('.btn__inner');
      btn.classList.add('btn_active');

      this.setTextAreaValue(btn, inner);

      if (btn.classList.contains('btn_caps')) {
        caps = !caps;
        btn.classList.toggle('btn_caps_active');
      }

      Keyboard.setSpecBtn(btn);
    }
  }

  // Логика при событии mouseUp, на этом событии можно выполнить смену языка
  static clickUp(e) {
    let btn;

    if (e.target.closest('.btn')) {
      btn = e.target.closest('.btn');
      btn.classList.remove('btn_active');

      Keyboard.setShortcats(this);
      Keyboard.setSpecBtn(btn);
    }
  }

  // Функция для корректирования заедания анимации.
  static mouseOut(e) {
    let btn;
    if (e.target.classList.contains('btn_active') && !e.relatedTarget.classList.contains('btn__inner')) {
      btn = e.target.closest('.btn');
      btn.classList.remove('btn_active');
    }
  }

  // Логика при событии pressdown
  static pressDown(e) {
    this.textArea.focus();
    const btn = Keyboard.findBtn(e);

    if (btn) {
      btn.classList.add('btn_active');
      Keyboard.setSpecBtn(btn, e.repeat);
      if (btn.dataset.value === 'CapsLock') {
        caps = e.repeat ? caps : !caps;
        if (!e.repeat) btn.classList.toggle('btn_caps_active');
      }

      const inner = btn.querySelector('.btn__inner');

      if (btn.dataset.value.match(/./) && ctrl) {
        return;
      }

      this.setTextAreaValue(btn, inner);

      e.preventDefault();
    }
  }

  // Логика при событии pressup, на этом событии можно выполнить смену языка
  static pressUp(e) {
    const btn = Keyboard.findBtn(e);

    const shortcats = Keyboard.setShortcats.bind(this);
    shortcats(this);
    Keyboard.setSpecBtn(btn);

    if (btn) {
      btn.classList.remove('btn_active');
    }
  }

  // Внутренние функции для функций обработчиков ///////////////////

  // Функция для поиска элемента нажатой кнопки
  static findBtn(e) {
    let btn;

    if (e.code.includes('Arrow')) {
      btn = document.querySelector(`[data-value="inner_${e.code.slice(5).toLowerCase()}"]`);
    } else if (e.code === 'AltRight') {
      btn = document.querySelector('[data-value="AltRight"]');
    } else {
      btn = document.querySelector(`[data-value="${e.code}"]`);
    }
    return btn;
  }

  // Функция для изменения значений спец-клавиш.
  static setSpecBtn(btn, repeat = false) {
    if (!repeat && btn) {
      if (btn.dataset.value.includes('Shift')) {
        shift = btn.classList.contains('btn_active') ? !shift : false;
      }
      if (btn.dataset.value.includes('Alt')) {
        alt = btn.classList.contains('btn_active') ? !alt : false;
      }
      if (btn.dataset.value.includes('Control')) {
        ctrl = btn.classList.contains('btn_active') ? !ctrl : false;
      }
    }
  }

  // Функция для поиска значения переданной кнопки
  static findBtnValue(textArea, btn, inner) {
    let value = '';
    if (inner.textContent.match(/^[^A-Za-zА-Яа-яёЁ]$/)) {
      if (shift && !alt) {
        value += btn.textContent[0];
      } else if (shift && alt) {
        value = '';
      } else {
        value += inner.textContent;
      }
    } else if (!btn.className.match(/(caps|space|shift|enter|win|del|ctrl|tab|Alt)/) && !inner.className.match(/inner_./)) {
      if (shift && !alt && !caps) {
        value += inner.textContent;
      } else if (!shift && caps) {
        value += inner.textContent;
      } else if (shift && !alt && caps) {
        value += inner.textContent.toLowerCase();
      } else if (shift && alt) {
        value += textArea.value;
      } else {
        value += inner.textContent.toLowerCase();
      }
    } else if (btn.classList.contains('btn_tab') && !shift) {
      value += '    ';
    } else if (btn.classList.contains('btn_space')) {
      value += ' ';
    } else if (btn.classList.contains('btn_enter')) {
      value += '\n';
    }
    return value;
  }

  // Функция изменяющая textarea.value в зависимости от нажатой кнопки или
  // сочетания клавишь и установка курсора на новое положение.
  setTextAreaValue(btn, inner) {
    const posStart = this.textArea.selectionStart;
    const posEnd = this.textArea.selectionEnd;
    const { value } = this.textArea;

    let isBS = false;
    let isDel = false;
    let deleted;
    const selected = posEnd - posStart;

    let btnValue;
    let newValue;

    const prevChar = value[posStart - 1];
    const nextChar = value[posEnd];

    if (btn.classList.contains('btn_backspace')) {
      if (posStart !== 0 || posEnd !== 0) {
        newValue = Keyboard.useBackspace(value, posStart, posEnd, selected, prevChar).newValue;
        deleted = Keyboard.useBackspace(value, posStart, posEnd, selected, prevChar).deleted;
        isBS = true;
      }
    } else if (btn.classList.contains('btn_del')) {
      newValue = Keyboard.useDel(value, posStart, posEnd, selected, nextChar).newValue;
      deleted = Keyboard.useDel(value, posStart, posEnd, selected, nextChar).deleted;
      isDel = true;
    } else if (btn.dataset.value.includes('inner')) {
      const pos = Keyboard.useArrows(btn, value, posStart, posEnd, selected, prevChar, nextChar);
      this.textArea.selectionStart = pos.start;
      this.textArea.selectionEnd = pos.end;
    } else {
      btnValue = Keyboard.findBtnValue(this.textArea, btn, inner);
      newValue = value.slice(0, posStart) + btnValue + value.slice(posEnd);
    }

    if (btnValue) {
      this.textArea.value = newValue;
      this.textArea.selectionStart = posStart + btnValue.length;
      this.textArea.selectionEnd = posStart + btnValue.length;
    } else if (isBS) {
      this.textArea.value = newValue;
      if (!selected) {
        this.textArea.selectionStart = posStart - deleted.length;
        this.textArea.selectionEnd = posEnd - deleted.length;
      } else {
        this.textArea.selectionStart = posStart;
        this.textArea.selectionEnd = posStart;
      }
    } else if (isDel) {
      this.textArea.value = newValue;
      this.textArea.selectionStart = posStart;
      this.textArea.selectionEnd = posStart;
    }
  }

  // Определяет новое значение textarea при нажатии backspace, в том числе
  // при сочетании клавиш
  static useBackspace(value, posStart, posEnd, selected, prevChar) {
    let newValue;
    let nonAlphNum;
    let posMatch;
    let deleted;
    if (selected) {
      deleted = value.slice(posStart, posEnd);
      newValue = value.slice(0, posStart) + value.slice(posEnd);
    } else if (ctrl) {
      nonAlphNum = prevChar.match(/[a-zA-ZА-Яа-я0-9ёЁ]+/) ? value.slice(0, posStart).match(/[a-zA-ZА-Яа-я0-9ёЁ]+$/) : value.slice(0, posStart).match(/[^a-zA-ZА-Яа-я0-9ёЁ]+$/);
      posMatch = nonAlphNum ? 0 + nonAlphNum.index : 0;
      deleted = value.slice(posMatch, posStart);
      newValue = value.slice(0, posMatch) + value.slice(posEnd);
    } else {
      deleted = value.slice(posStart - 1, posEnd);
      newValue = value.slice(0, posStart - 1) + value.slice(posEnd);
    }
    return { newValue, deleted };
  }

  // Определяет новое значение textarea при нажатии del, в том числе
  // при сочетании клавиш
  static useDel(value, posStart, posEnd, selected, nextChar) {
    let newValue;
    let opposedChar;
    let posMatch;
    let deleted;
    if (selected) {
      deleted = value.slice(posStart, posEnd);
      newValue = value.slice(0, posStart) + value.slice(posEnd);
    } else if (ctrl && nextChar) {
      opposedChar = nextChar.match(/[a-zA-ZА-Яа-я0-9ёЁ]+/) ? value.slice(posEnd, value.length).match(/[^a-zA-ZА-Яа-я0-9ёЁ]+?/) : value.slice(posEnd, value.length).match(/[a-zA-ZА-Яа-я0-9ёЁ]+?/);
      posMatch = opposedChar ? posEnd + opposedChar.index : value.length;
      deleted = value.slice(posEnd, posMatch);
      newValue = value.slice(0, posEnd) + value.slice(posMatch, value.length);
    } else {
      deleted = value.slice(posStart, posEnd + 1);
      newValue = value.slice(0, posStart) + value.slice(posEnd + 1);
    }
    return { newValue, deleted };
  }

  // Определяет новое положение курсора при нажатии на стрелочки в том числе
  // при сочетании клавиш
  static useArrows(btn, value, posStart, posEnd, selected, prevChar, nextChar) {
    let start;
    let end;
    let opposedChar;
    let posMatch;
    if (btn.dataset.value === 'inner_left') {
      if (ctrl && posStart > 0) {
        opposedChar = prevChar.match(/[a-zA-ZА-Яа-я0-9ёЁ]+/) ? value.slice(0, posStart).match(/[a-zA-ZА-Яа-я0-9ёЁ]+$/) : value.slice(0, posStart).match(/[^a-zA-ZА-Яа-я0-9ёЁ]+$/);
        posMatch = opposedChar ? 0 + opposedChar.index : 0;
        start = posMatch;
        if (shift) {
          end = posEnd;
        } else {
          end = posMatch;
        }
      } else if (shift && posStart > 0) {
        start = posStart - 1;
        end = posEnd;
      } else if (shift && !posStart) {
        start = 0;
        end = posEnd;
      } else if (selected) {
        start = posStart;
        end = posStart;
      } else if (posStart > 0) {
        start = posStart - 1;
        end = posStart - 1;
      }
    }

    if (btn.dataset.value === 'inner_right') {
      if (ctrl && posEnd < value.length) {
        opposedChar = nextChar.match(/[a-zA-ZА-Яа-я0-9ёЁ]+/) ? value.slice(posEnd, value.length).match(/[^a-zA-ZА-Яа-я0-9ёЁ]+?/) : value.slice(posEnd, value.length).match(/[a-zA-ZА-Яа-я0-9ёЁ]+?/);
        posMatch = opposedChar ? posEnd + opposedChar.index : value.length;
        end = posMatch;
        if (shift) {
          start = posStart;
        } else {
          start = posMatch;
        }
      } else if (shift && posStart < value.length) {
        start = posStart;
        end = posEnd + 1;
      } else if (shift && posEnd === value.length) {
        start = posStart;
        end = value.length;
      } else if (selected) {
        start = posEnd;
        end = posEnd;
      } else if (posEnd < value.length) {
        start = posStart + 1;
        end = posStart + 1;
      } else if (posStart === value.length) {
        start = value.length;
        end = value.length;
      }
    }

    if (btn.dataset.value === 'inner_up') {
      let prevLineEnd = value.slice(0, posStart).lastIndexOf('\n');
      prevLineEnd = prevLineEnd < 0 ? 0 : prevLineEnd;
      const prevLineStart = value.slice(0, prevLineEnd).lastIndexOf('\n') + 1;
      const column = posStart - (prevLineEnd + 1);

      start = prevLineEnd - prevLineStart < column ? prevLineEnd : prevLineStart + column;
      if (shift) {
        end = posEnd;
      } else {
        end = start;
      }
    }

    if (btn.dataset.value === 'inner_down') {
      const curLineStart = value.slice(0, posEnd).lastIndexOf('\n') + 1;
      let nextLineStart = value.indexOf('\n', curLineStart) + 1;
      nextLineStart = nextLineStart === 0 ? value.length : nextLineStart;
      const column = value.slice(curLineStart, posEnd).length;

      end = nextLineStart === value.length ? value.length : nextLineStart + column;
      if (shift) {
        start = posStart;
      } else {
        start = end;
      }
    }

    return { start, end };
  }

  // Вызывает функцию смены языка при сочетании клавиш
  static setShortcats(thisClass) {
    if (shift && alt) {
      Keyboard.switchLang.call(thisClass);
    }
  }
}

const keyboard = new Keyboard();
keyboard.build();
