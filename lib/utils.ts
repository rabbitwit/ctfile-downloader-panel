import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 添加一个客户端工具函数来生成下载链接
export function generateDownloadLink(apiUrl: string, xtlink: string, fileId: string, password?: string): string {
  let url = `${apiUrl}/download?xtlink=${encodeURIComponent(xtlink)}&file_id=${encodeURIComponent(fileId)}`

  if (password) {
    url += `&password=${encodeURIComponent(password)}`
  }

  return url
}

// 添加一个批量生成下载链接的函数，为后续添加批量复制功能做准备
export function generateMultipleDownloadLinks(
  apiUrl: string,
  xtlink: string,
  files: Array<{ key: string; name: string }>,
  password?: string,
): Array<{ name: string; url: string }> {
  return files.map((file) => ({
    name: file.name,
    url: generateDownloadLink(apiUrl, xtlink, file.key, password),
  }))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
