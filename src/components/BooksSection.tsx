import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book } from 'src/apis/booksApi';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { addBookmark, selectBookmarkById } from 'src/redux/bookmarks/bookmarks.reducer';
import {
  getBookListAsync,
  getBooksFilter,
  selectAllBooks,
  selectBooksEntities,
  setBooksFilter,
} from 'src/redux/books/books.reducer';
import BookModalDetail from './BookModalDetail';

type BookItemProps = {
  book: Book;
  openBook: () => void;
  selectBookId: Dispatch<SetStateAction<number | null>>;
};

const BookItem = ({ book, openBook, selectBookId }: BookItemProps) => {
  const dispatch = useAppDispatch();
  const bookmarksEntity = useAppSelector((state) => selectBookmarkById(state, book.id));
  const toast = useToast();

  const onSelectBookItem = async (id: number) => {
    selectBookId(id);
    openBook();
  };

  const onAddBookmark = (book: Book) => {
    if (!bookmarksEntity) {
      dispatch(addBookmark(book));
      toast({
        title: 'Successfully added to bookmark',
        status: 'success',
        isClosable: true,
      });
    }
  };

  return (
    <HStack
      p={'2'}
      borderWidth={'1px'}
      borderRadius={'lg'}
      spacing={'4'}
      justifyContent={'space-between'}
    >
      <HStack flex={'1 1 auto'} onClick={() => onSelectBookItem(book.id)}>
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

      <VStack
        paddingRight={'4'}
        onClick={() => onAddBookmark(book)}
        color={!!bookmarksEntity ? 'purple' : undefined}
      >
        <AddIcon />
        <Text>{!!bookmarksEntity ? 'Bookmarked' : 'Bookmark'}</Text>
      </VStack>
    </HStack>
  );
};

const BooksSection = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectAllBooks);
  const booksEntities = useAppSelector(selectBooksEntities);
  const bookStatus = useAppSelector((state) => state.books.status);
  const booksFilter = useAppSelector(getBooksFilter);
  const [searchParams] = useSearchParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [book, setBook] = useState<Book | null>(
    selectedBookId ? booksEntities[selectedBookId] || null : null,
  );

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
    setBook(() => (selectedBookId ? booksEntities[selectedBookId] || null : null));
    return () => {};
  }, [booksEntities, selectedBookId]);

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(getBookListAsync());
    }, 55);
    return () => {
      clearTimeout(t);
    };
  }, [booksFilter, dispatch]);

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    const size = searchParams.get('size');
    const page = searchParams.get('page');

    dispatch(
      setBooksFilter({ categoryId: Number(categoryId), size: Number(size), page: Number(page) }),
    );
    return () => {};
  }, [dispatch, searchParams]);

  const onCloseModal = () => {
    onClose();
    setSelectedBookId(() => null);
  };

  return (
    <>
      <Box paddingX={{ md: '5' }} flex={'1 1 auto'}>
        <Heading mb={'5'}>Books</Heading>

        {bookStatus === 'succeeded' ? (
          <>
            <VStack spacing={'4'} align="stretch" mb={4}>
              {books.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  openBook={onOpen}
                  selectBookId={setSelectedBookId}
                />
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

      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        {book ? <BookModalDetail book={book} onClose={onCloseModal} /> : null}
      </Modal>
    </>
  );
};

export default BooksSection;
