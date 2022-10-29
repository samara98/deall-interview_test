import React, { useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Select } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
import { getCategoryListAsync, selectAllCategories } from 'src/redux/categories/categories.reducer';
import { getBookListAsync, getBooksFilter, setBooksFilter } from 'src/redux/books/books.reducer';

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const categoryStatus = useAppSelector((state) => state.categories.status);
  const categories = useAppSelector(selectAllCategories);
  const booksFilter = useAppSelector(getBooksFilter);
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current && categoryStatus === 'idle') {
      ref.current = false;
      dispatch(getCategoryListAsync());
    }
    return () => {};
  }, [categoryStatus, dispatch]);

  const handleSizeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    dispatch(setBooksFilter({ [e.target.name]: Number(e.target.value) }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(
      getBookListAsync({ categoryId: booksFilter.categoryId, size: booksFilter.size, page: 0 }),
    );
  };

  return (
    <Box flex={'1 1 auto'}>
      <Heading>Filter</Heading>
      <Box borderWidth={'1px'} borderRadius={'lg'} px={'4'} py={'2'}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryId"
              placeholder="Select Category"
              size={'sm'}
              value={booksFilter.categoryId}
              onChange={handleSizeChange}
            >
              {categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Page Size</FormLabel>
            <Select
              name="size"
              placeholder="Select Size"
              size={'sm'}
              value={booksFilter.size}
              onChange={handleSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </Select>
          </FormControl>

          <FormControl>
            <Button
              mt={2}
              colorScheme="purple"
              type="submit"
              disabled={!booksFilter.categoryId || !booksFilter.size}
            >
              Find
            </Button>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default React.memo(FilterSection);
