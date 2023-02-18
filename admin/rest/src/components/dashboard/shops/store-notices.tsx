import ErrorMessage from '@/components/ui/error-message';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useStoreNoticesLoadMoreQuery } from '@/data/store-notice';
import { SortOrder, StoreNotice } from '@/types';
import StoreNoticeCard from '@/components/store-notice/store-notice-card';
import Button from '@/components/ui/button';
import { NoShop } from '@/components/icons/no-shop';
import { LIMIT } from '@/utils/constants';
import NotFound from '@/components/ui/not-found';

function StoreNotices() {
  const { t } = useTranslation();

  const { storeNotices, loading, error, hasNextPage, isLoadingMore, loadMore } =
    useStoreNoticesLoadMoreQuery({
      limit: LIMIT,
      orderBy: 'effective_from',
      sortedBy: SortOrder.Asc,
    });
  const sortedData = [...storeNotices].reverse();

  if (!loading && !storeNotices?.length)
    return (
      <div className="w-full min-h-full px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-notice-not-found" className="w-7/12 mx-auto" />
      </div>
    );

  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <>
      {storeNotices ? (
        <div className="space-y-4 md:space-y-5">
          {sortedData?.map((notice: StoreNotice, idx: number) => (
            <StoreNoticeCard noticeData={notice} key={idx} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="relative w-72 sm:h-80 sm:w-96">
            <NoShop />
          </div>
          <div className="pt-5 text-sm font-semibold">
            {t('common:text-empty-notice')}
          </div>
        </div>
      )}

      {hasNextPage && (
        <div className="grid mt-8 place-content-center md:mt-10">
          <Button onClick={loadMore} loading={isLoadingMore}>
            {t('common:text-load-more')}
          </Button>
        </div>
      )}
    </>
  );
}

export default StoreNotices;
