"use client";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { IndianRupee } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomerPopup } from "./view-customer";
import Loader from "./loader";
import { toast } from "@/hooks/use-toast";

interface Document {
    id: number;
    name: string;
    url: string;
    type: string;
    docType: string;
  }

interface Customer {
  id: number;
  name: string;
  contact: string;
  address?: string;
  folderId: string;
  joiningDate: string;
  documents?: Document[];
  kycStatus:string;
}

const KYCVerification = () => {
  const [flag, setFlag] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
      async function fetchData() {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/customer/all`, {
            headers: {
                authorization: `Bearer ` + localStorage.getItem("token"),
            },
            });
            setCustomers(res.data.customers);
            if(res.data.customers.length !== 0) setFlag(true);
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
        setIsLoading(false)
    }
    fetchData();
  }, []);

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
    <div className="w-full  relative p-1 rounded-md shadow-sm bg-white dark:bg-muted z-0 flex flex-col xs:bg-blue-500">
      <div className="px-4 py-3 border-b border-gray-300 dark:border-border">
        <h3 className="font-semibold text-md">KYC Verification</h3>
      </div>
      {selectedCustomer && (
            <CustomerPopup
            isOpen={isViewCustomerOpen}
            setIsOpen={setIsViewCustomerOpen}
            customer={selectedCustomer}
            setCustomers={setCustomers}
            />
        )}
      <div className="  py-1 rounded-md h-[300px] scrollbar-hide overflow-y-scroll ">
       {!isLoading ? 
        <>
        {flag ? (
          <div className="flex flex-col gap-1 cursor-pointer scrollbar-hide rounded-lg overflow-y-scroll">
            {customers.map((customer: Customer) => {
              if(customer.kycStatus !== "under review") return;
              return (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(undefined); 
                    setTimeout(() => setSelectedCustomer(customer), 0);
                    setIsViewCustomerOpen(true);
                  }}
                  className="flex items-center p-2 shadow-sm justify-between w-full bg-gray-100 dark:bg-background gap-2 p-1 "
                >
                  <div className="flex items-center w-full">
                    <div className="font-semibold text-[#5B4B49] text-xs lg:text-sm dark:text-gray-400">
                      <p className="whitespace-nowrap">
                        {customer.name}
                      </p>
                      <p className="whitespace-nowrap">
                        {customer.contact}
                      </p>
                    </div>
                  </div>
                  <div className="font-semibold flex items-center text-[#5B4B49] text-xs lg:text-sm dark:text-gray-400">
                    <div
                    onClick={(e) => handleKycStatus(e,customer.id,customer.kycStatus)}
                    className="rounded-full whitespace-nowrap p-2 bg-blue-500 text-white"
                    >Verify KYC</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <IndianRupee
              className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[2px] text-gray-400`}
            />
            <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
              No earnings yet
            </p>
          </div>
        )}
        </>
        :
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Loader/>
        </div>
        }
      </div>
    </div>
  );
};

export default KYCVerification;
