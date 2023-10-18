(function () {
  const _onload = function () {
    const pretag = document.getElementById("d");
    const canvastag = document.getElementById("canvasdonut");
    canvastag.height = 700;
    canvastag.width = 900;

    let tmr1 = undefined,
      tmr2 = undefined;
    let A = 1,
      B = 1;

    var asciiframe = function () {
      let bArr = [];
      let zArr = [];
      A += 0.07;
      B += 0.03;
      let cA = Math.cos(A),
        sA = Math.sin(A),
        cB = Math.cos(B),
        sB = Math.sin(B);
      for (let k = 0; k < 1760; k++) {
        bArr[k] = k % 80 == 79 ? "<br />" : "&nbsp;";
        // bArr[k] = k % 80 == 79 ? "\n" : " ";
        zArr[k] = 0;
      }
      for (let j = 0; j < 6.28; j += 0.07) {
        // j <=> theta
        let ct = Math.cos(j),
          st = Math.sin(j);
        for (i = 0; i < 6.28; i += 0.02) {
          // i <=> phi
          const sp = Math.sin(i),
            cp = Math.cos(i),
            h = ct + 2, // R1 + R2*cos(theta)
            D = 1 / (sp * h * sA + st * cA + 5), // this is 1/z
            t = sp * h * cA - st * sA; // this is a clever factoring of some of the terms in x' and y'

          let x = 0 | (40 + 30 * D * (cp * h * cB - t * sB)),
            y = 0 | (12 + 15 * D * (cp * h * sB + t * cB)),
            o = x + 80 * y,
            N =
              0 |
              (8 *
                ((st * sA - sp * ct * cA) * cB -
                  sp * ct * sA -
                  st * cA -
                  cp * ct * sB));
          if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > zArr[o]) {
            zArr[o] = D;
            bArr[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }
      pretag.innerHTML = bArr.join("");
      // console.clear();
      // console.log(bArr.join(""));
      // process.stdout.write(bArr.join(""));
    };

    window.anim1 = function () {
      if (tmr1 === undefined) {
        tmr1 = setInterval(asciiframe, 50);
      } else {
        clearInterval(tmr1);
        tmr1 = undefined;
      }
    };

    // This is a reimplementation according to my math derivation on the page
    const R1 = 1;
    const R2 = 2;
    const K1 = 150;
    const K2 = 5;
    const canvasframe = function () {
      const ctx = canvastag.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (tmr1 === undefined) {
        // only update A and B if the first animation isn't doing it already
        A += 0.07;
        B += 0.03;
      }
      // precompute cosines and sines of A, B, theta, phi, same as before
      const cA = Math.cos(A),
        sA = Math.sin(A),
        cB = Math.cos(B),
        sB = Math.sin(B);
      for (let j = 0; j < 6.28; j += 0.3) {
        // j <=> theta
        const ct = Math.cos(j),
          st = Math.sin(j); // cosine theta, sine theta
        for (i = 0; i < 6.28; i += 0.1) {
          // i <=> phi
          const sp = Math.sin(i),
            cp = Math.cos(i); // cosine phi, sine phi
          const ox = R2 + R1 * ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
            oy = R1 * st;

          const x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB; // final 3D x coordinate
          const y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB; // final 3D y
          // * size //
          const ooz = 2 / (K2 + cA * ox * sp + sA * oy); // one over z
          const xp = 300 + K1 * ooz * x; // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
          const yp = 270 - K1 * ooz * y; // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
          // luminance, scaled back to 0 to 1
          const L =
            0.7 *
            (cp * ct * sB -
              cA * ct * sp -
              sA * st +
              cB * (cA * st - ct * sA * sp));
          if (L > 0) {
            ctx.fillStyle = "rgba(255,255,255," + L + ")";
            ctx.fillRect(xp, yp, 2, 2);
          }
        }
      }
    };

    window.anim2 = function () {
      if (tmr2 === undefined) {
        tmr2 = setInterval(canvasframe, 50);
      } else {
        clearInterval(tmr2);
        tmr2 = undefined;
      }
    };

    anim1();
    anim2();
  };

  window.addEventListener("load", _onload, false);
})();
