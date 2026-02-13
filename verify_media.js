
import fs from 'fs';
import path from 'path';
import { Blob } from 'buffer';

const BASE_URL = 'http://localhost:3000';

async function run() {
    try {
        console.log("1. Initiating Signup...");
        const email = `test-${Date.now()}@example.com`;
        const initResponse = await fetch(`${BASE_URL}/auth/signup/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const initData = await initResponse.json();

        if (!initData.success) throw new Error("Signup initiation failed");

        const otp = initData.otp;

        console.log("2. Verifying Signup...");
        const verifyResponse = await fetch(`${BASE_URL}/auth/signup/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                otp,
                name: 'Test User',
                password: 'password123',
                role: 'ADMIN'
            })
        });
        const verifyData = await verifyResponse.json();

        if (!verifyData.success) throw new Error("Signup verification failed");

        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const loginData = await loginResponse.json();
        const token = loginData.token;

        console.log("4. Creating Artifact with Media...");

        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const fileBuffer = fs.readFileSync(packageJsonPath);
        const fileBlob = new Blob([fileBuffer], { type: 'application/json' });

        const form = new FormData();
        form.append('title', 'Artifact with Media');
        form.append('content', 'Content with media');
        form.append('status', 'PUBLISHED');
        form.append('file', fileBlob, 'package.json');

        const artifactResponse = await fetch(`${BASE_URL}/artifacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });

        const artifactData = await artifactResponse.json();
        console.log("Artifact Data:", artifactData);

        if (artifactData.success) {
            console.log("SUCCESS: Artifact created successfully!");
            if (artifactData.artifact.media) {
                if (artifactData.artifact.media.startsWith('http')) {
                    console.log("Media is a Cloudinary URL.");
                } else {
                    console.log("Media is a local path (Cloudinary upload likely failed or mocked).");
                }
            } else {
                console.warn("WARNING: Media field is missing in artifact data.");
                process.exit(1);
            }
        } else {
            console.error("FAILURE: Failed to create artifact -", artifactData.message);
            process.exit(1);
        }

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

run();
