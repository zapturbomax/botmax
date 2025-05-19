import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface PageHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  backText?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  backUrl,
  backText,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {backUrl && (
          <div className="mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={backUrl} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {backText || "Voltar"}
              </Link>
            </Button>
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}