"use client";
import { useState, useEffect } from "react";
import { FileUploader } from "./FileUploader";
import { getYearlyProgramUrl, setYearlyProgramUrl } from "@/app/actions/config";
import { FileText, AlertCircle, ExternalLink, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function ProgramFileManager() {
  const [currentProgramUrl, setCurrentProgramUrl] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgramUrl() {
      try {
        const url = await getYearlyProgramUrl();
        setCurrentProgramUrl(url);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossibile caricare l'URL del programma"
        );
        console.error("Errore nel caricamento dell'URL del programma:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgramUrl();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleUploadSuccess = async (data: {
    url: string;
    publicId: string;
  }) => {
    try {
      await setYearlyProgramUrl(data.url);
      setCurrentProgramUrl(data.url);
      console.log("URL del programma annuale salvato:", data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile salvare l'URL del programma"
      );
      console.error("Errore nel salvataggio dell'URL del programma:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {currentProgramUrl ? (
        <div className="p-6 rounded-lg border bg-card/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Current Program</h3>
                <p className="text-sm text-muted-foreground">
                  View or download the current yearly program
                </p>
              </div>
            </div>
            <a
              href={currentProgramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "btn btn-outline btn-sm group",
                "inline-flex items-center gap-2"
              )}
            >
              View PDF
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-lg border border-dashed text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            No yearly program uploaded yet. Upload one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
