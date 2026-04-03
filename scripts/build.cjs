const {
	mkdirSync,
	rmSync,
	existsSync,
	readFileSync,
	writeFileSync,
} = require("node:fs");
const { resolve } = require("node:path");
const esbuild = require("esbuild");
const { exec } = require("pkg");

const pkg = require("../package.json");

const DIST = "dist";
const OUT_BUNDLE = resolve(DIST, "bundle.cjs");
const OUT_EXE = resolve(DIST, "Valorant-Elo-Info.exe");
const ICON = "icon.ico";

async function setIcon(exePath, icoPath) {
	const { NtExecutable, NtExecutableResource, Data, Resource } =
		await import("resedit");

	const exe = NtExecutable.from(readFileSync(exePath), { ignoreCert: true });
	const res = NtExecutableResource.from(exe);
	const iconFile = Data.IconFile.from(readFileSync(icoPath));

	// Replace default Node.js icon
	Resource.IconGroupEntry.replaceIconsForResource(
		res.entries,
		1,
		1033,
		iconFile.icons.map((icon) => icon.data),
	);

	// Embed version info from package.json
	const versionInfo = Resource.VersionInfo.fromEntries(res.entries);
	if (versionInfo.length > 0) {
		const vi = versionInfo[0];
		const [major, minor, patch] = pkg.version.split(".").map(Number);

		vi.setFileVersion(major, minor, patch, 0);
		vi.setProductVersion(major, minor, patch, 0);

		vi.setStringValues({ lang: 1033, codepage: 1200 }, {
			ProductName: "Valorant Elo Info",
			FileDescription: pkg.description,
			CompanyName: pkg.author,
			LegalCopyright: `Copyright (c) ${new Date().getFullYear()} ${pkg.author}`,
			FileVersion: pkg.version,
			ProductVersion: pkg.version,
		});

		vi.outputToResourceEntries(res.entries);
	}

	res.outputResource(exe);
	writeFileSync(exePath, Buffer.from(exe.generate()));
}

function clean() {
	for (const file of [OUT_EXE, OUT_BUNDLE]) {
		if (existsSync(file)) rmSync(file);
	}
	if (!existsSync(DIST)) mkdirSync(DIST);
}

async function build() {
	const start = performance.now();

	clean();
	console.log("Cleaned dist/");

	await esbuild.build({
		entryPoints: ["src/index.ts"],
		bundle: true,
		platform: "node",
		format: "cjs",
		outfile: OUT_BUNDLE,
		minify: true,
		treeShaking: true,
	});
	console.log("Bundled to", OUT_BUNDLE);

	await exec([OUT_BUNDLE, "--compress", "Brotli", "--targets", "node18-win-x64", "--output", OUT_EXE]);
	console.log("Packaged to", OUT_EXE);

	await setIcon(OUT_EXE, ICON);
	console.log("Icon and metadata set");

	rmSync(OUT_BUNDLE);

	const elapsed = ((performance.now() - start) / 1000).toFixed(1);
	console.log(`Done in ${elapsed}s`);
}

build().catch((err) => {
	console.error("Build failed:", err.message);
	process.exit(1);
});
