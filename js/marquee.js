// ── FILM STRIP MARQUEE ──
(function () {
  const row1 = ['Arcangel','Jowell y Randy','Ryan Castro','Myke Towers','Zion','J Alvarez','Ñejo','Sech','Luigi 21+','Justin Quiles','Dalmata'];
  const row2 = ['Lenny Tavarez','Manuel Turizo','Beéle','Kapo','DJ Luian','Totoy El Frío','Darell','Hamilton','Trapical Minds','Mike Bahía','La Perreandanga'];

  function fill(id, arr) {
    const el = document.getElementById(id);
    let h = '';
    // Two copies for seamless loop
    for (let i = 0; i < 2; i++) {
      arr.forEach(a => {
        h += `<span class="marquee-item">${a}<span class="msep"> ✦ </span></span>`;
      });
    }
    el.innerHTML = h;
  }

  fill('m1', row1);
  fill('m2', row2);
})();
