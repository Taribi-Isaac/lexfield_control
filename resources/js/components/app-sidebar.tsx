import { Link } from '@inertiajs/react';
import {
    Briefcase,
    CalendarDays,
    FileText,
    LayoutGrid,
    FileBarChart2,
    CreditCard,
    FileSignature,
    ShieldCheck,
    MessageSquare,
    KeyRound,
    Receipt,
    Users,
} from 'lucide-react';
import ActivityLogController from '@/actions/App/Http/Controllers/ActivityLogController';
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import CauseListController from '@/actions/App/Http/Controllers/CauseListController';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import ConversationController from '@/actions/App/Http/Controllers/ConversationController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import NotificationLetterController from '@/actions/App/Http/Controllers/NotificationLetterController';
import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import QuoteController from '@/actions/App/Http/Controllers/QuoteController';
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import StaffController from '@/actions/App/Http/Controllers/StaffController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Clients',
        href: ClientController.index(),
        icon: Users,
    },
    {
        title: 'Cases',
        href: CaseFileController.index(),
        icon: Briefcase,
    },
    {
        title: 'Cause List',
        href: CauseListController.index(),
        icon: CalendarDays,
    },
    {
        title: 'Reports',
        href: ReportController.index(),
        icon: FileBarChart2,
    },
    {
        title: 'Quotes',
        href: QuoteController.index(),
        icon: FileSignature,
    },
    {
        title: 'Invoices',
        href: InvoiceController.index(),
        icon: Receipt,
    },
    {
        title: 'Payments',
        href: PaymentController.index(),
        icon: CreditCard,
    },
    {
        title: 'Messages',
        href: ConversationController.index(),
        icon: MessageSquare,
    },
    {
        title: 'Notification Letters',
        href: NotificationLetterController.index(),
        icon: FileSignature,
    },
    {
        title: 'Staff',
        href: StaffController.index(),
        icon: Users,
    },
    {
        title: 'Roles & Permissions',
        href: RoleController.index(),
        icon: KeyRound,
    },
    {
        title: 'Documents',
        href: DocumentController.index(),
        icon: FileText,
    },
    {
        title: 'Activity Logs',
        href: ActivityLogController.index(),
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    /*   {
        title: 'Lexfield Attorneys',
        href: dashboard(),
        icon: FolderGit2,
    },
    {
        title: 'Help',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    }, */
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
