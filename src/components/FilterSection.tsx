import React from 'react';
import { Flex, Heading, Input } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
import { categoriesSlice } from 'src/redux/categories/categories.reducer';

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.data);

  const selectCategory = (id: number) => {
    dispatch(categoriesSlice.actions.selectCategory({ id }));
  };

  return (
    <Flex direction={'column'}>
      <Flex direction={'column'}>
        <Heading>Categories</Heading>
        {categories.map((category) => {
          return (
            <p onClick={() => selectCategory(category.id)}>
              {category.id} - {category.name}
            </p>
          );
        })}
      </Flex>
      <Flex>
        <Heading>Size</Heading>
        <Input placeholder="size" type={'number'} min={5} max={50} />
      </Flex>
    </Flex>
  );
};

export default FilterSection;
