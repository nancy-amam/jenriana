"use client";

import { Instagram, Twitter, MessageCircleMore, Mail, MapPin, PhoneCall } from "lucide-react";

export default function ContactUsPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Form submitted! (This is a placeholder action)");
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white py-12 px-4 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left  mb-10 lg:mb-0">
            <h1 className="text-2xl md:text-[80px] font-extrabold text-white leading-[56px] mb-4"></h1>
            <p className=" text-xl md:text-[28px] font-bold text-white ">
              Please fill the form and we will be happy to assist you.
            </p>
          </div>

          {/* Right Side: Contact Form Card */}
          <div className="w-full lg:w-[617px] h-auto lg:h-[403px] bg-[#373737] rounded-[20px] p-6 lg:p-4 flex flex-col justify-center shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full h-[52px] rounded-[12px] p-4 bg-[#484848] text-white placeholder-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full h-[52px] rounded-[12px] p-4 bg-[#484848] text-white placeholder-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full h-[52px] rounded-[12px] p-4 bg-[#484848] text-white placeholder-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full h-[52px] rounded-[12px] p-4 bg-[#484848] text-white placeholder-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full h-[139px] rounded-[12px] p-4 bg-[#484848] text-white placeholder-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
              ></textarea>
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Social Section */}
        <div className="mb-16 ">
          <div className=" flex gap-5">
            <h2 className="text-xl font-semibold mb-4">Social:</h2>
            <div className="flex gap-6 mb-6">
              <a href="#" aria-label="Instagram" className="text-white hover:text-gray-400 transition-colors">
                <Instagram size={32} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-gray-400 transition-colors">
                <Twitter size={32} />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-white hover:text-gray-400 transition-colors">
                <MessageCircleMore size={32} />
              </a>
            </div>
          </div>
          <p className=" text-xl md:text-[48px] text-white">Let us know what we can do for you</p>
        </div>

        {/* Three Contact Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Email Us Card */}
          <div className="w-full h-[270px] bg-[#373737] rounded-[8px] p-8 flex flex-col items-center text-center shadow-lg">
            <Mail size={48} className="text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-base text-[#d1d5db] mb-4">Send us an email for any inquiries.</p>
            <p className="text-lg font-medium">info@jenriana.com</p>
          </div>

          {/* Visit Us Card */}
          <div className="w-full h-[270px] bg-[#373737] rounded-[8px] p-8 flex flex-col items-center text-center shadow-lg">
            <MapPin size={48} className="text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-base text-[#d1d5db] mb-4">Come say hello at our office location.</p>
            <p className="text-lg font-medium">123 Main St, City, Country</p>
          </div>

          {/* Call Us Card */}
          <div className="w-full h-[270px] bg-[#373737] rounded-[8px] p-8 flex flex-col items-center text-center shadow-lg">
            <PhoneCall size={48} className="text-white mb-4" />
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-base text-[#d1d5db] mb-4">Reach out to us by phone.</p>
            <p className="text-lg font-medium">+234 801 234 5678</p>
          </div>
        </div>
      </div>
    </div>
  );
}
