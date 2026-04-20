import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { createOrder } from "@/api/api";

export default function OrderDialog({
  product,
  open,
  onClose,
  user,
  onSuccess,
}) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const total = (product?.retail_price || 0) * quantity;

  const handleSubmit = async () => {
    if (!address.trim()) {
      toast({
        title: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    await createOrder({
      order_number: orderNumber,
      customer_email: user?.email,
      customer_name: user?.full_name || "Customer",
      items: [
        {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.retail_price,
          line_total: total,
        },
      ],
      total_amount: total,
      status: "pending",
      shipping_address: address,
    });
    setSubmitting(false);
    toast({
      title: "Order placed successfully!",
      description: `Order ${orderNumber} has been submitted.`,
    });
    setQuantity(1);
    setAddress("");
    onSuccess?.();
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Place Order
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
            <div className="flex-1">
              <p className="font-semibold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                £{product.retail_price?.toFixed(2)} each
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Shipping Address</Label>
            <Textarea
              placeholder="Enter your full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
            <span className="text-sm font-medium text-muted-foreground">
              Total
            </span>
            <span className="text-2xl font-heading font-bold text-primary">
              £{total.toFixed(2)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
