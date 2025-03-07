import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming shadcn Button component
import { cn } from "@/lib/utils"; // shadcn utility for className merging

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Main Content */}
      <main className="flex flex-col gap-12 row-start-2 items-center text-center sm:text-left max-w-3xl mx-auto">
        {/* Logo / Hero Image */}
        <div className="relative">
          <Image
            className="dark:invert opacity-99"
            src="/logo1.jpeg" // Replace with your logo
            alt="ResQ AI Logo"
            width={200}
            height={50}
            priority
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 blur-lg opacity-95 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Emergency Response, <span className="text-red-400">Reimagined</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
          ResQ AI enhances 911 with intelligent, emotion-aware assistance—prioritizing critical calls, analyzing distress, and dispatching help fast. Powered by AI, guided by humans.
        </p>

        {/* Key Features */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-[family-name:var(--font-geist-mono)] text-gray-400">
          <li className="flex flex-col items-center sm:items-start">
            <span className="text-red-400 font-semibold">Real-Time Analysis</span>
            Detects urgency in seconds.
          </li>
          <li className="flex flex-col items-center sm:items-start">
            <span className="text-blue-400 font-semibold">Smart Dispatch</span>
            Police, fire, or medical—instantly.
          </li>
          <li className="flex flex-col items-center sm:items-start">
            <span className="text-purple-400 font-semibold">Human Oversight</span>
            Every call reviewed by pros.
          </li>
        </ul>

        {/* Call to Action */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            className={cn(
              "rounded-full h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50",
              "flex items-center gap-2"
            )}
            asChild
          >
            <a
              href="/demo" // Replace with your demo link
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/siren.svg" // Custom siren icon
                alt="Siren icon"
                width={20}
                height={20}
              />
              Try the Demo
            </a>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "rounded-full h-12 px-6 border border-gray-600 hover:bg-gray-700 hover:border-transparent text-white transition-all duration-300",
              "sm:min-w-44"
            )}
            asChild
          >
            <a
              href="/docs" // Replace with your docs link
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-gray-400 text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-white transition-colors"
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          About Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-white transition-colors"
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/mail.svg"
            alt="Mail icon"
            width={16}
            height={16}
          />
          Contact
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-white transition-colors"
          href="https://x.com/resqai" // Replace with your social handle
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/x.svg" // X icon
            alt="X icon"
            width={16}
            height={16}
          />
          Follow on X
        </a>
      </footer>
    </div>
  );
}