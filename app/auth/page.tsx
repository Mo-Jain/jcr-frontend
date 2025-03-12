"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { useCarStore, useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { name,setName } = useUserStore();
  const router = useRouter();
  const {setCars} = useCarStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if(name){
      router.push('/');
    }
  },[name])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement login logic here
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/signin`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      localStorage.setItem("token", res.data.token);
      const res1 = await axios.get(`${BASE_URL}/api/v1/car/all`, {
        headers: {
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });
      setCars(res1.data.cars);
      router.push("/");
      router.refresh();
      setName(res.data.name);
      toast({
        description: "Login Successful",
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Failed to Login",
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-muted">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl select-none font-bold">Login</CardTitle>
          </div>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full text-white">
              {isLoading ? (
                    <>
                      <span>Please wait</span>
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                      </div>
                  </>
                ) : (
                  <span>Login</span>
                )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
