"use client";

import { useState } from "react";

export default function CourseDetailPage({ id }: { id: string }) {
  const [review, setReview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h1>CourseDetailPage</h1>
      <h1>CourseDetailPage</h1>
      <h1>CourseDetailPage</h1>
      <h1>CourseDetailPage</h1>
      <h1>CourseDetailPage</h1>
      <h1>CourseDetailPage</h1>
    </div>
  );
}
