var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');




function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log("after logged " + req.session.user)
    return next(); // User is logged in
  }
  return res.redirect("/login"); // Redirect to login if not authenticated
}




router.use(async (req, res, next) => {
  try {
    const auditoriums = await userHelpers.getAuditorium();
    res.locals.auditoriums = auditoriums; // Make it available in all views
    next();
  } catch (error) {
    console.error('Error fetching auditoriums:', error);
    res.locals.auditoriums = []; // Fallback to empty array
    next();
  }
});

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


/* GET home page. */
router.get('/', async function (req, res) {
  res.render('user/index', {
    auditoriums: res.locals.auditoriums,
    user: req.session.user
  });
  console.log(req.session.user)

});

router.get('/login', async function (req, res) {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.render('user/user-login');

  }
});

router.get('/signup', async function (req, res) {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.render('user/user-signup');

  }
});

router.get('/account', isAuthenticated, async function (req, res) {
  try {
    console.log(req.session.user.id)
    const userBookings = await userHelpers.getUserBookings(req.session.user.id);
    res.render('user/user-account', { bookings: userBookings, user: req.session.user });
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
});

router.get('/auditorium/:id',isAuthenticated, async (req, res) => {
  try {
    const auditoriums = await userHelpers.getAuditorium();
    const auditoriumId = req.params.id;
    const selectedAuditorium = auditoriums.find(auditorium => auditorium._id.toString() === auditoriumId);
    console.log(selectedAuditorium.images[0].url)

    if (!selectedAuditorium) {
      return res.status(404).send('Auditorium not found');
    }

    const bookedSlots = await userHelpers.getBookedSlots(selectedAuditorium.name);
    console.log(bookedSlots)

    const allTimeSlots = [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM'
    ];

    // Create an array with booking status
    const timeSlots = allTimeSlots.map(time => ({
      time,
      isBooked: bookedSlots.includes(time)
    }));
    console.log(timeSlots)
    console.log(bookedSlots.includes())
    console.log(bookedSlots)

    res.render('user/venues', {
      image1: selectedAuditorium.images[0].url,
      image2: selectedAuditorium.images[1].url,
      image3: selectedAuditorium.images[2].url,
      venue: selectedAuditorium.name,
      auditorium: selectedAuditorium,
      timeSlots,
      userId: req.session.user,
    });
  } catch (error) {
    console.error('Error fetching auditorium:', error);
    res.status(500).send('Server Error');
  }
});





router.post("/booking-form", isAuthenticated, async (req, res) => {
  try {
    console.log("Received booking data:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing booking details" });
    }

    let booking = await userHelpers.saveBooking(req.body);
    console.log("Booking saved:", booking);

    if (!booking._id) {
      return res.status(500).json({ error: "Failed to save booking" });
    }

    let order = await userHelpers.generateRazorpay(booking._id);
    console.log("Generated Razorpay order:", order);

    await userHelpers.SaveRazorpayOrder(order.id,booking._id);
    res.json(order);

  } catch (err) {
    console.error("Error in booking:", err);
    res.status(500).json({ error: "Booking failed", details: err.message });
  }
});


router.post("/verify-payment", isAuthenticated, async (req, res) => {
  try {
    console.log("Payment Verification Request:", req.body);
    
    if (req.body.failed) {
      console.log("Payment Failed:", req.body);
      // Update payment status to "failed"
      await userHelpers.updateFailedStatus(req.body.orderId);
      return res.json({ status: false, message: "Payment failed" });
    }

    // Verify successful payment
    const isValid = await userHelpers.verifyRazorpayPayment(req.body);
    if (isValid) {
      await userHelpers.updatePaidStatus(req.body.orderId);
      return res.json({ status: true });
    }
    
  } catch (err) {
    console.log("Error in verify-payment:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});






router.get('/auditoriums', async (req, res) => {
  try {
    const bookings = await userHelpers.getAuditorium();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching auditoriums:', error);
    res.status(500).json({ error: 'Failed to fetch auditoriums' });
  }
});


// Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { fullName, email, password } = req.body;

    // Validate inputs
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await userHelpers.doSignup(req.body);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error.message);

    if (error.message === "Email already in use" || error.message === "Password is required") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔹 Forgot Password Request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const result = await userHelpers.requestPasswordReset(email);

    if (result) {
      return res.json({ success: true, message: "Reset token sent to email!" });
    } else {
      return res.status(400).json({ message: "User not found!" });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});




router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log(req.body)

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required!" });
    }

    const result = await userHelpers.resetPassword({ token, newPassword });

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/reset-password',(req,res)=>{
  res.render('user/user-reset-password');

})

router.get('/forgot-password', (req, res) => {
  res.render('user/user-forgot-credential');
})



router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password" });
    }

    // Attempt login using userHelpers
    const user = await userHelpers.doLogin(req.body);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user info in session
    req.session.user = { id: user._id, fullName: user.fullName, email: user.email };
    console.log("before logged ", { messahe: req.session.user })

    // Send a JSON response with redirect info
    return res.status(200).json({ message: "Login successful", redirect: '/' });

  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie('connect.sid'); // Clears the session cookie
    res.redirect('/'); // Redirect to login after logout
  });
});









module.exports = router;
