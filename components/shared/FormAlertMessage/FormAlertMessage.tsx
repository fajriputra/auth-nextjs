import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import { TBaseStatus } from "@/types";

interface IFormAlertMessageProps {
  message?: string;
  status: TBaseStatus;
}

const FormAlertMessage = ({ message, status }: IFormAlertMessageProps) => {
  if (!status || !message) return;

  return (
    <div
      className={cn(
        "p-3 justify-center rounded-md flex items-center gap-x-2 text-sm",
        {
          "bg-yellow-500/15 text-yellow-500": status === "warning",
          "bg-destructive/15 text-destructive": status === "error",
          "bg-emerald-500/15 text-emerald-500": status === "success",
        }
      )}
    >
      {status === "warning" && <ExclamationTriangleIcon className="size-4" />}
      {status === "error" && <Cross1Icon className="size-4" />}
      {status === "success" && <CheckCircledIcon className="size-4" />}
      <p>{message}</p>
    </div>
  );
};

export default FormAlertMessage;
