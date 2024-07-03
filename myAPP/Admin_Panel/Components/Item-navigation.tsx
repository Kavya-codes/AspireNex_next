import { useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CategoryIcon from "@mui/icons-material/Category";
import GradingIcon from "@mui/icons-material/Grading";
import SettingsIcon from "@mui/icons-material/Settings";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import GroupIcon from "@mui/icons-material/Group";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: <DashboardIcon className="h-4 w-4 mr-2" />,
    href: `/admin`,
  },
  {
    label: "Orders",
    icon: <GradingIcon className="h-4 w-4 mr-2" />,
    href: `/admin/orders`,
  },
  {
    label: "Products",
    icon: <ProductionQuantityLimitsIcon className="h-4 w-4 mr-2" />,
    href: `/admin/products`,
  },
  {
    label: "Billboards",
    icon: <ArtTrackIcon className="h-4 w-4 mr-2" />,
    href: `/admin/billboards`,
  },
  {
    label: "Categories",
    icon: <CategoryIcon className="h-4 w-4 mr-2" />,
    href: `/admin/categories`,
  },
  {
    label: "Sizes",
    icon: <FullscreenExitIcon className="h-4 w-4 mr-2" />,
    href: `/admin/sizes`,
  },
  {
    label: "Manage Users",
    icon: <GroupIcon className="h-4 w-4 mr-2" />,
    href: `/admin/users`,
  },
  {
    label: "Settings",
    icon: <SettingsIcon className="h-4 w-4 mr-2" />,
    href: `/admin/settings`,
  },
];

const NavItem = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const onClickHandler = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col">
      {routes.map((route) => (
        <Button
          key={route.href}
          onClick={() => onClickHandler(route.href)}
          size="sm"
          variant="ghost"
          className={`w-full text-gray-800 font-normal justify-start ${
            (pathname === route.href ||
              pathname.startsWith(`${route.href}/new`)) &&
            "bg-gray-200 text-gray-900"
          }`}
        >
          {route.icon}
          {route.label}
        </Button>
      ))}
    </div>
  );
};

export default NavItem;
