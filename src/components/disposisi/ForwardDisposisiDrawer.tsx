
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useDisposisiDetail } from "@/hooks/useDisposisiDetail";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { disposisiData } = useDisposisiDetail(disposisiId.toString());
  
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
    if (isOpen && disposisiData) {
      fetchRecipients();
    }
  }, [isOpen, disposisiData]);

  const fetchRecipients = async () => {
    if (!disposisiData || !user?.userData?.user_id) return;
    
    const skpdId = disposisiData.skpd_generate;
    const userId = user.userData.user_id;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://ttd.lombokutarakab.go.id/api/nameOnDetail?user_id=${userId}&skpd_id=${skpdId}`, 
        {
          method: "GET",
        }
      );

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

  const filteredRecipients = searchQuery.trim() === ""
    ? recipients
    : recipients.filter(recipient => 
        recipient.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipient.skpd_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (values: ForwardFormValues) => {
    try {
      await onForward(values);
      form.reset();
    } catch (error) {
      console.error("Error forwarding disposition:", error);
    }
  };

  const selectedCount = form.watch("recipients").length;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b pb-3">
          <DrawerTitle>Forward Disposition</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-3 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="sticky top-0 z-10 mb-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="Search recipients..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                  />
                </div>
                {selectedCount > 0 && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    {selectedCount} recipient{selectedCount > 1 ? 's' : ''} selected
                  </Badge>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Recipients</FormLabel>
                    <FormControl>
                      <ScrollArea className="border rounded-md p-2 h-48">
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : filteredRecipients.length > 0 ? (
                          filteredRecipients.map((recipient) => (
                            <div 
                              key={recipient.user_id} 
                              className={`flex items-center mb-2 p-2 rounded-md ${
                                field.value.includes(recipient.user_id) 
                                  ? 'bg-primary/10 border border-primary/30' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
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
                              <label 
                                htmlFor={`recipient-${recipient.user_id}`} 
                                className="text-sm flex-1 cursor-pointer"
                              >
                                <span className="font-medium">{recipient.user_name}</span>
                                <br />
                                <span className="text-xs text-muted-foreground">{recipient.skpd_name}</span>
                              </label>
                              {field.value.includes(recipient.user_id) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No recipients found
                          </div>
                        )}
                      </ScrollArea>
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
                        className="resize-none min-h-[100px]"
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
              
              <DrawerFooter className="px-0 pt-2">
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
