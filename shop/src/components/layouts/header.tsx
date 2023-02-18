import Logo from '@/components/ui/logo';
import cn from 'classnames';
import StaticMenu from './menu/static-menu';
import { useAtom } from 'jotai';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { authorizationAtom } from '@/store/authorization-atom';
import { useIsHomePage } from '@/lib/use-is-homepage';
import { useMemo } from 'react';
import GroupsDropdownMenu from './menu/groups-menu';
import { useHeaderSearch } from '@/layouts/headers/header-search-atom';
import LanguageSwitcher from '@/components/ui/language-switcher';

const Search = dynamic(() => import('@/components/ui/search/search'));
const AuthorizedMenu = dynamic(() => import('./menu/authorized-menu'), {
  ssr: false,
});
const JoinButton = dynamic(() => import('./menu/join-button'), { ssr: false });

const Header = ({ layout }: { layout?: string }) => {
  const { t } = useTranslation('common');
  const { show, hideHeaderSearch } = useHeaderSearch();
  const [displayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const isHomePage = useIsHomePage();
  const isMultilangEnable =
    process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
    !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

  // useEffect(() => {
  //   if (!isHomePage) {
  //     hideHeaderSearch();
  //   }
  // }, [isHomePage]);
  const isFlattenHeader = useMemo(
    () => !show && isHomePage && layout !== 'modern',
    [show, isHomePage, layout]
  );
  return (
    <header
      className={cn(
        'site-header-with-search sticky top-0 z-50 h-14 md:h-16 lg:h-22',
        {
          'lg:!h-auto': isFlattenHeader,
        }
      )}
    >
      <div
        className={cn(
          ' flex h-14 w-full transform-gpu items-center justify-between border-b border-border-200 bg-light px-4 py-5 shadow-sm transition-transform duration-300 md:h-16 lg:h-22 lg:px-8',
          {
            'lg:absolute lg:border-0 lg:bg-transparent lg:shadow-none':
              isFlattenHeader,
          }
        )}
      >
        <div className="flex items-center w-full lg:w-auto">
          <Logo
            className={`${
              !isMultilangEnable ? 'mx-auto lg:mx-0' : 'ltr:ml-0 rtl:mr-0'
            }`}
          />

          {isMultilangEnable ? (
            <div className="ltr:ml-auto rtl:mr-auto lg:hidden">
              <LanguageSwitcher />
            </div>
          ) : (
            ''
          )}

          <div className="hidden ltr:ml-10 ltr:mr-auto rtl:mr-10 rtl:ml-auto xl:block">
            <GroupsDropdownMenu />
          </div>
        </div>
        {isHomePage ? (
          <>
            {(show || layout === 'modern') && (
              <div className="hidden w-full px-10 mx-auto overflow-hidden lg:block xl:w-11/12 2xl:w-10/12">
                <Search label={t('text-search-label')} variant="minimal" />
              </div>
            )}

            {displayMobileHeaderSearch && (
              <div className="absolute top-0 block h-full w-full bg-light px-5 pt-1.5 ltr:left-0 rtl:right-0 md:pt-2 lg:hidden">
                <Search label={t('text-search-label')} variant="minimal" />
              </div>
            )}
          </>
        ) : null}
        <ul className="items-center hidden shrink-0 space-x-7 rtl:space-x-reverse lg:flex 2xl:space-x-10">
          <StaticMenu />
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <a
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/register`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-3 py-0 text-sm font-semibold leading-none transition duration-300 ease-in-out border border-transparent rounded outline-none h-9 shrink-0 bg-accent text-light hover:bg-accent-hover focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700"
            >
              {t('text-become-seller')}
            </a>
            <li>{isAuthorize ? <AuthorizedMenu /> : <JoinButton />}</li>
          </div>
          {isMultilangEnable ? (
            <div className="flex-shrink-0 hidden ms-auto lg:me-5 xl:me-8 2xl:me-10 lg:block">
              <LanguageSwitcher />
            </div>
          ) : (
            ''
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
