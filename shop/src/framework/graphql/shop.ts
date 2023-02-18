import type { ShopQueryOptions } from '@/types';
import { useShopsQuery, useShopQuery } from './gql/shops.graphql';
import { NetworkStatus } from '@apollo/client';

export function useShops(options?: Partial<ShopQueryOptions>) {
  const {
    data,
    loading: isLoading,
    error,
    fetchMore,
    networkStatus,
  } = useShopsQuery({
    variables: {
      is_active: true,
    },
    notifyOnNetworkStatusChange: true,
  });

  function handleLoadMore() {
    if (data?.shops?.paginatorInfo.hasMorePages) {
      fetchMore({
        variables: {
          page: data?.shops?.paginatorInfo?.currentPage + 1,
        },
      });
    }
  }
  return {
    shops: data?.shops?.data ?? [],
    paginatorInfo: data?.shops?.paginatorInfo,
    isLoading,
    error,
    isLoadingMore: networkStatus === NetworkStatus.fetchMore,
    loadMore: handleLoadMore,
    hasMore: Boolean(data?.shops?.paginatorInfo?.hasMorePages),
  };
}

export const useShop = ({ slug }: { slug: string }) => {
  const { data, loading, error } = useShopQuery({
    variables: {
      slug: slug,
    },
    notifyOnNetworkStatusChange: true,
  });
  return {
    data: data?.shop ?? [],
    loading,
    error,
  };
};
