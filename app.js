// MyOS Word Guess — a self-contained Wordle-style game. Pure static, local word list.
(function () {
  var board = document.getElementById('wd-board');
  if (!board) return;
  var msg = document.getElementById('wd-msg');
  var kbEl = document.getElementById('wd-kb');

  var WORDS = ('about above actor acute admit adopt adult after again agent agree ahead alarm album ' +
    'alert alike alive allow alone along alter among anger angle angry apart apple apply arena argue ' +
    'arise array aside asset audio avoid award aware badly baker bases basic beach began begin being ' +
    'below bench birth black blame blank blast blind block blood board boost booth bound brain brand ' +
    'brave bread break breed brief bring broad broke brown build built buyer cabin cable candy cargo ' +
    'carry catch cause chain chair chaos charm chart chase cheap check chess chest chief child china ' +
    'claim class clean clear click climb clock close cloud coach coast could count court cover crack ' +
    'craft crash cream crime cross crowd crown curve cycle daily dance dealt death debut delay depth ' +
    'doing doubt dozen draft drama drawn dream dress drill drink drive drove dying eager early earth ' +
    'eight elite empty enemy enjoy enter entry equal error event every exact exist extra faith false ' +
    'fault favor fence fever field fifth fifty fight final first fixed flame flash fleet floor focus ' +
    'force forth forty forum found frame frank fresh front fruit fully funny ghost giant given glass ' +
    'globe glory grace grade grain grand grant grass great green greet group grown guard guess guest ' +
    'guide happy harsh heart heavy hello hobby honor horse hotel house human humor ideal image index ' +
    'inner input issue joint judge juice known label large laser later laugh layer learn lease least ' +
    'leave legal lemon level light limit lived lobby local logic loose lover lower lucky lunch lying ' +
    'magic major maker march match maybe mayor meant medal media metal meter might minor minus mixed ' +
    'model money month moral motor mount mouse mouth movie music naked nerve never newly night noble ' +
    'noise north novel nurse ocean offer often olive onion opera order other ought paint panel paper ' +
    'party peace phase phone photo piano piece pilot pitch place plain plane plant plate point pound ' +
    'power press price pride prime print prior prize proof proud prove queen quick quiet quite radio ' +
    'raise range rapid ratio reach ready realm rebel refer relax reply rider ridge right rival river ' +
    'robot round route royal rural sadly salad sauce scale scene scope score sense serve seven shade ' +
    'shall shape share sharp sheep sheet shelf shell shift shine shirt shock shoot shore short shown ' +
    'sight silly since sixth sixty skill sleep slide small smart smile smoke snake solid solve sorry ' +
    'sound south space spare speak speed spell spend spent spice spine split spoke sport staff stage ' +
    'stair stand stare start state steam steel steep steam stick still stock stone stood store storm ' +
    'story stove strip study stuff style sugar suite sunny super sweet table taken taste teach teeth ' +
    'tenth terms thank theft their theme there these thick thing think third those three threw throw ' +
    'tiger tight timer title today token tooth topic total touch tough tower trace track trade trail ' +
    'train treat trend trial tribe trick tried tries truck truly trust truth twice twist ultra uncle ' +
    'under union unity until upper upset urban usage usual valid value video virus visit vital vocal ' +
    'voice waste watch water wheel where which while white whole whose woman world worry worse worth ' +
    'would wound write wrong wrote yield young youth zebra').split(/\s+/);

  var answer, row, col, grid, done, keyState;

  function newGame() {
    answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    row = 0; col = 0; done = false; grid = [];
    keyState = {};
    board.innerHTML = '';
    for (var r = 0; r < 6; r++) {
      var rowArr = [];
      var rEl = document.createElement('div'); rEl.className = 'wd-row';
      for (var c = 0; c < 5; c++) {
        var t = document.createElement('div'); t.className = 'wd-tile';
        rEl.appendChild(t); rowArr.push(t);
      }
      board.appendChild(rEl); grid.push(rowArr);
    }
    note('Guess the 5-letter word in 6 tries.');
    renderKb();
  }

  function note(t, cls) { msg.textContent = t; msg.className = 'wd-msg' + (cls ? ' ' + cls : ''); }

  function type(ch) {
    if (done || col >= 5) return;
    grid[row][col].textContent = ch;
    grid[row][col].classList.add('filled');
    col++;
  }
  function back() {
    if (done || col === 0) return;
    col--;
    grid[row][col].textContent = '';
    grid[row][col].classList.remove('filled');
  }
  function submit() {
    if (done || col < 5) { if (!done) note('Not enough letters.', 'bad'); return; }
    var guess = grid[row].map(function (t) { return t.textContent.toLowerCase(); }).join('');
    var res = score(guess, answer);
    for (var i = 0; i < 5; i++) {
      grid[row][i].classList.add(res[i]);
      var ch = guess[i];
      if (res[i] === 'correct' || (res[i] === 'present' && keyState[ch] !== 'correct') ||
          (res[i] === 'absent' && !keyState[ch])) keyState[ch] = res[i];
    }
    renderKb();
    if (guess === answer) { done = true; note('Solved in ' + (row + 1) + '! 🎉', 'ok'); return; }
    row++; col = 0;
    if (row >= 6) { done = true; note('Out of tries — it was "' + answer.toUpperCase() + '".', 'bad'); }
  }
  function score(guess, ans) {
    var res = ['absent', 'absent', 'absent', 'absent', 'absent'];
    var counts = {};
    for (var i = 0; i < 5; i++) counts[ans[i]] = (counts[ans[i]] || 0) + 1;
    for (i = 0; i < 5; i++) if (guess[i] === ans[i]) { res[i] = 'correct'; counts[guess[i]]--; }
    for (i = 0; i < 5; i++) if (res[i] !== 'correct' && counts[guess[i]] > 0) { res[i] = 'present'; counts[guess[i]]--; }
    return res;
  }

  var ROWS = ['qwertyuiop', 'asdfghjkl', '↵zxcvbnm⌫'];
  function renderKb() {
    kbEl.innerHTML = '';
    ROWS.forEach(function (rw) {
      var rEl = document.createElement('div'); rEl.className = 'wd-kbrow';
      rw.split('').forEach(function (ch) {
        var b = document.createElement('button'); b.className = 'wd-key';
        if (ch === '↵') { b.classList.add('wide'); b.textContent = 'Enter'; b.onclick = submit; }
        else if (ch === '⌫') { b.classList.add('wide'); b.textContent = 'Del'; b.onclick = back; }
        else {
          b.textContent = ch;
          if (keyState[ch]) b.classList.add(keyState[ch]);
          b.onclick = function () { type(ch.toUpperCase()); };
        }
        rEl.appendChild(b);
      });
      kbEl.appendChild(rEl);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submit();
    else if (e.key === 'Backspace') back();
    else if (/^[a-zA-Z]$/.test(e.key)) type(e.key.toUpperCase());
  });
  document.getElementById('wd-new').onclick = newGame;

  newGame();
})();
