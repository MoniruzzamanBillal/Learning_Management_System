import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type TDeleteModalProps = {
  handleDeleteFunction: (id: string) => void;
  id: string;
  alertMessage: string;
  btnText?: string;
};

const DeleteModal = ({
  handleDeleteFunction,
  id,
  alertMessage,
  btnText,
}: TDeleteModalProps) => {
  return (
    <div className="DeleteModalContainer">
      {/* delete button  */}

      <AlertDialog>
        {/* alert trigger  */}
        <AlertDialogTrigger asChild>
          <Button className="px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-red-600 hover:bg-red-700 active:scale-95 duration-500">
            {btnText ? btnText : "Delete"}
          </Button>
        </AlertDialogTrigger>

        {/* alert content  */}
        <AlertDialogContent>
          {/* header and content type  */}
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className=" font-medium ">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* bottom button type  */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteFunction(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteModal;
