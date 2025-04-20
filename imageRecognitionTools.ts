import AWS from 'aws-sdk';
import fs from 'fs';

// Load environment variables
require('dotenv').config();

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Create Rekognition service object
const rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27'
});


// Function to analyze images using AWS Rekognition
export async function analyzeImage(imagePath: string, features: string[]): Promise<string> {
    try {
        // Read the image file
        const image = fs.readFileSync(imagePath);

        const params: any = {
            Image: {
                Bytes: image
            },
        };

        let response;

        if (features.includes('labels')) {
            response = await rekognition.detectLabels(params).promise();
            return `Labels: ${JSON.stringify(response.Labels)}`
        } else if (features.includes('faces')) {
            response = await rekognition.detectFaces(params).promise();
            return `Faces: ${JSON.stringify(response.FaceDetails)}`
        } else if (features.includes('text')) {
            response = await rekognition.detectText(params).promise();
            return `Text: ${JSON.stringify(response.TextDetections)}`
        } else if (features.includes('moderation')) {
            response = await rekognition.detectModerationLabels(params).promise();
            return `Moderation Labels: ${JSON.stringify(response.ModerationLabels)}`
        } else {
            return "No features specified."
        }

    } catch (error: any) {
        console.error('Error analyzing image:', error);
        return `Could not analyze image. ${error.message}`;
    }
}