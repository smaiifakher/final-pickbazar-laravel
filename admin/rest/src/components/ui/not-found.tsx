import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface Props {
  text?: string;
  className?: string;
}

const NotFound: React.FC<Props> = ({ className, text }) => {
  const { t } = useTranslation('common');
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative flex h-full min-h-[380px] w-full items-center justify-center md:min-h-[450px]">
        <Image
          src="/no-result.svg"
          alt={text ? t(text) : t('text-no-result-found')}
          className="object-contain w-full h-full"
          layout="fill"
        />
      </div>
      {text && (
        <h3 className="w-full text-xl font-semibold text-center my-7 text-body">
          {t(text)}
        </h3>
      )}
    </div>
  );
};

export default NotFound;
