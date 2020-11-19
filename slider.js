class Slider {
  
  constructor({ selector, sliders }) {
    this.selector = selector;
    this.wrapper = document.querySelector(this.selector); 
    this.sliders = sliders;
    this.width = 600;
    this.height = 600;
    this.pi2 = 2 * Math.Pi;
    this.arcLength = 10;
    this.arcSpacing = 1;
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

    // Start drawing sliders.
    this.sliders.forEach((slider, index) => this.drawSlider(svg, slider, index));
  }

  drawSlider(svg, slider, index) {
    // Defaults.
    slider.radius = slider.radius ?? 50;
    slider.min = slider.min ?? 0;
    slider.max = slider.max ?? 100;
    slider.step = slider.step ?? 5;
    slider.initialVal = slider.initialVal ?? 0;

    const circumf = slider.radius * this.pi2;
    const initialAngle = Math.floor( (slider.initialVal / (slider.max - slider.min)) * 360 );

    const arcSpacing = this.calculateArcSpacing(circumf, this.arcLength, this.arcSpacing);

    return;
  }

  calculateArcSpacing(circumf, arcLength, arcSpacing) {
    return;
  }

}
