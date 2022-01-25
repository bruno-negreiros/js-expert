const { readFile } = require('fs/promises');
const { join } = require('path');
const { error } = require('./constants');
const User = require('./user');

const DEFAULT_OPTION = {
    maxLines: 3,
    fields: ["id","name","profession","age"]
};

class File {
    static async csvToJson(filePath) {
        const content = await this.getFileContent(filePath);
        const validation = this.isValid(content);
        if (!validation.valid) throw new Error(validation.error);

        const users = File.parseCSVToJson(content)
        return users;
    }

    static async getFileContent(filePath) {
        const filename = join(__dirname, filePath);
        return (await readFile(filename)).toString('utf-8');
    }

    static isValid(csvString, options = DEFAULT_OPTION) {
        const [ header, ...fileWithoutHeader ] = csvString.split('\n');
        const isHeaderValid = header.trim() === options.fields.join(',');
        if (!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            };
        }

        const isContentLengthAccepted = 
            fileWithoutHeader.length > 0
            && fileWithoutHeader.length <= DEFAULT_OPTION.maxLines;

        if (!isContentLengthAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true };
    }

    static parseCSVToJson(csvString) {
        const lines = csvString.split('\n');
        const firstLine = lines.shift();
        const header = firstLine.split(',');

        const users = lines.map(l => {
            const line = l.split(',');
            let user = {};
            for (const index in line) {
                user[header[index].trim()] = line[index].trim();
            }
            return new User(user);
        });

        return users
    }
};

module.exports = File;
