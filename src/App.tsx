import { Deck } from "@/deck/Deck";
import { TooltipProvider } from "@/components/ui/tooltip";
import { slides } from "@/slides";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <Deck slides={slides} />
    </TooltipProvider>
  );
}
