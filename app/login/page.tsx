import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

async function LoginContent() {
    const user = await getSessionUser();

    if (user) {
        redirect("/");
    }

    return <LoginForm />;
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center w-full h-full pt-8">
            <div className="border-2 p-4 rounded-xl border-gray-400">
                <Suspense fallback={<p className="p-4">Carregando...</p>}>
                    <LoginContent />
                </Suspense>
            </div>
        </div>
    );
}
