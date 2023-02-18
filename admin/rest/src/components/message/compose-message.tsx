import Select from '@/components/ui/select/select';
import { useShopsQuery } from '@/data/shop';
import { useAdminsQuery } from '@/data/user';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { Shop } from '@/types';
import { useCreateConversations } from '@/data/conversations';
import Button from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import isEmpty from 'lodash/isEmpty';
import ErrorMessage from '@/components/ui/error-message';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { MessageAvatarPlaceholderIcon } from '@/components/icons/message-avatar-placeholder-icon';

type FormatOptionLabelProps = {
  name: string;
  logo: {
    thumbnail: string;
  };
};

const formatOptionLabel = ({ logo, name }: FormatOptionLabelProps) => (
  <div className="flex items-center">
    <div className="relative mr-3 h-6 w-6 shrink-0 overflow-hidden rounded-full">
      {!isEmpty(logo?.thumbnail) ? (
        <Image
          src={logo?.thumbnail}
          alt={name}
          layout="fill"
          objectFit="contain"
          className="product-image"
        />
      ) : (
        <MessageAvatarPlaceholderIcon
          className="text-[1.5rem]"
          color="#DDDDDD"
        />
      )}
    </div>
    <div className="truncate">{name}</div>
  </div>
);

const ComposeMessageModal = () => {
  const [shop, setShop] = useState(null);
  const [active, setIsActive] = useState<boolean>(Boolean(0));
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  let options = {
    limit: 1000,
    page: 1,
    orderBy: 'created_at',
    sortedBy: SortOrder.Desc as SortOrder,
  };

  let { shops, loading, error } = useShopsQuery(options);
  let {
    admins,
    loading: adminLoading,
    error: adminError,
  } = useAdminsQuery(options);
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const { handleSubmit } = useForm();
  let lists = permission ? shops : admins;
  let loadingState = permission ? loading : adminLoading;
  let errorState = permission ? error : adminError;

  if (errorState) return <ErrorMessage message={error?.message} />;

  const onTypeFilter = (shop: Shop[] | undefined) => {
    // @ts-ignore
    setShop(shop?.id);
    // @ts-ignore
    setIsActive(shop?.is_active);
  };
  async function onSubmit() {
    if (shop || !Boolean(active)) {
      createConversations({
        // @ts-ignore
        shop_id: shop,
      });
    }
  }
  return (
    <div className="m-auto block max-w-lg rounded bg-light p-6 md:w-[32.5rem]">
      <h2 className="mb-6 text-base font-medium">{t('text-starting-chat')}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          options={lists}
          isLoading={loadingState}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder="Find Vendor"
          onChange={onTypeFilter as any}
          isClearable={true}
          // @ts-ignore
          formatOptionLabel={formatOptionLabel}
        />
        <div className="mt-6 text-right">
          <Button
            className="h-full px-4 text-base"
            loading={creating}
            disabled={!!creating || !shop || !Boolean(active)}
          >
            {t('text-start-conversation')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComposeMessageModal;
