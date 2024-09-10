document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerSection = document.getElementById('register-section');
    const authSection = document.getElementById('auth-section');
    const appContent = document.getElementById('app-content');
    const logoutBtn = document.getElementById('logout-btn');
    const showRegisterFormBtn = document.getElementById('show-register-form');
    const cancelRegistrationBtn = document.getElementById('cancel-registration');
    const calculateBtn = document.getElementById('calculate-btn');
    const totalEmissions = document.getElementById('total-emissions');
    const emissionChartCtx = document.getElementById('emissionChart').getContext('2d');
    const emissionChart = new Chart(emissionChartCtx, {
        type: 'bar',
        data: {
            labels: ['Excavation', 'Transportation', 'Equipment'],
            datasets: [{
                label: 'Carbon Emissions (tons CO2)',
                data: [0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    const offsetBtn = document.getElementById('offset-calculate-btn');
    const carbonOffset = document.getElementById('carbon-offset');
    let emissionHistory = JSON.parse(localStorage.getItem('emissionHistory')) || [];
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(progressCtx, {
        type: 'bar',
        data: {
            labels: emissionHistory.map((_, idx) => `Session ${idx + 1}`),
            datasets: [{
                label: 'Total Emissions Over Time (tons CO2)',
                data: emissionHistory,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });

    document.getElementById('cleaner-tech-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const machineryType = document.getElementById('machinery-type').value;
        const reduction = machineryType === 'electric' ? '30% reduction in emissions' : 'No reduction in emissions';
        document.getElementById('cleaner-tech-result').innerText = `Estimated Emission Reduction: ${reduction}`;
    });

    document.getElementById('afforestation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const landSize = parseFloat(document.getElementById('land-size').value);
        const sequestrationRate = 10; 
        const sequestration = landSize * sequestrationRate;
        document.getElementById('afforestation-result').innerText = `Estimated CO₂ Sequestration: ${sequestration} tons per year`;
    });

    document.getElementById('renewable-energy-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const energySource = document.getElementById('energy-source').value;
        let savings = '';
        switch (energySource) {
            case 'solar': savings = '20% reduction in electricity consumption'; break;
            case 'wind': savings = '25% reduction'; break;
            case 'hydro': savings = '15% reduction'; break;
            default: savings = 'Unknown energy source';
        }
        document.getElementById('renewable-energy-result').innerText = `Estimated Energy Savings: ${savings}`;
    });

    showRegisterFormBtn.addEventListener('click', () => {
        authSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    cancelRegistrationBtn.addEventListener('click', () => {
        registerSection.style.display = 'none';
        authSection.style.display = 'block';
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        if (localStorage.getItem(username)) {
            alert("Username already exists.");
        } else {
            localStorage.setItem(username, password);
            alert(`User ${username} registered successfully!`);
            registerSection.style.display = 'none';
            authSection.style.display = 'block';
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        if (localStorage.getItem(username) === password) {
            alert(`Logged in as ${username}`);
            authSection.style.display = 'none';
            appContent.style.display = 'block';
            logoutBtn.style.display = 'block';
            localStorage.setItem('loggedInUser', username);
        } else {
            alert("Invalid username or password.");
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        authSection.style.display = 'block';
        appContent.style.display = 'none';
        logoutBtn.style.display = 'none';
    });

    calculateBtn.addEventListener('click', () => {
        const excavationAmount = parseFloat(document.getElementById('excavation-amount').value);
        const transportationDistance = parseFloat(document.getElementById('transportation-distance').value);
        const equipmentUsage = parseFloat(document.getElementById('equipment-usage').value);
        const excavationEmissions = excavationAmount * 0.1;
        const transportationEmissions = transportationDistance * 0.05;
        const equipmentEmissions = equipmentUsage * 0.02;
        const total = excavationEmissions + transportationEmissions + equipmentEmissions;
        totalEmissions.textContent = total.toFixed(2);
        emissionChart.data.datasets[0].data = [excavationEmissions, transportationEmissions, equipmentEmissions];
        emissionChart.update();

        const suggestions = document.getElementById('suggestions');
        suggestions.innerHTML = `
            <h3>Suggestions</h3>
            <ul>
                <li>Consider using cleaner technologies for equipment.</li>
                <li>Optimize transportation routes.</li>
                <li>Explore alternative energy for excavation.</li>
            </ul>
        `;

        emissionHistory.push(total);
        localStorage.setItem('emissionHistory', JSON.stringify(emissionHistory));
        progressChart.data.labels = emissionHistory.map((_, idx) => `Session ${idx + 1}`);
        progressChart.data.datasets[0].data = emissionHistory;
        progressChart.update();
    });

    offsetBtn.addEventListener('click', () => {
        const treesPlanted = parseFloat(document.getElementById('trees-planted').value);
        const offsetPerTree = 0.02;
        const offset = treesPlanted * offsetPerTree;
        carbonOffset.textContent = offset.toFixed(2);
    });
});
