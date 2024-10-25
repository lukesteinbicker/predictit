import PredictionCard from "@/components/prediction-card";

export default async function Page() {

  return (
    <div className="flex-1 w-full flex flex-col gap-12 mt-10">
      <div className="w-full">
        <PredictionCard />
      </div>
    </div>
  );
}
