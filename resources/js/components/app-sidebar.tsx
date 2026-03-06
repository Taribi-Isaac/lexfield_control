import { Link } from '@inertiajs/react';
import { BookOpen, Briefcase, FileText, FolderGit2, LayoutGrid, Users } from 'lucide-react';
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
import CaseFileController from '@/actions/App/Http/Controllers/CaseFileController';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import StaffController from '@/actions/App/Http/Controllers/StaffController';
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
        title: 'Staff',
        href: StaffController.index(),
        icon: Users,
    },
    {
        title: 'Documents',
        href: DocumentController.index(),
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lexfield Attorneys',
        href: dashboard(),
        icon: FolderGit2,
    },
    {
        title: 'Help',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
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
