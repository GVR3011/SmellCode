import * as ts from "typescript";
import * as fs from "fs";

// Función para contar los métodos en un nodo TypeScript
function countMethods(node: ts.Node): number {
    let methodCount = 0;

    function visit(node: ts.Node) {
        if (ts.isMethodDeclaration(node)) {
            methodCount++;
        }
        ts.forEachChild(node, visit);
    }

    visit(node);

    return methodCount;
}

// Directorio del proyecto
const projectDirectory = "./ejemplos/architecture";

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

// Obtener la lista de archivos TypeScript del proyecto
const files = readProject(projectDirectory);

// Procesar cada archivo individualmente
files.forEach(filename => {
    const code = fs.readFileSync(filename, "utf-8");

    const sourceFile = ts.createSourceFile(
        filename, code, ts.ScriptTarget.Latest
    );

    // Contar los métodos en el archivo y mostrar el resultado
    const methodCount = countMethods(sourceFile);
    console.log(`Número de métodos en ${filename}:`, methodCount);
});
