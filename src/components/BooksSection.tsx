import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book } from 'src/apis/booksApi';
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux';
import {
  getBookListAsync,
  getBooksFilter,
  selectAllBooks,
  selectBook,
  selectBooksEntities,
} from 'src/redux/books/books.reducer';
import BookModalDetail from './BookModalDetail';

type BookItemProps = { book: Book; openBook: () => void };

const BookItem = ({ book, openBook }: BookItemProps) => {
  const dispatch = useAppDispatch();

  const selectBookItem = async (id: number) => {
    dispatch(selectBook({ id }));
    await new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, 34);
    });
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
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectAllBooks);
  const booksEntities = useAppSelector(selectBooksEntities);
  const bookStatus = useAppSelector((state) => state.books.status);
  const bookId = useAppSelector((state) => state.books.selectedBookId);
  const booksFilter = useAppSelector(getBooksFilter);
  const [searchParams] = useSearchParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [book, setBook] = useState<Book | null>(null);

  const setBooksFilterPage = useCallback(
    (to: 'next' | 'prev') => {
      let result = '';
      let newQuery = {};
      if (to === 'next' && bookStatus !== 'failed') {
        newQuery = { ...booksFilter, page: booksFilter.page ? booksFilter.page + 1 : 1 };
        result = new URLSearchParams(newQuery).toString();
      } else if (to === 'prev' && booksFilter.page) {
        newQuery = { ...booksFilter, page: booksFilter.page - 1 };
        result = new URLSearchParams(newQuery).toString();
      }
      return result;
    },
    [bookStatus, booksFilter],
  );

  const prevLinkPage = useMemo(() => setBooksFilterPage('prev'), [setBooksFilterPage]);
  const nextLinkPage = useMemo(() => setBooksFilterPage('next'), [setBooksFilterPage]);

  useEffect(() => {
    if (bookId) {
      const newBook = booksEntities[bookId];
      setBook(() => (newBook ? newBook : null));
    }
    return () => {};
  }, [bookId, booksEntities]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (booksFilter.categoryId && booksFilter.size) {
        dispatch(getBookListAsync());
      }
    }, 55);
    return () => {
      clearTimeout(t);
    };
  }, [booksFilter, dispatch]);

  return (
    <>
      <Box paddingX={{ md: '5' }} flex={'1 1 auto'}>
        <Heading mb={'5'}>Books</Heading>

        {bookStatus === 'succeeded' ? (
          <>
            <VStack spacing={'4'} align="stretch" mb={4}>
              {books.map((book) => (
                <BookItem key={book.id} book={book} openBook={onOpen} />
              ))}
            </VStack>

            <HStack justifyContent={'center'}>
              <Button
                as={Link}
                colorScheme={'purple'}
                to={{ search: prevLinkPage }}
                disabled={!searchParams.get('page')}
              >
                <ChevronLeftIcon />
              </Button>
              <Button as={Link} colorScheme={'purple'} to={{ search: nextLinkPage }}>
                <ChevronRightIcon />
              </Button>
            </HStack>
          </>
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

        {bookStatus === 'failed' ? (
          <Flex flex={'1 1 auto'} justifyContent={'center'}>
            <Text>No books was found, please try to find again.</Text>
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
