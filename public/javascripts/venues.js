
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');
    const timeSlots = document.querySelectorAll('.time-slot');
    const hiddenDateInput = document.getElementById('selected-date');
    const hiddenTimeInput = document.getElementById('selected-time');

    let isDateSelected = false; // Track if a date is selected

    // Listen for date selection
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        hiddenDateInput.value = selectedDate;
        isDateSelected = true; // Mark date as selected

        // Fetch booked slots for the selected date
        fetch(`/get-booked-slots?date=${selectedDate}`)
            .then(response => response.json())
            .then(data => {
                updateBookedSlots(data.bookedSlots);
            })
            .catch(error => console.error('Error fetching booked slots:', error));
    });

    function updateBookedSlots(bookedSlots) {
        timeSlots.forEach(slot => {
            const slotTime = slot.textContent.trim();

            if (bookedSlots.includes(slotTime)) {
                slot.classList.add('booked');
                slot.classList.remove('available');
                slot.disabled = true;
            } else {
                slot.classList.remove('booked');
                slot.classList.add('available');
                slot.disabled = false;
            }
        });
    }

    // Handle time slot selection with alert
    timeSlots.forEach(timeSlot => {
        timeSlot.addEventListener('click', () => {
            if (!isDateSelected) {
                showMessage("⚠️ Please select a date.", "error");
                return;
            }

            if (timeSlot.classList.contains('available')) {
                hiddenTimeInput.value = timeSlot.textContent.trim();
                timeSlots.forEach(slot => slot.classList.remove('selected'));
                timeSlot.classList.add('selected');
            }
        });
    });
});



// Get references to the main image and all thumbnails
const mainImage = document.querySelector('.main-image');
const thumbnails = document.querySelectorAll('.thumbnail');

// Add click event listener to each thumbnail
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Update main image source with clicked thumbnail's source
        mainImage.src = thumbnail.src;
        mainImage.alt = thumbnail.alt;

        // Optional: Add visual feedback for selected thumbnail
        thumbnails.forEach(thumb => thumb.style.opacity = '0.7');
        thumbnail.style.opacity = '1';
    });
});

$(document).ready(function () {
    $('#booking-form').submit((e) => {
        e.preventDefault();

        // Sanitize input fields to prevent XSS attacks
        function sanitizeInput(input) {
            return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        // Get sanitized form values
        const name = sanitizeInput($('#name').val().trim());
        const email = sanitizeInput($('#email').val().trim());
        const phone = sanitizeInput($('#phone').val().trim());
        const department = sanitizeInput($('#department').val().trim());
        const eventType = sanitizeInput($('#event-type').val().trim());
        const description = sanitizeInput($('#description').val().trim());
        const dateInput = sanitizeInput($('#booking-date').val().trim());
        const selectedTime = sanitizeInput($('#selected-time').val().trim());

        // Regular expressions for strict validation
        const nameRegex = /^[A-Za-z\s]{3,}$/;  // Only letters, min 3 characters
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;  // Must end with ".com"
        const phoneRegex = /^[6-9][0-9]{9}$/; // Starts with 6-9, exactly 10 digits
        const textRegex = /^[A-Za-z0-9\s.,'-]+$/; // Allows alphanumeric with basic punctuation

        // Validate Name
        if (!name || !nameRegex.test(name)) {
            showMessage("⚠️ Name must contain only letters and be at least 3 characters.", "error");
            return;
        }

        // Validate Email (Only `.com` Domains Allowed)
        if (!email || !emailRegex.test(email)) {
            showMessage("⚠️ Enter a valid email address that ends with '.com'.", "error");
            return;
        }

        // Validate Phone Number
        if (!phone || !phoneRegex.test(phone)) {
            showMessage("⚠️ Phone number must be exactly 10 digits and start with 6-9.", "error");
            return;
        }

        // Validate Department & Event Type
        if (!department || !textRegex.test(department)) {
            showMessage("⚠️ Enter a valid department name.", "error");
            return;
        }

        if (!eventType || !textRegex.test(eventType)) {
            showMessage("⚠️ Enter a valid event type.", "error");
            return;
        }

        // Validate Description
        if (!description || description.length < 10 || !textRegex.test(description)) {
            showMessage("⚠️ Description must be at least 10 characters and not contain special characters.", "error");
            return;
        }

        // Validate Date
        if (!dateInput) {
            showMessage("⚠️ Please select a date before booking.", "error");
            return;
        }

        // Validate Time
        if (!selectedTime) {
            showMessage("⚠️ Please select a time slot before booking.", "error");
            return;
        }

        // Prevent multiple Razorpay popups
        $('#booking-form button[type="submit"]').prop('disabled', true);

        // Proceed with AJAX request only if all fields are valid
        $.ajax({
            url: '/booking-form',
            method: 'post',
            data: $('#booking-form').serialize(),
            success: (response) => {
                showMessage("✅ Booking submitted! Redirecting to payment...", "success");
                setTimeout(() => {
                    razorpayPayment(response);
                }, 1500);
            },
            error: () => {
                showMessage("❌ Error submitting form. Try again later.", "error");
                $('#booking-form button[type="submit"]').prop('disabled', false);
            }
        });
    });
});

// Function to display beautiful messages
function showMessage(message, type) {
    const messageBox = document.createElement("div");
    messageBox.className = `message-box ${type}`;
    messageBox.innerHTML = message;

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
        $('#booking-form button[type="submit"]').prop('disabled', false); // Re-enable submit button
    }, 3000);
}


function razorpayPayment(order){
    var options = {
        "key": "rzp_test_OBYVbsMPplTq7D",
        "amount": order.amount, 
        "currency": "INR",
        "name": "Your App Name",
        "order_id": order.id,
        "handler": function (response) {
            showMessage("✅ Payment Sucessfull!", "success");
          fetch("/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment: response,
              orderId: order.id
            })
          }).then(res => res.json())
            .then(data => console.log("Payment Verification Response:", data));
        },
        "modal": {
          "ondismiss": function () {
            showMessage("❌ Payment Failed!", "error");
            fetch("/verify-payment", {  // Notify server even when modal is closed
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: order.id, failed: true })
            });
          }
        }
      };
      
      var rzp = new Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        showMessage("❌ Payment Failed!", "error");
        fetch("/verify-payment", {  
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            failed: true,
            error: response.error
          })
        });
      });
      
      rzp.open();
      

}
function verifyPayment(payment,order){
    $.ajax({
        url:'/verify-payment',
        method:'post',
        data:{
            payment,
            order
        },
        success:(response)=>{
            if(response.status){
                showMessage("✅ Payment Successfull!", "success");
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);

            }else{
                showMessage("❌ Payment Failed!", "error");
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
            
        }


    })
}
