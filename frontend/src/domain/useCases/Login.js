/**
 * @fileoverview Login use case - handles user authentication business logic
 */

import { User } from '../entities/User.js';

/**
 * Result object returned by use case execution
 * @typedef {Object} UseCaseResult
 * @property {boolean} success - Whether the operation succeeded
 * @property {User|null} data - User entity if successful
 * @property {string|null} error - Error message if failed
 * @property {string|null} warning - Warning message if applicable
 */

/**
 * Login Use Case
 * 
 * @class
 * @classdesc Handles the business logic for user authentication/login in the system
 */
export class Login {
  /**
   * Creates a new Login use case instance
   * 
   * @param {Object} dependencies - Use case dependencies
   * @param {UserRepository} dependencies.userRepository - Repository for user data operations
   */
  constructor({ userRepository }) {
    /**
     * @type {UserRepository}
     * @private
     */
    this._userRepository = userRepository;

    if (!this._userRepository) {
      throw new Error('UserRepository is required');
    }
  }

  /**
   * Executes the login use case
   * 
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email (required)
   * @param {string} credentials.password - Password (required)
   * @returns {Promise<UseCaseResult>} Result object with success status and user data or error
   */
  async execute(credentials) {
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          data: null,
          error: 'Email and password are required',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email.trim())) {
        return {
          success: false,
          data: null,
          error: 'Please enter a valid email address',
        };
      }

      // Validate password is not empty
      if (credentials.password.length === 0) {
        return {
          success: false,
          data: null,
          error: 'Password is required',
        };
      }

      // Attempt to authenticate via repository
      // The repository will handle the actual authentication logic
      const user = await this._userRepository.authenticate(
        credentials.email.trim(),
        credentials.password
      );

      if (!user) {
        return {
          success: false,
          data: null,
          error: 'Email ou senha inválidos',
        };
      }

      // Clear password from memory after authentication for security
      user.clearPassword();

      return {
        success: true,
        data: user,
        error: null,
      };
    } catch (error) {
      // Handle repository errors
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao fazer login',
      };
    }
  }
}

