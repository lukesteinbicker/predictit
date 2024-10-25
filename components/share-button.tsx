import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Copy } from 'lucide-react';

export function ShareButton({ link }: {link: string}) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    const fullUrl = `${window.location.origin}${link}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={copyToClipboard}>
      <Copy />
    </Button>
  );
}
