"use client"

import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "../actions";
import { toast } from "@/components/hooks/use-toast";

export default function Page() {

    async function deleteAccount() {
        await deleteAccountAction()
    }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 mt-10">
      <div className="w-full">
        <Button variant="destructive" onClick={() => deleteAccount()}>Delete account</Button>
      </div>
    </div>
  );
}
