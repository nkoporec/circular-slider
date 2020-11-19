class Slider {

    constructor({ selector, sliders }) {
        this.selector = selector;
        this.container = document.querySelector(this.selector);
        this.sliderWidth = 400;
        this.sliderHeight = 400;
        this.cx = this.sliderWidth / 2;
        this.cy = this.sliderHeight / 2;
        this.tau = Math.PI * 2;
        this.sliders = sliders;
    }

    init() {
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('slider__data');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', this.sliderWidth);
        svg.setAttribute('width', this.sliderHeight);
        svgContainer.appendChild(svg);
        this.container.appendChild(svgContainer);

        this.sliders.forEach((slider) => this.drawSlider(svg, slider));
    }

    drawSlider(svg, slider) {
        // Defaults.
        slider.radius = slider.radius ?? 50;
        slider.min = slider.min ?? 0;
        slider.max = slider.max ?? 1000;
        slider.step = slider.step ?? 50;
        slider.initialValue = slider.initialValue ?? 0;
        slider.color = slider.color ?? '#FF5733';

        const initialAngle = Math.floor( (slider.initialValue / (slider.max - slider.min)) * 360 );
        const sliderGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        sliderGroup.setAttribute('transform', 'rotate(-90,' + this.cx + ',' + this.cy + ')');
        sliderGroup.setAttribute('rad', slider.radius);
        svg.appendChild(sliderGroup);

        this.drawPath(slider.radius, 360, sliderGroup, slider.color);
        this.drawHandle(slider, initialAngle, sliderGroup);
    }

    drawPath(radius, angle, group, color) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, angle));
        path.style.stroke = color;
        path.style.strokeWidth = 30;
        path.style.fill = 'none';
        group.appendChild(path);
    }

    drawHandle(slider, initialAngle, group) {
        const handleCenter = this.calculateHandleCenter(initialAngle * this.tau / 360, slider.radius);
        const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        handle.setAttribute('class', 'sliderHandle');
        handle.setAttribute('cx', handleCenter.x);
        handle.setAttribute('cy', handleCenter.y);
        handle.setAttribute('r', 12.5);
        handle.style.stroke = "#888888";
        handle.style.strokeWidth = 3;
        handle.style.fill = '#fff';

        group.appendChild(handle);
    }

    describeArc (x, y, radius, startAngle, endAngle) {
        let endAngleOriginal, start, end, arcSweep, path;
        endAngleOriginal = endAngle;

        if(endAngleOriginal - startAngle === 360){
            endAngle = 359;
        }

        start = this.polarToCartesian(x, y, radius, endAngle);
        end = this.polarToCartesian(x, y, radius, startAngle);
        arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        if (endAngleOriginal - startAngle === 360) {
            path = [
                'M', start.x, start.y,
                'A', radius, radius, 0, arcSweep, 0, end.x, end.y, 'z'
            ].join(' ');
        } else {
            path = [
                'M', start.x, start.y,
                'A', radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(' ');
        }

        return path;
    }

    polarToCartesian (centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = angleInDegrees * Math.PI / 180;
        const x = centerX + (radius * Math.cos(angleInRadians));
        const y = centerY + (radius * Math.sin(angleInRadians));
        return {x, y};
    }

    calculateHandleCenter (angle, radius) {
        const x = this.cx + Math.cos(angle) * radius;
        const y = this.cy + Math.sin(angle) * radius;
        return {x, y};
    }

}
