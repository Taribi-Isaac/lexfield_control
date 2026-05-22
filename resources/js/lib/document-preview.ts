export type DocumentPreviewType = 'pdf' | 'image' | 'unsupported';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
const PDF_EXTENSIONS = ['.pdf'];

export function getExtension(fileName?: string | null): string {
    if (!fileName) {
        return '';
    }

    const dot = fileName.lastIndexOf('.');
    if (dot === -1) {
        return '';
    }

    return fileName.slice(dot).toLowerCase();
}

export function getPreviewType(
    mimeType?: string | null,
    fileName?: string | null,
): DocumentPreviewType {
    const mime = mimeType?.toLowerCase() ?? '';
    const extension = getExtension(fileName);

    if (mime.startsWith('image/') || IMAGE_EXTENSIONS.includes(extension)) {
        return 'image';
    }

    if (mime === 'application/pdf' || PDF_EXTENSIONS.includes(extension)) {
        return 'pdf';
    }

    return 'unsupported';
}

export function canPreviewInModal(
    mimeType?: string | null,
    fileName?: string | null,
): boolean {
    return getPreviewType(mimeType, fileName) !== 'unsupported';
}
