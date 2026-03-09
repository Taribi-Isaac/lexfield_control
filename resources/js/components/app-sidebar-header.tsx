import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import CauseListController from '@/actions/App/Http/Controllers/CauseListController';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();
    const notifications = page.props.notifications as
        | {
              total: number;
              messages: number;
              shared_reports: number;
              case_assignments: number;
              cause_list: number;
          }
        | undefined;

    const totalNotifications = notifications?.total ?? 0;

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {totalNotifications > 0 && (
                                <span className="absolute right-1 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                                    {totalNotifications}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem asChild>
                            <Link href={ConversationController.index().url}>
                                Messages ({notifications?.messages ?? 0})
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={ReportController.index().url}>
                                Reports shared ({notifications?.shared_reports ?? 0})
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={CaseFileController.index().url}>
                                Case assignments ({notifications?.case_assignments ?? 0})
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={CauseListController.index().url}>
                                Cause list ({notifications?.cause_list ?? 0})
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
