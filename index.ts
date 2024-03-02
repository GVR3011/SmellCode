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

// Función para contar las líneas de código en un nodo TypeScript
function countLinesOfCode(node: ts.Node): number {
    const sourceText = node.getSourceFile().getFullText();
    const lines = sourceText.split("\n");
    return lines.length;
}

// Directorio del proyecto
const projectDirectory = "./ejemplos/architecture";

// Array para almacenar la información de los archivos
const fileInfo: { filename: string, methodCount: number, linesOfCode: number }[] = [];

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

    // Contar los métodos en el archivo
    const methodCount = countMethods(sourceFile);

    // Contar las líneas de código en el archivo
    const linesOfCode = countLinesOfCode(sourceFile);

    // Almacenar la información del archivo en el array
    fileInfo.push({ filename, methodCount, linesOfCode });
});

// Generar el reporte HTML
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Reporte DetectiveSmell</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h2>Métodos y líneas </h2>
    <table>
        <tr>
            <th>Nombre archivo</th>
            <th>Métodos en cada archivo</th>
            <th>Líneas de cada archivo</th>
        </tr>
        ${fileInfo.map(info => `
            <tr>
                <td>${info.filename}</td>
                <td>${info.methodCount}</td>
                <td>${info.linesOfCode}</td>
            </tr>
        `).join('')}
    </table>
</body>
</html>
`;

// Escribir el contenido HTML en un archivo
fs.writeFileSync("report.html", htmlContent);

console.log("Reporte generado: report.html");
