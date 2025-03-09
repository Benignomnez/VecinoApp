"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Divider,
  Avatar,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { getReviewsByPlace } from "@/lib/supabase/client";
import StarRating from "./StarRating";

interface ReviewListProps {
  placeId: string;
  refreshTrigger?: number; // Un valor que cambia para forzar la recarga de reseñas
}

interface ReviewWithProfile {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

const ReviewList = ({ placeId, refreshTrigger = 0 }: ReviewListProps) => {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await getReviewsByPlace(placeId);

        if (error) {
          throw error;
        }

        if (data) {
          setReviews(data as ReviewWithProfile[]);
        }
      } catch (err) {
        console.error("Error al cargar las reseñas:", err);
        setError(
          "No se pudieron cargar las reseñas. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId, refreshTrigger]);

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Box key={i} mb={6}>
            <Flex mb={2}>
              <SkeletonCircle size="10" mr={2} />
              <Box flex="1">
                <Skeleton height="20px" width="150px" mb={2} />
                <Skeleton height="15px" width="100px" />
              </Box>
            </Flex>
            <SkeletonText mt={2} noOfLines={3} spacing="2" />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} borderRadius="md" bg="red.50" color="red.500">
        {error}
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box p={4} borderRadius="md" bg="gray.50" textAlign="center">
        <Text>
          No hay reseñas para este lugar todavía. ¡Sé el primero en opinar!
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <Box key={review.id} mb={6}>
          {index > 0 && <Divider mb={4} />}

          <Flex mb={2}>
            <Avatar
              name={review.profiles.full_name}
              src={review.profiles.avatar_url || undefined}
              size="md"
              mr={3}
            />
            <Box>
              <Text fontWeight="bold">{review.profiles.full_name}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(review.created_at).toLocaleDateString()}
              </Text>
            </Box>
          </Flex>

          <Box mb={2}>
            <StarRating initialRating={review.rating} isReadOnly size="sm" />
          </Box>

          <Text>{review.comment}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default ReviewList;
