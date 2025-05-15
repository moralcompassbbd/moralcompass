export function handleCredentialResponse(response: any) {
    if (!response?.credential) {
        console.error('No credential in response:', response);
        alert('Login failed: Missing credentials');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(async res => {
        if (!res.ok) {
            // Try to get error details from response
            const errorData = await res.json().catch(() => null);
            console.error('Login response not OK:', {
                status: res.status,
                statusText: res.statusText,
                errorData
            });
            throw new Error(errorData?.detail || 'Login failed');
        }
        return res.json();
    })
    .then((data) => {
        console.log('Login response:', JSON.stringify(data, null, 2));
        
        if (!data || !data.user || !data.jwt) {
            throw new Error('Invalid login response structure');
        }

        try {
            const user = typeof data.user === 'string' ? JSON.parse(data.user) : data.user;
            
            if (!user?.name) {
                throw new Error('Missing user name in response');
            }

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("jwt", data.jwt);

            // Show navigation after successful login
            document.querySelector('nav')?.classList.remove('nav-hidden');

            // Navigate to homepage with correct user data
            SPA.navigatePage('homepage', { name: user.name });
        } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            throw new Error('Failed to process user data');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
        // Hide navigation on error
        document.querySelector('nav')?.classList.add('nav-hidden');
        alert(`Failed to login: ${error.message}`);
        SPA.navigatePage('main');
    });
}

// Check auth status on page load
window.addEventListener('load', () => {
    const jwt = localStorage.getItem('jwt');
    const user = localStorage.getItem('user');

    if (jwt && user) {
        document.getElementById('nav-container')?.classList.remove('nav-hidden');
    } else {
        document.getElementById('nav-container')?.classList.add('nav-hidden');
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
    }
});
