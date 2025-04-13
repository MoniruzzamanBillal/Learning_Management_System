import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-white pt-4 sm:pt-10 lg:pt-12">
      <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="flex flex-col items-center border-t pt-6">
          <nav className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start md:gap-6">
            <Link
              to={"/"}
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to={"/"}
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              About Us
            </Link>
            <Link
              to={"/"}
              className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
            >
              Courses
            </Link>
          </nav>

          <div className="flex ">
            {/* facebook icon  */}
            <Link
              to={"https://web.facebook.com/MoniruzzamanBillal3018"}
              className="mr-6 text-2xl text-neutral-600 hover:text-blue-700"
            >
              <FaFacebook />
            </Link>

            {/* linkedin icon  */}
            <Link
              to={"https://www.linkedin.com/in/MoniruzzamanBillal3018"}
              className="mr-6 text-2xl text-neutral-600 hover:text-blue-800"
            >
              <FaLinkedin />
            </Link>
            {/* github icon  */}
            <Link
              to={"https://github.com/MoniruzzamanBillal"}
              className="mr-6 text-2xl text-neutral-600 hover:text-neutral-800"
            >
              <FaGithub />
            </Link>
          </div>
        </div>

        <div className="py-3 text-center text-sm text-gray-400">
          © 2024 All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
