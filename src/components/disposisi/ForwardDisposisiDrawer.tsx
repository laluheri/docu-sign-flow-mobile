
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { forwardFormSchema, type ForwardFormValues } from "@/schemas/disposisiSchemas";
import { RecipientList } from "./RecipientList";
import { useRecipientsList } from "@/hooks/useRecipientsList";

interface ForwardDisposisiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onForward: (data: ForwardFormValues) => Promise<void>;
  disposisiId: number;
}

export const ForwardDisposisiDrawer = ({ isOpen, onClose, onForward, disposisiId }: ForwardDisposisiDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { recipients, isLoading } = useRecipientsList({ skpd_generate: String(disposisiId) });
  
  const form = useForm<ForwardFormValues>({
    resolver: zodResolver(forwardFormSchema),
    defaultValues: {
      recipients: [],
      instruction: "",
      passphrase: "",
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectRecipient = (recipientId: number, selected: boolean) => {
    const currentRecipients = form.getValues("recipients");
    const newRecipients = selected
      ? [...currentRecipients, recipientId]
      : currentRecipients.filter((id) => id !== recipientId);
    form.setValue("recipients", newRecipients, { shouldValidate: true });
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

  if (!isOpen) return null;

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
                    <RecipientList
                      recipients={recipients || []}
                      selectedRecipients={field.value}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                      onSelectRecipient={handleSelectRecipient}
                    />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea 
                      placeholder="Enter instructions for the recipients"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passphrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase</FormLabel>
                    <Input 
                      type="password" 
                      placeholder="Enter your passphrase"
                      {...field}
                    />
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
