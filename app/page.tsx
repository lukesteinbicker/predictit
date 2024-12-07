import { LampMain } from "@/components/lamp";
import Link from "next/link";

export default async function Index() {
  return (
      <main className="flex-1 flex flex-col gap-6 px-4">
      <LampMain />
        <div className="p-4 rounded-lg">
          <div className="h-[20rem] flex flex-col justify-start items-center px-4">
            <div className="text-2xl mx-auto font-normal text-muted-foreground mb-20">
              <h2>
                The creator of this project didn&apos;t want to pay his email verification API.
                New accounts cannot be created, but feel free to check out the source code.
              </h2>
            </div>
            <div className="text-sm mx-auto font-normal text-muted-foreground">
              <p><Link href="/manual-transaction"><u>You can still make transations with the contract, too.</u></Link></p>
            </div>
          </div>
        </div>
      </main>
  );
}
