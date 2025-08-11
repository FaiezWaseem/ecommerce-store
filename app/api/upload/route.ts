import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, chmod } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Allowed file types by extension
const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.mp4', '.webm', '.mov', '.avi', '.mkv',
    '.mp3', '.wav', '.ogg',
    '.zip', '.pdf'
];

// Blocked file extensions (security)
const blockedExtensions = [
    '.js', '.mjs', '.cjs',
    '.php', '.html', '.htm',
    '.py', '.rb', '.sh',
    '.exe', '.bat', '.cmd',
    '.dll', '.jar', '.asp', '.aspx'
];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const ext = path.extname(file.name).toLowerCase();

        // Block dangerous file types
        if (blockedExtensions.includes(ext)) {
            return NextResponse.json({ error: 'This file type is not allowed' }, { status: 400 });
        }

        // Allow only specific file types
        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        // File size limits (50MB for videos, 5MB for images/audio, 100MB for zip/pdf)
        let maxSize = 5 * 1024 * 1024; // default 5MB
        if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext)) maxSize = 50 * 1024 * 1024;
        if (['.zip', '.pdf'].includes(ext)) maxSize = 100 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json({ error: `File too large. Max allowed size is ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${safeName}`;

        // Store in "uploads" folder outside public/
        const uploadDir = path.join(process.cwd(), 'uploads', folder);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        //@ts-ignore
        await writeFile(filePath, buffer);
        
        try {
            await chmod(filePath, 0o644);
        } catch (err) {
            console.warn('Could not set file permissions:', err);
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('File was not written successfully');
        }

        // Instead of direct public URL, we serve via API route
        const serveUrl = `/api/upload/${folder}/${filename}`;

        return NextResponse.json({
            success: true,
            url: serveUrl,
            filename,
            size: file.size,
            type: file.type
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
