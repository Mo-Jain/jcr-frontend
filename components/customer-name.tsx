import React, { useEffect, useState } from "react"
import { Input } from "./ui/input";
import { User } from "lucide-react";
interface Customer {
    id: number;
    name: string;
    contact: string;
    address: string;
    imageUrl: string;
    folderId: string;
  }

const CustomerName = ({name,contact,onChangeInput,setCustomerId,setName,setContact,customers}:{
    name:string,
    contact:string,
    onChangeInput:(e:React.ChangeEvent<HTMLInputElement>) => void,
    setCustomerId:React.Dispatch<React.SetStateAction<number | undefined>>,
    customerId:number | undefined,
    setName:React.Dispatch<React.SetStateAction<string>>,
    setContact:React.Dispatch<React.SetStateAction<string>>
    customers:Customer[] | undefined
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if(!customers || customers.length === 0) return;
        const newfilteredCustomers = customers.filter(
          (customer) =>
            (customer.name.toLowerCase().includes(name.toLowerCase())),
        )
    
        setFilteredCustomers(newfilteredCustomers);
    },[customers,name,contact])

    
    
  return (
    <div className="relative">
        <div className=" w-full relative">
              <Input
                placeholder="Search or add new customer..."
                value={name}
                onChange={onChangeInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full max-sm:text-xs max-sm:placeholder:text-xs"
              />
            </div>
          { isFocused && name.length > 0 &&
            <div 
            className="w-[150px] bg-muted ba p-0 absolute rounded-md scrollbar-hide top-10 left-0" 
          >
            {filteredCustomers.length > 0 && (
              <div className="max-h-[300px] overflow-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-start gap-3 p-3 w-full rounded-md hover:bg-card cursor-pointer transition-colors"
                    onClick={() => {
                      setCustomerId(customer.id);
                      setName(customer.name);
                      setContact(customer.contact);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                      <div className="font-medium text-sm">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.contact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          }
      
    </div>
  )
};

export default CustomerName;
