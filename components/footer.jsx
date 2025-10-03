import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  const team = [
    {
      name: "Hariom",
      image: "/owner.jpg", // put in public/
      linkedin: "https://www.linkedin.com/in/hariom-pandey-48ab10326/",
    },
    {
      name: "Saish",
      image: "/saish.jpg",
      linkedin: "https://www.linkedin.com/in/saish-parab-b7b4ab277/",
    },
    {
      name: "Swarnadeep",
      image: "/swarnadeep.jpg",
      linkedin: "https://www.linkedin.com/in/swarnadeep-samajdar-a7641a249/",
    },
    {
      name: "Vivek",
      image: "/vivek.jpg",
      linkedin: "https://www.linkedin.com/in/vivek-sidhdhapura-0b5038345/",
    },
  ];

  return (
<footer className="bg-gray-900 py-6 mt-12">
      <div className="container mx-auto px-6 text-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          {/* Left side → Logo + Name */}
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <Image
              src="/logo.png"
              alt="JobPilot Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-semibold text-white">JobPilot</span>
          </div>

          {/* Right side → Team members */}
          <div className="text-center md:text-right">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">
              Our Team
            </h3>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {team.map((member, idx) => (
                <Link
                  key={idx}
                  href={member.linkedin}
                  target="_blank"
                  className="flex items-center space-x-2 hover:text-white transition"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-600 transform transition duration-300 hover:scale-110 hover:border-blue-400"
                  />
                  <span className="text-sm">{member.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-gray-500">
          © {year} JobPilot. Made with 💗 by Our Team
        </div>
      </div>
    </footer>
  );
}
