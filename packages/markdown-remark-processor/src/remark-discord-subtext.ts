import type { Root } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';

/**
 * A remark plugin to transform markdown subtext syntax into HTML.
 *
 * This plugin searches for lines starting with `-# ` and wraps the
 * following text in a `<small>` HTML tag.
 *
 * @returns A transformer function that processes the markdown AST.
 */
export default function remarkDiscordSubtext(): (tree: Root) => void {
	return (tree: Root) => {
		findAndReplace(tree, [
			/^-# (.*)/,
			(_, $1) => ({ type: 'html', value: `<small>${$1}</small>` }),
		]);
	};
}
