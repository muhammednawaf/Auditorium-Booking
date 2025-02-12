var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require("bcryptjs");
const ObjectId = require('mongodb').ObjectId;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { resolve } = require('path');
const { rejects } = require('assert');
const Razorpay = require('razorpay');


var instance = new Razorpay({
    key_id: 'rzp_test_OBYVbsMPplTq7D',
    key_secret: 'DhO1dFVKVuTKCzmiaW6uOS1S',
});




module.exports = {
    saveBooking(details) {
        return new Promise(async (resolve, reject) => {
            const { name, email, phone, department, event, description, time, auditorium, userId, date } = details;
            const booking = {
                name,
                email,
                phone,
                department,
                event,
                description,
                date,
                time,
                auditorium,
                userId,
                current_date: new Date(),
                payment_status: 'pending',
                status: 'pending',
            }
            db.get().collection(collection.BOOKING_COLLECTION).insertOne(booking).then(() => {
                resolve(booking);
            });
            console.log(auditorium)

        })
    },
    getAuditorium() {
        return new Promise(async (resolve, reject) => {
            try {
                const bookings = await db.get().collection(collection.AUDITORIUM_COLLECTION).find().toArray();
                resolve(bookings);
            } catch (error) {
                reject(error);
            }
        });
    },
    doSignup(details) {
        return new Promise(async (resolve, reject) => {
            try {
                const { fullName, email, password } = details;

                if (!password) {
                    return reject(new Error("Password is required")); // ✅ Ensure password exists
                }

                // Check if email already exists
                const existingUser = await db.get().collection(collection.USER_COLLECTION).findOne({ email });
                if (existingUser) {
                    return reject(new Error("Email already in use"));
                }

                // Hash Password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                // ✅ Debugging

                // Store User in Database
                const newUser = {
                    fullName,
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                };

                await db.get().collection(collection.USER_COLLECTION).insertOne(newUser);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    doLogin(details) {
        return new Promise(async (resolve, reject) => {
            try {

                const { email, password } = details;

                // Find user in the database
                const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email });

                if (!user) {
                    return reject(new Error("Invalid user"));
                }

                // Compare the hashed password
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return reject(new Error("Invalid email or password"));
                    //return res.status(401).json({ error: "Invalid email or password" });
                }

                resolve(user);
            } catch (error) {
                reject(error);
            }
        });

    },
    getUserBookings(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const bookings = await db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .find({ userId: userId }) // Filter by userId
                    .toArray();
                resolve(bookings);
            } catch (error) {
                reject(error);
            }
        });
    },
    async getBookedSlots(auditoriumName, selectedDate) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("🔍 Checking bookings for:", auditoriumName, selectedDate);
    
                const bookings = await db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .find({
                        auditorium: auditoriumName,
                        date: selectedDate, // Direct string match instead of date range
                        status: { $ne: 'Rejected' }
                    })
                    .toArray();
    
                console.log("📅 Retrieved bookings:", bookings);
    
                const bookedTimes = bookings.map(booking => booking.time);
                console.log("⏳ Booked slots:", bookedTimes);
    
                resolve(bookedTimes);
            } catch (error) {
                console.error("❌ Error fetching booked slots:", error);
                reject(error);
            }
        });
    }
,    

    resetPassword(details) {
        return new Promise(async (resolve, reject) => {
            try {
                const { token, newPassword } = details;

                if (!newPassword) {
                    return reject(new Error("New password is required"));
                }

                // Find user with valid token and check expiry
                const user = await db.get().collection(collection.USER_COLLECTION).findOne({
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
                await db.get().collection(collection.USER_COLLECTION).updateOne(
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
                const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email });
                console.log(user)
                if (!user) {
                    return reject(new Error("User is not found"));
                }

                // Generate reset token (random string)
                const resetToken = crypto.randomBytes(3).toString("hex");
                const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes

                // Store reset token in database
                await db.get().collection(collection.USER_COLLECTION).updateOne(
                    { email },
                    { $set: { resetToken, resetTokenExpiry } }
                );

                // Send email with reset link
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: 'muhammednawaf.buissness@gmail.com',
                        pass: 'resf hkhn zzxx grnv'
                    }
                });


                const mailOptions = {
                    from: 'muhammednawaf.buissness@gmail.com',
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



    },
    generateRazorpay(id) {
        return new Promise((resolve, reject) => {
            try {

                var options = {
                    amount: 250 * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: "INR",
                    receipt: id
                };
                instance.orders.create(options, function (err, order) {
                    resolve(order)
                });

            } catch (err) {
                reject(err)

            }


        }

        )
    },

    verifyRazorpayPayment(details) {
        return new Promise((resolve, reject) => {
            try {
                console.log("Received details:", details);

                let hmac = crypto.createHmac("sha256", "DhO1dFVKVuTKCzmiaW6uOS1S"); // Secret key
                hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
                hmac = hmac.digest("hex");

                if (hmac === details.payment.razorpay_signature) {
                    console.log("Payment verified successfully");
                    resolve({ success: true, message: "Payment verified" });
                } else {
                    console.error("Payment verification failed: Invalid signature");
                    reject({ success: false, message: "Invalid payment signature" });
                }
            } catch (err) {
                console.error("Error in payment verification:", err);
                reject({ success: false, message: "Error verifying payment", error: err });
            }
        });
    }
    ,

    updatePaidStatus(orderId) {
        return new Promise((resolve, reject) => {
            try {
                db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .updateOne(
                        { razorpay_order_id: orderId }, // 🔍 Find booking by Razorpay Order ID
                        { $set: { payment_status: "paid" } } // ✅ Update payment status
                    )
                    .then((result) => {
                        if (result.modifiedCount > 0) {
                            resolve("Payment status updated successfully.");
                        } else {
                            reject("No matching order found.");
                        }
                    })
                    .catch((err) => reject(err));
            } catch (err) {
                reject(err);
            }
        });
    },
    updateFailedStatus(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("🔍 Checking if order exists:", orderId);
    
                // Check if order exists & get current payment_status
                const order = await db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .findOne({ razorpay_order_id: orderId });
    
                if (!order) {
                    console.error("🚨 No matching order found before update:", orderId);
                    return reject("No matching order found.");
                }
    
                // Check if payment_status is already "failed"
                if (order.payment_status === "failed") {
                    console.log("⚠️ Payment status is already 'failed' for:", orderId);
                    return resolve("Payment status was already failed.");
                }
    
                // Proceed to update only if needed
                const result = await db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .updateOne(
                        { razorpay_order_id: orderId },
                        { $set: { payment_status: "failed" } }
                    );
    
                if (result.modifiedCount > 0) {
                    console.log("✅ Payment status updated successfully for:", orderId);
                    resolve("Payment status updated successfully.");
                } else {
                    console.error("🚨 Update failed: No order modified.", orderId);
                    reject("Order found but update failed.");
                }
            } catch (err) {
                reject(err);
            }
        });
    },    
    SaveRazorpayOrder(id, bookingId) {
        return new Promise((resolve, reject) => {
            try {

                db.get()
                    .collection(collection.BOOKING_COLLECTION)
                    .updateOne(
                        { _id: new ObjectId(bookingId) }, // Find booking by ID
                        { $set: { razorpay_order_id: id } } // Update payment status
                    )
                resolve()
            } catch (err) {
                reject(err)

            }
        }

        )

    },
    







}