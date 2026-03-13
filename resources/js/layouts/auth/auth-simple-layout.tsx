import { Link } from '@inertiajs/react';
import { login } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="relative flex min-h-svh items-center justify-center bg-black bg-cover bg-center px-6 py-10"
            style={{ backgroundImage: "url('/BG-IMAGE.png')" }}
        >
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link
                            href={login()}
                            className="flex flex-col items-center gap-3"
                        >
                            {/*   <img
                                src="/LEXFIELD-ICON.png"
                                alt="Lexfield icon"
                                className="h-12 w-12"
                            /> */}
                            <img
                                src="/LEXFIELD-LOGO.png"
                                alt="Lexfield Attorneys"
                                className="h-10"
                            />
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold text-black">
                                {title}
                            </h1>
                            <p className="text-sm text-slate-600">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
