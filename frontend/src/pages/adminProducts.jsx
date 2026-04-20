import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EditProductDialog from "@/components/admin/EditProductDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import { fetchProducts, deleteProduct } from "../api/api";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      toast({ title: "Product deleted" });
    },
  });

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <PageHeader
        title="Products & Pricing"
        subtitle="Manage product catalogue and adjust retail prices"
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditProduct(null);
              setShowDialog(true);
            }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        }
      />

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">SKU</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Wholesale</TableHead>
                  <TableHead className="font-semibold">Retail</TableHead>
                  <TableHead className="font-semibold">Margin</TableHead>
                  <TableHead className="font-semibold">Stock</TableHead>
                  <TableHead className="font-semibold">Active</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => {
                    const margin =
                      p.retail_price && p.wholesale_price
                        ? (
                            (1 - p.wholesale_price / p.retail_price) *
                            100
                          ).toFixed(1)
                        : "—";
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {p.sku || "—"}
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {p.category?.replace(/_/g, " ") || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          £{p.wholesale_price?.toFixed(2) || "—"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          £{p.retail_price?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">{margin}%</TableCell>
                        <TableCell>
                          <StatusBadge status={p.stock_status || "in_stock"} />
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              p.is_active !== false
                                ? "text-emerald-600 font-medium text-sm"
                                : "text-muted-foreground text-sm"
                            }
                          >
                            {p.is_active !== false ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditProduct(p);
                                setShowDialog(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EditProductDialog
        product={editProduct}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSuccess={handleRefresh}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteMutation.mutate(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
