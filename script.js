document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Toggle sidebar (works on all pages)
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (!sidebar.contains(event.target) && event.target !== menuBtn) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Normal Calculator Logic (only on normal.html)
    if (document.getElementById('normalScreen')) {
        const normalScreen = document.getElementById('normalScreen');
        const calculatorKeys = document.querySelector('.calculator-keys');
        
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;
        
        function updateScreen() {
            normalScreen.value = currentInput;
        }
        
        calculatorKeys.addEventListener('click', function(e) {
            if (e.target.matches('button')) {
                const value = e.target.value;
                
                if (value >= '0' && value <= '9') {
                    if (currentInput === '0' || resetScreen) {
                        currentInput = value;
                        resetScreen = false;
                    } else {
                        currentInput += value;
                    }
                    updateScreen();
                } else if (value === '.') {
                    if (!currentInput.includes('.')) {
                        currentInput += '.';
                        updateScreen();
                    }
                } else if (value === 'all-clear') {
                    currentInput = '0';
                    previousInput = '';
                    operation = null;
                    updateScreen();
                } else if (value === '+' || value === '-' || value === '*' || value === '/') {
                    if (operation !== null) calculate();
                    previousInput = currentInput;
                    operation = value;
                    resetScreen = true;
                } else if (value === '=') {
                    calculate();
                    operation = null;
                }
            }
        });
        
        function calculate() {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev)) return;
            
            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            previousInput = '';
            resetScreen = true;
            updateScreen();
        }
    }

    // Age Calculator Logic (only on age.html)
    if (document.getElementById('calculateAge')) {
        const calculateAgeBtn = document.getElementById('calculateAge');
        const birthDateInput = document.getElementById('birthDate');
        const ageResult = document.getElementById('ageResult');
        
        calculateAgeBtn.addEventListener('click', function() {
            const birthDate = new Date(birthDateInput.value);
            const today = new Date();
            
            if (isNaN(birthDate.getTime())) {
                ageResult.textContent = 'Please enter a valid date';
                return;
            }
            
            if (birthDate > today) {
                ageResult.textContent = 'Birth date cannot be in the future';
                return;
            }
            
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            // Calculate months and days
            let months, days;
            if (today.getMonth() >= birthDate.getMonth()) {
                months = today.getMonth() - birthDate.getMonth();
            } else {
                months = 12 + today.getMonth() - birthDate.getMonth();
            }
            
            if (today.getDate() >= birthDate.getDate()) {
                days = today.getDate() - birthDate.getDate();
            } else {
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDate.getDate());
                days = Math.floor((today - lastMonth) / (1000 * 60 * 60 * 24));
                months--;
            }
            
            ageResult.innerHTML = `
                <strong>Your age is:</strong><br>
                ${age} years, ${months} months, and ${days} days<br>
                or ${age} years<br>
                or ${age * 12 + months} months<br>
                or ${Math.floor((today - birthDate) / (1000 * 60 * 60 * 24))} days
            `;
        });
    }

    // EMI Calculator Logic (only on emi.html)
    if (document.getElementById('calculateEMI')) {
        const calculateEMIBtn = document.getElementById('calculateEMI');
        const loanAmountInput = document.getElementById('loanAmount');
        const interestRateInput = document.getElementById('interestRate');
        const loanTenureInput = document.getElementById('loanTenure');
        const monthlyEMI = document.getElementById('monthlyEMI');
        const totalInterest = document.getElementById('totalInterest');
        const totalPayment = document.getElementById('totalPayment');
        
        calculateEMIBtn.addEventListener('click', function() {
            const principal = parseFloat(loanAmountInput.value);
            const interest = parseFloat(interestRateInput.value) / 100 / 12;
            const payments = parseFloat(loanTenureInput.value) * 12;
            
            if (isNaN(principal)) {
                alert('Please enter a valid loan amount');
                return;
            }
            
            if (isNaN(interest)) {
                alert('Please enter a valid interest rate');
                return;
            }
            
            if (isNaN(payments)) {
                alert('Please enter a valid loan tenure');
                return;
            }
            
            // Calculate EMI
            const x = Math.pow(1 + interest, payments);
            const emi = (principal * interest * x) / (x - 1);
            
            // Calculate total payment and total interest
            const total = emi * payments;
            const totalInt = total - principal;
            
            // Display results
            monthlyEMI.textContent = `Monthly EMI: ₹${emi.toFixed(2)}`;
            totalInterest.textContent = `Total Interest: ₹${totalInt.toFixed(2)}`;
            totalPayment.textContent = `Total Payment: ₹${total.toFixed(2)}`;
        });
    }
});