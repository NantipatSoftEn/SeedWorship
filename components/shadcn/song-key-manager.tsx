"use client"

import { useState, useEffect } from "react"
import { Music, Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/dialog"
import { Input } from "@/components/shadcn/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  getAllKeys,
  getSongKeys,
  getSongPrimaryKey,
  addKeyToSong,
  setPrimarySongKey,
  removeKeyFromSong,
  createKey,
  type SongKey,
} from "@/lib/services/song-key-service"
import type { JSX } from "react/jsx-runtime"

interface SongKeyManagerProps {
  songId: string
  className?: string
  onKeysChange?: () => void
}

export function SongKeyManager({ songId, className, onKeysChange }: SongKeyManagerProps): JSX.Element {
  const [allKeys, setAllKeys] = useState<SongKey[]>([])
  const [songKeys, setSongKeys] = useState<SongKey[]>([])
  const [primaryKey, setPrimaryKey] = useState<SongKey | null>(null)
  const [selectedKeyId, setSelectedKeyId] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [newKeyName, setNewKeyName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  // โหลดข้อมูลคีย์ทั้งหมด
  useEffect(() => {
    const loadKeys = async () => {
      try {
        setIsLoading(true)
        const [allKeysData, songKeysData, primaryKeyData] = await Promise.all([
          getAllKeys(),
          getSongKeys(songId),
          getSongPrimaryKey(songId),
        ])

        setAllKeys(allKeysData)
        setSongKeys(songKeysData)
        setPrimaryKey(primaryKeyData)
      } catch (error) {
        console.error("Error loading keys:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลคีย์ได้",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadKeys()
  }, [songId, toast])

  // เพิ่มคีย์ให้กับเพลง
  const handleAddKey = async () => {
    if (!selectedKeyId) return

    try {
      await addKeyToSong(songId, selectedKeyId)

      // ถ้ายังไม่มีคีย์หลัก ให้ตั้งค่าคีย์นี้เป็นคีย์หลัก
      if (!primaryKey) {
        await setPrimarySongKey(songId, selectedKeyId)
      }

      // โหลดข้อมูลคีย์ใหม่
      const [songKeysData, primaryKeyData] = await Promise.all([getSongKeys(songId), getSongPrimaryKey(songId)])

      setSongKeys(songKeysData)
      setPrimaryKey(primaryKeyData)
      setSelectedKeyId("")
      setIsAddDialogOpen(false)

      toast({
        title: "เพิ่มคีย์สำเร็จ",
        description: "เพิ่มคีย์ให้กับเพลงเรียบร้อยแล้ว",
      })

      if (onKeysChange) {
        onKeysChange()
      }
    } catch (error) {
      console.error("Error adding key:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มคีย์ได้",
        variant: "destructive",
      })
    }
  }

  // ตั้งค่าคีย์หลัก
  const handleSetPrimaryKey = async (keyId: string) => {
    try {
      await setPrimarySongKey(songId, keyId)

      // โหลดข้อมูลคีย์หลักใหม่
      const primaryKeyData = await getSongPrimaryKey(songId)
      setPrimaryKey(primaryKeyData)

      toast({
        title: "ตั้งค่าคีย์หลักสำเร็จ",
        description: "ตั้งค่าคีย์หลักเรียบร้อยแล้ว",
      })

      if (onKeysChange) {
        onKeysChange()
      }
    } catch (error) {
      console.error("Error setting primary key:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถตั้งค่าคีย์หลักได้",
        variant: "destructive",
      })
    }
  }

  // ลบคีย์ออกจากเพลง
  const handleRemoveKey = async (keyId: string) => {
    try {
      await removeKeyFromSong(songId, keyId)

      // โหลดข้อมูลคีย์ใหม่
      const [songKeysData, primaryKeyData] = await Promise.all([getSongKeys(songId), getSongPrimaryKey(songId)])

      setSongKeys(songKeysData)
      setPrimaryKey(primaryKeyData)

      toast({
        title: "ลบคีย์สำเร็จ",
        description: "ลบคีย์ออกจากเพลงเรียบร้อยแล้ว",
      })

      if (onKeysChange) {
        onKeysChange()
      }
    } catch (error) {
      console.error("Error removing key:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบคีย์ได้",
        variant: "destructive",
      })
    }
  }

  // สร้างคีย์ใหม่
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return

    try {
      const newKey = await createKey(newKeyName.trim())

      // เพิ่มคีย์ใหม่เข้าไปในรายการคีย์ทั้งหมด
      setAllKeys([...allKeys, newKey])
      setNewKeyName("")
      setIsCreateDialogOpen(false)

      // เลือกคีย์ใหม่
      setSelectedKeyId(newKey.id)

      toast({
        title: "สร้างคีย์สำเร็จ",
        description: `สร้างคีย์ "${newKey.key_name}" เรียบร้อยแล้ว`,
      })
    } catch (error) {
      console.error("Error creating key:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างคีย์ได้",
        variant: "destructive",
      })
    }
  }

  // คีย์ที่ยังไม่ได้เพิ่มให้กับเพลง
  const availableKeys = allKeys.filter((key) => !songKeys.some((songKey) => songKey.id === key.id))

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <Music className="h-4 w-4" />
          <span>คีย์ของเพลง:</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          className="h-7 px-2 text-xs border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
          disabled={isLoading || availableKeys.length === 0}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          เพิ่มคีย์
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
        </div>
      ) : songKeys.length > 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-800">
          <div className="space-y-3">
            {songKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "cursor-pointer",
                      primaryKey?.id === key.id
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800",
                    )}
                    onClick={() => handleSetPrimaryKey(key.id)}
                  >
                    {key.key_name}
                    {primaryKey?.id === key.id && <Check className="ml-1 h-3 w-3" />}
                  </Badge>
                  {primaryKey?.id === key.id && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">(คีย์หลัก)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {primaryKey?.id !== key.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetPrimaryKey(key.id)}
                      className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                    >
                      ตั้งเป็นคีย์หลัก
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveKey(key.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">ลบคีย์</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">ยังไม่มีคีย์ที่กำหนด กรุณาเพิ่มคีย์</p>
        </div>
      )}

      {/* Dialog สำหรับเพิ่มคีย์ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-900 dark:text-blue-300">เพิ่มคีย์ให้กับเพลง</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">เลือกคีย์ที่ต้องการเพิ่ม</label>
              <div className="flex items-center gap-2">
                <Select value={selectedKeyId} onValueChange={setSelectedKeyId}>
                  <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="เลือกคีย์" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                    {availableKeys.length > 0 ? (
                      availableKeys.map((key) => (
                        <SelectItem
                          key={key.id}
                          value={key.id}
                          className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                        >
                          {key.key_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled className="text-gray-400 dark:text-gray-600">
                        ไม่มีคีย์ที่สามารถเพิ่มได้
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setIsCreateDialogOpen(true)
                  }}
                  className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  สร้างคีย์ใหม่
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleAddKey}
              disabled={!selectedKeyId}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              เพิ่มคีย์
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog สำหรับสร้างคีย์ใหม่ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-900 dark:text-blue-300">สร้างคีย์ใหม่</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อคีย์</label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="เช่น C, D, Em, F#"
                className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={!newKeyName.trim()}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
            >
              สร้างคีย์
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
