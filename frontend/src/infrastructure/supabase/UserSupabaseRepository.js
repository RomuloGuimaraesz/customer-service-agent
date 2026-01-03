import { UserRepository } from '../../domain/repositores/UserRepository'
import { User } from '../../domain/entities/User.js'
import { supabase } from './config'

export class UserSupabaseRepository extends UserRepository {
    constructor(supabaseClient) {
        super();
        // Store the supabase client if needed, though we're using the imported one
        // This allows for dependency injection if needed in the future
    }

    async createUser(user, authHeader = null) {
        // Access password through the User entity's public method (maintains encapsulation)
        const password = user.getPassword();
        
        // Validate password is provided and not empty
        if (!password) {
            throw new Error('Password is required');
        }
        
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }
        
        // Check if password is empty (but don't trim as passwords can contain spaces)
        if (password.length === 0) {
            throw new Error('Password cannot be empty');
        }

        // Validate email is provided
        if (!user.email || typeof user.email !== 'string' || user.email.trim().length === 0) {
            throw new Error('Email is required and must be a non-empty string');
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: user.email.trim(),
            password: password,
            options: {
              emailRedirectTo: window.location.origin + '/',
              data: {
                username: user.username,
                full_name: user.fullName,
                role: user.role,
              },
            },
        })
        
        if (error) {
            throw new Error(error.message)
        }

        // If user is created, return User entity
        if (data?.user) {
            return new User({
                id: data.user.id,
                username: user.username || user.email,
                email: data.user.email,
                fullName: user.fullName || data.user.user_metadata?.full_name || null,
                role: user.role || data.user.user_metadata?.role || 'user',
                isActive: true,
                createdAt: data.user.created_at ? new Date(data.user.created_at) : new Date(),
            })
        }

        // If email confirmation is required, Supabase might not return user immediately
        // Return a user entity with the provided data
        return new User({
            username: user.username || user.email,
            email: user.email,
            fullName: user.fullName,
            role: user.role || 'user',
            isActive: true,
        })
    }

    async authenticate(email, password) {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Attempt to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });

        if (error) {
            // Return null for invalid credentials (don't throw to allow use case to handle gracefully)
            if (error.message.includes('Invalid login credentials') || 
                error.message.includes('Email not confirmed')) {
                return null;
            }
            throw new Error(error.message);
        }

        // If authentication successful, create and return User entity
        if (data?.user) {
            return new User({
                id: data.user.id,
                username: data.user.user_metadata?.username || data.user.email,
                email: data.user.email,
                fullName: data.user.user_metadata?.full_name || null,
                role: data.user.user_metadata?.role || 'user',
                isActive: true,
                createdAt: data.user.created_at ? new Date(data.user.created_at) : new Date(),
            });
        }

        return null;
    }
}
