
import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
console.log(`API Key Loaded (first 10 chars): ${process.env.GEMINI_API_KEY?.substring(0, 10)}`);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const cv = formData.get('cv') as File;

  if (!cv) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await cv.arrayBuffer());
    const data = await pdf(buffer);    const cvText = data.text;        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });    const prompt = `You are an expert in resume optimization and Applicant Tracking Systems (ATS) compliance. You analyze resumes for formatting, keyword optimization, and job description alignment. You must:

Evaluate the CV against common ATS parsing rules (e.g., no tables, clear headings, chronological consistency).

Identify missing hard skills, soft skills, and keywords based on the target job description (if provided).

Provide a clear score (0–100) for ATS compatibility.

Give structured, actionable recommendations for improvement, broken down into the following sections. For each section, provide a brief introductory sentence or paragraph before listing the specific issues or tips:

**Searchability:**
Here are some areas for improvement regarding the searchability of your CV:
- [List of issues to fix]

**Hard Skills:**
Consider these points to enhance the hard skills section of your CV:
- [List of issues to fix]

**Soft Skills:**
To strengthen the soft skills presented in your CV, focus on these aspects:
- [List of issues to fix]

**Recruiter Tips:**
Here are some tips from a recruiter's perspective to make your CV stand out:
- [List of tips]

**Formatting:**
To improve the overall formatting and ATS compatibility of your CV, address the following:
- [List of issues to fix]

Maintain a professional, concise, and easy-to-follow tone.

CV Text:
${cvText}`;

    const result = await model.generateContent(prompt);    const response = await result.response;    const feedback = response.text();    return NextResponse.json({ feedback });  } catch (error) {    console.error(error);    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });  }}
