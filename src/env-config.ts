/** Defines helper functions for working with environment config values. */


/**
 * Checks that a config value is a non-empty string. The standard {@link process.env} produces
 * either a {@link string} or a {@link undefined}. This will allow the first case to pass, provided
 * that the string is non-empty, and will raise an application-stopping error in the second case.
 * @param name - the name of the config value.
 * @returns The value of the environment variable if it exists and is non-empty.
 * @throws If the value is missing or empty.
 */
export function getFromEnv(name: string): string {
    const value = process.env[name];

    if (typeof value == 'undefined') {
        throw Error(`Config value ${name} is not specified`);
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length == 0) {
        throw Error(`Config value ${name} is not specified`);
    }

    return trimmedValue;
}
