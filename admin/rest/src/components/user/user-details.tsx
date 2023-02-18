import Image from 'next/image';
import { CheckMarkFill } from '@/components/icons/checkmark-circle-fill';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';

const UserDetails: React.FC = () => {
  const { t } = useTranslation('common');
  const { data, isLoading: loading } = useMeQuery();
  if (loading) return <Loader text={t('text-loading')} />;

  const { name, email, profile, is_active } = data!;

  return (
    <div className="flex flex-col items-center h-full p-5">
      <div className="relative flex items-center justify-center w-32 h-32 overflow-hidden border border-gray-200 rounded-full shrink-0">
        <Image
          src={profile?.avatar?.thumbnail ?? '/avatar-placeholder.svg'}
          layout="fill"
          alt={name}
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-heading">{name}</h3>
      <p className="mt-1 text-sm text-muted">{email}</p>
      {!profile ? (
        <p className="mt-0.5 text-sm text-muted">
          {t('text-add-your')}{' '}
          <Link href={Routes.profileUpdate} className="underline text-accent">
            {t('authorized-nav-item-profile')}
          </Link>
        </p>
      ) : (
        <>
          <p className="mt-0.5 text-sm text-muted">{profile.contact}</p>
        </>
      )}
      <div className="flex items-center justify-center px-3 py-2 mt-6 text-sm border border-gray-200 rounded text-body-dark">
        {is_active ? (
          <CheckMarkFill width={16} className="text-accent me-2" />
        ) : (
          <CloseFillIcon width={16} className="text-red-500 me-2" />
        )}
        {is_active ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};
export default UserDetails;
