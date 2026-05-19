import fs from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { getContactLinks } from '../../lib/content/content-loader';

export const runtime = 'nodejs';

export async function GET() {
  const resumePath = getContactLinks().find((link) =>
    link.label.toLowerCase().includes('resume'),
  )?.href;

  if (!resumePath) {
    return new NextResponse('Resume not found', { status: 404 });
  }

  const allowedDirectory = path.join(process.cwd(), 'assets', 'profile');
  const resolvedPath = path.resolve(resumePath);
  const relativePath = path.relative(allowedDirectory, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return new NextResponse('Resume path is not allowed', { status: 400 });
  }

  try {
    const file = await fs.readFile(resolvedPath);

    return new NextResponse(file, {
      headers: {
        'Content-Disposition': `attachment; filename="${path.basename(resolvedPath)}"`,
        'Content-Type': 'application/pdf',
      },
    });
  } catch {
    return new NextResponse('Resume not found', { status: 404 });
  }
}
