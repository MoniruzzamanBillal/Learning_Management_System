import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | My Course",
};

type TpageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: TpageProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Course ID: {id}</h1>
    </div>
  );
}
