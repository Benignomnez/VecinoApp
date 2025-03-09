"use client";

import React from "react";
import { Box, Text, Image, Flex, Badge } from "@chakra-ui/react";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface BusinessCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
}

const BusinessCard = ({
  id,
  name,
  image,
  rating,
  reviewCount,
  location,
  category,
}: BusinessCardProps) => {
  return (
    <Box position="relative">
      <Link
        href={`/business/${id}`}
        passHref
        style={{ textDecoration: "none" }}
      >
        <Box
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
          transition="all 0.3s"
        >
          <Image
            src={image}
            alt={name}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <Box p={4}>
            <Flex justify="space-between" align="center" mb={2}>
              <Badge borderRadius="full" px={2} colorScheme="red">
                {category}
              </Badge>
              <Flex align="center">
                <Text fontWeight="bold" color="orange.400">
                  {rating}
                </Text>
                <Text fontSize="sm" color="gray.500" ml={1}>
                  ({reviewCount} reseñas)
                </Text>
              </Flex>
            </Flex>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={2}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {name}
            </Text>
            <Text
              color="gray.500"
              fontSize="sm"
              overflow="hidden"
              textOverflow="ellipsis"
              display="-webkit-box"
              style={{
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {location}
            </Text>
          </Box>
        </Box>
      </Link>

      {/* Botón de favorito */}
      <FavoriteButton
        placeId={id}
        placeName={name}
        placeImage={image}
        size="sm"
        position="absolute"
        top={3}
        right={3}
      />
    </Box>
  );
};

export default BusinessCard;
