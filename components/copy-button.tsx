"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";

export function CopyButton({text, copyText} : {text: string, copyText: string}) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      toast({
        title: "Copied wallet address!",
        description: "Users like you allow this site to exist",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="link" onClick={copyToClipboard}>
      {text}
    </Button>
  );
}
