import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CadastroForm } from "@/components/CadastroForm";

async function CadastroContent() {
    const user = await getSessionUser();

    if (user) {
        redirect("/");
    }

    return <CadastroForm />;
}

export default function CadastroPage() {
    return (
        <div className="flex items-center justify-center w-full h-full pt-8">
            <div className="border-2 p-4 rounded-xl border-gray-400">
                <Suspense fallback={<p className="p-4">Carregando...</p>}>
                    <CadastroContent />
                </Suspense>
            </div>
        </div>
    );
}
