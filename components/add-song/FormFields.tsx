"use client"

import { Music } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { TagSelector } from "@/components/shadcn/tag-selector"
import { getAllKeys } from "@/utils/chord-transposer"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "./schema"
import type { SongTag } from "@/types/song"
import { JSX } from "react"

interface FormFieldsProps {
    form: UseFormReturn<FormValues>
}

export const FormFields = ({ form }: FormFieldsProps): JSX.Element => {
    const allKeys = getAllKeys()
    const selectedTags = form.watch("tags") || []

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                ชื่อเพลง
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ระบุชื่อเพลง"
                                    {...field}
                                    className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                ศิลปิน/วง
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ระบุชื่อศิลปินหรือวง"
                                    {...field}
                                    className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-blue-900 dark:text-blue-300">
                                หมวดหมู่
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder="เลือกหมวดหมู่" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                    <SelectItem
                                        value="praise"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        สรรเสริญ
                                    </SelectItem>
                                    <SelectItem
                                        value="worship"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        นมัสการ
                                    </SelectItem>
                                    <SelectItem
                                        value="opening"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        บทเพลงเปิด
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-blue-900 dark:text-blue-300">ภาษา</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder="เลือกภาษา" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                    <SelectItem
                                        value="thai"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        ภาษาไทย
                                    </SelectItem>
                                    <SelectItem
                                        value="english"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        ภาษาอังกฤษ
                                    </SelectItem>
                                    <SelectItem
                                        value="other"
                                        className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                    >
                                        ภาษาอื่นๆ
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-blue-900 dark:text-blue-300 flex items-center">
                                <Music className="h-4 w-4 mr-1" />
                                คีย์เพลงหลัก
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value || "C"}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-blue-100 dark:border-blue-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder="เลือกคีย์" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                                    {allKeys.map((key) => (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900"
                                        >
                                            {key}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <TagSelector
                                selectedTags={(field.value as SongTag[]) || []}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                )}
            />
        </>
    )
}
