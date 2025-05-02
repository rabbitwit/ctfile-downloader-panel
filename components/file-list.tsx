"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateDownloadLink, generateMultipleDownloadLinks } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

interface FileListProps {
  files: Array<{ key: string; name: string }>
  xtlink: string
  password: string
}

export function FileList({ files, xtlink, password }: FileListProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopyingAll, setIsCopyingAll] = useState(false)

  const handleCopyLink = async (file: { key: string; name: string }) => {
    try {
      setError(null)

      // 使用环境变量获取API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error("API URL 未配置，请检查环境变量")
      }

      // 生成下载链接
      const linkUrl = generateDownloadLink(apiUrl, xtlink, file.key, password)

      // 复制到剪贴板
      await navigator.clipboard.writeText(linkUrl)

      // 显示复制成功状态
      setCopiedFile(file.key)

      // 3秒后重置状态
      setTimeout(() => {
        setCopiedFile(null)
      }, 3000)
    } catch (err) {
      setError("复制链接失败，请手动复制")
      console.error("复制链接时出错:", err)
    }
  }

  const handleCopyAllLinks = async () => {
    try {
      setError(null)
      setIsCopyingAll(true)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error("API URL 未配置，请检查环境变量")
      }

      // 生成所有文件的下载链接
      const allLinks = generateMultipleDownloadLinks(apiUrl, xtlink, files, password)

      // 格式化为易读的文本
      const linksText = allLinks.map((link) => `${link.name}: ${link.url}`).join("\n\n")

      // 复制到剪贴板
      await navigator.clipboard.writeText(linksText)

      // 显示成功消息
      setCopiedFile("all")

      // 3秒后重置状态
      setTimeout(() => {
        setCopiedFile(null)
        setIsCopyingAll(false)
      }, 3000)
    } catch (err) {
      setError("批量复制链接失败")
      console.error("批量复制链接时出错:", err)
      setIsCopyingAll(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">文件列表</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">点击文件名复制下载链接</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCopyAllLinks()
            }}
            className={`flex items-center rounded-md px-2 py-1 text-xs ${
              copiedFile === "all" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            disabled={isCopyingAll || files.length === 0}
          >
            {copiedFile === "all" ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                已复制全部
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" />
                复制全部
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4 max-h-80 overflow-y-auto rounded border">
        {files.length > 0 ? (
          <ul className="divide-y">
            {files.map((file) => (
              <li
                key={file.key}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCopyLink(file)}
              >
                <span className="flex-1 truncate">{file.name}</span>
                <span className="ml-2 flex items-center text-sm">
                  {copiedFile === file.key ? (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      已复制
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500">
                      <Copy className="h-4 w-4 mr-1" />
                      复制链接
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">没有找到文件</div>
        )}
      </div>
    </div>
  )
}
