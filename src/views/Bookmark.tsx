import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
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

  const onSelectBookItem = async (id: number) => {
    selectBookId(() => id);
    openBook();
  };

  const onDeleteBookmark = (id: number) => {
    dispatch(deleteBookmark(id));
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
  const [book, setBook] = useState(selectedBookId ? booksEntities[selectedBookId] : null);

  useEffect(() => {
    const search = q.trim();

    if (!!search) {
      const searchRegex = new RegExp(search, 'i');
      setFilteredBooks(() => {
        const newState = books.filter((book) => {
          const flag = searchRegex.test(book.title) || searchRegex.test(book.authors?.join(', '));
          return flag;
        });
        return newState;
      });
    } else {
      setFilteredBooks(() => books);
    }

    return () => {};
  }, [books, q]);

  useEffect(() => {
    setBook(() => booksEntities[selectedBookId!]);
    return () => {};
  }, [booksEntities, selectedBookId]);

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQeyword(() => e.target.value);
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
            <Input variant="filled" placeholder="Search" value={qeyword} onChange={onSearch} />
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
        <ModalContent>
          {book ? <BookModalDetail book={book} /> : null}

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Bookmark;
