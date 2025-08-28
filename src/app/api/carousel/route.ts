
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const carouselDirectory = path.join(process.cwd(), 'public', 'carousel');
    const filenames = fs.readdirSync(carouselDirectory);
    const images = filenames.filter(name => !name.startsWith('.')).map((name) => `/carousel/${name}`);
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read carousel directory' }, { status: 500 });
  }
}
