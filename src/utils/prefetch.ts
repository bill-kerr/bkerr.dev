export function createImagePrefetchScript(src: string) {
	const varName = `i${Math.floor(Math.random() * 10000)}`;

	return (
		`if (!prefetched.has("${src}")){` +
		`const ${varName}=document.createElement("link");` +
		`${varName}.rel="prefetch";` +
		`${varName}.href="${src}";` +
		`${varName}.type="image/webp";` +
		`$el.appendChild(${varName});` +
		`prefetched.add("${src}");}`
	);
}
