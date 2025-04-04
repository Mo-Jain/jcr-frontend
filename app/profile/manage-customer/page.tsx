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
import { CustomerPopup } from "@/components/view-customer";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import BackArrow from "@/public/back-arrow.svg";
import { useRouter } from "next/navigation";
import { AddCustomer } from "@/components/add-customer";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

// Sample customer data - in a real app, this would come from an API or database

export interface Customer {
  id: number;
  name: string;
  contact: string;
  address?: string;
  folderId: string;
  joiningDate: string;
  email?: string;
  documents?: Document[];
  kycStatus:string;
  password?:string;
}

export interface Document {
  id: number;
  name: string;
  url: string;
  type: string;
  docType:string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status,setStatus] = useState("under review");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/customer/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        //sort customers by joining date
        const sortedCustomers = res.data.customers.sort((a:Customer, b:Customer) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime());
        setCustomers(sortedCustomers);
        setIsLoading(false);
        setFilteredCustomers(res.data.customers.filter((customer:Customer) => customer.kycStatus === "under review"));
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchData();
    setIsLoading(false);
  }, []);

 


  const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredCustomers(customers.filter(
      (customer) =>
        (customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        customer.contact.toLowerCase().includes(e.target.value.toLowerCase())) &&
        (customer.kycStatus === status || status === "all")
    ));
  }

  const handleStatusChange = (value:string) => {
    setStatus(value);
    if(value === "all"){
      setFilteredCustomers(customers);
      return;
    }
    setFilteredCustomers(customers.filter((customer) => customer.kycStatus === value));
  }

  const handleKycStatus = async(e:React.MouseEvent<HTMLDivElement, MouseEvent>,id:number,status:string) => {
    e.preventDefault();
    e.stopPropagation();
    if(status === "under review"){
      try{
        await axios.put(`${BASE_URL}/api/v1/customer/verify-kyc/${id}`,{},
          {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast({
          description:"Successfully verified",
          duration:2000
        })
        setCustomers(customers.map((customer) => {
          if(customer.id === id){
            customer.kycStatus = "verified";
          }
          return customer;
        }));
      }
      catch(err){
        console.error(err);
        toast({
          description:"Failed to verify",
          variant:"destructive",
          duration:2000
        })
      }

    }
  }

  return (
    <div className="min-h-screen bg-background sm:p-8 p-2">
      <AddCustomer
        isOpen={isAddCustomerOpen}
        setIsOpen={setIsAddCustomerOpen}
        setCustomers={setCustomers}
      />
      {selectedCustomer && (
        <CustomerPopup
          isOpen={isViewCustomerOpen}
          setIsOpen={setIsViewCustomerOpen}
          customer={selectedCustomer}
          setCustomers={setCustomers}
        />
      )}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center h-fit gap-2  justify-between">
          <div className="w-full flex gap-1 h-fit max-h-[60px] sm:gap-6  items-start">
            <Button
              onClick={() => router.push("/profile")}
              className=" mt-2 flex p-3 active:scale-95 bg-transparent shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
            >
              <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </Button>
            <div className="flex justify-start sm:mt-2 mt-[4px] items-center mb-8 ">
              <h1
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="text-3xl max-sm:text-lg font-bold text-black dark:text-white font-myfont"
              >
                MANAGE CUSTOMERS
              </h1>
            </div>
          </div>
          <Button
            className="flex active:scale-95 items-center gap-2"
            onClick={() => setIsAddCustomerOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
          <Card className="border-border bg-muted">
            <CardContent className="p-6">
              <div className="relative mb-6 flex item-center gap-2">
                <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={handleSearch}
                  className="pl-9 max-sm:text-sm"
                />
                <Select
                  value={status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    value={status}
                    className="w-1/3"
                  >
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-zinc-700 bg-background">
                    <SelectItem className="hover:black/20" value={"all"}>All
                    </SelectItem>
                    <SelectItem className="hover:black/20" value={"pending"}>Pending
                    </SelectItem>
                    <SelectItem className="hover:black/20" value={"under review"}>Verify KYC
                    </SelectItem>
                    <SelectItem className="hover:black/20" value={"verified"}>Verified
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border border-border">
              {filteredCustomers.length > 0 ? (
                <Table className="border-border">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-border">
                    {filteredCustomers.map((customer, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          setSelectedCustomer(undefined); // Reset first
                          setTimeout(() => setSelectedCustomer(customer), 0);
                          setIsViewCustomerOpen(true);
                        }}
                        className="border-border cursor-pointer "
                      >
                        <TableCell className="font-medium border-border">
                          {customer.name}
                        </TableCell>
                        <TableCell className="border-border">
                          {customer.contact}
                        </TableCell>
                        <TableCell 
                        onClick={(e) => e.preventDefault()}
                        className="flex justify-center text-xs" >
                          <div
                          onClick={(e) => handleKycStatus(e,customer.id,customer.kycStatus)}
                          className={cn("p-2 py-1 w-fit text-center cursor-pointer rounded-full bg-red-400 text-white",
                            customer.kycStatus === "verified" && "bg-green-400",
                            customer.kycStatus === "under review" && "bg-blue-400 cursor-pointer active:scale-[0.95]",
                          )}>
                          {customer.kycStatus === "under review" ? "Verify KYC" : customer.kycStatus}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  ) : (
                    <div key={2}>
                      {!isLoading ? (
                        <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                          <Users className={`sm:h-16 h-12 sm:w-16 w-12 text-gray-400 `} />
                          <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                            No Customers in this category
                          </p>
                        </div>
                      ) : (
                        <div className="w-full h-full py-28 gap-2 flex justify-center items-center">
                          <Loader/>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        
      </div>
    </div>
  );
}
