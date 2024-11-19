const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Configure CORS to allow requests from specific origins
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS for all routes with specific options

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://intutor-7cd24-default-rtdb.firebaseio.com' // Replace with your database URL
});

// Define the /create-teacher endpoint
app.post('/create-teacher', async (req, res) => {
    const { email, password, ...otherData } = req.body;

    try {
        // Create the user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Add additional user data to Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            ...otherData,
            role: 'teacher',
        });

        res.status(200).send({ message: 'Teacher created successfully' });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).send({ error: 'Error creating teacher' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});