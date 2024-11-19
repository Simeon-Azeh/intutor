const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.createTeacher = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

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
});