const { error } = require('./src/constants');
const File = require('./src/file');
const { rejects, deepStrictEqual } = require('assert');

(async () => {
    {
        const filePath = '../mocks/emptyFile-invalid.csv';
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        rejects(result, rejection);
    }
    {
        const filePath = '../mocks/fourItems-invalid.csv';
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        rejects(result, rejection);
    }
    {
        const filePath = '../mocks/invalidHeader-invalid.csv';
        const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
        const result = File.csvToJson(filePath);
        rejects(result, rejection);
    }
    {
        const filePath = '../mocks/threeItems-valid.csv';
        const result = await File.csvToJson(filePath);
        const expected = [
            {
                "id": 123,
                "name": "Bruno Negreiros",
                "profession": "Desenvolvedor de Software",
                "age": 26
            },
            {
                "id": 456,
                "name": "Joao Pe de Feijao",
                "profession": "Cacador de Gigantes",
                "age": 20
            },
            {
                "id": 789,
                "name": "Peter Parker",
                "profession": "Entregador de Pizza",
                "age": 18
            }
        ];
        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
    }
})()