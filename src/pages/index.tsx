import { useMemo } from 'react';
import Head from 'next/head';

import { useInfiniteQuery } from 'react-query';

import { Button, Box } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type IInfiniteQueryResponse = {
  after: number | null;
  data: Card[];
};

export default function Home(): JSX.Element {
  const getDBImages = async ({
    pageParam = null,
  }): Promise<IInfiniteQueryResponse> => {
    const { data } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage = null,
  } = useInfiniteQuery<unknown, unknown, IInfiniteQueryResponse>(
    'images',
    getDBImages,
    {
      getNextPageParam: (lastPage: { after: number }) => lastPage.after,
    }
  );

  const formattedData = useMemo(() => {
    const imgsData = data?.pages.map(page => page.data).flat();
    return imgsData;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) return <Loading />;

  // TODO RENDER ERROR SCREEN
  if (isError) return <Error />;

  return (
    <>
      <Head>
        <title>UpFi</title>
        <link rel="shortcut icon" href="logo.svg" />
      </Head>

      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button mt={8} onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
