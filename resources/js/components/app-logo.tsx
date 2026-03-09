import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-9 items-center justify-center rounded-md bg-white">
                <AppLogoIcon className="size-8" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white">
                    Lexfield Attorneys
                </span>
            </div>
        </>
    );
}
