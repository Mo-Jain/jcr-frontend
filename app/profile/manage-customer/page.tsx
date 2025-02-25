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
import { Search, UserPlus, Users } from "lucide-react";
import { CustomerPopup } from "./view-customer";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import BackArrow from "@/public/back-arrow.svg";
import { useRouter } from "next/navigation";
import { AddCustomer } from "@/components/add-customer";

// Sample customer data - in a real app, this would come from an API or database


export interface Customer {
    id: number;
    name:string;
    contact:string;
    address?:string;
    folderId:string;
    documents? : Document[];
}

export interface Document {
  id:number;
  name:string;
  url:string;
  type:string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isAddCustomerOpen,setIsAddCustomerOpen] = useState(false);
  const [isViewCustomerOpen,setIsViewCustomerOpen] = useState(false);
  const [selectedCustomer,setSelectedCustomer] = useState<Customer>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/customer/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
          }
        })
        setCustomers(res.data.customers);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setIsLoading(false);
  },[])

  useEffect(() => {
    console.log("selected customer",selectedCustomer);
  },[selectedCustomer])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background sm:p-8 p-2">
        <AddCustomer isOpen={isAddCustomerOpen} setIsOpen={setIsAddCustomerOpen} setCustomers={setCustomers} />
        {selectedCustomer && (
          <CustomerPopup isOpen={isViewCustomerOpen} setIsOpen={setIsViewCustomerOpen} customer={selectedCustomer} setCustomers={setCustomers} />
        )}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center h-fit gap-2  justify-between">
            <div className="w-full flex gap-1 h-fit max-h-[60px] sm:gap-6  items-start">
              <Button 
                onClick={() => router.push('/profile')}
                className=" mt-2 flex p-3 bg-transparent shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card ">
                    <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
              </Button>
              <div className="flex justify-start sm:mt-2 mt-[4px] items-center mb-8 ">
                  <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                  }} className="text-3xl max-sm:text-lg font-bold text-black dark:text-white font-myfont">MANAGE CUSTOMERS</h1>
                  
              </div>
            </div>
              <Button className="flex items-center gap-2"
                onClick={() => setIsAddCustomerOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add Customer
              </Button>
        </div>
        {customers.length > 0 ? (
        <Card className="border-border bg-muted">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="rounded-md border border-border">
              <Table className="border-border">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-border">
                  {filteredCustomers.map((customer,index) => (
                      <TableRow key={index}
                      onClick = {() => {
                        setSelectedCustomer(undefined); // Reset first
                        setTimeout(() => setSelectedCustomer(customer), 0);
                        setIsViewCustomerOpen(true);
                      }}
                      className="border-border cursor-pointer ">
                        <TableCell className="font-medium border-border">
                          {customer.name}
                        </TableCell>
                        <TableCell className="border-border">{customer.contact}</TableCell>
                        <TableCell>
                          
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
            {!isLoading ? <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
              <Users className={`sm:h-16 h-12 sm:w-16 w-12 text-gray-400 `}/>
              <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">No Customers added yet</p>
              
            </div>
            :
            <div className="w-full h-full py-28 gap-2 flex justify-center items-center">
              <span className="sr-only">Loading...</span>
              <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce"></div>
            </div>
            }
          </div>
          )}
      </div>
    </div>
  );
}