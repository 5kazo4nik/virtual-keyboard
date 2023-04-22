import '../css/styles.scss';

const rus = {
  1: [['ё'], ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['Backspace']],
  2: [['Tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '|'], ['Del']],
  3: [['Caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['Enter']],
  4: [['Shift'], ['\\', '|'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['inner_up'], ['Shift']],
  5: [['Ctrl'], ['Win'], ['Alt'], ['space'], ['Alt'], ['Ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

const eng = {
  1: [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['Backspace']],
  2: [['Tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['Del']],
  3: [['Caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ["'", '"'], ['Enter']],
  4: [['Shift'], ['\\', '|'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['inner_up'], ['Shift']],
  5: [['Ctrl'], ['Win'], ['Alt'], ['space'], ['Alt'], ['Ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

let alph = localStorage.getItem('alph') ? localStorage.getItem('alph') : 'eng';
let textValue = '';
let ctrl = false;
let alt = false;
let shift = false;
let caps = false;

class Keyboard {
  constructor() {
    this.alph = alph === 'eng' ? eng : rus;
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

  createButtons() {
    const buttonsLines = [];

    Object.keys(this.alph).forEach((line) => {
      const keyboardLine = Keyboard.createNode('div', 'keyboard__line');

      this.alph[line].forEach((el) => {
        const inner = Keyboard.createNode('div', 'btn__inner');
        const btn = Keyboard.createNode('div', 'btn');

        // Вставляет текст в зависимости от того какая это будет кнопка
        // и определяет dataset для " и \
        if (el[1]) {
          Keyboard.insertNode(btn, el[1]);
          if (el[0] === '\\' && this.alph[line].indexOf(el) === 1) {
            btn.dataset.value = 'lBackSlash';
          } else if (el[0] === '\\') {
            btn.dataset.value = 'rBackSlash';
          } else {
            [btn.dataset.value] = el;
          }
          inner.dataset.value = el[1] === '"' ? 'dquote' : el[1];
        }
        if (el[0].length && !el[0].match(/(inner|^space$)/)) {
          if (el[0].length > 1) {
            Keyboard.insertNode(inner, el[0]);
          } else {
            Keyboard.insertNode(inner, el[0].toUpperCase());
          }
        }

        // Устанавливает dataset для поиска элементов при нажатии клавиши
        if (el[0].match(/[a-zA-ZА-Яа-я]/) && el[0].length <= 1) {
          [btn.dataset.value] = el;
          inner.dataset.value = el[0].toUpperCase();
        } else if (el[0].match(/[a-zA-ZА-Яа-я]/)) {
          [btn.dataset.value] = el;
        }

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

  insertElements() {
    // prettier-ignore
    this.text = alph === 'eng'
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

  /// ///////////////////////////////////////////////

  static switchLang() {
    document.body.innerHTML = '';
    alph = alph === 'eng' ? 'рус' : 'eng';
    textValue = this.textArea.value;
    const switchedKeyboard = new Keyboard();
    switchedKeyboard.build();
  }

  static clickDown(e) {
    let btn;
    let inner;
    if (e.target.closest('.btn')) {
      btn = e.target.closest('.btn');
      inner = btn.querySelector('.btn__inner');
      btn.classList.add('btn_active');
      this.textArea.value += Keyboard.setTextAreaValue(this.textArea, btn, inner);

      Keyboard.setSpecBtn(btn);

      if (btn.classList.contains('btn_caps')) {
        caps = !caps;
        btn.classList.toggle('btn_caps_active');
      }
    }
  }

  static clickUp(e) {
    let btn;
    // let inner;

    if (e.target.closest('.btn')) {
      btn = e.target.closest('.btn');
      // inner = btn.querySelector('.btn__inner');
      btn.classList.remove('btn_active');

      Keyboard.setShortcats(this);
      Keyboard.setSpecBtn(btn);
    }
  }

  static mouseOut(e) {
    let btn;
    if (e.target.classList.contains('btn_active') && !e.relatedTarget.classList.contains('btn__inner')) {
      btn = e.target.closest('.btn');
      btn.classList.remove('btn_active');
    }
  }

  static pressDown(e) {
    this.textArea.focus();
    const btn = Keyboard.findBtn(e);

    if (btn) {
      Keyboard.setSpecBtn(btn, e.repeat);
      btn.classList.add('btn_active');

      const inner = btn.querySelector('.btn__inner');

      if (btn.dataset.value === 'Caps lock') {
        caps = e.repeat ? caps : !caps;
        if (!e.repeat) btn.classList.toggle('btn_caps_active');
      }

      if (shift) {
        this.textArea.value += Keyboard.setTextAreaValue(this.textArea, btn, inner);
        if (inner.textContent.match(/^.$/)) e.preventDefault();
      }
    }
  }

  static pressUp(e) {
    const btn = Keyboard.findBtn(e);

    const shortcats = Keyboard.setShortcats.bind(this);
    shortcats(this);
    Keyboard.setSpecBtn(btn);

    if (btn) {
      btn.classList.remove('btn_active');
    }
  }

  static findBtn(e) {
    let btn;

    if (e.code.includes('Arrow')) {
      btn = document.querySelector(`[data-value="inner_${e.code.slice(5).toLowerCase()}"]`);
    } else if (e.code === 'ShiftLeft') {
      btn = document.querySelector('.btn_lshift');
    } else if (e.code === 'ShiftRight') {
      btn = document.querySelector('.btn_rshift');
    } else if (e.code === 'Space') {
      btn = document.querySelector('.btn_space');
    } else if (e.code === 'AltLeft') {
      btn = document.querySelector('.btn_lAlt');
    } else if (e.code === 'AltRight') {
      btn = document.querySelector('.btn_rAlt');
    } else if (e.code === 'ControlLeft') {
      btn = document.querySelector('.btn_lctrl');
    } else if (e.code === 'ControlRight') {
      btn = document.querySelector('.btn_rctrl');
    } else if (e.code === 'CapsLock') {
      btn = document.querySelector('.btn_caps');
    } else if (e.code === 'Delete') {
      btn = document.querySelector('.btn_del');
    } else if (e.key === 'Meta') {
      btn = document.querySelector('.btn_win');
    } else if (e.key === 'Tab') {
      btn = document.querySelector('.btn_tab');
    } else if (e.key === 'Backspace') {
      btn = document.querySelector('.btn_backspace');
    } else if (e.key === '"') {
      btn = document.querySelector('[data-value="dquote"]');
    } else if (e.key.match(/^.{1}$/)) {
      btn = document.querySelector(`[data-value="${e.key}"]`);
    } else {
      btn = document.querySelector(`[data-value="${e.key}"]`);
    }

    if (btn) {
      btn = btn.closest('.btn');
    }
    return btn;
  }

  static setSpecBtn(btn, repeat = false) {
    if (!repeat && btn) {
      if (btn.dataset.value === 'Shift') {
        shift = !shift;
      }
      if (btn.dataset.value === 'Alt') {
        alt = !alt;
      }
      if (btn.dataset.value === 'Ctrl') {
        ctrl = !ctrl;
      }
    }
  }

  static setTextAreaValue(textArea, btn, inner) {
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
    }
    return value;
  }

  static setShortcats(thisClass) {
    if (shift && alt) {
      Keyboard.switchLang.call(thisClass);
    }
  }
}

const keyboard = new Keyboard();
keyboard.build();
