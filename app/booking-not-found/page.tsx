import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackArrow from "@/public/back-arrow.svg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Booking Not Found
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="h-30 w-30 p-2 rounded-full bg-blue-300 bg-opacity-20">
            <div className="h-25 w-25 p-2 rounded-full bg-blue-300">
              <BackArrow className="h-20 w-20 stroke-0 fill-white" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            We&apos;re sorry, but the booking you&apos;re looking for
            doesn&apos;t exist or has been cancelled.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full active:scale-95">
            <Link href="/bookings">
              <BackArrow className=" h-7 w-4 stroke-0 fill-black" />
              Back to Bookings
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full active:scale-95">
            <Link href="/">Go to HomePage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
