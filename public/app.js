document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phoneNumber = document.getElementById('signupPhoneNumber').value;
    const dob = document.getElementById('signupDob').value;
    const monthlySalary = document.getElementById('signupMonthlySalary').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phoneNumber, dob, monthlySalary, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        console.log(data);
        alert('Signup successful');
    } catch (error) {
        console.error(error);
        alert(`Signup failed: ${error.message}`);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        displayUserData();
        console.log(data);
        alert('Login successful');
    } catch (error) {
        console.error(error);
        alert(`Login failed: ${error.message}`);
    }
});

document.getElementById('borrowForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('borrowAmount').value;
    const tenure = document.getElementById('borrowTenure').value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please login first');
        return;
    }

    try {
        const response = await fetch('/api/borrow', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ amount, tenure })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        document.getElementById('borrowData').innerText = JSON.stringify(data, null, 2);
        console.log(data);
        alert('Borrow successful');
    } catch (error) {
        console.error(error);
        alert(`Borrow failed: ${error.message}`);
    }
});

async function displayUserData() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('No token found');
        alert('Please login first');
        return;
    }

    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        document.getElementById('userData').innerText = JSON.stringify(data, null, 2);
        console.log(data);
    } catch (error) {
        console.error(error);
        alert(`Failed to fetch user data: ${error.message}`);
    }
}
