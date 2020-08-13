import * as fs from "fs";
import * as path from "path";

import { Project } from "ts-morph";

// Example usage:
//  npx ts-node ./compiler.ts input/twoPlusTwo.ps

const project = new Project({
	"addFilesFromTsConfig": false,
	"tsConfigFilePath": path.join(__dirname, "tsconfig.json")
});

export function compile(input) {
	// Normalize whitespace
	input = input.replace(/^\t+/gm, function(match) {
		return " ".repeat(match.length * 4);
	}).replace(/[ \t]+$/gm, "");

	const sourceFile = project.createSourceFile("input.ts", input);

	for (const transform of fs.readdirSync(path.join(__dirname, "transforms"))) {
		const transformFunction = require(path.join(__dirname, "transforms", transform))["default"];

		if (transformFunction.name !== "skip") {
			transformFunction(sourceFile);
		}
	}

	const output = project.emitToMemory().getFiles()[0].text;

	project.removeSourceFile(sourceFile);

	return output;
}

if (require.main === module) {
	console.log(compile(fs.readFileSync(process.argv.pop(), { "encoding": "utf8" })));
}
