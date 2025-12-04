"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { notification } from "@/lib/utils"
import { loginFormSchema, LoginFormType } from "@/types"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

export default function LoginPage() {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (res?.code)
        return notification("Incorrect or no access account!");
      if (res?.ok) {
        route.replace("/admin/employee");
      }
    } catch {
      notification("An unexpected error occurred. Please try again.");
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user1/user1@email.com..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
