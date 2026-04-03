const { mkdirSync, rmSync, existsSync } = require("node:fs");
const esbuild = require("esbuild");
const { exec } = require("pkg");
const { rcedit } = require("rcedit");

const OUT_BUNDLE = "dist/bundle.cjs";
const OUT_EXE = "dist/Valorant-Elo-Info.exe";

async function build() {
	if (existsSync(OUT_EXE)) rmSync(OUT_EXE);
	if (existsSync(OUT_BUNDLE)) rmSync(OUT_BUNDLE);
	if (!existsSync("dist")) mkdirSync("dist");
	console.log("Cleaned dist/");

	await esbuild.build({
		entryPoints: ["src/index.ts"],
		bundle: true,
		platform: "node",
		format: "cjs",
		outfile: OUT_BUNDLE,
	});
	console.log("Bundled to", OUT_BUNDLE);

	await exec([OUT_BUNDLE, "--targets", "node18-win-x64", "--output", OUT_EXE]);
	console.log("Packaged to", OUT_EXE);

	await rcedit(OUT_EXE, {
		icon: "icon.ico",
		"version-string": {
			ProductName: "Valorant Elo Info",
			FileDescription: "Valorant Rank, RR, and ELO checker",
			CompanyName: "Adib23704",
			LegalCopyright: "MIT License",
		},
		"file-version": "1.0.0",
		"product-version": "1.0.0",
	});
	console.log("Icon and metadata set");

	rmSync(OUT_BUNDLE);
	console.log("Done!");
}

build().catch((err) => {
	console.error("Build failed:", err.message);
	process.exit(1);
});
