"use client";

import Link from "next/link";
import { SubmitEvent, useEffect, useState } from "react";

import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

type Major = {
    majorId: number;
    majorCode: string;
    majorName: string;
};

type RegisterRequest = {
    username: string;
    password: string;
    email: string;
    name: string;
    majorId: number | null;
    cohort: string | null;
};

export default function Page() {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [majorId, setMajorId] = useState("");
    const [cohort, setCohort] = useState("");
    const [majors, setMajors] = useState<Major[]>([]);
    const [cohorts, setCohorts] = useState<string[]>([]);

    useEffect(() => {
        async function getAppData() {
            try {
                const [majorsResult, cohortsResult] = await Promise.all([
                    fetch(`${backendUrl}/api/app-data/majors`),
                    fetch(`${backendUrl}/api/app-data/cohorts`),
                ]);

                if (!majorsResult.ok || !cohortsResult.ok) {
                    throw new Error("Failed to fetch app data");
                }

                const [majorOptions, cohortOptions] = await Promise.all([
                    majorsResult.json(),
                    cohortsResult.json(),
                ]);

                setMajors(majorOptions);
                setCohorts(cohortOptions);
            } catch (error) {
                console.error("Failed to load majors and cohorts:", error);
            }
        }

        getAppData();
    }, [backendUrl]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const majorIdValue = String(formData.get("majorId") ?? "");
        const cohortValue = String(formData.get("cohort") ?? "");

        const registerData: RegisterRequest = {
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
            email: String(formData.get("email") ?? ""),
            name: String(formData.get("name") ?? ""),
            majorId: majorIdValue ? Number(majorIdValue) : null,
            cohort: cohortValue || null,
        };

        const result = await fetch(`${backendUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(registerData),
        })

        if (!result.ok) {
            toast({ type: "error", description: "Failed to register!" });
            throw new Error(await result.text());
        }
        await mutate("/api/auth/me");

        setIsSuccessful(true);

        toast({ type: "success", description: "Register successful!" });
        router.push("/home");

    };

    return (
        <>
            <h1 className="text-2xl font-semibold tracking-tight">
                Create account
            </h1>

            <p className="text-sm text-muted-foreground">
                Sign up to start using your account
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label
                            className="font-normal text-muted-foreground"
                            htmlFor="username"
                        >
                            Username
                        </Label>
                        <Input
                            autoComplete="username"
                            autoFocus
                            className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                            id="username"
                            name="username"
                            placeholder="yourusername"
                            required
                            type="text"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            className="font-normal text-muted-foreground"
                            htmlFor="name"
                        >
                            Name
                        </Label>
                        <Input
                            autoComplete="name"
                            className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="font-normal text-muted-foreground" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        autoComplete="email"
                        className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                        id="email"
                        name="email"
                        placeholder="youremail@gmail.com"
                        required
                        type="email"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label
                        className="font-normal text-muted-foreground"
                        htmlFor="password"
                    >
                        Password
                    </Label>
                    <Input
                        autoComplete="new-password"
                        className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                        id="password"
                        name="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        required
                        type="password"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label
                            className="font-normal text-muted-foreground"
                            htmlFor="majorId"
                        >
                            Major
                        </Label>
                        <input name="majorId" type="hidden" value={majorId} />
                        <Select value={majorId} onValueChange={setMajorId}>
                            <SelectTrigger
                                className="h-10 w-full rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                                id="majorId"
                            >
                                <SelectValue placeholder="Select major" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {majors.map((major) => (
                                        <SelectItem
                                            key={major.majorId}
                                            value={String(major.majorId)}
                                        >
                                            {major.majorCode} - {major.majorName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            className="font-normal text-muted-foreground"
                            htmlFor="cohort"
                        >
                            Cohort
                        </Label>
                        <input name="cohort" type="hidden" value={cohort} />
                        <Select value={cohort} onValueChange={setCohort}>
                            <SelectTrigger
                                className="h-10 w-full rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
                                id="cohort"
                            >
                                <SelectValue placeholder="Select cohort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {cohorts.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SubmitButton isSuccessful={isSuccessful}>Sign up</SubmitButton>

                <p className="text-center text-[13px] text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        className="text-foreground underline-offset-4 hover:underline"
                        href="/login"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </>
    );
}
