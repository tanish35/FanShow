import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ArtistDetailsPage = () => {
  const artist = {
    name: "Juice WRLD",
    image:
      "https://i.guim.co.uk/img/media/cd59a408307ade77175cbef95d736687c971baf6/0_1869_5792_3473/master/5792.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=f242cb62772158ca0f7eb4f626faff8d",
    description:
      "Jarad Anthony Higgins, known professionally as Juice WRLD, was an American rapper, singer, and songwriter. He was a leading figure in the emo rap and SoundCloud rap genres which gained mainstream popularity in the late 2010s.",
    topSongs: [
      { name: "Lucid Dreams", streams: "1.8B" },
      { name: "All Girls Are The Same", streams: "1.1B" },
      { name: "Robbery", streams: "950M" },
    ],
    albums: [
      {
        name: "Goodbye & Good Riddance",
        year: 2018,
        image:
          "https://i.scdn.co/image/ab67616d0000b273f7db43292a6a99b21b51d5b4",
      },
      {
        name: "Death Race for Love",
        year: 2019,
        image:
          "https://upload.wikimedia.org/wikipedia/en/0/04/Juice_Wrld_-_Death_Race_for_Love.png",
      },
      {
        name: "Legends Never Die",
        year: 2020,
        image: "https://m.media-amazon.com/images/I/81PIHyWRWnS.jpg",
      },
    ],
    totalStreams: "27B",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12">
      <div
        className="relative h-80 w-full bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${artist.image})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end">
          <Avatar className="w-32 h-32 border-4 border-background mr-6 shadow-xl">
            <AvatarImage src={artist.image} alt={artist.name} />
            <AvatarFallback>{artist.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-1">{artist.name}</h1>
            <Badge variant="secondary" className="text-sm font-medium">
              {artist.totalStreams} Total Streams
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {artist.description}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Top Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Song</TableHead>
                  <TableHead className="text-right">Streams</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artist.topSongs.map((song, index) => (
                  <TableRow
                    key={index}
                    className="group hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{song.name}</TableCell>
                    <TableCell className="text-right">{song.streams}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Albums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artist.albums.map((album, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-square relative">
                    <img
                      src={album.image}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 bg-card">
                    <h3 className="font-bold text-lg truncate">{album.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {album.year}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistDetailsPage;
