import { loadFixture } from '@inox-tools/astro-tests/astroFixture';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const fixture = await loadFixture({
	root: './fixture/astro',
});

describe('Swash Astro Integration Tests', () => {
	beforeAll(async () => {
		await fixture.build({});
	});

	// afterAll(async () => {
	// 	await fixture.clean();
	// });

	test('Basic Component Tests', async () => {
		const content = await fixture.readFile('basic/index.html');

		expect(content).toContain(
			`<div tabindex="-1" class="heading-wrapper level-h1"><h1 id="hello-world">Hello World!</h1><a class="anchor-link" href="#hello-world"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Hello World!, '” section'</span></a></div>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
		);
	});

	test('Basic Render Tests', async () => {
		const content = await fixture.readFile('basic-render/index.html');

		expect(
			content
		).toContain(`<div tabindex="-1" class="heading-wrapper level-h1"><h1 id="hello-world">Hello World!</h1><a class="anchor-link" href="#hello-world"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Hello World!, '” section'</span></a></div>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`);
	});

	test('Direct Markdown Processor Tests', async () => {
		const content = await fixture.readFile('direct/index.html');

		expect(content).toContain(
			`<div tabindex="-1" class="heading-wrapper level-h1"><h1 id="hello-world">Hello World!</h1><a class="anchor-link" href="#hello-world"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Hello World!, '” section'</span></a></div>`
		);
	});

	describe('Markdown Syntax tests', async () => {
		test('Headers', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="headers">Headers</h2><a class="anchor-link" href="#headers"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Headers, '” section'</span></a></div>
<div tabindex="-1" class="heading-wrapper level-h1"><h1 id="this-is-a-heading-h1">This is a Heading h1</h1><a class="anchor-link" href="#this-is-a-heading-h1"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', This is a Heading h1, '” section'</span></a></div>
<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="this-is-a-heading-h2">This is a Heading h2</h2><a class="anchor-link" href="#this-is-a-heading-h2"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', This is a Heading h2, '” section'</span></a></div>
<div tabindex="-1" class="heading-wrapper level-h6"><h6 id="this-is-a-heading-h6">This is a Heading h6</h6><a class="anchor-link" href="#this-is-a-heading-h6"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', This is a Heading h6, '” section'</span></a></div>`);
		});

		test('Emphasis', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="emphasis">Emphasis</h2><a class="anchor-link" href="#emphasis"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Emphasis, '” section'</span></a></div>
<p><em>This text will be italic</em><br>
<em>This will also be italic</em></p>
<p><strong>This text will be bold</strong><br>
<strong>This will also be bold</strong></p>
<p><em>You <strong>can</strong> combine them</em></p>`);
		});

		test('Lists', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="lists">Lists</h2><a class="anchor-link" href="#lists"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Lists, '” section'</span></a></div>
<div tabindex="-1" class="heading-wrapper level-h3"><h3 id="unordered">Unordered</h3><a class="anchor-link" href="#unordered"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Unordered, '” section'</span></a></div>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 2a</li>
<li>Item 2b
<ul>
<li>Item 3a</li>
<li>Item 3b</li>
</ul>
</li>
</ul>
<div tabindex="-1" class="heading-wrapper level-h3"><h3 id="ordered">Ordered</h3><a class="anchor-link" href="#ordered"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Ordered, '” section'</span></a></div>
<ol>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3
<ol>
<li>Item 3a</li>
<li>Item 3b</li>
</ol>
</li>
</ol>`);
		});

		test('Images', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="images">Images</h2><a class="anchor-link" href="#images"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Images, '” section'</span></a></div>
<p><img src="https://markdownlivepreview.com/image/sample.webp" alt="This is an alt text." title="This is a sample image."></p>`);
		});

		test('Links', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="links">Links</h2><a class="anchor-link" href="#links"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Links, '” section'</span></a></div>
<p>You may be using <a href="https://github.com/withstudiocms/markdown-remark">StudioCMS Markdown Remark</a>.</p>`);
		});

		test('Blockquotes', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="blockquotes">Blockquotes</h2><a class="anchor-link" href="#blockquotes"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Blockquotes, '” section'</span></a></div>
<blockquote>
<p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>
<blockquote>
<p>Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
</blockquote>
</blockquote>`);
		});

		test('Tables', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(content).toContain(
				`<table><thead><tr><th>Left columns</th><th align="center">Right columns</th></tr></thead><tbody><tr><td>left foo</td><td align="center">right foo</td></tr><tr><td>left bar</td><td align="center">right bar</td></tr><tr><td>left baz</td><td align="center">right baz</td></tr></tbody></table>`
			);
		});

		test('Code Blocks', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="blocks-of-code">Blocks of code</h2><a class="anchor-link" href="#blocks-of-code"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Blocks of code, '” section'</span></a></div>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="js"><code><span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> message </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'Hello world'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">alert</span><span style="color:#E1E4E8">(message);</span></span></code></pre>`);
		});

		test('Inline Code', async () => {
			const content = await fixture.readFile('syntax/index.html');

			expect(
				content
			).toContain(`<div tabindex="-1" class="heading-wrapper level-h2"><h2 id="inline-code">Inline code</h2><a class="anchor-link" href="#inline-code"><span aria-hidden="true" class="anchor-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path></svg></span><span is:raw="" class="sr-only">'Read the “', Inline code, '” section'</span></a></div>
<p>This web site is using <code>@studiocms/markdown-remark</code>.</p> </body></html>`);
		});
	});
});
