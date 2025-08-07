import { ReactNode } from "react";

type TWrapperProps = {
  children: ReactNode;
  className?: string;
};

const Wrapper = ({ children, className }: TWrapperProps) => {
  return (
    <div
      className={`WrapperContainer  w-[97%] sm:w-[94%] xl:w-[90%] xlg:w-[85%] m-auto ${
        className || ""
      } `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
