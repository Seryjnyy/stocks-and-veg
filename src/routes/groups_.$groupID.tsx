import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/use-auth";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { CaretDownIcon, CaretUpIcon, GearIcon } from "@radix-ui/react-icons";

import OtherUsersTasks from "@/components/group/sections/other-users-tasks";
import { Badge } from "@/components/ui/badge";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    AlertCircleIcon,
    AlertTriangle,
    CheckCheckIcon,
    CheckSquare,
    CrownIcon,
    Info,
    Target,
    Trophy,
    UserPlus,
    Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import BackButton from "@/components/back-button";
import GroupSection from "@/components/group/sections/group-section";
import Invite from "@/components/group/sections/invite";
import Leaderboard from "@/components/group/sections/leaderboard";
import Manage from "@/components/group/sections/manage";
import TodaysTargets from "@/components/group/sections/todays-targets";
import Users from "@/components/group/sections/users";
import YourTasksToday from "@/components/group/sections/your-tasks-today";
import Sidebar from "@/components/group/sidebar";
import useWorkStatus from "@/hooks/use-work-status";
import { GroupSection as GroupSectionType } from "@/lib/types";
import WorkOverBanner from "@/components/group/work-over-banner";

export const Route = createFileRoute("/groups/$groupID")({
    component: Group,
});

// TODO : is it better to drill stuff like session, or let components use useAuth hook?
function Group() {
    const { groupID } = Route.useParams();
    const { session } = useAuth();
    const { data, error, isLoading } = useGetGroup({
        enabled: !!session,
        groupID: groupID,
    });
    const isWorkEnabled = useWorkStatus();

    if (error) {
        return (
            <div className="flex justify-center items-center px-12  py-12">
                <DataError message={error.message} />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center px-12  py-12">
                <Loading />
            </div>
        );
    }

    if (data == null) {
        return (
            <div className="flex justify-center  px-12  py-12 flex-col gap-4">
                <Link to="/groups" className="w-fit">
                    <BackButton />
                </Link>
                <DataError message="Group data is missing." />
            </div>
        );
    }

    const sections: GroupSectionType[] = [
        {
            icon: Target,
            label: "Todays targets",
            value: "todays-targets-section",
            section: <TodaysTargets group={data} />,
        },
        {
            icon: CheckSquare,
            label: "Your tasks for today",
            value: "your-tasks-for-today-section",
            section: <YourTasksToday groupID={groupID} />,
        },
        {
            icon: CheckCheckIcon,
            label: "Other user tasks",
            value: "other-user-tasks-section",
            section: <OtherUsersTasks groupID={groupID} />,
        },
        {
            icon: Trophy,
            label: "Leaderboard",
            value: "leaderboard-section",
            section: <Leaderboard groupID={groupID} />,
        },
        {
            icon: UsersIcon,
            label: "Group users",
            value: "group-users-section",
            section: <Users groupID={groupID} />,
        },
        {
            icon: UserPlus,
            label: "Invite",
            value: "invite-section",
            section: <Invite groupID={groupID} />,
        },
        {
            icon: GearIcon,
            label: "Manage group",
            value: "manage-group-section",
            section: <Manage group={data} />,
        },
    ];

    const isUserCreator =
        (data && session && session?.user.id == data.creator_id) ?? false;

    const filteredSection = isUserCreator
        ? sections
        : sections.filter((section) => {
              if (
                  section.value == "invite-section" ||
                  section.value == "manage-group-section"
              )
                  return undefined;
              return section;
          });

    return (
        <div className="flex flex-col h-[calc(100vh-4.1rem)] overflow-hidden">
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar groupID={groupID} sections={filteredSection} />
                <main className="flex-1 overflow-y-auto relative">
                    {!isWorkEnabled && (
                        <div className="w-full sticky top-0 z-50">
                            <WorkOverBanner />
                        </div>
                    )}
                    {/* Shadow thingy so looks like components disappearing into void */}
                    {/* <div className="w-full h-[5rem] sticky top-0 bg-gradient-to-b  from-background to-transparent"></div> */}
                    <h1 className="font-bold text-7xl text-center text-muted-foreground mb-32 mt-10">
                        {data.name}
                        <Badge className="bg-muted-foreground">
                            <CrownIcon className="size-3" />
                        </Badge>
                    </h1>
                    <div className="space-y-[30rem] xl:mx-48 lg:mx-32 md:mx-6 sm:mx-20 mx-2 pb-28">
                        {filteredSection.map((section) => (
                            <GroupSection
                                sectionData={{
                                    label: section.label,
                                    value: section.value,
                                }}
                            >
                                {section.section}
                            </GroupSection>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
