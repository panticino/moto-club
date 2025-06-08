"use client";

import { useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Script from "next/script";

interface FileUploaderProps {
  onUploadSuccess: (data: { url: string; publicId: string }) => void;
}

interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
  };
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: {
          cloudName: string | undefined;
          uploadPreset: string | undefined;
          folder: string;
          sources: string[];
          multiple: boolean;
          maxFiles: number;
          maxFileSize: number;
          styles: {
            palette: Record<string, string>;
          };
        },
        callback: (error: Error | null, result: CloudinaryResult) => void
      ) => { open: () => void };
    };
  }
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const initializeWidget = useCallback(() => {
    if (typeof window === "undefined") return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: "moto-club/events",
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 10,
        maxFileSize: 10000000, // 10MB
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          onUploadSuccess({
            url: result.info.secure_url,
            publicId: result.info.public_id,
          });
        }
      }
    );

    return widget;
  }, [onUploadSuccess]);

  const openWidget = useCallback(() => {
    const widget = initializeWidget();
    if (widget) widget.open();
  }, [initializeWidget]);

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      <div className="space-y-4">
        <Button
          type="button"
          onClick={openWidget}
          className="w-full py-2 px-4 flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Carica Foto
        </Button>
      </div>
    </>
  );
}
