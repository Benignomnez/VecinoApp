"use client";

import { useState } from "react";
import { Box, Icon, Flex, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  isReadOnly?: boolean;
  showLabel?: boolean;
}

const StarRating = ({
  initialRating = 0,
  onChange,
  size = "md",
  isReadOnly = false,
  showLabel = false,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: { size: 16, spacing: 1 },
    md: { size: 20, spacing: 2 },
    lg: { size: 24, spacing: 3 },
  };

  const { size: starSize, spacing } = starSizes[size];

  const handleClick = (selectedRating: number) => {
    if (isReadOnly) return;

    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (isReadOnly) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (isReadOnly) return;
    setHoverRating(0);
  };

  const getLabelText = (value: number) => {
    const labels = [
      "Sin calificar",
      "Pésimo",
      "Malo",
      "Regular",
      "Bueno",
      "Excelente",
    ];
    return labels[value] || labels[0];
  };

  return (
    <Flex direction="column" align="flex-start">
      <Flex>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            cursor={isReadOnly ? "default" : "pointer"}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            mr={spacing}
          >
            <Icon
              as={StarIcon}
              boxSize={starSize}
              color={
                (hoverRating || rating) >= star ? "yellow.400" : "gray.300"
              }
            />
          </Box>
        ))}
      </Flex>

      {showLabel && (
        <Text mt={1} fontSize="sm" color="gray.600">
          {getLabelText(hoverRating || rating)}
        </Text>
      )}
    </Flex>
  );
};

export default StarRating;
