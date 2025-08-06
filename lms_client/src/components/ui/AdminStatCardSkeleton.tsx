import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminStatCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </CardTitle>
        <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
};

export default AdminStatCardSkeleton;
