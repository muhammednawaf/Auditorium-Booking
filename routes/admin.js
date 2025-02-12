var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers');
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var DataTable = require('datatables.net');
const { ADMIN_COLLECTION } = require('../config/collection');
require('datatables.net-responsive');


// Define storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Define the upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
]);

// Use upload in your route
router.post('/add-auditorium', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    } else if (err) {
      // Handle other errors
      console.error('Error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }

    // Proceed with your database operation
    const { name, capacity, description, feature_1, feature_2, feature_3, feature_4,
      content_feature1, content_feature2, content_feature3, content_feature4,
      content_feature5, content_feature6, content_description } = req.body;
    console.log(req.body)

    if (!name || !capacity || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }



    // Accessing files from req.files based on field names
    const imagesArray = [];

    if (req.files['image1']) {
      imagesArray.push({
        url: `/uploads/${req.files['image1'][0].filename}`,
        altText: req.body['altText-image1'] || ''
      });
    }
    if (req.files['image2']) {
      imagesArray.push({
        url: `/uploads/${req.files['image2'][0].filename}`,
        altText: req.body['altText-image2'] || ''
      });
    }
    if (req.files['image3']) {
      imagesArray.push({
        url: `/uploads/${req.files['image3'][0].filename}`,
        altText: req.body['altText-image3'] || ''
      });
    }

    const auditoriumDetails = {
      name,
      capacity,
      description,
      feature_1,
      feature_2,
      feature_3,
      feature_4,
      content_feature1,
      content_feature2,
      content_feature3,
      content_feature4,
      content_feature5,
      content_feature6,
      content_description,
      images: imagesArray,
      current_date: new Date(),
    };

    adminHelpers.addAuditoriumDetails(auditoriumDetails)
      .then(() => {
        res.status(200).json({ message: 'Auditorium added successfully!' });
      })
      .catch((error) => {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to add auditorium', details: error.message });
      });
  });
});


// Save uploads to a specific folder



router.use(async (req, res, next) => {
  try {
    const auditoriums = await adminHelpers.getAuditorium();
    const admins = await adminHelpers.getAdmins();
    res.locals.auditoriums = auditoriums;
    res.locals.admins = admins
    // Make it available in all views
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


/* GET users listing. */
router.get('/', function (req, res) {
  if (req.session.admin) {
    res.render('admin/admin-dashboard');
  }
  else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.render('admin/admin-login');

  }
});

router.get('/admin-dashboard', isAdminAuthenticated, (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/'); // Redirect to login if session is missing
  }
  res.render('admin/admin-dashboard',{admin: req.session.admin});
});


router.get('/bookings', async (req, res) => {

  if (req.session.admin && req.session.admin.role === "super-admin") {
    try {
      const bookings = await adminHelpers.getBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }


});

router.get('/admin-bookings', async (req, res) => {

  if (req.session.admin && req.session.admin.role === "admin") {
    try {
      const bookings = await adminHelpers.getAdminBookings(req.session.admin.id);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }



});


router.put('/bookings/:id/approve', async (req, res) => {
  try {
    console.log("hai")
    await adminHelpers.updateStatusApprove(req.params.id);
    res.status(200).json({ message: 'Booking approved!', status: 'Approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});



router.put('/bookings/:id/reject', async (req, res) => {
  try {
    await adminHelpers.updateStatusReject(req.params.id);
    res.status(200).json({ message: 'Booking rejected!', status: 'Rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});




router.get('/super-admin-dashboard',isSuperAdmin, async(req, res) => {
  let unassigned = await adminHelpers.getUnassignedAuditoriums();
  console.log(unassigned);
  res.render('admin/super-admin-dashboard', {
    unassignedAuditorium: unassigned,
    auditoriums: res.locals.auditoriums,
    admins: res.locals.admins,
    admin: req.session.admin
  });
});

router.post('/edit-auditorium',isSuperAdmin, async (req, res) => {

  try {
    console.log(req.body)
    await adminHelpers.editAuditorium(req.body.id, req.body);
    res.status(200).json({ message: 'Auditorium updated successfully' });
  } catch (error) {
    console.error('Error updating auditorium:', error);
    res.status(500).json({ error: 'Failed to update auditorium' });
  }
});


// Store files in 'uploads/'

router.post('/update-content',isSuperAdmin, (req, res) => {
  upload(req, res, async (err) => { // Use multer as a middleware inside the route
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    } else if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }

    try {
      const { auditoriumId, name, capacity, content_feature1, content_feature2, content_feature3,
        content_feature4, content_feature5, content_feature6, content_description } = req.body;

      if (!auditoriumId) {
        return res.status(400).json({ error: 'Auditorium ID is required' });
      }

      // Process uploaded images
      const images = [];
      if (req.files['image1']) images.push(`/uploads/${req.files['image1'][0].filename}`);
      if (req.files['image2']) images.push(`/uploads/${req.files['image2'][0].filename}`);
      if (req.files['image3']) images.push(`/uploads/${req.files['image3'][0].filename}`);

      const updatedDetails = {
        name,
        capacity,
        content_feature1, content_feature2, content_feature3,
        content_feature4, content_feature5, content_feature6,
        content_description,
        images
      };

      // Update the auditorium details in the database
      await adminHelpers.updateContent(auditoriumId, updatedDetails);

      res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({ error: 'Failed to update content' });
    }
  });
});

router.post('/add-admin',isSuperAdmin, async (req, res) => {
  try {
    console.log(req.body)
    await adminHelpers.addAdmin(req.body);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error.message);

    if (error.message === "Email already in use") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }


})



router.delete("/delete-admin/:id",isSuperAdmin, async (req, res) => {
  try {
    adminHelpers.deleteAdmin(req.params.id).then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      res.json({ success: true, message: "Admin deleted successfully" });

    })


  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting admin", error });
  }
});

router.post('/admin-login', async (req, res) => {
  try {

    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide both username and password" });
    }

    // Attempt login using userHelpers
    const admin = await adminHelpers.adminLogin(req.body);
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role // Ensure this field exists in the database
    };
    console.log("before logged ", { messahe: req.session.admin })

    if (admin.role === "admin") {
      return res.status(200).json({ message: "Login successful", redirect: '/admin/admin-dashboard' });
    } else {
      return res.status(200).json({ message: "Login successful", redirect: '/admin/super-admin-dashboard' });
    }


  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ error: error.message });
  }

})

function isAdminAuthenticated(req, res, next) {
  if (req.session.admin && req.session.admin.role === "admin" || "super-admin") {
    console.log("after logged " + req.session.admin)
    return next(); // User is logged in
  }
  return res.redirect("/admin/"); // Redirect to login if not authenticated
}

function isSuperAdmin(req, res, next) {
  if (req.session.admin && req.session.admin.role === "super-admin") {
    return next();
  }
  return res.redirect('/admin/'); // Redirect regular admins
}

router.get("/logout", (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie('connect.sid'); // Clears the session cookie
    res.redirect('/admin/'); // Redirect to login after logout
  });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔹 Forgot Password Request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const result = await adminHelpers.requestPasswordReset(email);

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

    const result = await adminHelpers.resetPassword({ token, newPassword });

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/forgot-password', (req, res) => {
  res.render('admin/admin-forgot-credential');
})

router.get('/reset-password',(req,res)=>{
  res.render('admin/admin-reset-password');

})




router.get('/admin-login',(req,res)=>{
  res.render('admin/admin-login')
})






module.exports = router;
