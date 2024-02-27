import * as ts from "typescript";
import * as fs from "fs";

// Función para contar las clases en un nodo TypeScript
function countClasses(node: ts.Node): number {
    let classCount = 0;

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node)) {
            classCount++;
        }
        ts.forEachChild(node, visit);
    }

    visit(node);

    return classCount;
}

// Función para imprimir recursivamente la estructura sintáctica de un nodo TypeScript
function printRecursiveFrom(
    node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile
) {
    const indentation = "-".repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    console.log(`${indentation}${syntaxKind}: ${nodeText}`);

    node.forEachChild(child =>
        printRecursiveFrom(child, indentLevel + 1, sourceFile)
    );
}

// Función para leer todos los archivos TypeScript en un directorio y sus subdirectorios
function readProject(directory: string): string[] {
    let files: string[] = [];

    fs.readdirSync(directory).forEach(file => {
        const filePath = `${directory}/${file}`;
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Si es un directorio, leer sus archivos recursivamente
            files = files.concat(readProject(filePath));
        } else if (file.endsWith(".ts")) {
            // Si es un archivo TypeScript, agregarlo a la lista
            files.push(filePath);
        }
    });

    return files;
}

// Directorio del proyecto
const projectDirectory = "./ejemplos/architecture";

// Obtener la lista de archivos TypeScript del proyecto
const files = readProject(projectDirectory);

// Procesar cada archivo individualmente
files.forEach(filename => {
    const code = fs.readFileSync(filename, "utf-8");

    const sourceFile = ts.createSourceFile(
        filename, code, ts.ScriptTarget.Latest
    );

    // Contar las clases en el archivo y mostrar el resultado
    const classCount = countClasses(sourceFile);
    console.log(`Número de clases en ${filename}:`, classCount);

    // Imprimir la estructura sintáctica del archivo
    //printRecursiveFrom(sourceFile, 0, sourceFile);
});
