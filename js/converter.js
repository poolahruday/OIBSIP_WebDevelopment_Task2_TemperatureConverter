/**
 * Temperature Converter - SHOWS ALL 3 UNITS SIMULTANEOUSLY
 */

class TemperatureConverter {
    constructor() {
        this.currentInputUnit = 'celsius';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Unit selector buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleUnitSelect(e));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleUnitSelect(e);
                }
            });
        });

        // Live conversion on input
        document.getElementById('temperatureInput').addEventListener('input', (e) => {
            this.clearError();
            if (e.target.value.trim()) {
                this.convertLive(parseFloat(e.target.value));
            } else {
                this.clearResults();
            }
        });

        // Form submission (for Enter key)
        document.querySelector('.input-group').addEventListener('submit', (e) => {
            e.preventDefault();
            this.convertTemperature();
        });
    }

    handleUnitSelect(event) {
        const btn = event.currentTarget;
        const unit = btn.dataset.unit;

        // Update active state
        document.querySelectorAll('.unit-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        
        this.currentInputUnit = unit;
        
        // Reconvert if there's input
        const inputValue = document.getElementById('temperatureInput').value.trim();
        if (inputValue) {
            this.convertLive(parseFloat(inputValue));
        }
    }

    validateInput(value) {
        return !isNaN(value) && isFinite(value);
    }

    clearError() {
        const input = document.getElementById('temperatureInput');
        const error = document.getElementById('error-message');
        input.classList.remove('error');
        error.style.display = 'none';
    }

    showError() {
        const input = document.getElementById('temperatureInput');
        const error = document.getElementById('error-message');
        input.classList.add('error');
        error.style.display = 'block';
    }

    showLoading() {
        const btn = document.getElementById('convertBtn');
        btn.classList.add('loading');
        btn.disabled = true;
    }

    hideLoading() {
        const btn = document.getElementById('convertBtn');
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.textContent = 'Show All Units';
    }

    convertLive(value) {
        if (!this.validateInput(value)) return;
        this.convertAllUnits(value);
    }

    convertTemperature() {
        const inputValue = parseFloat(document.getElementById('temperatureInput').value);
        if (!this.validateInput(inputValue)) {
            this.showError();
            return;
        }
        this.clearError();
        this.showLoading();
        
        setTimeout(() => {
            this.convertAllUnits(inputValue);
            this.hideLoading();
        }, 200);
    }

    convertAllUnits(inputValue) {
        // Convert input to Celsius first
        let celsius = this.toCelsius(inputValue, this.currentInputUnit);
        
        // Convert Celsius to all units
        const celsiusValue = parseFloat(celsius.toFixed(2));
        const fahrenheitValue = parseFloat(this.fromCelsius(celsius, 'fahrenheit').toFixed(2));
        const kelvinValue = parseFloat(this.fromCelsius(celsius, 'kelvin').toFixed(2));

        // Update ALL result displays
        this.updateResult('celsius', celsiusValue);
        this.updateResult('fahrenheit', fahrenheitValue);
        this.updateResult('kelvin', kelvinValue);

        // Show input unit as active
        document.querySelectorAll('.result-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-unit="${this.currentInputUnit}"]`).classList.add('active');

        // Show result section
        document.getElementById('resultSection').classList.add('show');
    }

    toCelsius(value, unit) {
        switch (unit) {
            case 'celsius': return value;
            case 'fahrenheit': return (value - 32) * 5 / 9;
            case 'kelvin': return value - 273.15;
        }
    }

    fromCelsius(celsius, unit) {
        switch (unit) {
            case 'celsius': return celsius;
            case 'fahrenheit': return (celsius * 9 / 5) + 32;
            case 'kelvin': return celsius + 273.15;
        }
    }

    updateResult(unit, value) {
        document.getElementById(`result${unit.charAt(0).toUpperCase() + unit.slice(1)}`).textContent = value;
    }

    clearResults() {
        document.getElementById('resultCelsius').textContent = '--';
        document.getElementById('resultFahrenheit').textContent = '--';
        document.getElementById('resultKelvin').textContent = '--';
        document.getElementById('resultSection').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});
