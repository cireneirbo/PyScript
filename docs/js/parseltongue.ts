import { Project } from "../../lib/ts-morph/ts-morph";

import transform from "../../transforms/meaningfulWhitespace";

const project = new Project({
	"compilerOptions": {
		"allowJs": true,
		"allowSyntheticDefaultImports": true,
		"alwaysStrict": true,
		"esModuleInterop": true,
		"experimentalDecorators": true,
		"moduleResolution": "Node",
		"target": "ES2015",
		"preserveConstEnums": true
	}
});

globalThis.compile = function(input) {
	// Normalize whitespace
	input = input.replace(/^\t+/gm, function(match) {
		return " ".repeat(match.length * 4);
	}).replace(/[ \t]+$/gm, "");

	const sourceFile = project.createSourceFile("input.ts", input, { "overwrite": true });

	transform(sourceFile);

	const output = project.emitToMemory().getFiles()[0].text;

	project.removeSourceFile(sourceFile);

	return output;
};
