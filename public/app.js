// Event listener for the signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally

    // Collect the input values from the form
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phoneNumber = document.getElementById('signupPhoneNumber').value;
    const dob = document.getElementById('signupDob').value;
    const monthlySalary = document.getElementById('signupMonthlySalary').value;
    const password = document.getElementById('signupPassword').value;

    try {
        // Send a POST request to the signup API endpoint
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phoneNumber, dob, monthlySalary, password })
        });

        // Parse the JSON response
        const data = await response.json();
        if (!response.ok) throw new Error(data.message); // Check if the response is not OK and throw an error if so

        console.log(data); // Log the response data
        alert('Signup successful'); // Display a success message
    } catch (error) {
        console.error(error); // Log any errors
        alert(`Signup failed: ${error.message}`); // Display an error message
    }
});

// Event listener for the login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally

    // Collect the input values from the form
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Send a POST request to the login API endpoint
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Parse the JSON response
        const data = await response.json();
        if (!response.ok) throw new Error(data.message); // Check if the response is not OK and throw an error if so

        localStorage.setItem('token', data.token); // Store the token in localStorage
        displayUserData(); // Display the user data
        console.log(data); // Log the response data
        alert('Login successful'); // Display a success message
    } catch (error) {
        console.error(error); // Log any errors
        alert(`Login failed: ${error.message}`); // Display an error message
    }
});

// Event listener for the borrow form submission
document.getElementById('borrowForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally

    // Collect the input values from the form
    const amount = document.getElementById('borrowAmount').value;
    const tenure = document.getElementById('borrowTenure').value;
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        alert('Please login first'); // Alert the user if they are not logged in
        return;
    }

    try {
        // Send a POST request to the borrow API endpoint
        const response = await fetch('/api/borrow', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // Include the token in the request headers
            },
            body: JSON.stringify({ amount, tenure })
        });

        // Parse the JSON response
        const data = await response.json();
        if (!response.ok) throw new Error(data.message); // Check if the response is not OK and throw an error if so

        document.getElementById('borrowData').innerText = JSON.stringify(data, null, 2); // Display the response data
        console.log(data); // Log the response data
        alert('Borrow successful'); // Display a success message
    } catch (error) {
        console.error(error); // Log any errors
        alert(`Borrow failed: ${error.message}`); // Display an error message
    }
});

// Function to display user data
async function displayUserData() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        console.log('No token found'); // Log if no token is found
        alert('Please login first'); // Alert the user if they are not logged in
        return;
    }

    try {
        // Send a GET request to the user API endpoint
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // Include the token in the request headers
            }
        });

        // Parse the JSON response
        const data = await response.json();
        if (!response.ok) throw new Error(data.message); // Check if the response is not OK and throw an error if so

        document.getElementById('userData').innerText = JSON.stringify(data, null, 2); // Display the user data
        console.log(data); // Log the response data
    } catch (error) {
        console.error(error); // Log any errors
        alert(`Failed to fetch user data: ${error.message}`); // Display an error message
    }
}
