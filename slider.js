class Slider {
  
  constructor({ selector, sliders }) {
    this.selector = selector;
    this.wrapper = document.querySelector(this.selector); 
    this.sliders = sliders;
    this.width = 600;
    this.height = 600;
    // @TODO Replace with actual Pi.
    this.pi2 = 2 * 3,14;
    this.arcLength = 10;
    this.arcSpacing = 0.7;
    this.cx = this.sliderWidth / 2;
    this.cy = this.sliderHeight / 2;
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

    const sliderGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    sliderGroup.setAttribute('class', 'slider-single');
    sliderGroup.setAttribute('data-slider', index);
    sliderGroup.setAttribute('transform', 'rotate(-90,' + this.cx + ',' + this.cy + ')');
    sliderGroup.setAttribute('rad', slider.radius);
    svg.appendChild(sliderGroup);

    return;
  }

  calculateArcSpacing(circumf, arcLength, arcSpacing) {
    const num = Math.floor((circumf / arcLength) * arcSpacing);
    const total = circumf - num * arcLength;
    const result = total / num;
    
    return result;
  }

}
