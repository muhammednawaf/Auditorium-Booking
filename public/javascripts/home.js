document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navigation = document.getElementById('navigation');
    const navigationOverlay = document.getElementById('navigationOverlay');

    menuToggle.addEventListener('click', () => {
        navigation.classList.toggle('active');
        navigationOverlay.classList.toggle('active');
    });

    navigationOverlay.addEventListener('click', () => {
        navigation.classList.remove('active');
        navigationOverlay.classList.remove('active');
    });
});

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

async function handleLogout(event) {
    event.preventDefault();

    try {
        const response = await fetch("/logout", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        // Instead of expecting JSON, handle the redirect manually
        if (response.redirected) {
            showNotification("Logout Successful!");

            // Delay before redirecting
            setTimeout(() => {
                window.location.href = response.url; // Redirect to homepage/login page
            }, 1000);
        }
    } catch (error) {
        console.error("Logout Error:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const userBtn = document.querySelector('.user-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    const mobileUserMenu = document.querySelector('.user-menu');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const userBtns = document.querySelectorAll('.user-btn');
    
    userBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dropdown = this.nextElementSibling; // Find the dropdown menu
            const isVisible = dropdown.style.display === 'block';
            
            // Toggle dropdown visibility
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    });
});

