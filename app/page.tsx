"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { LinkInput } from "@/components/link-input"
import { FileList } from "@/components/file-list"
import { checkLogin } from "@/lib/api"
import { GitHubIcon } from "@/components/github-icon"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [password, setPassword] = useState<string>("")
  const [files, setFiles] = useState<Array<{ key: string; name: string }>>([])
  const [xtlink, setXtlink] = useState<string>("")

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        setIsLoading(true)
        const result = await checkLogin()
        setIsLoggedIn(result)
        if (result) {
          setPassword("")
        }
      } catch (error) {
        console.error("登录验证失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    verifyLogin()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            <span>正在加载...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <header className="mb-8 flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-2xl font-bold">城通网盘解析工具</h1>
        <a
          href="https://github.com/Nekohy/ctfile-downloader"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
        >
          <GitHubIcon className="h-5 w-5" />
          <span>GitHub</span>
        </a>
      </header>

      <main className="w-full max-w-4xl space-y-6">
        {!isLoggedIn ? (
          <LoginForm
            onLoginSuccess={(pwd) => {
              setIsLoggedIn(true)
              setPassword(pwd)
            }}
          />
        ) : (
          <>
            <LinkInput
              onSubmit={(link, files) => {
                setXtlink(link)
                setFiles(files)
              }}
              password={password}
            />

            {files.length > 0 && <FileList files={files} xtlink={xtlink} password={password} />}
          </>
        )}
      </main>
    </div>
  )
}
