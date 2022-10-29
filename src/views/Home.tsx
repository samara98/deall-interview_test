import React, { useEffect } from 'react';
import { Container, Flex } from '@chakra-ui/react';
// import logo from 'src/logo.svg';
import FilterSection from 'src/components/FilterSection';
import BooksSection from 'src/components/BooksSection';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
import { getBookListAsync } from 'src/redux/books/books.reducer';

function Home() {
  const dispatch = useAppDispatch();
  const bookStatus = useAppSelector((state) => state.books.status);
  const selectedCategoryId = useAppSelector((state) => state.categories.selectedCategoryId);

  useEffect(() => {
    if (selectedCategoryId && bookStatus === 'idle') {
      dispatch(getBookListAsync({ categoryId: selectedCategoryId }));
    }
    return () => {};
  }, [bookStatus, dispatch, selectedCategoryId]);

  return (
    <Container maxW={{ lg: 'container.lg' }}>
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Flex w={{ md: '25%' }} mb={{ base: '5', md: '2' }}>
          <FilterSection />
        </Flex>
        <Flex w={{ md: '75%' }}>
          <BooksSection />
        </Flex>
      </Flex>
    </Container>
  );
}

export default React.memo(Home);
