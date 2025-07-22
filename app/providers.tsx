'use client';

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/hooks/use-auth";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <NextUIProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NextUIProvider>
    );
}