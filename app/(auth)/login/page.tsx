"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { SubmitButton } from "@/components/forms/submit-button";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function loginRequest(data: { email: string; password: string }) {
    return fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        const data = {
            email: String(formData.get("email")),
            password: String(formData.get("password")),
        };

        try {
            const res = await loginRequest(data);

            console.log("STATUS:", res.status);
            console.log("OK:", res.ok);

            if (!res.ok) {
                toast({ type: "error", description: "Invalid credentials!" });
                return;
            }

            setIsSuccessful(true);

            toast({ type: "success", description: "Login successful!" });

        } catch (err) {
            toast({ type: "error", description: "Network error!" });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
            </h1>

            <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
            </p>

            <AuthForm action={handleSubmit} defaultEmail={email}>
                <SubmitButton isSuccessful={isSuccessful}>
                    Sign in
                </SubmitButton>

                <p className="text-center text-[13px] text-muted-foreground">
                    No account?{" "}
                    <Link
                        className="text-foreground underline-offset-4 hover:underline"
                        href="/register"
                    >
                        Sign up
                    </Link>
                </p>
            </AuthForm>
        </>
    )
}