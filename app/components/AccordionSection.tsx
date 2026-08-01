import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

type AccordionSectionProps = {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function AccordionSection({
  value,
  trigger,
  children,
  className,
}: AccordionSectionProps) {
  return (
    <AccordionItem value={value} className={className}>
      <AccordionTrigger>{trigger}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}