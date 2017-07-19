import * as which from 'which';
import * as child_process from 'child_process';
import { TextDocument, Range, TextEdit, Position, window } from 'vscode';

export default class Formatter {
    command: string;
    options: Array<string> = ["-p"];
    process: Object;

    /**
     * Initiates Formatter instance
     */
    constructor(config: any) {
        this.command = which.sync(config.get('executable', ''));
        this.options = this.options.concat(["-m=" + config.get('masonVersion')]);
        this.options = this.options.concat(config.get('additionalArguments', []));
    }

    format(document: TextDocument, range?: Range): Promise<TextEdit[]> {
        if (range === null) {
            let start = new Position(0, 0);
            let end = new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            range = new Range(start, end);
        }
        let text = document.getText(range);

        if (!text || text.length === 0) {
            return;
        }

        return new Promise((resolve, reject) => {
            try {
                let spawn = child_process.spawn;
                let worker = spawn(this.command, this.options);

                worker.stdin.write(text);
                worker.stdin.end();

                let formattedText: string = '';
                worker.stdout.on('data', (chunk) => {
                    formattedText += chunk;
                });

                let errorText: string = '';
                worker.stderr.on('data', (chunk) => {
                    errorText += chunk;
                });

                worker.stdout.on('end', () => {
                    if (errorText) {
                        window.showErrorMessage(errorText);
                        return;
                    }
                    resolve([new TextEdit(range, formattedText)]);
                });
            }
            catch (error) {
                window.showErrorMessage(error);
                return;
            }
        });
    }
}

interface IFormatterConfig {
    executatble: string;
    profile?: string;
    additionalArguments?: Array<string>;
    get<T>(section: string, defaultValue?: T);
}
