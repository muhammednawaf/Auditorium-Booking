function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleResetPassword(event) {
    
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    
    const loginData = { email, password };

    try {
        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = data.redirect; // Redirect to homepage
        } else {
            document.getElementById("errorMessage").innerText = data.error;
            document.getElementById("errorMessage").style.display = "block";
        }
    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("errorMessage").innerText = "Server Error!";
        document.getElementById("errorMessage").style.display = "block";
    }
    
    // Reset error messages
    hideError();
    hideSuccess();

    // Validate email
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Validate password

    // Validate password match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

   
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    return emailPattern.test(email);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function hideSuccess() {
    document.getElementById('successMessage').style.display = 'none';
}


async function handleforgot(event) {
    event.preventDefault();
    console.log("hai")

    const email = document.getElementById("email").value.trim(); // Get email from input

    showNotification("Processing request...");

    try {
        const response = await fetch("/forgot-password", {
            method: "POST",  // ✅ Changed to POST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }) // ✅ Send email in request body
        });

        const data = await response.json();

        if (response.ok) {
            showNotification("Reset token sent to email successfully!");

            // Delay before redirecting
            setTimeout(() => {
                window.location.href = "/reset-password"; // Change URL as needed
            }, 2000);
        } else {
            showNotification(data.message || "Failed to send reset token.");
        }
    } catch (error) {
        console.error("Forgot Password Error:", error);
        showNotification("An error occurred. Please try again.");
    }
}

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

async function handleReset(event) {
    event.preventDefault();
    console.log("🔹 Reset button clicked!")

    const token = document.getElementById("token").value;
    const newPassword = document.getElementById("newPassword").value.trim();

    const response = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();

    if (response.ok) {
        showNotification(data.message); // ✅ Show success message

        // Delay redirection to allow user to see the message
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    } else {
        showNotification(data.message); // Show error message if any
    }
};

// ✅ Function to Show Notification Message



