import ShopLayout from '@/components/layouts/shop';
import StoreNoticeCreateOrUpdateForm from '@/components/store-notice/store-notice-form';
import { useTranslation } from 'next-i18next';
import { adminAndOwnerOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateStoreNotice() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-store-notice')}
        </h1>
      </div>
      <StoreNoticeCreateOrUpdateForm />
    </>
  );
}
CreateStoreNotice.authenticate = {
  permissions: adminAndOwnerOnly,
};
CreateStoreNotice.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
