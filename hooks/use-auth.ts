"use client"

import { useState, useEffect } from "react"

interface AuthState {
    isAdmin: boolean
    isAuthenticated: boolean
}

export const useAuth = (): AuthState => {
    // In a real application, you would fetch this from your auth provider
    // This is just a mock implementation
    const [authState, setAuthState] = useState<AuthState>({
        isAdmin: true, // Set to true for demonstration
        isAuthenticated: true,
    })

    useEffect(() => {
        // Here you would check the user's authentication status
        // For example, by fetching from an API or checking local storage

        // Mock implementation
        const checkAuth = (): void => {
            // In a real app, this would verify the user's session
            setAuthState({
                isAdmin: true, // For demo purposes
                isAuthenticated: true,
            })
        }

        checkAuth()
    }, [])

    return authState
}
