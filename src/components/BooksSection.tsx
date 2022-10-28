import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useAppSelector } from 'src/hook/useRedux';

const BooksSection = () => {
  const books = useAppSelector((state) => state.books.data);

  return (
    <div>
      <Heading>BooksSection</Heading>
      <Flex direction={'column'}>
        {books.map((book) => {
          return (
            <Box marginBottom={'4'}>
              <p>
                {book.title} - by {book.authors}
              </p>
              <p>{book.description}</p>
            </Box>
          );
        })}
      </Flex>
    </div>
  );
};

export default BooksSection;
