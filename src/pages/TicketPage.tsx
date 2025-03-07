import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  DollarSign,
  Info,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TicketType {
  type: string;
  price: number;
  available: number;
}

interface Venue {
  name: string;
  capacity: number;
  location: string;
}

interface EventDescription {
  date: string;
  image: string;
  venue: Venue;
  duration: string;
  openingAct: string;
  ticketTypes: TicketType[];
  additionalInfo: string;
  ageRestriction: string;
}

interface EventDetails {
  artistName: string;
  concertName: string;
  description: EventDescription;
}

interface BlockchainDetails {
  transactionId: string;
  username: string;
  ticketsBooked: number;
  ticketType: string;
  bookingDateTime: string;
  concertId: string;
  concertName: string;
  totalAmount: number;
}

interface Ticket {
  ticketId: string;
  eventDetails: EventDetails;
  blockchainDetails: BlockchainDetails;
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/tickets/gettickets");

        const data = response.data as Ticket[];
        setTickets(data);
      } catch (err) {
        setError("Unable to load your tickets. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy 'at' h:mm a");
    } catch (err) {
      return dateString;
    }
  };

  const toggleExpand = (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">My Tickets</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View all your upcoming concert tickets. Click on a ticket to see
            more details.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
            <Info className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center max-w-md mx-auto">
            <Ticket className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any tickets yet. Browse upcoming concerts to get
              started.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Browse Concerts
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence>
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.ticketId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    onClick={() => toggleExpand(ticket.ticketId)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`overflow-hidden border-purple-200 shadow-md transition-all duration-300 ${
                        expandedTicket === ticket.ticketId
                          ? "bg-purple-50"
                          : "bg-white"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative md:w-1/3 h-48 md:h-auto">
                            <img
                              src={
                                ticket.eventDetails.description.image ||
                                "/placeholder.svg?height=400&width=300"
                              }
                              alt={ticket.eventDetails.concertName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 md:hidden">
                              <h2 className="text-white text-xl font-bold">
                                {ticket.eventDetails.concertName}
                              </h2>
                              <p className="text-white/90">
                                {ticket.eventDetails.artistName}
                              </p>
                            </div>
                          </div>

                          <div className="p-6 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <div className="hidden md:block">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                  {ticket.eventDetails.concertName}
                                </h2>
                                <p className="text-lg text-gray-600 mb-4">
                                  {ticket.eventDetails.artistName}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-0">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>
                                    {formatDate(
                                      ticket.eventDetails.description.date
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                  <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>
                                    {ticket.eventDetails.description.venue.name}
                                    ,{" "}
                                    {
                                      ticket.eventDetails.description.venue
                                        .location
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>
                                    {ticket.eventDetails.description.duration}
                                  </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                  <Ticket className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>
                                    {ticket.blockchainDetails.ticketType}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1">
                                {ticket.blockchainDetails.ticketsBooked}{" "}
                                {ticket.blockchainDetails.ticketsBooked > 1
                                  ? "Tickets"
                                  : "Ticket"}
                              </Badge>

                              <div className="flex items-center text-purple-600">
                                <span className="mr-1 text-sm font-medium">
                                  View Details
                                </span>
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform duration-300 ${
                                    expandedTicket === ticket.ticketId
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {expandedTicket === ticket.ticketId && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <Separator className="my-1" />
                              <div className="p-6 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                      <Info className="h-5 w-5 mr-2 text-purple-500" />
                                      Event Details
                                    </h3>

                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Opening Act
                                        </p>
                                        <p className="text-gray-700">
                                          {
                                            ticket.eventDetails.description
                                              .openingAct
                                          }
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Age Restriction
                                        </p>
                                        <p className="text-gray-700">
                                          {
                                            ticket.eventDetails.description
                                              .ageRestriction
                                          }
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Additional Information
                                        </p>
                                        <p className="text-gray-700">
                                          {
                                            ticket.eventDetails.description
                                              .additionalInfo
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                      <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
                                      Transaction Details
                                    </h3>

                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Booking Date
                                        </p>
                                        <p className="text-gray-700">
                                          {formatDate(
                                            ticket.blockchainDetails
                                              .bookingDateTime
                                          )}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Username
                                        </p>
                                        <p className="text-gray-700">
                                          {ticket.blockchainDetails.username}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Total Amount
                                        </p>
                                        <p className="text-gray-700">
                                          $
                                          {ticket.blockchainDetails.totalAmount.toFixed(
                                            2
                                          )}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Transaction ID
                                        </p>
                                        <p className="text-gray-700 truncate">
                                          {
                                            ticket.blockchainDetails
                                              .transactionId
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                  {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Download Ticket
                                  </Button> */}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
