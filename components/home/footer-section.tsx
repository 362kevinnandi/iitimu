import { Wrench } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex w-full items-center justify-normal gap-8">
          <div className="">
            <div className="flex items-center mb-4">
              <Wrench className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">Daily</span>
              <span className="text-backgroundPrimary text-xl font-bold">
                TM
              </span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Your personal workspace for better productivity and project
              management
            </p>
          </div>

          <div className="w-full ">
            <ul className="flex flex-col md:flex-wrap gap-4 justify-end">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 DailyTM. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
