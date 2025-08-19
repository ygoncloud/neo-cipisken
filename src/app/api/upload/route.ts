import { NextRequest, NextResponse } from 'next/server';
import sanitizeFilename from 'sanitize-filename';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPE = 'application/pdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cv = formData.get('cv') as File;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!cv) {
      return NextResponse.json({ error: 'Missing required fields: CV file' }, { status: 400 });
    }

    // Validate file type
    if (cv.type !== ALLOWED_FILE_TYPE) {
      return NextResponse.json({ error: `Invalid file type. Please upload a ${ALLOWED_FILE_TYPE.split('/')[1].toUpperCase()} file.` }, { status: 400 });
    }

    // Validate file size
    if (cv.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }, { status: 400 });
    }

    // Sanitize filename (though not directly used for storage, good practice for logging/display)
    const safeFileName = sanitizeFilename(cv.name || 'cv.pdf');
    console.log(`Processing sanitized file: ${safeFileName}`);

    const buffer = Buffer.from(await cv.arrayBuffer());
    const data = await pdf(buffer);
    const cvText = data.text;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert in resume optimization and Applicant Tracking Systems (ATS) compliance. You analyze resumes for formatting, keyword optimization, and job description alignment. You must:\n\nEvaluate the CV against common ATS parsing rules (e.g., no tables, clear headings, chronological consistency).\n\nIdentify missing hard skills, soft skills, and keywords based on the target job description (if provided).\n\nProvide a clear score (0–100) for ATS compatibility.\n\nGive structured, actionable recommendations for improvement, broken down into the following sections. For each section, provide a brief introductory sentence or paragraph before listing the specific issues or tips:\n\n**Searchability:**\nHere are some areas for improvement regarding the searchability of your CV:\n- [List of issues to fix]\n\n**Hard Skills:**\nConsider these points to enhance the hard skills section of your CV:\n- [List of issues to fix]\n\n**Soft Skills:**\nTo strengthen the soft skills presented in your CV, focus on these aspects:\n- [List of issues to fix]\n\n**Recruiter Tips:**\nHere are some tips from a recruiter's perspective to make your CV stand out:\n- [List of tips]\n\n**Formatting:**\nTo improve the overall formatting and ATS compatibility of your CV, address the following:\n- [List of issues to fix]\n\nMaintain a professional, concise, and easy-to-follow tone.\n\nCV Text:\n${cvText}\n\n${jobDescription ? `Job Description:\n${jobDescription}` : ''}`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}
