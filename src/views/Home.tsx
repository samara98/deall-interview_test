import { Container, Flex } from '@chakra-ui/react';
import React from 'react';
import FilterSection from 'src/components/FilterSection';
import BooksSection from 'src/components/BooksSection';

function Home() {
  return (
    <Container maxW={{ lg: 'container.lg' }} mb={'8'}>
      <Flex direction={{ base: 'column', md: 'row' }}>
        <Flex w={{ md: '25%' }} mb={{ base: '5', md: '2' }}>
          <FilterSection />
        </Flex>
        <Flex w={{ md: '75%' }}>
          <BooksSection />
        </Flex>
      </Flex>
    </Container>
  );
}

export default React.memo(Home);
