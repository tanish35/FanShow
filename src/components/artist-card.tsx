"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

interface Artist {
  id: number;
  artist: string;
  image: string;
  date: string;
  venue: string;
  city: string;
  affinity: number;
}

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden border-purple-200 bg-white shadow-sm h-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
          <img
            src={artist.image || "/placeholder.svg"}
            alt={artist.artist}
            className="w-full aspect-[4/3] object-cover object-center"
          />
          <div className="absolute top-4 right-4 z-20">
            {/* <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
              {artist.affinity}% Affinity
            </Badge> */}
          </div>
        </div>

        <CardContent className="p-6 relative">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            {artist.artist}
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-sm">{artist.date}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-sm">
                {artist.venue}, {artist.city}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                {/* <span className="text-xs text-gray-500">
                  Your affinity score
                </span> */}
                {/* <span className="text-xs font-medium text-gray-700">
                  {artist.affinity}%
                </span> */}
              </div>
              {/* <Progress
                value={artist.affinity}
                className="h-1.5"
                indicatorClassName={`bg-gradient-to-r ${
                  artist.affinity > 90
                    ? "from-purple-500 to-pink-500"
                    : artist.affinity > 70
                    ? "from-blue-500 to-purple-500"
                    : "from-green-500 to-blue-500"
                }`}
              /> */}
            </div>
          </div>

          {/* <Button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700">
            Join Queue
          </Button> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
