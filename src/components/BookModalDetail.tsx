import {
  Box,
  Heading,
  Image,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  StackDivider,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Book } from 'src/apis/booksApi';

type BookModalDetailProps = {
  book: Book;
};

const BookModalDetail = ({ book }: BookModalDetailProps) => {
  return (
    <>
      <Image src={book.cover_url} alt={book.cover_url} />
      <ModalHeader>{book.title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
          <Box>
            <Heading as="h4" size={'sm'}>
              Authors
            </Heading>
            <Text>{book.authors.join(', ')}</Text>
          </Box>
          <Box>
            <Heading as="h4" size={'sm'}>
              Description
            </Heading>
            <Text>{book.description}</Text>
          </Box>
          <Box>
            <Heading as="h4" size={'sm'}>
              Section
            </Heading>
            <UnorderedList>
              {book.sections.map((section, idx) => (
                <ListItem key={idx}>
                  <Box>
                    <Heading size={'xs'}>{section.title}</Heading>
                    <Text>{section.content}</Text>
                  </Box>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        </VStack>
      </ModalBody>
    </>
  );
};

export default React.memo(BookModalDetail);
