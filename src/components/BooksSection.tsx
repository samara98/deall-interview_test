import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
import { selectAllBooks, selectBook, selectBooksEntities } from 'src/redux/books/books.reducer';
import { Book } from 'src/apis/booksApi';
import BookModalDetail from './BookModalDetail';

type BookItemProps = { book: Book; openBook: () => void };

const BookItem = ({ book, openBook }: BookItemProps) => {
  const dispatch = useAppDispatch();

  const selectBookItem = (id: number) => {
    dispatch(selectBook({ id }));
    openBook();
  };

  return (
    <HStack
      p={'2'}
      borderWidth={'1px'}
      borderRadius={'lg'}
      spacing={'4'}
      onClick={() => selectBookItem(book.id)}
    >
      <Image height={'100px'} src={book.cover_url} alt={book.cover_url} />
      <Box>
        <Heading as="h3" size={'md'}>
          {book.title}
        </Heading>
        <Box>
          <Text>
            by <span>{book.authors.join(', ')}</span>
          </Text>
        </Box>
      </Box>
    </HStack>
  );
};

const BooksSection = () => {
  const books = useAppSelector(selectAllBooks);
  const booksEntities = useAppSelector(selectBooksEntities);
  const bookStatus = useAppSelector((state) => state.books.status);
  const bookId = useAppSelector((state) => state.books.selectedBookId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (bookId) {
      const newBook = booksEntities[bookId];
      setBook(() => (newBook ? newBook : null));
    }
    return () => {};
  }, [bookId, booksEntities]);

  return (
    <>
      <Box paddingX={{ md: '5' }} flex={'1 1 auto'}>
        <Heading>Books</Heading>

        {bookStatus === 'succeeded' ? (
          <VStack spacing={'4'} align="stretch">
            {books.map((book) => (
              <BookItem key={book.id} book={book} openBook={onOpen} />
            ))}
          </VStack>
        ) : null}

        {bookStatus === 'loading' ? (
          <Flex flex={'1 1 auto'} justifyContent={'center'}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        ) : null}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {book ? <BookModalDetail book={book} /> : null}

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BooksSection;
