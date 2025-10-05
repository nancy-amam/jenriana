import Link from "next/link";
import { InstagramIcon, TwitterIcon, PhoneIcon as WhatsappIcon, MailIcon, PhoneIcon, MountainIcon } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#212121] text-[#9ca3af] text-base py-16 md:py-16 px-5 md:px-20 ">
      <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 justify-around  gap-10 ">
        {/* Jenrianna Section */}
        <div className="flex flex-col gap-4 col-span-2 lg:col-span-1 ">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <Image src={"/images/logo2.jpg"} alt="Jenriana" width={100} height={30} />
          </Link>
          <p className="text-sm leading-relaxed max-w-[270px]">
            Your trusted partner for short-term apartment rentals across Nigeria.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/apartment" className="text-sm hover:underline underline-offset-4">
                Apartments
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="text-sm hover:underline underline-offset-4">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/policy" className="text-sm hover:underline underline-offset-4">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="feedback" className="text-sm hover:underline underline-offset-4">
                Feedback
              </Link>
            </li>
            <li>
              <Link href="policy" className="text-sm hover:underline underline-offset-4">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              <a href="mailto:info@jenrianna.com" className="text-sm hover:underline underline-offset-4">
                info@jenrianna.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              <a href="tel:+2348012345678" className="text-sm hover:underline underline-offset-4">
                +234 801 234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#" aria-label="Instagram">
              <InstagramIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <TwitterIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="WhatsApp">
              <WhatsappIcon className="h-6 w-6 hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center text-xs text-gray-500 mt-8 pt-8 border-t border-gray-700">
        &copy; {new Date().getFullYear()} Jenrianna. All rights reserved.
      </div>
    </footer>
  );
}
