import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ActionDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  action,
  handleAction,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: string;
  handleAction: () => void;
}) => {
  //make the first letter as uppercase
  const heading = action.split(" ")[0];
  const upperHeading = heading.charAt(0).toUpperCase() + heading.slice(1);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
      <DialogContent className="sm:max-w-[425px] bg-muted border-border">
        <DialogHeader>
          <DialogTitle>{upperHeading}</DialogTitle>
          <DialogDescription className="text-grey-500">
            Are you sure you want to {action} the booking?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="max-sm:w-full active:scale-95 bg-primary hover:bg-opacity-10 shadow-lg"
            onClick={() => {
              handleAction();
              setIsDialogOpen(false);
            }}
          >
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
