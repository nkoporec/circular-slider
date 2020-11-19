class Slider {
  
  constructor({ selector, sliders }) {
    this.selector = selector;
    this.wrapper = document.querySelector(this.selector); 
    this.sliders = sliders;
    this.width = 600;
    this.height = 600;
  }

  init() {
    const svgWrap = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // Basic svg attributes.
    svg.setAttribute('height', this.width);
    svg.setAttribute('width', this.height);

    // Append the new svg el.
    svgWrap.appendChild(svg);
    this.wrapper.appendChild(svgWrap);
  }
}
