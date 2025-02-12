 // Sample admin credentials (In real application, this should be handled securely on the server)
 async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const loginData = { username, password };

    try {
        const response = await fetch("/admin/admin-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            showNotification("Login Successfull!")
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 500);
            // Redirect to homepage
        } else {
            document.getElementById("errorMessage").innerText = data.error;
            document.getElementById("errorMessage").style.display = "block";
        }
    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("errorMessage").innerText = "Server Error!";
        document.getElementById("errorMessage").style.display = "block";
    }
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


