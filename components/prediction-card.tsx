"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { verifyPredictionById } from "@/app/actions";
import { getPredictionByIdAction } from "@/app/actions";
import dayjs from "dayjs";
import { ShareButton } from "./share-button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "./hooks/use-toast";

export default function PredictionCard() {
  interface MyData {
    authuserid: string;
    description: string;
    created_at: string;
  }
  
  const [predictionData, setPredictionData] = useState<MyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // New state for verification
  const predictionId = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchPrediction() {
      try {
        const data = await getPredictionByIdAction(predictionId.id);
        setPredictionData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();
  }, [predictionId]);

  async function verifyOnChain(id: string) {
    setIsVerifying(true);
    const message = await verifyPredictionById(id);
    toast({
      title: message[0],
      description: (
        <div>
          <pre className="mt-2 w-[340px] max-h-[200px] overflow-y-auto rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(message[1], null, 2)}</code>
          </pre>
        </div>
      ),
    });
  }

  if (loading) return <Skeleton className="w-full h-400px rounded-md" />;
  if (error || predictionData == null) return (
    <Card className="w-full">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle>Prediction</CardTitle>
        <ShareButton link={`/${predictionId}`} />
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription>This does not exist... maybe?</CardDescription>
      <p>If a user created a prediction anonymously through the smart contract outside of this application, it exists on the chain but not in our database storage. Feel free to verify (disregard the user ID field in the response).</p>
    </CardContent>
    <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
      <Button onClick={() => verifyOnChain(predictionId.id)} disabled={isVerifying}>
        Verify on chain
      </Button>
    </CardFooter>
  </Card>
);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Prediction</CardTitle>
          <ShareButton link={`/${predictionId}`} />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>Created on {dayjs(predictionData.created_at).format('MMMM D, YYYY h:mm A')}</CardDescription>
        <p>{predictionData.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <Link href={`/u/${predictionData.authuserid}`}>
          <Button variant="link">See all predictions from this user</Button>
        </Link>
        <Button onClick={() => verifyOnChain(predictionId.id)} disabled={isVerifying}>
          Verify on chain
        </Button>
      </CardFooter>
    </Card>
  );
}
