/**
 * A class that extends the native JavaScript `String` object to represent an HTML string.
 * This class overrides the `Symbol.toStringTag` property to return 'HTMLString',
 * which can be useful for debugging or type-checking purposes.
 *
 * @extends {String}
 */
export class HTMLString extends String {
	get [Symbol.toStringTag]() {
		return 'HTMLString';
	}
}
