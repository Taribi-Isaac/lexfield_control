import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/LEXFIELD-ICON.png"
            alt="Lexfield Attorneys"
            {...props}
        />
    );
}
