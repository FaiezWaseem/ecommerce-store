'use client';

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/hooks/use-auth";
import { useEffect } from "react";
import { registerServiceWorker } from "./pwa";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    useEffect(() => {
        // Register service worker for PWA functionality
        registerServiceWorker();
    }, []);

    return (
        <NextUIProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NextUIProvider>
    );
}