window.showView = (viewName) => {
    // 1. Mostrar la sección
    const target = document.getElementById(`view-calculator`);
    if (target) target.classList.remove('hidden');

    // 2. Resaltar Botón Cotizar en Ámbar/Amarillo
    const btn = document.getElementById('nav-calc');
    if (btn) {
        btn.classList.remove('opacity-40');
        btn.classList.add('opacity-100');

        const icon = btn.querySelector('svg');
        const text = btn.querySelector('span');

        if (icon) {
            // Clases de Tailwind para el color base
            icon.classList.remove('text-slate-400');
            icon.classList.add('text-amber-400');
            
            // Estilos manuales para el "Glow" (brillo)
            icon.style.color = '#fbbf24'; // Color ámbar exacto
            icon.style.filter = 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))';
        }

        if (text) {
            text.classList.remove('text-slate-400');
            text.classList.add('text-amber-400');
            text.style.color = '#fbbf24';
            text.style.fontWeight = '900';
        }
    }
};

// Variable global para conectar los dos pasos
window.totalAppUSD = 0;
window.tasaCambioActual = 26.60; 
window.inversionTotalUSD_Global = 0;
window.costoAppSHEIN_Global = 0;

window.toggleShippingInput = () => {
    const isChecked = document.getElementById('toggle-shipping').checked;
    const input = document.getElementById('calc-shipping-usa');
    
    if (isChecked) {
        input.disabled = false;
        input.classList.remove('opacity-40');
        input.classList.add('opacity-100');
    } else {
        input.disabled = true;
        input.classList.remove('opacity-100');
        input.classList.add('opacity-40');
    }
};

// PASO 1: Calcular lo que se paga en la App de SHEIN
window.calcularPrecioApp = () => {
    const precioBase = parseFloat(document.getElementById('calc-price').value) || 0;
    
    // VALIDACIÓN: Solo sumar si el toggle está activo
    const shippingToggle = document.getElementById('toggle-shipping').checked;
    const envioUSA = shippingToggle ? (parseFloat(document.getElementById('calc-shipping-usa').value) || 0) : 0;

    const taxCalculado = precioBase * 0.09;
    window.totalAppUSD = precioBase + envioUSA + taxCalculado;

    // ... resto de tu código para mostrar resultados
    document.getElementById('res-val-tax').innerText = `$ ${taxCalculado.toFixed(2)}`;
    document.getElementById('res-val-total-app').innerText = `$ ${window.totalAppUSD.toFixed(2)}`;
    
    document.getElementById('result-app-step').classList.remove('hidden');
    document.getElementById('step-2-container').classList.remove('hidden');
};

// PASO 2: Calcular el precio final de reventa en Honduras
window.calcularPrecioVentaFinal = () => {
    const fleteHN = parseFloat(document.getElementById('calc-flete-hn').value) || 0;
    
    // Inversión que tú haces
    window.inversionTotalUSD_Global = window.totalAppUSD + fleteHN;

    // Lógica de utilidad automática (Paso inicial)
    let margen = 0;
    if (window.totalAppUSD <= 5) margen = 1.00;
    else if (window.totalAppUSD <= 20) margen = 0.80;
    else if (window.totalAppUSD <= 50) margen = 0.50;
    else margen = 0.40;

    // Cálculo inicial
    const gananciaUSD = window.totalAppUSD * margen;
    const utilidadLpsInicial = Math.round(gananciaUSD * window.tasaCambioActual);
    
    // Llenar el campo de utilidad (para que puedas editarlo después)
    document.getElementById('res-val-utilidad-input').value = utilidadLpsInicial;

    // Mostrar todo
    actualizarPantallaFinal(utilidadLpsInicial);
};

// ESTA ES LA FUNCIÓN MÁGICA: Si escribes en Utilidad, cambia el precio
window.recalcularDesdeUtilidad = () => {
    const nuevaUtilidadLps = parseFloat(document.getElementById('res-val-utilidad-input').value) || 0;
    actualizarPantallaFinal(nuevaUtilidadLps);
};

function actualizarPantallaFinal(utilidadLps) {
    // 1. Cálculos de base
    const gananciaUSDReal = utilidadLps / window.tasaCambioActual;
    const inversionLps = window.inversionTotalUSD_Global * window.tasaCambioActual;
    
    // 2. Precio final (Inversión + Ganancia deseada)
    const precioFinalLps = Math.ceil(inversionLps + utilidadLps);

    // 3. Cálculo del % de margen real
    const porcentajeReal = (gananciaUSDReal / window.totalAppUSD) * 100;

    // 4. MOSTRAR RESULTADOS
    document.getElementById('calc-result').classList.remove('hidden');
    
    // Precio grande arriba
    document.getElementById('res-total').value = precioFinalLps;
    
    // Inversión (Dólares y Lempiras)
    document.getElementById('res-val-costo-usd').innerText = `$ ${window.inversionTotalUSD_Global.toFixed(2)}`;
    document.getElementById('res-val-costo-lps').innerText = `L ${inversionLps.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    // Margen y Utilidad
    document.getElementById('res-val-margen').innerText = `${porcentajeReal.toFixed(0)}%`;
    // El campo de utilidad ya tiene el valor porque lo escribiste tú o se puso al inicio
}
