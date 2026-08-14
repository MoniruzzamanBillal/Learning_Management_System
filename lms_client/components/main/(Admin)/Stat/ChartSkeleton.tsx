import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChartSkeleton = ({ title }: { title: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;
