import { TService } from "./Service";

const ServiceCard = ({ service }: { service: TService }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6">
      {/* Icon container */}
      <div className="bg-indigo-50 rounded-lg p-3 w-fit mb-4">
        <span className="text-prime-100">{service.icon}</span>
      </div>

      {/* Category name */}
      <p className="font-semibold text-gray-900 text-base mb-1">
        {service.category}
      </p>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">{service.heading}</p>
    </div>
  );
};

export default ServiceCard;
