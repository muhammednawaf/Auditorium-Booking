var db = require('../config/connection');
var collection = require('../config/collection');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports = {

    getBookings() {
        return new Promise(async (resolve, reject) => {
            try {
                const bookings = await db.get().collection(collection.BOOKING_COLLECTION).find().toArray();
                resolve(bookings);
            } catch (error) {
                reject(error);
            }
        });
    },
    updateStatusApprove(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const bookingId = id;

                // Validate the ID
                if (!ObjectId.isValid(bookingId)) {
                    return res.status(400).json({ error: 'Invalid booking ID' });
                }

                await db.get().collection(collection.BOOKING_COLLECTION).updateOne(
                    { _id: new ObjectId(bookingId) },
                    { $set: { status: 'Approved' } }
                );

                resolve();
            } catch (error) {
                reject(error);
            }

        })
    },
    updateStatusReject(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const bookingId = id;

                // Validate the ID
                if (!ObjectId.isValid(bookingId)) {
                    return res.status(400).json({ error: 'Invalid booking ID' });
                }

                await db.get().collection(collection.BOOKING_COLLECTION).updateOne(
                    { _id: new ObjectId(bookingId) },
                    { $set: { status: 'Rejected' } }
                );

                resolve();
            } catch (error) {
                reject(error);
            }

        })
    },

    addAuditoriumDetails(details) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("hjj")
                const { name, capacity, description, feature_1, feature_2, feature_3, feature_4, content_feature1,
                    content_feature2, content_feature3, content_feature4, content_feature5, content_feature6,
                    content_description, images } = details;

                // Process features into an array of objects (featureName, description)

                // Process images into an array of objects (url, altText)
                const processedImages = images.map((image) => ({
                    url: image.url,
                    altText: image.altText || '' // Default to empty if no alt text
                }));

                // Construct the auditorium object
                const auditorium = {
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
                    images: processedImages,
                    current_date: new Date(), // Capture the current date  // Set the updated date as well
                };

                // Insert the auditorium into the database
                await db.get().collection(collection.AUDITORIUM_COLLECTION).insertOne(auditorium);

                resolve();
            } catch (error) {
                console.error('Error adding auditorium:', error);
                reject(error);
            }
        });
    },

    getAuditorium() {
        return new Promise(async (resolve, reject) => {
            try {
                const auditoriums = await db.get()
                    .collection(collection.AUDITORIUM_COLLECTION)
                    .find({}, { projection: { name: 1, _id: 1 } }) // Fetch only "name" and exclude "_id"
                    .toArray();
                resolve(auditoriums);
            } catch (error) {
                reject(error);
            }
        });
    },

    editAuditorium(id, updatedDetails) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!ObjectId.isValid(id)) {
                    reject({ error: 'Invalid auditorium ID' });
                    return;
                }

                // Create dynamic update object
                let updateFields = {};
                Object.keys(updatedDetails).forEach((key) => {
                    if (updatedDetails[key]) {  // Only add non-empty values
                        updateFields[key] = updatedDetails[key];
                    }
                });

                if (Object.keys(updateFields).length === 0) {
                    reject({ error: 'No fields to update' });
                    return;
                }

                await db.get().collection(collection.AUDITORIUM_COLLECTION).updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateFields }
                );

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },



    updateContent(id, updatedDetails) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!ObjectId.isValid(id)) {
                    return reject({ error: 'Invalid auditorium ID' });
                }

                const { name,
                    capacity,
                    content_feature1, content_feature2, content_feature3,
                    content_feature4, content_feature5, content_feature6,
                    content_description,
                    images } = updatedDetails;

                let updateFields = {};
                if (name) updateFields.name = name;
                if (capacity) updateFields.capacity = capacity;
                if (content_feature1) updateFields.content_feature1 = content_feature1;
                if (content_feature2) updateFields.content_feature2 = content_feature2;
                if (content_feature3) updateFields.content_feature3 = content_feature3;
                if (content_feature4) updateFields.content_feature4 = content_feature4;
                if (content_feature5) updateFields.content_feature5 = content_feature5;
                if (content_feature6) updateFields.content_feature6 = content_feature6;
                if (content_description) updateFields.content_description = content_description;
                if (images.length === 3) updateFields.images = images;

                // Update the selected auditorium
                await db.get().collection(collection.AUDITORIUM_COLLECTION).updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateFields }
                );

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    addAdmin(details) {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, email, phone, username, password } = details;

                // Check if email already exists
                const existingAdmin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email });
                if (existingAdmin) {
                    return reject(new Error("Email already in use"));
                }

                // Hash Password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                // ✅ Debugging

                // Store User in Database
                const admin = {
                    name,
                    email,
                    phone,
                    username,
                    password,
                    password: hashedPassword,
                    role: "admin",
                    createdAt: new Date(),

                }

                await db.get().collection(collection.ADMIN_COLLECTION).insertOne(admin);
                resolve();
            } catch (error) {
                reject(error);
            }



        })
    },
    getAdmins() {
        return new Promise(async (resolve, reject) => {
            try {
                const admins = await db.get().collection(collection.ADMIN_COLLECTION).find().toArray();
                resolve(admins);
            } catch (error) {
                reject(error);
            }
        });
    },
    deleteAdmin(adminId) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.get().collection(collection.ADMIN_COLLECTION).deleteOne({ _id: new ObjectId(adminId) });
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });


    },
    adminLogin(details) {
        return new Promise(async (resolve, reject) => {
            try {

                const { username, password } = details;

                // Find user in the database
                const admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ username });

                if (!admin) {
                    return reject(new Error("Invalid user"));
                }

                // Compare the hashed password
                const passwordMatch = await bcrypt.compare(password, admin.password);

                if (!passwordMatch) {
                    return reject(new Error("Invalid username or password"));
                    //return res.status(401).json({ error: "Invalid email or password" });
                }

                resolve(admin);
            } catch (error) {
                reject(error);
            }
        });

    },
    resetPassword(details) {
        return new Promise(async (resolve, reject) => {
            try {
                const { token, newPassword } = details;

                if (!newPassword) {
                    return reject(new Error("New password is required"));
                }

                // Find user with valid token and check expiry
                const user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({
                    resetToken: token,
                    resetTokenExpiry: { $gt: Date.now() } // Ensure token is not expired
                });

                if (!user) {
                    return reject(new Error("Invalid or expired token"));
                }

                // Hash the new password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                // Update password and remove reset token
                await db.get().collection(collection.ADMIN_COLLECTION).updateOne(
                    { resetToken: token },
                    { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiry: "" } }
                );

                resolve({ message: "Password reset successful" });

            } catch (error) {
                reject(error);
            }
        });
    },
    requestPasswordReset(email) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if user exists
                const user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email });
                if (!user) {
                    return reject(new Error("Admin not found"));
                }

                // Generate reset token (random string)
                const resetToken = crypto.randomBytes(3).toString("hex");
                const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes

                // Store reset token in database
                await db.get().collection(collection.ADMIN_COLLECTION).updateOne(
                    { email },
                    { $set: { resetToken, resetTokenExpiry } }
                );

                // Send email with reset link
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "muhammednawaf.buissness@gmail.com",
                        pass: "resf hkhn zzxx grnv"
                    }
                });


                const mailOptions = {
                    from: "muhammednawaf.buissness@gmail.com",
                    to: email,
                    subject: "Password Reset Request",
                    text: `Enter the token to reset your password: ${resetToken}`
                };

                await transporter.sendMail(mailOptions);
                resolve({ message: "Reset link sent to email" });

            } catch (error) {
                reject(error);
            }
        });



    }









}
