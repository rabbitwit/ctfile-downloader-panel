"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyPassword } from "@/lib/api"

interface LoginFormProps {
  onLoginSuccess: (password: string) => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setError("请输入密码")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const isValid = await verifyPassword(password)

      if (isValid) {
        onLoginSuccess(password)
      } else {
        setError("密码错误，请重试")
      }
    } catch (err) {
      setError("验证过程中出现错误，请重试")
      console.error("验证密码时出错:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">登录</h2>
      <p className="mb-6 text-sm text-gray-500">请输入密码以继续访问城通网盘解析工具</p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "验证中..." : "登录"}
        </Button>
      </form>
    </div>
  )
}
