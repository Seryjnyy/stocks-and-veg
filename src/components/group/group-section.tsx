import { currentSectionInGroupPageAtom } from "@/lib/atoms/current-section-group-page";
import { cn } from "@/lib/utils";
import { ReactNode } from "@tanstack/react-router";
import { useAtom } from "jotai";
import React from "react";
import { InView } from "react-intersection-observer";

interface GroupSectionProps {
    children?: ReactNode;
    sectionData: { label: string; value: string };
}

export default function GroupSection({
    children,
    sectionData,
}: GroupSectionProps) {
    const [currentSection, setCurrentSection] = useAtom(
        currentSectionInGroupPageAtom
    );

    return (
        <section
            className="p-4  flex flex-col gap-2 pt-12"
            id={sectionData.value}
        >
            <InView
                as="h3"
                className={cn(
                    "text-5xl font-semibold text-center text-foreground transition-all duration-500 delay-100",
                    currentSection == sectionData.value && "text-blue-300 "
                )}
                onChange={(val) => val && setCurrentSection(sectionData.value)}
            >
                {sectionData.label}
            </InView>

            <div className="relative pt-8">{children}</div>
        </section>
    );
}
