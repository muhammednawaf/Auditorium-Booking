// Function to show notification
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


// Sidebar toggle functionality
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
let isSidebarOpen = false;

function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('active', isSidebarOpen);
    overlay.classList.toggle('active', isSidebarOpen);
    menuToggle.setAttribute('aria-expanded', isSidebarOpen);
}

// Event listeners
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
});

overlay.addEventListener('click', () => {
    if (isSidebarOpen) {
        toggleSidebar();
    }
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (isSidebarOpen && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleSidebar();
    }
});

// Section switching functionality
function showSection(sectionName) {
    const sections = document.querySelectorAll('.main-content > div');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Update active button
    const buttons = document.querySelectorAll('.sidebar-menu button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const clickedButton = event.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768 && isSidebarOpen) {
        toggleSidebar();
    }
}

// Form submission handlers

// Image upload preview


// Add keydown event listener for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSidebarOpen) {
        toggleSidebar();
    }
});



    // Reject button click handler
   

function checkMaxLength(input) {
    const maxLength = input.getAttribute('maxlength');
    const currentLength = input.value.length;
    const message = document.getElementById('message');
    console.log("hai")

    if (currentLength >= maxLength) {
        message.style.display = 'block'; // Show the message
    } else {
        message.style.display = 'none'; // Hide the message
    }
}



 


$(document).ready( function () {
    $('#admins-table').DataTable();
} );

document.addEventListener("DOMContentLoaded", function () {
    const adminTable = document.getElementById("admins-table");

    if (adminTable) {
        adminTable.addEventListener("click", function (event) {
            if (event.target.classList.contains("btn-delete")) {
                const adminId = event.target.dataset.id;

                if (confirm("Are you sure you want to delete this admin?")) {
                    fetch(`/admin/delete-admin/${adminId}`, {
                        method: "DELETE",
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                showNotification('Admin deleted successfully');
                                event.target.closest("tr").remove();
                            } else {
                                alert("Failed to delete admin.");
                            }
                        })
                        .catch((error) => console.error("Error:", error));
                }
            }
        });
    }
});

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


function updateStatusColors() {
    const statusBadges = document.querySelectorAll('[data-label="Status"]');
    
    statusBadges.forEach(badge => {
        const status = badge.querySelector('.status-badge').textContent.trim().toLowerCase();
        
        const colorMap = {
            'pending': {
                background: '#fff4e0',
                color: '#ff9800',
                border: '#ffd180'
            },
            'paid': {
                background: '#e8f5e9',
                color: '#2e7d32',
                border: '#81c784'
            },
            'failed': {
                background: '#ffebee',
                color: '#d32f2f',
                border: '#ef5350'
            },
            'approved': {
                background: '#e8f5e9',
                color: '#2e7d32',
                border: '#81c784'
            },
            'rejected': {
                background: '#ffebee',
                color: '#d32f2f',
                border: '#ef5350'
            },
            'processing': {
                background: '#e3f2fd',
                color: '#1976d2',
                border: '#64b5f6'
            }
        };

        const statusStyle = colorMap[status] || colorMap['pending'];
        
        badge.querySelector('.status-badge').style.backgroundColor = statusStyle.background;
        badge.querySelector('.status-badge').style.color = statusStyle.color;
        badge.querySelector('.status-badge').style.border = `1px solid ${statusStyle.border}`;
    });
}

// Call this function after loading bookings or when status changes
document.addEventListener('DOMContentLoaded', updateStatusColors);