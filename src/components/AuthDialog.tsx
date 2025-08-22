// components/AuthDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Chrome, Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AuthDialog() {
  const { isOpen, closeDialog } = useSignInDialogStore();
  const { signInWithGitHub, signOut, user, signInWithGoogle } = useAuth();
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        {/* "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", */}
        <div className="w-full text-card-foreground flex flex-col py-6  gap-6  max-w-md shadow-2xl   backdrop-blur-sm">
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sign Up
              </p>
              <p className="text-muted-foreground">
                Choose your preferred sign-in method
              </p>
            </div>
          </div>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full gap-3 h-12 border-2 hover:border-blue-300"
              >
                <Chrome className="h-5 w-5 text-blue-500" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full gap-3 h-12 border-2 hover:border-gray-400"
                onClick={signInWithGitHub}
              >
                <Github className="h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground">
                Forgot your password?
              </Button>
              <div className="text-sm text-muted-foreground">
                New to our platform?{" "}
                <Button
                  variant="link"
                  className="px-0 font-medium text-blue-600"
                >
                  Create an account
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}
