import { TService } from "./Service";

const ServiceCard = ({ service }: { service: TService }) => {
  return (
    <div className="ServiceCardContainer p-4 bg-gray-50 border  border-dotted border-prime100 rounded shadow-sm ">
      <div className="ServiceCardWrapper">
        {/* heading section  */}
        <div className="headingSection flex items-center justify-center  gap-x-4 ">
          <div className="icon text-prime50 ">{service?.icon}</div>
          <p className="  text-lg xsm:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-prime200 ">
            {service?.category}
          </p>
        </div>

        {/* text  */}
        <p className=" mt-4 text-base xsm:text-sm sm:text-base lg:text-lg text-center ">
          {service?.heading}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
