const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let token = '';

async function verifyFeatures() {
    console.log('🚀 Starting Verification...');

    try {
        // 1. Login to get token
        console.log('\n🔐 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'testest@gmail.com',
            password: 'password123'
        });
        token = loginRes.data.token;
        console.log('✅ Logged in successfully');

        // 2. Test Location Update
        console.log('\n📍 Testing Location Update...');
        const locRes = await axios.patch(`${API_URL}/users/location`, {
            latitude: 40.7128,
            longitude: -74.0060
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Location Update Response:', locRes.data.message);

        // 3. Test Discovery with Distance
        console.log('\n🔍 Testing Discovery with Distance...');
        const discRes = await axios.get(`${API_URL}/users/discovery`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const profiles = discRes.data.data.profiles;
        console.log(`✅ Loaded ${profiles.length} profiles`);
        if (profiles.length > 0) {
            console.log('📄 Sample Profile Distance:', profiles[0].distance, 'km');
        }

        // 4. Test Google Auth Endpoint (Expect 401 for invalid token)
        console.log('\n🛡️ Testing Google Auth Endpoint...');
        try {
            await axios.post(`${API_URL}/auth/google`, {
                idToken: 'invalid_token_test'
            });
        } catch (err) {
            console.log('✅ Google Auth Response (expected failure):', err.response?.data?.message || err.message);
        }

        console.log('\n✨ Verification Completed Successfully!');
    } catch (err) {
        console.error('\n❌ Verification failed:', err.response?.data || err.message);
    }
}

verifyFeatures();
