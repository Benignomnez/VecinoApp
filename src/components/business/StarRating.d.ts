import { FC } from "react";

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  isReadOnly?: boolean;
  showLabel?: boolean;
}

declare const StarRating: FC<StarRatingProps>;

export default StarRating;
