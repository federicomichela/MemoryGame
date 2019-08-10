function resizeSections() {
  let sections = document.getElementsByClassName("flexi-section");
  let style = `width: ${window.innerWidth}px; height: ${window.innerHeight}px;`;

  for (let section of sections)
  {
    section.style.cssText = style;
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  resizeSections();
});

window.onresize = resizeSections;
