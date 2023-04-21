import '../css/styles.scss';

const rus = {
  1: [['ё'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
  2: [['tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '|'], ['del']],
  3: [['caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['enter']],
  4: [['shift'], ['\\', '|'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['inner_up'], ['shift']],
  5: [['ctrl'], ['win'], ['alt'], ['wspace'], ['alt'], ['ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

const eng = {
  1: [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
  2: [['tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['del']],
  3: [['caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ["'", ['"']], ['enter']],
  4: [['shift'], ['\\', '|'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['inner_up'], ['shift']],
  5: [['ctrl'], ['win'], ['alt'], ['wspace'], ['alt'], ['ctrl'], ['inner_left'], ['inner_down'], ['inner_right']],
};

const alph = localStorage.getItem('alph') ? localStorage.getItem('alph') : 'eng';

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
  }

  createButtons() {
    const buttonsLines = [];

    Object.keys(this.alph).forEach((line) => {
      const keyboardLine = Keyboard.createNode('div', 'keyboard__line');

      this.alph[line].forEach((el) => {
        const inner = Keyboard.createNode('div', 'btn__inner');
        const btn = Keyboard.createNode('div', 'btn');
        if (el[1]) {
          Keyboard.insertNode(btn, el[1]);
        }
        if (el[0].length && !el[0].match(/(inner|wspace)/)) {
          if (el[0].length > 1) {
            Keyboard.insertNode(inner, el[0].slice(0, 1).toUpperCase() + el[0].slice(1));
          } else {
            Keyboard.insertNode(inner, el[0].toUpperCase());
          }
        }

        if ((el[0].length > 1 || el === this.alph[1][0]) && el[0] !== 'wspace') {
          btn.classList.add('btn_bordered');
        }
        if (el[0].match(/inner/)) {
          inner.classList.add(`btn__${el[0]}`);
        }

        if (el[0] === 'tab') {
          btn.classList.add('btn_tab');
        } else if (el[0] === 'caps lock') {
          btn.classList.add('btn_caps');
        } else if (el[0] === 'ctrl') {
          btn.classList.add('btn_ctrl');
        } else if (el[0] === 'win') {
          btn.classList.add('btn_win');
        } else if (el[0] === 'alt') {
          btn.classList.add('btn_alt');
        } else if (el[0] === 'shift') {
          if (this.alph[line].indexOf(el) > 0) {
            btn.classList.add('btn_rshift');
          } else {
            btn.classList.add('btn_lshift');
          }
        } else if (el[0] === 'wspace') {
          btn.classList.add('btn_space');
        } else if (el[0] === 'backspace') {
          btn.classList.add('btn_backspace');
        } else if (el[0] === 'enter') {
          btn.classList.add('btn_enter');
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
    this.textArea.setAttribute('autofocus', 'true');
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
}

const keyboard = new Keyboard();
keyboard.build();
