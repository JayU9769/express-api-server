import passport from 'passport';
/**
 * A singleton service class to manage Passport configuration and strategies.
 * It ensures that Passport is initialized only once and manages user authentication.
 */
export declare class PassportService {
    private static instance;
    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor();
    /**
     * Gets the singleton instance of the PassportService class.
     * @returns The singleton instance of PassportService.
     */
    static getInstance(): PassportService;
    /**
     * Initializes Passport strategies and serialization/deserialization logic.
     */
    private initialize;
}
export { passport };
