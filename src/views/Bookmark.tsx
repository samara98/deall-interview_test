import { CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Book } from 'src/apis/booksApi';
import BookModalDetail from 'src/components/BookModalDetail';
import useDebounce from 'src/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import {
  deleteBookmark,
  selectAllBookmarks,
  selectBookmarksEntities,
} from 'src/redux/bookmarks/bookmarks.reducer';

type BookItemProps = {
  book: Book;
  openBook: () => void;
  selectBookId: Dispatch<SetStateAction<number | null>>;
};

const BookItem = ({ book, openBook, selectBookId }: BookItemProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const onSelectBookItem = async (id: number) => {
    selectBookId(() => id);
    openBook();
  };

  const onDeleteBookmark = (id: number) => {
    dispatch(deleteBookmark(id));
    toast({
      title: 'Bookmark has been deleted',
      status: 'error',
      isClosable: true,
    });
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
              by <span>{book.authors?.join(', ')}</span>
            </Text>
          </Box>
        </Box>
      </HStack>

      <VStack paddingRight={'4'} onClick={() => onDeleteBookmark(book.id)}>
        <DeleteIcon />
        <Text>Delete</Text>
      </VStack>
    </HStack>
  );
};

const Bookmark = () => {
  const books = useAppSelector(selectAllBookmarks);
  const booksEntities = useAppSelector(selectBookmarksEntities);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [qeyword, setQeyword] = useState('');
  const q = useDebounce(qeyword, 300);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [book, setBook] = useState<Book | null>(
    selectedBookId ? booksEntities[selectedBookId] || null : null,
  );

  useEffect(() => {
    const search = q.trim();

    if (search.length >= 3) {
      const searchRegex = new RegExp(search, 'i');
      setFilteredBooks(() => {
        const newState = books.filter((book) => {
          const flag = searchRegex.test(book.title) || searchRegex.test(book.authors?.join(', '));
          return flag;
        });
        return newState;
      });
    } else if (!search) {
      setFilteredBooks(() => books);
    }

    return () => {};
  }, [books, q]);

  useEffect(() => {
    setBook(() => (selectedBookId ? booksEntities[selectedBookId] || null : null));
    return () => {};
  }, [booksEntities, selectedBookId]);

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQeyword(() => e.target.value);
  };
  const onClearSearch = () => {
    setQeyword(() => '');
  };

  const onCloseModal = () => {
    onClose();
    setSelectedBookId(() => null);
  };

  return (
    <Container maxW={{ md: 'container.md' }} mb={'8'}>
      <Box>
        <Flex justifyContent={'space-between'}>
          <Heading mb={'5'}>Bookmark</Heading>
          <Box width={'40%'}>
            <InputGroup>
              <Input variant="filled" placeholder="Search" value={qeyword} onChange={onSearch} />
              <InputRightAddon
                children={<CloseIcon color={'gray'} />}
                onClick={() => onClearSearch()}
              />
            </InputGroup>
          </Box>
        </Flex>

        <VStack spacing={'4'} align="stretch" mb={4}>
          {filteredBooks.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              openBook={onOpen}
              selectBookId={setSelectedBookId}
            />
          ))}
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        {book ? <BookModalDetail book={book} onClose={onCloseModal} /> : null}
      </Modal>
    </Container>
  );
};

export default Bookmark;
