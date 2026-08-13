const stats = [
  { number: "10K+", label: "Students Enrolled" },
  { number: "500+", label: "Courses Completed" },
  { number: "50+", label: "Expert Instructors" },
  { number: "98%", label: "Satisfaction Rate" },
];

const StatsSection = () => {
  return (
    <section className="bg-prime-100 py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center py-6 px-4 ${
                index < stats.length - 1
                  ? "border-b-2 lg:border-b-0 lg:border-r border-indigo-400/40"
                  : ""
              } ${index % 2 === 0 && index < stats.length - 1 ? "border-r border-indigo-400/40 lg:border-r-0" : ""}`}
            >
              <p className="text-4xl sm:text-5xl font-bold text-white mb-1">
                {stat.number}
              </p>
              <p className="text-indigo-200 text-base sm:text-lg">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
