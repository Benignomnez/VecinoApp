"use client";

import React, { useState } from "react";
import { Box, Text, Image, Flex, Badge, Icon, Tooltip } from "@chakra-ui/react";
import { StarIcon, TimeIcon, InfoIcon } from "@chakra-ui/icons";
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
  const [imageError, setImageError] = useState(false);

  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  // Función para renderizar estrellas basadas en la calificación
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`star-${i}`} as={StarIcon} color="yellow.400" boxSize={3} />
      );
    }

    // Media estrella si es necesario
    if (hasHalfStar) {
      stars.push(
        <Icon
          key="half-star"
          as={StarIcon}
          color="yellow.400"
          boxSize={3}
          opacity={0.6}
        />
      );
    }

    // Estrellas vacías
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-star-${i}`}
          as={StarIcon}
          color="gray.300"
          boxSize={3}
        />
      );
    }

    return stars;
  };

  return (
    <Box position="relative">
      <Link
        href={`/business/${id}`}
        passHref
        style={{ textDecoration: "none" }}
      >
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          boxShadow="sm"
          _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
          transition="transform 0.3s, box-shadow 0.3s"
          height="100%"
        >
          <Box position="relative" height="200px" overflow="hidden">
            <Image
              src={imageError ? "/placeholder-image.jpg" : image}
              alt={name}
              height="100%"
              width="100%"
              objectFit="cover"
              onError={handleImageError}
              transition="transform 0.5s"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bg="linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)"
              height="60px"
              pointerEvents="none"
            />
            <Badge
              position="absolute"
              top={3}
              left={3}
              borderRadius="full"
              px={2}
              py={1}
              colorScheme="red"
              fontSize="xs"
              textTransform="uppercase"
              fontWeight="bold"
              boxShadow="sm"
            >
              {category}
            </Badge>
          </Box>

          <Box p={4}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={2}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              color="gray.800"
            >
              {name}
            </Text>

            <Flex align="center" mb={2}>
              <Flex mr={2}>{renderStars(rating)}</Flex>
              <Text fontSize="sm" color="gray.600">
                {rating.toFixed(1)} ({reviewCount})
              </Text>
            </Flex>

            <Flex align="center" color="gray.500" fontSize="sm">
              <Icon as={InfoIcon} mr={1} boxSize={3} />
              <Text
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
            </Flex>
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
