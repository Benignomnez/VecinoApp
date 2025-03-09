"use client";

import { Box, Skeleton, SkeletonText, Flex } from "@chakra-ui/react";

const BusinessCardSkeleton = () => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      transition="transform 0.3s, box-shadow 0.3s"
      height="100%"
    >
      <Skeleton height="200px" width="100%" />
      <Box p={4}>
        <SkeletonText mt="2" noOfLines={1} spacing="4" skeletonHeight="6" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" />
        <Flex mt={4} align="center">
          <Skeleton height="20px" width="100px" />
        </Flex>
        <Flex mt={2} justify="space-between" align="center">
          <Skeleton height="20px" width="80px" />
          <Skeleton height="30px" width="30px" borderRadius="full" />
        </Flex>
      </Box>
    </Box>
  );
};

export default BusinessCardSkeleton;
