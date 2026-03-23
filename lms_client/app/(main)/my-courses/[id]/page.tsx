export default function page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <h1>Course ID: {id}</h1>
    </div>
  );
}
