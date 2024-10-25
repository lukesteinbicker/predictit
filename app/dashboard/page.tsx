import { PredictionForm } from "@/components/prediction-form";
import { createClient } from "@/utils/supabase/server";
import { ExternalLink, InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 mt-10">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
            <span>Rome wasn't built in 3 days but this idea was. Please be patient, as submissions take a few seconds to be registered.</span> 
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Create</h2>
        <PredictionForm />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Link href={`u/${user.id}`} className="w-full"><div className="flex"><h2 className="font-bold text-2xl mb-4">Your previous predictions </h2><ExternalLink /></div></Link>
      </div>
    </div>
  );
}
