import { Download, ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
    canPreviewInModal,
    getPreviewType,
    type DocumentPreviewType,
} from '@/lib/document-preview';

export type DocumentPreviewModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    fileName?: string | null;
    mimeType?: string | null;
    viewUrl: string;
    downloadUrl?: string | null;
    canDownload?: boolean;
};

type LoadState = 'loading' | 'ready' | 'error';

export default function DocumentPreviewModal({
    open,
    onOpenChange,
    title,
    fileName,
    mimeType,
    viewUrl,
    downloadUrl,
    canDownload = true,
}: DocumentPreviewModalProps) {
    const previewType = getPreviewType(mimeType, fileName);
    const supportsInlinePreview = canPreviewInModal(mimeType, fileName);
    const [loadState, setLoadState] = useState<LoadState>('loading');

    const verifyAccess = useCallback(async () => {
        setLoadState('loading');

        try {
            const response = await fetch(viewUrl, {
                method: 'HEAD',
                credentials: 'same-origin',
            });

            if (!response.ok) {
                setLoadState('error');
                return;
            }

            if (!supportsInlinePreview) {
                setLoadState('ready');
                return;
            }
        } catch {
            if (!supportsInlinePreview) {
                setLoadState('ready');
                return;
            }

            setLoadState('error');
        }
    }, [supportsInlinePreview, viewUrl]);

    useEffect(() => {
        if (!open) {
            return;
        }

        void verifyAccess();
    }, [open, verifyAccess]);

    const handleMediaReady = () => {
        setLoadState('ready');
    };

    const handleMediaError = () => {
        setLoadState('error');
    };

    const effectiveDownloadUrl = downloadUrl ?? viewUrl;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[min(90vh,900px)] w-[calc(100%-1rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
                <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
                    <DialogTitle className="truncate pr-2">{title}</DialogTitle>
                    {fileName ? (
                        <DialogDescription className="truncate">
                            {fileName}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                <div className="relative min-h-[200px] flex-1 overflow-auto bg-muted/30 p-4 sm:min-h-[280px] sm:p-6">
                    {loadState === 'loading' && supportsInlinePreview && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                            <Spinner className="size-8" />
                        </div>
                    )}

                    {loadState === 'error' && (
                        <AlertError
                            title="Unable to load document"
                            errors={[
                                'You may not have permission to view this file, or the file may be unavailable.',
                            ]}
                        />
                    )}

                    {loadState !== 'error' && (
                        <PreviewContent
                            previewType={previewType}
                            supportsInlinePreview={supportsInlinePreview}
                            viewUrl={viewUrl}
                            fileName={fileName}
                            onReady={handleMediaReady}
                            onError={handleMediaError}
                        />
                    )}
                </div>

                <DialogFooter className="shrink-0 gap-2 border-t px-4 py-4 sm:px-6">
                    {canDownload && effectiveDownloadUrl ? (
                        <Button asChild variant="outline" size="sm">
                            <a href={effectiveDownloadUrl}>
                                <Download className="size-4" />
                                Download
                            </a>
                        </Button>
                    ) : null}
                    <Button asChild variant="outline" size="sm">
                        <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="size-4" />
                            Open in new tab
                        </a>
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function PreviewContent({
    previewType,
    supportsInlinePreview,
    viewUrl,
    fileName,
    onReady,
    onError,
}: {
    previewType: DocumentPreviewType;
    supportsInlinePreview: boolean;
    viewUrl: string;
    fileName?: string | null;
    onReady: () => void;
    onError: () => void;
}) {
    if (!supportsInlinePreview) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="max-w-md text-sm text-muted-foreground">
                    This file type cannot be previewed in the browser. Use
                    Download or Open in new tab to view it with another
                    application.
                </p>
                {fileName ? (
                    <p className="text-xs text-slate-500">{fileName}</p>
                ) : null}
            </div>
        );
    }

    if (previewType === 'image') {
        return (
            <div className="flex min-h-[200px] items-center justify-center">
                <img
                    src={viewUrl}
                    alt={fileName ?? 'Document preview'}
                    className="max-h-[min(65vh,700px)] w-auto max-w-full rounded-md object-contain shadow-sm"
                    onLoad={onReady}
                    onError={onError}
                />
            </div>
        );
    }

    return (
        <iframe
            src={viewUrl}
            title={fileName ?? 'Document preview'}
            className="h-[min(65vh,700px)] w-full rounded-md border bg-white shadow-sm"
            onLoad={onReady}
            onError={onError}
        />
    );
}
