import React from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

const CreditsPage = () => {
  const libraries = [
    {
      name: "Lucide React",
      description: "Beautiful & consistent icon toolkit",
      url: "https://lucide.dev/",
      license: "ISC License",
      usage: "Icons throughout the application",
    },
    {
      name: "Headless UI",
      description: "Unstyled, fully accessible UI components",
      url: "https://headlessui.com/",
      license: "MIT License",
      usage: "UI components (Button, Menu, Switch, Input)",
    },
    {
      name: "Next.js",
      description: "The React Framework for the Web",
      url: "https://nextjs.org/",
      license: "MIT License",
      usage: "React framework and routing",
    },
    {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      url: "https://reactjs.org/",
      license: "MIT License",
      usage: "Core UI library",
    },
    {
      name: "Tailwind CSS",
      description: "A utility-first CSS framework",
      url: "https://tailwindcss.com/",
      license: "MIT License",
      usage: "Styling and responsive design",
    },
    {
      name: "Fabric.js",
      description: "A powerful and simple Javascript HTML5 canvas library",
      url: "http://fabricjs.com/",
      license: "MIT License",
      usage: "Canvas manipulation for mockup editor",
    },
    {
      name: "React Dropzone",
      description: "Simple HTML5 drag-drop zone with React.js",
      url: "https://react-dropzone.js.org/",
      license: "MIT License",
      usage: "File upload functionality",
    },
    {
      name: "React Hot Toast",
      description: "Smoking hot React notifications",
      url: "https://react-hot-toast.com/",
      license: "MIT License",
      usage: "Toast notifications",
    },
    {
      name: "Next Themes",
      description: "Perfect dark mode in Next.js",
      url: "https://github.com/pacocoursey/next-themes",
      license: "MIT License",
      usage: "Dark/light theme switching",
    },
    {
      name: "tRPC",
      description: "End-to-end typesafe APIs made easy",
      url: "https://trpc.io/",
      license: "MIT License",
      usage: "API layer and client-server communication",
    },
    {
      name: "NextAuth.js",
      description: "Authentication for Next.js",
      url: "https://next-auth.js.org/",
      license: "ISC License",
      usage: "Authentication system",
    },
    {
      name: "Drizzle ORM",
      description: "TypeScript ORM that feels like writing SQL",
      url: "https://orm.drizzle.team/",
      license: "Apache 2.0 License",
      usage: "Database ORM",
    },
    {
      name: "Zod",
      description: "TypeScript-first schema validation",
      url: "https://zod.dev/",
      license: "MIT License",
      usage: "Schema validation",
    },
    {
      name: "AWS SDK",
      description: "AWS SDK for JavaScript",
      url: "https://aws.amazon.com/sdk-for-javascript/",
      license: "Apache 2.0 License",
      usage: "S3 and Lambda integration",
    },
  ];

  const fonts = [
    {
      name: "Poppins",
      description: "Geometric sans serif typeface",
      url: "https://fonts.google.com/specimen/Poppins",
      license: "Open Font License",
      usage: "Primary application font",
    },
  ];

  const icons = [
    {
      name: "Lucide Icons",
      license: "ISC License",
      url: "https://lucide.dev/",
      used: [
        "Home",
        "Images",
        "Moon",
        "Sun",
        "User2",
        "Laptop",
        "FolderSync",
        "SquareChevronUp",
        "CloudUpload",
        "ArrowLeft",
        "Info",
        "X",
        "ExternalLink",
      ],
    },
    {
      name: "Simple Icons",
      license: "CC0 1.0 Universal",
      url: "https://simpleicons.org/",
      used: ["Github"],
    },
    {
      name: "Flaticon Image Icon by Graphics Plazza",
      license: "Flaticon License",
      url: "https://www.flaticon.com/free-icons/image-placeholder",
      used: ["favicon"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 pb-8 space-y-8">
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          Credits & Attribution
        </h1>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          This project is built with amazing open-source libraries and tools.
          We&apos;re grateful to all the contributors and maintainers.
        </p>
      </div>

      {/* Libraries Section */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-bold border-b border-secondary-light dark:border-secondary-dark
            pb-2"
        >
          {"Libraries & Frameworks"}
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
          {libraries.map((library) => (
            <div
              key={library.name}
              className="p-3 md:p-4 rounded-lg bg-secondary-light dark:bg-secondary-dark space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold">
                  {library.name}
                </h3>
                <Link
                  href={library.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info-light dark:text-info-dark hover:opacity-80 transition-opacity"
                >
                  <ExternalLinkIcon size={16} />
                </Link>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {library.description}
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-success-light dark:text-success-dark">
                  {library.license}
                </span>
                <span className="text-neutral-500">{library.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonts Section */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-bold border-b border-secondary-light dark:border-secondary-dark
            pb-2"
        >
          Fonts
        </h2>
        <div className="grid gap-3 lg:gap-4">
          {fonts.map((font) => (
            <div
              key={font.name}
              className="p-3 md:p-4 rounded-lg bg-secondary-light dark:bg-secondary-dark space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold">
                  {font.name}
                </h3>
                <Link
                  href={font.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info-light dark:text-info-dark hover:opacity-80 transition-opacity"
                >
                  <ExternalLinkIcon size={16} />
                </Link>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {font.description}
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-success-light dark:text-success-dark">
                  {font.license}
                </span>
                <span className="text-neutral-500">{font.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Icons Section */}
      <section className="space-y-4">
        <h2
          className="text-2xl font-bold border-b border-secondary-light dark:border-secondary-dark
            pb-2"
        >
          Icons
        </h2>

        {icons.map((icon, i) => (
          <div
            key={i}
            className="p-3 md:p-4 rounded-lg bg-secondary-light dark:bg-secondary-dark space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold">
                {icon.name}
              </h3>
              <Link
                href={icon.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-info-light dark:text-info-dark hover:opacity-80 transition-opacity"
              >
                <ExternalLinkIcon size={16} />
              </Link>
            </div>
            <div className="text-xs text-success-light dark:text-success-dark">
              {icon.license}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {icon.used.map((a) => (
                <span
                  key={a}
                  className="px-2 py-1 text-xs bg-primary-light dark:bg-primary-dark text-secondary-light
                    dark:text-secondary-dark rounded"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CreditsPage;
