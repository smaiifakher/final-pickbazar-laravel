import ShopLayout from '@/components/layouts/shop';
import StoreNoticeCreateOrUpdateForm from '@/components/store-notice/store-notice-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useStoreNoticeQuery } from '@/data/store-notice';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';

export default function UpdateStoreNoticePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { storeNotice, loading, error } = useStoreNoticeQuery({
    id: query.id as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-store-notice')}
        </h1>
      </div>
      <StoreNoticeCreateOrUpdateForm initialValues={storeNotice} />
    </>
  );
}

UpdateStoreNoticePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
UpdateStoreNoticePage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
