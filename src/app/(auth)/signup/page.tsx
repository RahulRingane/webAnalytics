 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Something went wrong");
        setLoading(false);
        return;
      }

      // ✅ Signup success → redirect to signin
      router.push("/signin");
    } catch (err) {
      console.error(err);
      setError("Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="w-full min-h-screen flex bg-gradient-to-b from-purple-900 to-gray-900 px-5">

       <div className="hidden md:flex w-[65%] h-screen items-center justify-start px-10">
        <img
          src="/authh.svg"
          alt="Analytics Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="md:w-1/2 h-screen flex items-center justify-start bg-gradient-to-b from-purple-900 to-gray-900 px-4">
      <Card className="w-full max-w-md border-purple-600 bg-gray-800 bg-opacity-50 p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Create your account
          </CardTitle>
        </CardHeader>

        {error && (
          <div className="mb-4 flex items-center gap-x-2 rounded-md bg-destructive p-3 text-sm text-white">
            <TriangleAlert className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              disabled={loading}
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-400 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-purple-600 focus-visible:ring-offset-0"
              type="email"
              required
            />

            <Input
              disabled={loading}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-400 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-purple-600 focus-visible:ring-offset-0"
              type="password"
              required
            />

            <Input
              disabled={loading}
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-gray-400 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-purple-600 focus-visible:ring-offset-0"
              type="password"
              required
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              size={"lg"}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <Separator className="bg-gradient-to-r from-gray-800 via-neutral-500 to-gray-800" />

          <p className="text-sm text-center text-gray-300">
            Already have an account?{" "}
            <a href="/signin" className="text-sky-500 hover:underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
