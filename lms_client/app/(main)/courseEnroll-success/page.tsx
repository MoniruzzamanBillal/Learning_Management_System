import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function EnrollSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re Enrolled!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Your payment was successful. Your course is ready — start learning
          now!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/my-courses">
            <Button className="bg-prime-100 hover:bg-prime-200 text-white cursor-pointer">
              Go to My Courses
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Browse More Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
