import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type TDeleteModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleDeleteFunction: (id: string) => void;
  id: string;
  alertMessage: string;
  btnText?: string;
};

const DeleteModal = ({
  isOpen,
  setIsOpen,
  handleDeleteFunction,
  id,
  alertMessage,
  btnText,
}: TDeleteModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* alert content  */}
      <AlertDialogContent>
        {/* header and content type  */}
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="font-medium">
            {alertMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* bottom button type  */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteFunction(id)}>
            {btnText ? btnText : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
