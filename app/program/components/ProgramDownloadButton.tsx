"use client";

import { ProgramPDFDownload } from "@/components/admin/ProgramPDF";
import type { YearlyProgram } from "@/app/actions/program";

export function ProgramDownloadButton({ program }: { program: YearlyProgram }) {
  return (
    <div className="flex justify-center">
      <ProgramPDFDownload program={program} />
    </div>
  );
}
