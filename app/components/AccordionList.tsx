import { Accordion } from "../ui/accordion";
import AccordionSection from "./AccordionSection";

type AccordionListItem = {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
};

type AccordionListProps = {
  sections: AccordionListItem[];
};

export default function AccordionList({ sections }: AccordionListProps) {
  return (
    <Accordion type="single" collapsible>
      {sections.map((section, i) => (
        <AccordionSection
          key={section.value}
          value={section.value}
          trigger={section.trigger}
          className={i > 0 ? "mt-10" : undefined}
        >
          {section.content}
        </AccordionSection>
      ))}
    </Accordion>
  );
}
