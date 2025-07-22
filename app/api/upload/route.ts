import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type (images and videos)
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            return NextResponse.json(
                { error: 'Only image and video files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 50MB for videos, 5MB for images)
        const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for videos, 5MB for images
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${originalName}`;

        // Determine the appropriate directory based on file type
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        
        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', mediaType, folder);
        await mkdir(uploadDir, { recursive: true });

        // Write file to public folder
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer as any);

        // Return the public URL
        const publicUrl = `/${mediaType}/${folder}/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename,
            size: file.size,
            type: file.type
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}