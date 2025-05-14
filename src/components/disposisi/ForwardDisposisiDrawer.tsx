
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Recipient {
  user_id: number;
  user_name: string;
  skpd_name: string;
}

interface ForwardDisposisiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onForward: (data: ForwardFormValues) => Promise<void>;
  disposisiId: number;
}

const forwardFormSchema = z.object({
  recipients: z.array(z.number()).min(1, "Select at least one recipient"),
  instruction: z.string().min(1, "Instruction is required"),
  passphrase: z.string().min(1, "Passphrase is required"),
});

type ForwardFormValues = z.infer<typeof forwardFormSchema>;

export const ForwardDisposisiDrawer = ({ isOpen, onClose, onForward, disposisiId }: ForwardDisposisiDrawerProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ForwardFormValues>({
    resolver: zodResolver(forwardFormSchema),
    defaultValues: {
      recipients: [],
      instruction: "",
      passphrase: "",
    },
  });

  // Fetch recipients when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchRecipients();
    }
  }, [isOpen]);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://ttd.lombokutarakab.go.id/api/getUser", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipients");
      }

      const data = await response.json();
      if (data.status && Array.isArray(data.data)) {
        setRecipients(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      toast({
        title: "Error",
        description: "Failed to load recipient list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: ForwardFormValues) => {
    try {
      await onForward(values);
      form.reset();
    } catch (error) {
      console.error("Error forwarding disposition:", error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Forward Disposition</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Recipients</FormLabel>
                    <FormControl>
                      <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          recipients.map((recipient) => (
                            <div key={recipient.user_id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`recipient-${recipient.user_id}`}
                                value={recipient.user_id}
                                className="mr-2"
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const newRecipients = e.target.checked
                                    ? [...field.value, value]
                                    : field.value.filter((id) => id !== value);
                                  field.onChange(newRecipients);
                                }}
                                checked={field.value.includes(recipient.user_id)}
                              />
                              <label htmlFor={`recipient-${recipient.user_id}`} className="text-sm">
                                <span className="font-medium">{recipient.user_name}</span>
                                <br />
                                <span className="text-xs text-muted-foreground">{recipient.skpd_name}</span>
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter instructions for the recipients"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passphrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your passphrase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DrawerFooter className="px-0">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Forwarding...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Forward Disposition
                    </>
                  )}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
