const stats = [
  {
    id: "1",
    number: "10K+",
    label: "Students Enrolled",
  },
  {
    id: "2",
    number: "500+",
    label: "Courses Completed",
  },
  {
    id: "3",
    number: "50+",
    label: "Expert Instructors",
  },
  {
    id: "4",
    number: "98%",
    label: "Satisfaction Rate",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-teal-600 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="text-5xl font-bold mb-2">{stat.number}</p>
              <p className="text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
