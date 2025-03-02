import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CarIcon from "@/public/car-icon.svg";
import BackArrow from "@/public/back-arrow.svg";

export default function CarNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Car Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CarIcon className="w-56 h-24 dark:stroke-blue-200  dark:fill-blue-200 stroke-primary fill-primary" />
          <p className="text-center text-muted-foreground">
            We&apos;re sorry, but the car you&apos;re looking for doesn&apos;t
            exist or has been removed.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/profile/manage-garrage">
              <BackArrow className=" h-7 w-4 stroke-black fill-black" />
              Back to Car List
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
