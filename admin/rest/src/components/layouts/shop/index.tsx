import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/layouts/navigation/top-navbar';
import { getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';

const ShopLayout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const {
    query: { shop },
    locale,
  } = useRouter();

  const { permissions: currentUserPermissions } = getAuthCredentials();

  const SidebarItemMap = () => (
    <Fragment>
      {siteSettings.sidebarLinks.shop.map(
        ({ href, label, icon, permissions }) => {
          if (!hasAccess(permissions, currentUserPermissions)) return null;
          return (
            <SidebarItem
              key={label}
              href={href(shop?.toString()!)}
              label={t(label)}
              icon={icon}
            />
          );
        }
      )}
    </Fragment>
  );

  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="fixed bottom-0 hidden h-full px-4 overflow-y-auto bg-white shadow xl:w-76 w-72 pt-22 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
          <div className="flex flex-col py-3 space-y-6">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="w-full ltr:xl:pl-76 rtl:xl:pr-76 ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default ShopLayout;
