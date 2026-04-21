import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (!userId) return alert("Enter User ID");

    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", role);

    navigate(role === "admin" ? "/admin" : "/products");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="p-10 bg-white rounded-3xl shadow-2xl w-full max-w-sm space-y-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">DropShip Login</h1>
        <p className="text-slate-500 text-sm">
          Enter your Customer ID to start
        </p>

        <Input
          type="number"
          placeholder="User ID (e.g., 1)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="text-center text-lg h-12"
        />

        <div className="flex flex-col gap-3">
          <Button
            className="h-12 text-lg"
            onClick={() => handleLogin("customer")}
          >
            Login as Customer
          </Button>
          <Button
            variant="outline"
            className="h-12 text-lg"
            onClick={() => handleLogin("admin")}
          >
            Login as Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
