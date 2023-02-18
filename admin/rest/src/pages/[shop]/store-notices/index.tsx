import Card from '@/components/common/card';
import ShopLayout from '@/components/layouts/shop';
import { useState } from 'react';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminAndOwnerOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { useStoreNoticesQuery } from '@/data/store-notice';
import StoreNoticeList from '@/components/store-notice/store-notice-list';
import { Config } from '@/config';
export default function StoreNotices() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;
  const { storeNotices, paginatorInfo, loading, error } = useStoreNoticesQuery({
    limit: 15,
    shop_id: shopId,
    notice: searchTerm,
    page,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-store-notices')}
          </h1>
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search onSearch={handleSearch} />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shop}/store-notices/create`}
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span className="hidden xl:block">
                + {t('form:button-label-add-store-notice')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <StoreNoticeList
        storeNotices={storeNotices}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

StoreNotices.authenticate = {
  permissions: adminAndOwnerOnly,
};
StoreNotices.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
