"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Music,
  Ticket,
  Star,
  ChevronRight,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MusicVisualizer } from "@/components/music-visualizer";
import { ArtistCard } from "@/components/artist-card";
import { SpotifyLoginButton } from "@/components/spotify-login-button";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    setIsClient(true);
    // Set theme to light mode on page load
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  // Mock data for featured concerts
  const featuredConcerts = [
    {
      id: 1,
      artist: "Taylor Swift",
      image: "/placeholder.svg?height=400&width=400",
      date: "Dec 15, 2023",
      venue: "Madison Square Garden",
      city: "New York, NY",
      affinity: 98,
    },
    {
      id: 2,
      artist: "The Weeknd",
      image: "/placeholder.svg?height=400&width=400",
      date: "Jan 22, 2024",
      venue: "Staples Center",
      city: "Los Angeles, CA",
      affinity: 87,
    },
    {
      id: 3,
      artist: "Billie Eilish",
      image: "/placeholder.svg?height=400&width=400",
      date: "Feb 10, 2024",
      venue: "United Center",
      city: "Chicago, IL",
      affinity: 92,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-50 to-white"
      >
        {/* Background animation */}
        {isClient && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-100/50 to-white z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,230,0.1)_0,rgba(255,255,255,0)_70%)]"></div>
            <MusicVisualizer />
          </div>
        )}

        <motion.div
          className="container relative z-10 px-4 text-center"
          style={{ opacity, scale }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Skip the line based on your music taste
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Music Taste
            <br />
            Your Ticket Priority
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Get priority access to concert tickets based on how much you
            actually love the artist. No more bots or scalpers - just real fans
            getting the tickets they deserve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <SpotifyLoginButton />
            <Button
              variant="outline"
              className="group border-purple-300 bg-white text-purple-700 hover:bg-purple-50"
            >
              How It Works
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="flex flex-col items-center"
          >
            <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container px-4">
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
                icon: <Music className="h-10 w-10 text-purple-600" />,
                title: "Connect Spotify",
                description:
                  "Link your Spotify account to analyze your listening history and playlists.",
              },
              {
                icon: <Star className="h-10 w-10 text-pink-600" />,
                title: "Get Your Affinity Score",
                description:
                  "We calculate how much you genuinely listen to and love each artist.",
              },
              {
                icon: <Ticket className="h-10 w-10 text-amber-600" />,
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
                <Card className="bg-white border-purple-200 shadow-sm overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8">
                    <div className="mb-6 p-4 rounded-full bg-purple-100 w-fit">
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

      {/* Featured Concerts Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,41,230,0.1),transparent_50%)]"></div>

        <div className="container px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-pink-500 text-pink-700 bg-pink-50"
              >
                Upcoming Shows
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
                Featured Concerts
              </h2>
            </div>
            <Button
              variant="link"
              className="text-purple-600 p-0 group flex items-center"
            >
              View all concerts
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-8 bg-purple-50 border border-purple-100">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredConcerts.map((concert, index) => (
                  <ArtistCard key={concert.id} artist={concert} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder content for other tabs */}
                <div className="h-64 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center justify-center">
                  <p className="text-gray-500">
                    Connect Spotify to see recommendations
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder content for other tabs */}
                <div className="h-64 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center justify-center">
                  <p className="text-gray-500">
                    Connect Spotify to see popular concerts
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-amber-500 text-amber-700 bg-amber-50"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              What Fans Are Saying
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real fans getting tickets to see their favorite artists thanks to
              their genuine listening history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                avatar: "/placeholder.svg?height=100&width=100",
                concert: "Taylor Swift",
                quote:
                  "I've been streaming Taylor's albums for years. Got front row tickets thanks to my 95% affinity score!",
              },
              {
                name: "Samantha Lee",
                avatar: "/placeholder.svg?height=100&width=100",
                concert: "The Weeknd",
                quote:
                  "After missing out on tickets last tour, my listening history finally paid off. Amazing experience!",
              },
              {
                name: "Marcus Chen",
                avatar: "/placeholder.svg?height=100&width=100",
                concert: "Billie Eilish",
                quote:
                  "As a day one fan, it felt great to be recognized. The queue priority system is a game changer.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border-purple-200 shadow-sm h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border-2 border-purple-200">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fan of {testimonial.concert}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="mt-6 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 p-8 md:p-16 border border-purple-200"
          >
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                  Ready to Get Priority Access?
                </h2>
                <p className="text-lg text-gray-700 max-w-xl">
                  Connect your Spotify account now and start building your
                  artist affinity score for upcoming concerts.
                </p>
              </div>
              <SpotifyLoginButton size="lg" />
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="h-6 w-6 text-purple-600" />,
                value: "250K+",
                label: "Music Fans",
              },
              {
                icon: <Ticket className="h-6 w-6 text-pink-600" />,
                value: "1.2M+",
                label: "Tickets Sold",
              },
              {
                icon: <Music className="h-6 w-6 text-amber-600" />,
                value: "3,500+",
                label: "Artists",
              },
              {
                icon: <Calendar className="h-6 w-6 text-green-600" />,
                value: "850+",
                label: "Concerts",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <p className="text-3xl md:text-4xl font-bold mb-1 text-gray-800">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Toggle - Add this before the Footer section */}
      {/* <section className="py-8 bg-white">
        <div className="container px-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-center text-lg font-medium text-gray-700">
              Switch between light and dark mode
            </p>
            <ThemeToggle />
          </motion.div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 border-t border-purple-100 bg-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Music className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">FanQueue</span>
            </div>
            <div className="flex gap-6">
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
