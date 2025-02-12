document.addEventListener('DOMContentLoaded', () => {
    const bookingsTableBody = document.getElementById('bookingsTableBody');

    // Function to Fetch and Display Bookings
    function fetchBookings() {
        fetch('/admin/bookings')
            .then(response => response.json())
            .then(data => {
                bookingsTableBody.innerHTML = data.map(booking => {
                    const status = booking.status.toLowerCase();
                    const payment_status = booking.payment_status.toLowerCase();
                    const buttonState = status === 'pending' ? '' : 'disabled';
                    const buttonClass = status === 'pending' ? '' : 'disabled-btn';
                    return `
                        <tr id="booking-${booking._id}">
                            <td>${new Date(booking.date).toLocaleDateString()}</td>
                            <td>${booking.time}</td>
                            <td>${booking.auditorium}</td>
                            <td>${booking.name}</td>
                            <td>${booking.email}</td>
                            <td>${booking.phone}</td>
                            <td>${booking.department}</td>
                            <td>${booking.event}</td>
                            <td id="payment-status-${booking._id}">
                                <span class="status-badge status-${payment_status}">
                                   ${booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                                </span>
                            </td>
                            <td id="status-${booking._id}">
                                <span class="status-badge status-${status}">
                                   ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-approve ${buttonClass}" data-id="${booking._id}" ${buttonState}>Approve</button>
                                <button class="btn btn-reject ${buttonClass}" data-id="${booking._id}" ${buttonState}>Reject</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            })
            .catch(error => console.error('Error fetching bookings:', error));
    }

    // Initial fetch on page load
    fetchBookings();

    function fetchAdminBookings() {
        fetch('/admin/admin-bookings')
            .then(response => response.json())
            .then(data => {
                bookingsTableBody.innerHTML = data.map(booking => {
                    const status = booking.status.toLowerCase();
                    const payment_status = booking.payment_status.toLowerCase();
                    const buttonState = status === 'pending' ? '' : 'disabled';
                    const buttonClass = status === 'pending' ? '' : 'disabled-btn';
                    return `
                        <tr id="booking-${booking._id}">
                            <td>${new Date(booking.date).toLocaleDateString()}</td>
                            <td>${booking.time}</td>
                            <td>${booking.auditorium}</td>
                            <td>${booking.name}</td>
                            <td>${booking.email}</td>
                            <td>${booking.phone}</td>
                            <td>${booking.department}</td>
                            <td>${booking.event}</td>
                            <td id="payment-status-${booking._id}">
                                <span class="status-badge status-${payment_status}">
                                   ${booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                                </span>
                            </td>
                            <td id="status-${booking._id}">
                                <span class="status-badge status-${status}">
                                   ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('');
            })
            .catch(error => console.error('Error fetching bookings:', error));
    }

    // Initial fetch on page load
    fetchAdminBookings();

});

async function handleLogout(event) {
    event.preventDefault();

    try {
        const response = await fetch("/admin/logout", {
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



// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

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
}

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
document.getElementById('auditoriumForm')?.addEventListener('submit', function (e) {
    // Handle auditorium form submission
    showNotification('Auditorium details updated successfully');
});

document.getElementById('contentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    // Handle content form submission
    showNotification('Content updated successfully');
});

// Image upload preview
document.getElementById('auditoriumImages')?.addEventListener('change', function (e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(this.files).forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'preview-image';
        preview.appendChild(img);
    });
});


// Add keydown event listener for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSidebarOpen) {
        toggleSidebar();
    }
});


$(document).ready(function () {
    $(document).on('click', '.btn-approve', function () {
        const bookingId = $(this).data('id'); // Get booking ID

        $.ajax({
            url: `/admin/bookings/${bookingId}/approve`,
            type: 'PUT',
            success: function (data) {
                if (data.status === 'Approved') {
                    // Update status text and badge color
                    $(`#status-${bookingId} .status-badge`)
                        .text('Approved')
                        .removeClass('status-pending status-rejected')
                        .addClass('status-approved');  // Green background

                    // Disable both buttons and apply disabled style
                    $(`#booking-${bookingId} .btn-approve, #booking-${bookingId} .btn-reject`)
                        .prop('disabled', true)
                        .addClass('disabled-btn');

                    showNotification('Booking approved successfully');
                } else {
                    alert(data.error || 'Failed to approve booking');
                }
            },
            error: function (error) {
                console.error('Error approving booking:', error);
            },
        });
    });

    $(document).on('click', '.btn-reject', function () {
        const bookingId = $(this).data('id'); // Get booking ID

        $.ajax({
            url: `/admin/bookings/${bookingId}/reject`,
            type: 'PUT',
            success: function (data) {
                if (data.status === 'Rejected') {
                    // Update status text and badge color
                    $(`#status-${bookingId} .status-badge`)
                        .text('Rejected')
                        .removeClass('status-pending status-approved')
                        .addClass('status-rejected');  // Red background

                    // Disable both buttons and apply disabled style
                    $(`#booking-${bookingId} .btn-approve, #booking-${bookingId} .btn-reject`)
                        .prop('disabled', true)
                        .addClass('disabled-btn');

                    showNotification('Booking rejected successfully');
                } else {
                    alert(data.error || 'Failed to reject booking');
                }
            },
            error: function (error) {
                console.error('Error rejecting booking:', error);
            },
        });
    });
});



// Function to set a cookie



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






$(document).ready(function () {
    $('#admins-table').DataTable();
});

document.addEventListener("DOMContentLoaded", function () {
    const adminTable = document.getElementById("admins-table");
    const modal = document.getElementById("confirmModal");
    let selectedAdminId = null;

    if (adminTable) {
        adminTable.addEventListener("click", function (event) {
            if (event.target.classList.contains("btn-delete")) {
                selectedAdminId = event.target.dataset.id;

                // Show the modal
                modal.style.display = "flex";
            }
        });
    }

    // Handle Confirm Click
    document.getElementById("confirmDelete").onclick = async function () {
        if (!selectedAdminId) return;

        try {
            const response = await fetch(`/admin/delete-admin/${selectedAdminId}`, { method: "DELETE" });
            const data = await response.json();

            if (data.success) {
                showNotification("Admin deleted successfully", "success");

                // Remove the deleted row
                document.querySelector(`[data-id="${selectedAdminId}"]`).closest("tr").remove();
            } else {
                showNotification("Failed to delete admin.", "error");
            }
        } catch (error) {
            showNotification("An error occurred.", "error");
        }

        // Close the modal
        modal.style.display = "none";
    };

    // Handle Cancel Click
    document.getElementById("cancelDelete").onclick = function () {
        modal.style.display = "none";
    };
});


// Function to create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "1000";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
    return container;
}


function showToast(message, type = "error") {
    let toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";

        // Default styles (mobile-friendly)
        toastContainer.style.position = "fixed";
        toastContainer.style.bottom = "20px";
        toastContainer.style.zIndex = "1000";
        toastContainer.style.display = "flex";
        toastContainer.style.flexDirection = "column";
        toastContainer.style.gap = "10px";
        toastContainer.style.width = "90%";  // Mobile default
        toastContainer.style.maxWidth = "400px"; // Max width
        toastContainer.style.left = "50%";
        toastContainer.style.transform = "translateX(-50%)";

        document.body.appendChild(toastContainer);
    }

    // Apply desktop styles if screen width is larger
    if (window.innerWidth > 768) {
        toastContainer.style.left = "auto";
        toastContainer.style.right = "20px"; // Right-aligned on desktop
        toastContainer.style.transform = "none";
        toastContainer.style.width = "300px";
    }

    // Create toast
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    // Apply styles
    toast.style.padding = "12px 16px";
    toast.style.color = "#fff";
    toast.style.borderRadius = "6px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "bold";
    toast.style.display = "inline-block";
    toast.style.textAlign = "center";
    toast.style.animation = "fadeInOut 3s ease-in-out";
    toast.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545";
    toast.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    toast.style.width = "100%";

    // Append toast
    toastContainer.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
        if (toastContainer.childElementCount === 0) {
            toastContainer.remove(); // Remove container if empty
        }
    }, 3000);
}


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("auditoriumform"); // Change ID based on your form

    
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form); // Capture all form data, including files

        try {
            const response = await fetch('/admin/add-auditorium', {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
             showToast(result.message, "success");
                
                form.reset(); // Clear the form after successful submission
            } else {
                showToast(result.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Request failed:", error);
            showToast("Network error, please try again.");
        }
    });
});






document.getElementById("editAuditoriumForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/admin/edit-auditorium", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message, "success");
            this.reset();
        } else {
            showToast(result.error, "error");
            
        }
    } catch (error) {
        showToast("Something went wrong!", "error");
    }
});


document.getElementById("updateContentForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);


    try {
        const response = await fetch("/admin/update-content", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message, "success");
            this.reset();
        } else {
            showToast(result.error, "error");
        }
    } catch (error) {
        showToast("Something went wrong!", "error");
    }
});

document.getElementById("addAdmin").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    if (!validatePassword(formObject.password)) {
        return; // Stop form submission if validation fails
    }

    

    try {
        const response = await fetch("/admin/add-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            showToast("User registered successfully", "success");
            location.reload();
 // Clear the form after success
        } else {
            showToast(result.error, "error");
        }
    } catch (error) {
        showToast("Something went wrong!", "error");
    }
});

function validatePassword(password) {
    if (password.length < 8) {
        showToast("Password must be at least 8 characters long.");
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        showToast("Password must contain at least one uppercase letter.");
        return false;
    }
    if (!/[a-z]/.test(password)) {
        showToast("Password must contain at least one lowercase letter.");
        return false;
    }
    if (!/[0-9]/.test(password)) {
        showToast("Password must contain at least one number.");
        return false;
    }
    if (!/[@$!%*?&]/.test(password)) {
        showToast("Password must contain at least one special character.");
        return false;
    }
    return true;
}

document.getElementById('auditoriumName').addEventListener('input', function () {
    this.value = this.value.replace(/\s/g, '');
})

