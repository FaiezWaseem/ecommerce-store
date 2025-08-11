import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const blockedExtensions = [
    '.js', '.mjs', '.cjs',
    '.php', '.html', '.htm',
    '.py', '.rb', '.sh',
    '.exe', '.bat', '.cmd',
    '.dll', '.jar', '.asp', '.aspx'
];

const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.zip': 'application/zip',
    '.pdf': 'application/pdf'
};

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
    const filePath = path.join(process.cwd(), 'uploads', ...params.path);
    const ext = path.extname(filePath).toLowerCase();

    // Block dangerous files
    if (blockedExtensions.includes(ext)) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            // Uncomment to force download instead of inline view:
            // 'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`
        }
    });
}
