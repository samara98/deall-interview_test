import React, { useEffect, useRef } from 'react';
import { Container, Flex } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
// import logo from 'src/logo.svg';
import { getBookListAsync } from 'src/redux/books/books.reducer';
import { getCategoryListAsync } from 'src/redux/categories/categories.reducer';
import FilterSection from 'src/components/FilterSection';
import BooksSection from 'src/components/BooksSection';

function Home() {
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.categories);
  const booksState = useAppSelector((state) => state.books);
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      if (categoriesState.status === 'idle') {
        dispatch(getCategoryListAsync());
      }
    }
    return () => {};
  }, [dispatch, categoriesState.status, booksState.status]);

  useEffect(() => {
    if (categoriesState.selectedCategory) {
      dispatch(getBookListAsync({ categoryId: categoriesState.selectedCategory.id }));
    }
    return () => {};
  }, [dispatch, categoriesState.selectedCategory]);

  return (
    <Container maxW={{ lg: 'container.lg' }}>
      <Flex>
        <Flex w={'25%'}>
          <FilterSection />
        </Flex>
        <Flex w={'75%'}>
          <BooksSection />
        </Flex>
      </Flex>
    </Container>
  );
}

export default Home;
