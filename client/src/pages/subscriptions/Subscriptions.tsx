import { useAuthStore } from "@/lib/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosinstance";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { UserMinus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Subscription {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
  member_since: string;
}

interface SubscriptionsResponse {
  message: string;
  subscriptions: Subscription[];
}

export default function Subscriptions() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [selectedSubscription, setSelectedSubscription] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch subscriptions using TanStack Query
  const {
    data: subscriptionsData,
    isLoading,
    error,
  } = useQuery<SubscriptionsResponse>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const response = await api.get("/verifiedUser/getSubscriptions");
      return response.data;
    },
    enabled: !!user, // Only run query if user exists
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await api.put(`/verifiedUser/deleteSubscription/`, {
        author_id: subscriptionId,
      });
      return response.data;
    },
    onSuccess: (data, subscriptionId) => {
      console.log("Unsubscribed user ID:", subscriptionId);
      toast.success("Successfully unsubscribed!");

      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

      // Reset selected subscription
      setSelectedSubscription(null);
    },
    onError: (error) => {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to unsubscribe. Please try again.");
    },
  });

  const handleUnsubscribe = () => {
    if (selectedSubscription) {
      unsubscribeMutation.mutate(selectedSubscription.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Please log in to view your subscriptions.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">
          Error loading subscriptions. Please try again.
        </p>
      </div>
    );
  }

  const subscriptions = subscriptionsData?.subscriptions || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscriptions ({subscriptions.length} total)
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <UserMinus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground">
            You haven't subscribed to anyone yet. Start exploring to find
            interesting creators!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscriptions.map((subscription) => (
            <Card
              key={subscription.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={subscription.avatar}
                      alt={subscription.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {subscription.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {subscription.name}
                    </h3>

                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Member Since {formatDate(subscription.member_since)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Subscribed {formatDate(subscription.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setSelectedSubscription({
                          id: subscription.id,
                          name: subscription.name,
                        })
                      }
                      disabled={unsubscribeMutation.isPending}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      {unsubscribeMutation.isPending
                        ? "Unsubscribing..."
                        : "Unsubscribe"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Unsubscribe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to unsubscribe from{" "}
                        <span className="font-semibold">
                          {selectedSubscription?.name}
                        </span>
                        ? You will no longer receive updates from this creator.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedSubscription(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnsubscribe}
                        className="bg-primary text-white hover:bg-destructive/90"
                        disabled={unsubscribeMutation.isPending}
                      >
                        {unsubscribeMutation.isPending
                          ? "Unsubscribing..."
                          : "Unsubscribe"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
