"use client"

import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/shadcn/label"

const Form = FormProvider

interface FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>): JSX.Element => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

interface FormItemContextValue {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const useFormField = (): {
    id: string
    name: FieldPath<FieldValues>
    formItemId: string
    formDescriptionId: string
    formMessageId: string
    error: any
    isDirty: boolean
    isTouched: boolean
    isValidating: boolean
} => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>")
    }

    if (!itemContext) {
        throw new Error("useFormField should be used within <FormItem>")
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    }
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(({ className, ...props }, ref) => {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <div ref={ref} className={cn("space-y-2", className)} {...props} />
        </FormItemContext.Provider>
    )
})
FormItem.displayName = "FormItem"

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
    className?: string
}

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
    ({ className, ...props }, ref) => {
        const { error, formItemId } = useFormField()

        return (
            <Label
                ref={ref}
                className={cn(error && "text-destructive", className)}
                htmlFor={formItemId}
                {...props}
            />
        )
    }
)
FormLabel.displayName = "FormLabel"

interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {
    className?: string
}

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, FormControlProps>(
    ({ ...props }, ref) => {
        const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

        return (
            <Slot
                ref={ref}
                id={formItemId}
                aria-describedby={
                    !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
                }
                aria-invalid={!!error}
                {...props}
            />
        )
    }
)
FormControl.displayName = "FormControl"

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string
}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
    ({ className, ...props }, ref) => {
        const { formDescriptionId } = useFormField()

        return (
            <p
                ref={ref}
                id={formDescriptionId}
                className={cn("text-sm text-muted-foreground", className)}
                {...props}
            />
        )
    }
)
FormDescription.displayName = "FormDescription"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ className, children, ...props }, ref) => {
        const { error, formMessageId } = useFormField()
        const body = error ? String(error?.message) : children

        if (!body) {
            return null
        }

        return (
            <p
                ref={ref}
                id={formMessageId}
                className={cn("text-sm font-medium text-destructive", className)}
                {...props}
            >
                {body}
            </p>
        )
    }
)
FormMessage.displayName = "FormMessage"

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}
