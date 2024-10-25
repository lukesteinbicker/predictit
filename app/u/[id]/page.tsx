import PredictionList from "@/components/prediction-list";
import { InfoIcon } from "lucide-react";

export default async function Page() {

  return (
    <div className="flex-1 w-full flex flex-col gap-12 mt-10">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
            <span>These are predictions associated with a user in the application's database. It is the only valid list of a given user's predictions, as the user ID stored in the contract itself is purely for decorative purposes.</span> 
        </div>
        <PredictionList />
      </div>
    </div>
  );
}