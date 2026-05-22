import { type ReactNode, useState } from 'react';
import DocumentPreviewModal from '@/components/document-preview-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DocumentPreviewTriggerProps = {
    title: string;
    fileName?: string | null;
    mimeType?: string | null;
    viewUrl: string;
    downloadUrl?: string | null;
    canView?: boolean;
    canDownload?: boolean;
    onDenied?: () => void;
    children: ReactNode;
    className?: string;
    variant?: 'link' | 'button';
    buttonVariant?: 'default' | 'outline' | 'secondary';
};

export default function DocumentPreviewTrigger({
    title,
    fileName,
    mimeType,
    viewUrl,
    downloadUrl,
    canView = true,
    canDownload = true,
    onDenied,
    children,
    className,
    variant = 'link',
    buttonVariant = 'secondary',
}: DocumentPreviewTriggerProps) {
    const [open, setOpen] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();

        if (!canView) {
            onDenied?.();
            return;
        }

        setOpen(true);
    };

    const trigger =
        variant === 'button' ? (
            <Button
                type="button"
                variant={buttonVariant}
                onClick={handleClick}
                className={className}
            >
                {children}
            </Button>
        ) : (
            <button
                type="button"
                onClick={handleClick}
                className={cn(
                    'text-sm text-primary underline-offset-4 hover:underline',
                    className,
                )}
            >
                {children}
            </button>
        );

    return (
        <>
            {trigger}
            <DocumentPreviewModal
                open={open}
                onOpenChange={setOpen}
                title={title}
                fileName={fileName}
                mimeType={mimeType}
                viewUrl={viewUrl}
                downloadUrl={downloadUrl}
                canDownload={canDownload}
            />
        </>
    );
}
