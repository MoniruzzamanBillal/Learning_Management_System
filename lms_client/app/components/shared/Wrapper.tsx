import type { ReactNode } from "react";

type TWrapperProps = {
  children: ReactNode;
  className?: string;
};

const Wrapper = ({ children, className }: TWrapperProps) => {
  return (
    <div
      className={`WrapperContainer  w-[96%] sm:w-[92%] xl:w-[90%] xlg:w-[85%] m-auto ${
        className || ""
      } `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
