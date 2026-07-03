import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function EnrollFailPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Something went wrong with your payment. Please try again or contact
          support if the issue persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/courses">
            <Button className="bg-prime-100 hover:bg-prime-200 text-white cursor-pointer">
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
