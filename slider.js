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
        this.createValueUI();

        const svgContainer = document.createElement('div');
        svgContainer.classList.add('slider');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('height', this.sliderWidth);
        svg.setAttribute('width', this.sliderHeight);
        svgContainer.appendChild(svg);
        this.container.appendChild(svgContainer);

        this.sliders.forEach((slider, index) => this.drawSlider(svg, slider, index));

        svgContainer.addEventListener('mousedown', this.mouseStart.bind(this), false);
        svgContainer.addEventListener('touchstart', this.mouseStart.bind(this), false);
        svgContainer.addEventListener('mousemove', this.mouseMove.bind(this), false);
        svgContainer.addEventListener('touchmove', this.mouseMove.bind(this), false);
        window.addEventListener('mouseup', this.mouseEnd.bind(this), false);
        window.addEventListener('touchend', this.mouseEnd.bind(this), false);
    }

    drawSlider(svg, slider, index) {
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
        sliderGroup.setAttribute('data-slider', index);
        sliderGroup.setAttribute('rad', slider.radius);
        svg.appendChild(sliderGroup);

        this.drawPath(slider.radius, 360, sliderGroup, "grey", 'back');
        this.drawPath(slider.radius, 0, sliderGroup, slider.color, 'front');

        this.drawHandle(slider, initialAngle, sliderGroup);
    }

    drawPath(radius, angle, group, color, type) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const pathClass = (type === 'front') ? 'sliderSinglePathActive' : 'sliderSinglePath';
        path.classList.add(pathClass);
        path.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, angle));
        path.style.stroke = color;
        path.style.strokeWidth = 30;
        path.style.fill = 'none';
        group.appendChild(path);
    }

    drawHandle(slider, initialAngle, group) {
        const handleCenter = this.calculateHandleCenter(initialAngle * this.tau / 360, slider.radius);
        const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        handle.setAttribute('class', 'handle');
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

    mouseStart(e) {
        if (this.mouseDown) return;
        this.mouseDown = true;
        const rmc = this.getMouseCoordinates(e);
        this.closestSlider(rmc);
        this.redrawSlider(rmc);
    }

    mouseMove(e) {
        if (!this.mouseDown) return;
        e.preventDefault();
        const rmc = this.getMouseCoordinates(e);
        this.redrawSlider(rmc);
    }

    mouseEnd() {
        if (!this.mouseDown) return;
        this.mouseDown = false;
        this.activeSlider = null;
    }

    redrawSlider(rmc) {
        const activePath = this.activeSlider.querySelector('.sliderSinglePathActive');
        const radius = +this.activeSlider.getAttribute('rad');
        const currentAngle = this.calculateMouseAngle(rmc) * 0.999;

        // Redraw active path
        activePath.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, this.radiansToDegrees(currentAngle)));

        // Redraw handle
        const handle = this.activeSlider.querySelector('.handle');
        const handleCenter = this.calculateHandleCenter(currentAngle, radius);
        handle.setAttribute('cx', handleCenter.x);
        handle.setAttribute('cy', handleCenter.y);

        this.updateValueUI(currentAngle);
    }

    updateValueUI(currentAngle) {
        const sliderIndex = this.activeSlider.getAttribute('data-slider');
        const targetUi = document.querySelector(`li[data-slider="${sliderIndex}"] .slider-val`);
        const currentSlider = this.sliders[sliderIndex];
        const currentSliderRange = currentSlider.max - currentSlider.min;

        let currentValue = currentAngle / this.tau * currentSliderRange;
        const numOfSteps =  Math.round(currentValue / currentSlider.step);
        currentValue = currentSlider.min + numOfSteps * currentSlider.step;

        targetUi.innerText = currentValue;
    }

    getMouseCoordinates (e) {   
        const containerRect = document.querySelector('.slider').getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        return { x, y };
    }

    calculateMouseAngle(rmc) {
        const angle = Math.atan2(rmc.y - this.cy, rmc.x - this.cx);
        if (angle > - this.tau / 2 && angle < - this.tau / 4) {
            return angle + this.tau * 1.25;
        } else {
            return angle + this.tau * 0.25;
        }
    }

    radiansToDegrees(angle) {
        return angle / (Math.PI / 180);
    }

    closestSlider(rmc) {
        const mouseDistanceFromCenter = Math.hypot(rmc.x - this.cx, rmc.y - this.cy);
        const container = document.querySelector('.slider');
        const sliderGroups = Array.from(container.querySelectorAll('g'));

        // Get distances from client coordinates to each slider
        const distances = sliderGroups.map(slider => {
            const rad = parseInt(slider.getAttribute('rad'));
            return Math.min( Math.abs(mouseDistanceFromCenter - rad) );
        });

        // Find closest slider
        const closestSliderIndex = distances.indexOf(Math.min(...distances));
        this.activeSlider = sliderGroups[closestSliderIndex];
    }

    createValueUI() {
        const ui_wrapper = document.createElement('ul');

        this.sliders.forEach((slider, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-slider', index);

            const sliderValue = document.createElement('span');
            sliderValue.classList.add('slider-val');
            sliderValue.innerText = slider.initialValue ?? 0;
            li.appendChild(sliderValue);

            const sliderName = document.createElement('span');
            sliderName.innerText = slider.id ?? 'Unknown';
            li.appendChild(sliderName);

            ui_wrapper.appendChild(li);
        });

        this.container.appendChild(ui_wrapper);
    }
}
