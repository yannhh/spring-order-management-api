import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { createProduct, updateProduct } from "@/api/api";

export default function EditProductDialog({
  product,
  open,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setForm({ ...product });
    } else {
      setForm({
        name: "",
        description: "",
        sku: "",
        wholesale_price: 0,
        retail_price: 0,
        stock_status: "in_stock",
        category: "other",
        is_active: true,
        image_url: "",
      });
    }
  }, [product, open]);

  const handleSave = async () => {
    if (!form.name?.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const data = {
      name: form.name,
      description: form.description,
      sku: form.sku,
      wholesale_price: parseFloat(form.wholesale_price) || 0,
      retail_price: parseFloat(form.retail_price) || 0,
      stock_status: form.stock_status,
      category: form.category,
      is_active: form.is_active,
      image_url: form.image_url,
    };
    if (product?.id) {
      await updateProduct(product.id, data);
    } else {
      await createProduct(data);
    }
    setSaving(false);
    toast({ title: product?.id ? "Product updated" : "Product created" });
    onSuccess?.();
    onClose();
  };

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {product?.id ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Name</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.sku || ""}
                onChange={(e) => update("sku", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category || "other"}
                onValueChange={(v) => update("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home_garden">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wholesale Price (£)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.wholesale_price || ""}
                onChange={(e) => update("wholesale_price", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Retail Price (£)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.retail_price || ""}
                onChange={(e) => update("retail_price", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select
                value={form.stock_status || "in_stock"}
                onValueChange={(v) => update("stock_status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={form.image_url || ""}
                onChange={(e) => update("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2 flex items-center gap-3 pt-2">
              <Switch
                checked={form.is_active !== false}
                onCheckedChange={(v) => update("is_active", v)}
              />
              <Label>Listed for sale</Label>
            </div>
          </div>
          {form.wholesale_price > 0 && form.retail_price > 0 && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <span className="text-muted-foreground">Margin: </span>
              <span className="font-semibold text-foreground">
                £{(form.retail_price - form.wholesale_price).toFixed(2)} (
                {((1 - form.wholesale_price / form.retail_price) * 100).toFixed(
                  1,
                )}
                %)
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {product?.id ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
