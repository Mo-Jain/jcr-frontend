"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {  Search,  UserPlus, Users } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import BackArrow from "@/public/back-arrow.svg";
import { useRouter } from "next/navigation";
import { UserPopup } from "./view-user";
import { Adduser } from "./add-user";
import { useUserStore } from "@/lib/store";
import Loader from "@/components/loader";


export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  imageUrl?: string;
  profileFolderId: string;
}



export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isViewUserOpen,setIsViewUserOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const {userId} = useUserStore();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/users/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setUsers(res.data.users);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);


  if(userId!=1) router.push('/');
  
  const filteredUsers = users.filter(
    (users) =>
      users.name.toLowerCase().includes(search.toLowerCase()) ||
      users.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background sm:p-8 p-2">
      {selectedUser && 
        <UserPopup
        isOpen={isViewUserOpen}
        setIsOpen={setIsViewUserOpen}
        user={selectedUser}
        setUsers={setUsers}
      />}
      <Adduser
        isOpen={isAddUserOpen}
        setIsOpen={setIsAddUserOpen}
        setUsers={setUsers}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center h-fit gap-2  justify-between">
          <div className="w-full flex gap-1 h-fit max-h-[60px] sm:gap-6  items-start">
            <Button
              onClick={() => router.push("/profile")}
              className=" mt-2 flex p-3 bg-transparent shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
            >
              <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </Button>
            <div className="flex justify-start sm:mt-2 mt-[4px] items-center mb-8 ">
              <h1
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="text-3xl max-sm:text-lg font-bold text-black dark:text-white font-myfont"
              >
                MANAGE USERS
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
        {users.length > 0 ? (
          <Card className="border-border bg-muted">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 max-sm:text-sm"
                />
              </div>

              <div className="rounded-md border border-border">
                <Table className="border-border">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-border">
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          setSelectedUser(undefined); // Reset first
                          setTimeout(() => setSelectedUser(user), 0);
                          setIsViewUserOpen(true);
                        }}
                        className="border-border cursor-pointer "
                      >
                        <TableCell>
                            {user.name}
                        </TableCell>
                        <TableCell className="font-medium border-border">
                          {user.username}
                        </TableCell>
                        <TableCell className="border-border">
                          {user.password}
                        </TableCell>
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div key={2}>
            {isLoading ? (
              <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                <Users className={`sm:h-16 h-12 sm:w-16 w-12 text-gray-400 `} />
                <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                  No users added yet
                </p>
              </div>
            ) : (
              <Loader/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
