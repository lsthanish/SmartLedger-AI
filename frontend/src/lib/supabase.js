import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lhorlrbmcsuxhgzzifbw.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3JscmJtY3N1eGhnenppZmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDA1OTQsImV4cCI6MjA3NjI3NjU5NH0.Slhm6slBYpyxXrBjonYICzGxacPnJFHKTejhFsSR1QY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

/**
 * Sign up a new user with Supabase Auth
 */
export const signUp = async(email, password, fullName) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
    }
}

/**
 * Sign in an existing user with Supabase Auth
 */
export const signIn = async(email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
    }
}

/**
 * Sign out the current user
 */
export const signOut = async() => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
    } catch (error) {
        console.error('Sign out error:', error)
        return { error }
    }
}

/**
 * Get the current user session
 */
export const getSession = async() => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return { session, error: null }
    } catch (error) {
        console.error('Get session error:', error)
        return { session: null, error }
    }
}

/**
 * Get the current user
 */
export const getUser = async() => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return { user, error: null }
    } catch (error) {
        console.error('Get user error:', error)
        return { user: null, error }
    }
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback)
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
    console.error('Supabase error:', error)
    return error.message || 'An error occurred'
}

export default supabase