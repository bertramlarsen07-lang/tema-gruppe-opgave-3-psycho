/* ==========================================================
   PSYCHO – OPEN AIR CINEMA
   JavaScript til introen på forsiden (bruserscenen).

   Alt indhold kan læses uden JavaScript. Uden JavaScript
   springes introen bare over.
   ========================================================== */

/* ---------- Intro på forsiden ---------- */
// Introen vises kun første gang i en session, og ikke hvis brugeren har
// slået animationer fra. Den starter først, når alle 4 billeder er hentet,
// så den aldrig viser tomme felter.
const intro = document.querySelector("#intro");

if (intro) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try {
    seen = sessionStorage.getItem("psycho-intro") === "set";
  } catch (e) {
    seen = false;
  }

  if (!prefersReducedMotion && !seen) {
    const images = Array.from(intro.querySelectorAll("img"));
    const loaded = images.map(function (img) {
      return img.decode ? img.decode() : Promise.resolve();
    });

    Promise.all(loaded)
      .then(function () {
        intro.hidden = false;
        intro.classList.add("intro--play");

        // Efter ca. 2 sekunder tones introen ud, og forsiden kommer frem
        setTimeout(function () {
          intro.classList.add("intro--done");
          intro.addEventListener("animationend", function (event) {
            // Kun når selve introen er tonet ud (ikke billedernes animationer)
            if (event.target === intro) {
              intro.remove();
            }
          });
        }, 2000);

        try {
          sessionStorage.setItem("psycho-intro", "set");
        } catch (e) {
          // Hvis lagring er blokeret, vises introen bare igen næste gang
        }
      })
      .catch(function () {
        // Et billede mangler: spring introen over
        intro.remove();
      });
  } else {
    intro.remove();
  }
}
