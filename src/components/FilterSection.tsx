import { Box, Button, FormControl, FormLabel, Heading, Select } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { getCategoryListAsync, selectAllCategories } from 'src/redux/categories/categories.reducer';

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const categoryStatus = useAppSelector((state) => state.categories.status);
  const categories = useAppSelector(selectAllCategories);
  const [searchParams, setSearchParams] = useSearchParams();
  const ref = useRef(true);

  const [filter, setFilter] = useState<{
    categoryId?: number | null;
    size?: number | null;
  }>({ size: 10 });

  useEffect(() => {
    if (ref.current && categoryStatus === 'idle') {
      ref.current = false;
      dispatch(getCategoryListAsync());
    }
    return () => {};
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    const size = searchParams.get('size');

    setFilter((prev) => ({
      ...prev,
      categoryId: categoryId ? Number(categoryId) : null,
      size: !!size ? Number(size) : 10,
    }));

    return () => {};
  }, [dispatch, searchParams]);

  const handleSizeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (e.target.name === 'categoryId' || e.target.name === 'size') {
      setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.delete('page');
      return { ...prev, ...filter };
    });
  };

  return (
    <Box flex={'1 1 auto'}>
      <Heading mb={'5'}>Filter</Heading>
      <Box borderWidth={'1px'} borderRadius={'lg'} px={'4'} py={'2'}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryId"
              placeholder="Select Category"
              size={'sm'}
              value={filter.categoryId!}
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
              value={filter.size!}
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
              disabled={!filter.categoryId || !filter.size}
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
