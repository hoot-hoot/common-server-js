/**
 * Helpers for database migrations. `hoot-hoot` API services usually have an associated database. We
 * use [knex]{@link http://knexjs.org/} to interact with the database. This is simply a query
 * builder with some added functionality, but is not an ORM. So it doesn't have any of those
 * code first schemas. So specifying the database schema is done via migrations files in a
 * migrations directory. These are meant to be applied in order to the database and bring it to the
 * desired state.
 */

/** Imports. Also so typedoc works correctly. **/
import { execSync } from 'child_process'


/**
 * Executes all of the database migrations in the ./migrations directory, in the order they are
 * defined. Does not run already executed migrations. Meant to be used at process initialization.
 * A synchronous function which takes a while to run. Depends on the "knex" package being installed.
 */
export function startupMigration(): void {
    execSync('./node_modules/.bin/knex migrate:latest');
}
