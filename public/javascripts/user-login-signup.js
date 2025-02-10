function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        padding: 1rem;
        background: #4CAF50;
        color: white;
        border-radius: 8px;
        z-index: 1000;
        text-align: center;
        font-size: 1rem;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    `;

    // Check screen width to determine position
    if (window.innerWidth <= 768) {
        // Mobile: Centered
        notification.style.left = "20px";
        notification.style.right = "20px";
        notification.style.maxWidth = "300px";
        notification.style.margin = "auto";
    } else {
        // Desktop: Right side
        notification.style.right = "20px";
        notification.style.minWidth = "250px";
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for smooth appearance and disappearance
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-50px); opacity: 0; }
    }
`;
document.head.appendChild(style);


function showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
}

function clearError() {
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.innerText = "";
    errorDiv.style.display = "none";
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailPattern.test(email);
}


function validatePassword(password) {
    if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        showError("Password must contain at least one uppercase letter.");
        return false;
    }
    if (!/[a-z]/.test(password)) {
        showError("Password must contain at least one lowercase letter.");
        return false;
    }
    if (!/[0-9]/.test(password)) {
        showError("Password must contain at least one number.");
        return false;
    }
    if (!/[@$!%*?&]/.test(password)) {
        showError("Password must contain at least one special character.");
        return false;
    }
    return true;
}

function sanitizeInput(input) {
    return input.replace(/[^\w\s@.-]/gi, "");
}

async function handleLogin(event) {
    event.preventDefault();
    clearError();  // Clear previous errors

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!validateEmail(email)) {
        showError("Invalid email format");
        return;
    }
    /*if (!validatePassword(password)) {
        return;
    }*/

    email = sanitizeInput(email);
    password = sanitizeInput(password);

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showNotification("Login Successfully");
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1000);
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError("Server Error! Please try again later.");
    }
}

async function handleSignup(event) {
    event.preventDefault();
    clearError();  // Clear previous errors

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!fullName) {
        showError("Full Name is required.");
        return;
    }
    if (!validateEmail(email)) {
        showError("Invalid email format");
        return;
    }
    if (!validatePassword(password)) {
        return;
    }
    

    fullName = sanitizeInput(fullName);
    email = sanitizeInput(email);
    password = sanitizeInput(password);

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(data.message);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError("Server Error! Please try again later.");
    }
}

