"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { notification } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

type FormLogin = {
  username: string,
  password: string
}

export default function LoginPage() {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormLogin>();
  const onSubmit = async (data: FormLogin) => {
    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (res?.code)
        return notification("Incorrect or no access account!");
      if (res?.ok) {
        route.push("/admin/employee");
      }
    } catch (e) {
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div>
                <Input
                  placeholder="Username/email..."
                  {
                  ...register("username", {
                    required: "Username or email is required!"
                  })
                  }
                />
                {errors.username && <p className="text-red-500 text-[12px] mt-2">{errors.username.message}</p>}
              </div>
              <div className="relative">

                <Input
                  placeholder="Password..."
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is requried!",
                    minLength: {
                      value: 2,
                      message: "Password at least 2 characters"
                    }
                  })}
                />
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
              {errors.password && <p className="text-red-500 text-[12px]">{errors.password.message}</p>}
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
