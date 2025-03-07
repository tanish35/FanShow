import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Music,
  AlertCircle,
} from "lucide-react";
import { apiClient2 } from "@/main";
import ScorePopup from "@/components/ScorePopup";

interface TicketType {
  type: string;
  price: number;
  available: number;
}

interface Event {
  id: string;
  name: string;
  ongoing: boolean;
  liveAt: string;
  artistName: string;
  concertName: string;
  description: {
    venue: {
      name: string;
      location: string;
      capacity: number;
    };
    date: string;
    image: string;
    duration: string;
    openingAct: string;
    ticketTypes: TicketType[];
    ageRestriction: string;
    additionalInfo: string;
  };
}

const ConcertBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isScorePopupOpen, setIsScorePopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

  useEffect(() => {
    const newSocket = io(WEBSOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!localStorage.getItem("userId")) {
    window.location.href = "/spotify-login";
  }

  useEffect(() => {
    if (!socket || !id) return;

    const handleQueueUpdate = (queue: string[]) => {
      const userId = localStorage.getItem("userId");

      let foundInQueue = false;
      for (let i = 0; i < queue.length; i += 2) {
        try {
          const entry = JSON.parse(queue[i]);
          if (entry.eventId === id && entry.userId === userId) {
            setQueuePosition(i / 2 + 1);
            setInQueue(true);
            foundInQueue = true;
            break;
          }
        } catch (error) {
          console.error("Error parsing queue entry:", error);
        }
      }

      if (!foundInQueue && !isFirstUser) {
        setInQueue(false);
      }
    };

    const handleFirstUserUpdate = (data: {
      userId: string;
      eventId: string;
      expiresAt?: number;
    }) => {
      const userId = localStorage.getItem("userId");

      if (data.eventId === id && data.userId === userId) {
        setIsFirstUser(true);
        setInQueue(true);

        const expiresAt = data.expiresAt || Date.now() + 60000;
        const remainingTime = Math.max(
          0,
          Math.floor((expiresAt - Date.now()) / 1000)
        );

        localStorage.setItem(
          `bookingSession:${id}`,
          JSON.stringify({
            eventId: id,
            expiresAt: expiresAt,
          })
        );

        setTimeRemaining(remainingTime);

        const timer = setInterval(() => {
          setTimeRemaining((prev) => {
            const newTime = prev! - 1;
            if (newTime <= 0) {
              clearInterval(timer);
              setIsFirstUser(false);
              setInQueue(false);
              localStorage.removeItem(`bookingSession:${id}`);
              toast.error("Booking time expired");
            }
            return newTime;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    };

    socket.on("queueUpdate", handleQueueUpdate);
    socket.on("firstUserUpdate", handleFirstUserUpdate);
    const storedSession = localStorage.getItem(`bookingSession:${id}`);
    if (storedSession) {
      try {
        const { expiresAt } = JSON.parse(storedSession);
        const currentTime = Date.now();
        if (expiresAt > currentTime) {
          socket.emit("checkBookingStatus", {
            userId: localStorage.getItem("userId"),
            eventId: id,
          });
        } else {
          localStorage.removeItem(`bookingSession:${id}`);
        }
      } catch (error) {
        console.error("Error parsing stored session:", error);
        localStorage.removeItem(`bookingSession:${id}`);
      }
    } else {
      socket.emit("checkBookingStatus", {
        userId: localStorage.getItem("userId"),
        eventId: id,
      });
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const storedSession = localStorage.getItem(`bookingSession:${id}`);
        if (storedSession) {
          try {
            const { expiresAt } = JSON.parse(storedSession);
            if (expiresAt > Date.now()) {
              // We still have time, request an update from the server
              socket.emit("requestFirstUserUpdate", {
                userId: localStorage.getItem("userId"),
                eventId: id,
              });
            } else {
              // Session expired, remove it
              localStorage.removeItem(`bookingSession:${id}`);
              setIsFirstUser(false);
              setInQueue(false);
            }
          } catch (error) {
            console.error("Error parsing stored session:", error);
            localStorage.removeItem(`bookingSession:${id}`);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      socket.off("queueUpdate", handleQueueUpdate);
      socket.off("firstUserUpdate", handleFirstUserUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, id]);

  const handleEnterQueue = async () => {
    try {
      if (!id || !event) return;

      setIsLoading(true);

      // Already in first position with time left?
      const storedSession = localStorage.getItem(`bookingSession:${id}`);
      if (storedSession) {
        try {
          const { expiresAt } = JSON.parse(storedSession);
          if (expiresAt > Date.now()) {
            // We're already in the booking process
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing stored session:", error);
        }
      }

      const response = await apiClient2.post("/book", {
        eventId: id,
        artistName: event.artistName,
      });

      if (response.data.message === "User has already booked tickets") {
        toast.error("You have already booked a ticket");
        return;
      }

      setScore(response.data.queue[1]);
      setIsScorePopupOpen(true);

      setInQueue(true);
      toast.success("You've been added to the queue!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Failed to join queue");
        if (error.response?.status === 400) setInQueue(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("Event ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/event/getevent/${id}`);
        setEvent(response.data);
        if (response.data?.description?.ticketTypes?.length > 0) {
          setSelectedTicket(response.data.description.ticketTypes[0]);
        }
      } catch (err) {
        setError("Failed to fetch event data");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handlePayNow = async () => {
    if (!event || !selectedTicket) {
      toast.error("Please select a ticket type");
      return;
    }

    setIsProcessing(true);
    const username = localStorage.getItem("walletConnection");

    if (!username) {
      toast.error("Please connect your Hive wallet first");
      setIsProcessing(false);
      return;
    }

    if (!window.hive_keychain) {
      toast.error("Hive Keychain extension not found");
      setIsProcessing(false);
      return;
    }

    const customJson = {
      username: username,
      ticketsBooked: ticketCount,
      ticketType: selectedTicket.type,
      bookingDateTime: new Date().toISOString(),
      concertId: event.id,
      concertName: event.concertName,
      totalAmount: selectedTicket.price * ticketCount,
    };

    try {
      const loadingToastId = toast.loading("Processing your booking...");
      setIsProcessing(true);

      interface KeychainResponse {
        success: boolean;
        message?: string;
        result?: any;
      }
      await new Promise<KeychainResponse>((resolve, reject) => {
        (window.hive_keychain as any).requestCustomJson(
          username,
          "fanshow_booking",
          "Active",
          JSON.stringify(customJson),
          "Book Concert Tickets",
          (response: KeychainResponse) => {
            toast.dismiss(loadingToastId);

            if (response.success) {
              // console.log("Transaction successful:", response);
              localStorage.removeItem(`bookingSession:${id}`);
              apiClient2
                .post("/payment-success", {
                  userId: localStorage.getItem("userId"),
                  eventId: event.id,
                  ticketId: response.result.id,
                })
                .then((queueResponse) => {
                  toast.success("Tickets booked successfully!");
                  console.log("Transaction successful:", response);
                  console.log("Queue update:", queueResponse.data);

                  setIsFirstUser(false);
                  setInQueue(false);
                  // setInQueue(false);
                })
                .catch((queueError) => {
                  toast.error(
                    "Transaction successful, but queue update failed"
                  );
                  console.error("Queue update error:", queueError);
                  setIsFirstUser(false);
                  setInQueue(false);
                  localStorage.removeItem(`bookingSession:${id}`);
                });
            } else {
              localStorage.removeItem(`bookingSession:${id}`);
              toast.error(
                "Transaction failed: " + (response.message || "Unknown error")
              );
              setInQueue(false);
              console.log("Transaction failed:", response);
            }

            resolve(response);
          }
        );

        setTimeout(() => {
          reject(new Error("Transaction request timed out"));
        }, 30000);
      });
    } catch (error) {
      toast.dismiss();
      toast.error(
        "An error occurred: " + ((error as Error).message || "Unknown error")
      );
      console.error("Transaction error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScorePopupClose = () => {
    setIsScorePopupOpen(false);
  };

  if (loading)
    return <div className="p-8 text-center">Loading event details...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!event)
    return <div className="p-8 text-center">No event data available</div>;

  const eventDate = new Date(event.liveAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {event.description.image && (
        <div className="relative h-[40vh] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.description.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10 px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {event.name}
              </h1>
              <p className="text-xl opacity-90">{event.artistName}</p>
              <div className="mt-4 inline-flex items-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {eventDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Music className="h-5 w-5 mr-2" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </div>
                    <p className="font-medium text-lg">
                      {eventDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      Time
                    </div>
                    <p className="font-medium text-lg">
                      {eventDate.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      Age Restriction
                    </div>
                    <p className="font-medium">
                      {event.description.ageRestriction}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Venue
                    </div>
                    <p className="font-medium text-lg">
                      {event.description.venue.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.description.venue.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      Capacity: {event.description.venue.capacity} people
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration
                    </div>
                    <p className="font-medium">{event.description.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Opening Act</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{event.description.openingAct}</p>
              </CardContent>
            </Card>

            {event.description.additionalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{event.description.additionalInfo}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            {isFirstUser && timeRemaining !== null ? (
              <Card className="shadow-lg border-t-4 border-t-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Book Tickets</CardTitle>
                  <CardDescription className="text-sm text-red-500">
                    Time Remaining to Complete Booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex justify-center items-center">
                    <div className="text-5xl font-bold text-red-500">
                      {timeRemaining}
                      <span className="text-2xl ml-2">seconds</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Ticket Type
                    </label>
                    <Select
                      value={selectedTicket?.type}
                      onValueChange={(value) => {
                        const ticket = event.description.ticketTypes.find(
                          (t) => t.type === value
                        );
                        if (ticket) setSelectedTicket(ticket);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        {event.description.ticketTypes.map((ticket) => (
                          <SelectItem key={ticket.type} value={ticket.type}>
                            {ticket.type} - ${ticket.price} ({ticket.available}{" "}
                            available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Number of Tickets
                    </label>
                    <Select
                      value={ticketCount.toString()}
                      onValueChange={(value) => setTicketCount(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTicket && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">
                          Price per ticket:
                        </span>
                        <span>${selectedTicket.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Quantity:</span>
                        <span>{ticketCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                        <span>Total:</span>
                        <span>
                          ${(selectedTicket.price * ticketCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full py-6 text-lg mt-4"
                    disabled={isProcessing || !selectedTicket}
                    onClick={handlePayNow}
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Secured by Hive blockchain technology
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="shadow-lg border-t-4 border-t-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {inQueue ? "Queue Status" : "Join Queue"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inQueue ? (
                      <>
                        <div className="text-center">
                          <p className="text-2xl font-bold mb-2">
                            Position in Queue
                          </p>
                          <div className="text-4xl text-blue-500">
                            #{queuePosition}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Updates every 5 minutes
                          </p>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                          When you reach position #1, the booking form will
                          appear automatically
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          className="w-full py-6 text-lg"
                          onClick={handleEnterQueue}
                          disabled={!event?.ongoing || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Joining Queue...
                            </>
                          ) : (
                            "Enter Queue"
                          )}
                        </Button>
                        {!event?.ongoing && (
                          <p className="text-sm text-red-500 text-center mt-2">
                            Ticket sales have not started yet
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                <ScorePopup
                  score={score}
                  isOpen={isScorePopupOpen}
                  onClose={handleScorePopupClose}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertBooking;
