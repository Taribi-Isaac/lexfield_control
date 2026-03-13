import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

type DeleteActionProps = {
    action: { url: string; method: string };
    title: string;
    description?: string;
    triggerText?: string;
    variant?: 'icon' | 'button';
};

export default function DeleteAction({
    action,
    title,
    description = 'This action cannot be undone.',
    triggerText = 'Delete',
    variant = 'button',
}: DeleteActionProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {variant === 'icon' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{triggerText}</span>
                    </Button>
                ) : (
                    <Button variant="destructive" size="sm">
                        {triggerText}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>

                <Form {...action}>
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button variant="destructive" disabled={processing} type="submit">
                                {triggerText}
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
