

import { NextRequest, NextResponse } from 'next/server';
import sanitizeFilename from 'sanitize-filename';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPE = 'application/pdf';

// Define Zod schemas for validation
const cvTextSchema = z.string().min(10, "CV text is too short.").max(50000, "CV text is too long.");
const jobDescriptionSchema = z.string().min(10, "Job description is too short.").max(5000, "Job description is too long.").nullable();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cv = formData.get('cv') as File;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!cv) {
      logger.error('Missing required fields: CV file');
      return NextResponse.json({ error: 'Missing required fields: CV file' }, { status: 400 });
    }

    // Validate file type
    if (cv.type !== ALLOWED_FILE_TYPE) {
      logger.error(`Invalid file type: ${cv.type}`);
      return NextResponse.json({ error: `Invalid file type. Please upload a ${ALLOWED_FILE_TYPE.split('/')[1].toUpperCase()} file.` }, { status: 400 });
    }

    // Validate file size
    if (cv.size > MAX_FILE_SIZE) {
      logger.error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }, { status: 413 });
    }

    // Sanitize filename (though not directly used for storage, good practice for logging/display)
    const safeFileName = sanitizeFilename(cv.name || 'cv.pdf');
    logger.info(`Processing sanitized file: ${safeFileName}`);

    const buffer = Buffer.from(await cv.arrayBuffer());

    const data = await pdf(buffer);
    const cvText = data.text;

    // Validate cvText and jobDescription using Zod
    const parsedCvText = cvTextSchema.safeParse(cvText);
    if (!parsedCvText.success) {
      logger.error('Invalid CV text', { error: parsedCvText.error });
      return NextResponse.json({ error: `Invalid CV text: ${parsedCvText.error.issues[0].message}` }, { status: 400 });
    }

    const parsedJobDescription = jobDescriptionSchema.safeParse(jobDescription);
    if (!parsedJobDescription.success) {
      logger.error('Invalid job description', { error: parsedJobDescription.error });
      return NextResponse.json({ error: `Invalid job description: ${parsedJobDescription.error.issues[0].message}` }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an expert in resume optimization and Applicant Tracking Systems (ATS) compliance. You analyze resumes for formatting, keyword optimization, and job description alignment. You must return a JSON object with the following structure:

{
  "score": <a number between 0 and 100>,
  "feedback": {
    "searchability": "<string>",
    "hardSkills": "<string>",
    "softSkills": "<string>",
    "recruiterTips": "<string>",
    "formatting": "<string>"
  },
  "categoryScores": {
    "searchability": <a number between 0 and 100>,
    "hardSkills": <a number between 0 and 100>,
    "softSkills": <a number between 0 and 100>,
    "recruiterTips": <a number between 0 and 100>,
    "formatting": <a number between 0 and 100>
  }
}

CV Text:
${parsedCvText.data}

${parsedJobDescription.data ? `Job Description:
${parsedJobDescription.data}` : ''}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the text to ensure it is a valid JSON
    const cleanedText = text.replace(/```json\n|```/g, '').trim();

    try {
      const jsonResponse = JSON.parse(cleanedText);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      logger.error("Failed to parse JSON response:", { error: e, response: cleanedText });
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

  } catch (error) {
    logger.error('Error processing request', { error });
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}
