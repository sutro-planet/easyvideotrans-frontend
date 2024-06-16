import { FaGithub } from 'react-icons/fa';
import { FaBilibili } from 'react-icons/fa6';
import Link from 'next/link';
import { MdEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Bottom area */}
        <div className="border-t border-gray-200 py-4 md:flex md:items-center md:justify-between md:py-8">
          {/* Social as */}
          <ul className="mb-4 flex md:order-1 md:mb-0 md:ml-4">
            <li>
              <Link
                href="https://space.bilibili.com/278134"
                className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
                aria-label="Twitter"
              >
                <FaBilibili />
              </Link>
            </li>
            <li className="ml-4">
              <Link
                href="https://github.com/sutro-planet/easyvideotrans-service"
                className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
                aria-label="Github"
              >
                <FaGithub />
              </Link>
            </li>
            <li className="ml-4">
              <Link
                href="mailto:zornlink@163.com"
                className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
                aria-label="Github"
              >
                <MdEmail />
              </Link>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="mr-4 text-sm text-gray-600">
            &copy; EasyVideoTrans. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
