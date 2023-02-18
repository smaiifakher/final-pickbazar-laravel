import useLayout from '@/lib/hooks/use-layout';
import Header from './header';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';
import Footer from './footer';
import NoticeHighlightedBar from '@/components/store-notice/notice-highlightedBar';
import { useRouter } from 'next/router';

export default function SiteLayout({ children }: React.PropsWithChildren<{}>) {
  const { layout } = useLayout();
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100">
      {router.query.slug && <NoticeHighlightedBar />}

      {['minimal', 'compact'].includes(layout) ? (
        <HeaderMinimal layout={layout} />
      ) : (
        <Header layout={layout} />
      )}
      {children}
      {['compact'].includes(layout) && <Footer />}
      <MobileNavigation />
    </div>
  );
}
export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);
