import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full border border-border/40 bg-muted/40 px-4 text-xs font-semibold uppercase tracking-[0.35em] text-foreground transition hover:border-border hover:bg-background/80"
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span>{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] rounded-2xl border border-border/60 bg-background/95 p-2 text-sm shadow-xl backdrop-blur"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer rounded-xl px-3 py-2 transition ${
            language === "en" ? "bg-muted text-foreground" : "hover:bg-muted/50"
          }`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("he")}
          className={`cursor-pointer rounded-xl px-3 py-2 transition ${
            language === "he" ? "bg-muted text-foreground" : "hover:bg-muted/50"
          }`}
        >
          עברית
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
