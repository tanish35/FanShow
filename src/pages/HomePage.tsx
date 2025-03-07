import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Calendar, MapPin, ArrowRight, Image } from "lucide-react";
import { Link } from "react-router-dom";
// import { Navigation } from "@/components/navbar"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SpotifyLoginButton } from "@/components/spotify-login-button";
import { CircularText } from "@/components/circular-text";
import axios from "axios";

interface Concert {
  id: string;
  name: string;
  liveAt: string; // ISO date string
  artistName: string;
  concertName: string;
  description: {
    venue?: {
      name?: string;
      location?: string;
      capacity?: number;
    };
    date?: string; // ISO date string
    duration?: string;
    image?: string;
    openingAct?: string;
    ticketTypes?: {
      type: string;
      price: number;
      available: number;
    }[];
    ageRestriction?: string;
    additionalInfo?: string;
  };
}

export default function HomePage() {
  // const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end start"],
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [showingAll, setShowingAll] = useState(false);
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Mock data for featured concerts
  const featuredConcerts = [
    {
      id: 1,
      artist: "Taylor Swift",
      tagline: "Eras Tour 2024",
      headline: "Experience the journey through musical eras",
      description:
        "The biggest pop sensation of our generation brings her record-breaking tour with a nostalgic atmosphere along with the euphoria of her greatest hits that really touch your soul.",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/taylor-swift-performs-onstage-during-the-taylor-swift-the-news-photo-1681860356.jpg?crop=1xw:0.99988xh;center,top&resize=980:*",
      date: "Dec 15, 2023",
      venue: "Madison Square Garden",
      city: "New York, NY",
      affinity: 98,
      color: "from-purple-600 to-pink-500",
      link: "/booking/cm7x6o5h0000013dozlhzmecc",
    },
    {
      id: 2,
      artist: "The Weeknd",
      tagline: "After Hours Tour",
      headline: "Lose yourself in the blinding lights",
      description:
        "An immersive experience featuring spectacular visuals and state-of-the-art production that transports you to the world of After Hours and Dawn FM.",
      image:
        "https://wallpapercat.com/w/full/3/3/d/193483-2560x1600-desktop-hd-the-weeknd-background.jpg",
      date: "Jan 22, 2024",
      venue: "Staples Center",
      city: "Los Angeles, CA",
      affinity: 87,
      color: "from-red-600 to-orange-500",
      link: "/booking/cm7x6o5h1000113dossnggfty",
    },
    {
      id: 3,
      artist: "Billie Eilish",
      tagline: "Happier Than Ever Tour",
      headline: "Dance with the rhythm, immersed in the melody",
      description:
        "The biggest concert festival of the decade features legendary performances and unforgettable moments. Bringing a nostalgic atmosphere along with the euphoria of the night music that really touches your soul.",
      image:
        "https://www.billboard.com/wp-content/uploads/2023/08/Billie-Eilish-paris-2023-a-billboard-1548.jpg?w=942&h=623&crop=1",
      date: "Feb 10, 2024",
      venue: "United Center",
      city: "Chicago, IL",
      affinity: 92,
      color: "from-teal-600 to-emerald-500",
      link: "/booking/cm7x6o5h1000213dospikt5vw",
    },
    {
      id: 4,
      artist: "Kendrick Lamar",
      tagline: "The Big Steppers Tour",
      headline: "Witness the poetic genius in motion",
      description:
        "A groundbreaking performance that combines visual storytelling with Kendrick's unmatched lyrical prowess, creating an unforgettable cultural moment.",
      image:
        "https://media.gq.com/photos/65fda114b208611ae82cb8f5/4:3/pass/GettyImages-1685949453.jpg",
      date: "Mar 5, 2024",
      venue: "TD Garden",
      city: "Boston, MA",
      affinity: 89,
      color: "from-amber-600 to-yellow-500",
      link: "/booking/cm7x6o5h1000313doir5sj6g4",
    },
    {
      id: 5,
      artist: "Dua Lipa",
      tagline: "Future Nostalgia Tour",
      headline: "Step into the dance floor of tomorrow",
      description:
        "An electrifying show filled with chart-topping hits, dazzling choreography, and a futuristic disco atmosphere that will keep you dancing all night long.",
      image: "https://wallpapercave.com/wp/wp2088741.jpg",
      date: "Apr 12, 2024",
      venue: "O2 Arena",
      city: "London, UK",
      affinity: 94,
      color: "from-blue-600 to-indigo-500",
      link: "/booking/cm7x6o5h1000413dob74js85z",
    },
  ];

  async function fetchConcerts() {
    setIsLoading(true);
    const res = await axios.get("/event/getEvents");
    // @ts-ignore
    setAllConcerts(res.data);
    setIsLoading(false);
  }

  useEffect(() => {
    // setIsClient(true);
    fetchConcerts();
    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredConcerts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % featuredConcerts.length);
  // };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen items-center bg-white text-gray-800 overflow-hidden">
      {/* Navigation */}
      {/* <Navigation /> */}

      {/* Full-screen Carousel */}
      <section
        ref={carouselRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {featuredConcerts.map(
            (concert, index) =>
              index === currentSlide && (
                <motion.div
                  key={concert.id}
                  className={`absolute inset-0 bg-gradient-to-r ${concert.color}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10 mix-blend-overlay"></div>

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ opacity, scale, y }}
                  >
                    <div className="container h-full flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-20">
                      {/* Left side - Image */}
                      <motion.div
                        className="w-full md:w-1/2 flex justify-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="relative w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] rounded-full overflow-hidden border-8 border-white/20">
                          <img
                            src={concert.image || "/placeholder.svg"}
                            alt={concert.artist}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </motion.div>

                      {/* Right side - Content */}
                      <motion.div
                        className="w-full md:w-1/2 text-white"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2">
                            <div className="h-px w-12 bg-white/60"></div>
                            <span className="text-white/80 uppercase tracking-widest text-sm">
                              {concert.tagline}
                            </span>
                          </div>

                          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            {concert.headline}
                          </h1>

                          <p className="text-white/80 text-lg max-w-xl">
                            {concert.description}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-6 pt-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-white/70" />
                              <span>{concert.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-5 w-5 text-white/70" />
                              <span>
                                {concert.venue}, {concert.city}
                              </span>
                            </div>
                          </div>

                          <div className="pt-6">
                            <Button
                              size="lg"
                              className="bg-white text-purple-700 hover:bg-white/90 rounded-none px-8 h-14"
                              onClick={() =>
                                window.open(concert.link, "_blank")
                              }
                            >
                              BOOK YOUR SEAT
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Slide indicator */}
                  <div className="absolute bottom-8 left-8 md:left-16 flex items-center space-x-3">
                    <span className="text-white/80 text-xl font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px w-6 bg-white/60"></div>
                    <span className="text-white/80">{concert.artist}</span>
                  </div>

                  {/* Circular text */}
                  <div className="absolute bottom-8 right-8 md:right-16">
                    <CircularText />
                  </div>

                  {/* Slide navigation dots */}
                  <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 flex flex-col gap-3">
                    {featuredConcerts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentSlide
                            ? "bg-white scale-125"
                            : "bg-white/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </section>

      <section className="py-20 bg-white justify-center items-center flex">
        {isLoading ? (
          <div className="text-center">
            <Image className="h-16 w-16 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="container px-4 items-center justify-center">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-purple-500 text-purple-700 bg-purple-50"
              >
                Upcoming Events
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Featured Concerts
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover upcoming shows from your most-listened artists with
                exclusive early access
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allConcerts && allConcerts.length > 0 ? (
                allConcerts.map((concert, index) => (
                  <motion.div
                    key={concert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden h-full transition-all hover:shadow-lg">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={concert.description.image || "/placeholder.svg"}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {/* <Badge className="absolute top-4 left-4 bg-white text-purple-700 hover:bg-white">
                        {concert.affinity}% Affinity
                      </Badge> */}
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-gray-500">
                          <Calendar className="h-5 w-5" />
                          <span className="text-sm">
                            {concert.description.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {concert.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <MapPin className="h-5 w-5" />
                          <span>{concert.description.venue?.name}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <Button
                            asChild
                            variant="outline"
                            className="border-purple-500 text-purple-700 hover:bg-purple-50"
                          >
                            <Link to={`/booking/${concert.id}`}>
                              View Event
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div>No concerts available</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white justify-center items-center flex">
        <div className="container px-4 justify-center items-center">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-purple-500 text-purple-700 bg-purple-50"
            >
              The Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              How Queue Priority Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our algorithm analyzes your Spotify listening history to determine
              your genuine connection to artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎵",
                title: "Connect Spotify",
                description:
                  "Link your Spotify account to analyze your listening history and playlists.",
              },
              {
                icon: "⭐",
                title: "Get Your Affinity Score",
                description:
                  "We calculate how much you genuinely listen to and love each artist.",
              },
              {
                icon: "🎟️",
                title: "Priority Queue Access",
                description:
                  "Higher affinity scores get earlier access to purchase tickets when they go on sale.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="bg-white border-purple-200 shadow-sm overflow-hidden group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 rounded-full bg-purple-100 w-fit text-4xl">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    >
                      <ArrowRight className="h-6 w-6 text-purple-500" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50 justify-center items-center flex">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-16"
          >
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to Get Priority Access?
                </h2>
                <p className="text-lg text-white/90 max-w-xl">
                  Connect your Spotify account now and start building your
                  artist affinity score for upcoming concerts.
                </p>
              </div>
              <Link to={"/spotify"}>
                <SpotifyLoginButton size="lg" />
              </Link>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-100 justify-center items-center flex bg-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <span className="text-xl font-bold text-gray-800">FanQueue</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-700"
              >
                About
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-700"
              >
                FAQ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-700"
              >
                Privacy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-700"
              >
                Terms
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-purple-700"
              >
                Contact
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FanQueue. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
