"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var unzipper = require('unzipper');
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var mmo_replacer_1 = __importDefault(require("mmo-replacer"));
var mmo_command_line_1 = __importDefault(require("mmo-command-line"));
var EXTS = '.json,.md,.js,.ts'.split(',');
function commandLineArgs() {
    var args = mmo_command_line_1.default({
        destiny: mmo_command_line_1.default.STRING,
        template: mmo_command_line_1.default.STRING,
        proyect: mmo_command_line_1.default.STRING,
        t: 'template',
        d: 'destiny',
        p: 'proyect'
    });
    var source = args.template || args[0];
    if (!source) {
        console.log('FATAL: Falta la ruta de la plantilla.');
        process.exit(1);
    }
    source = path.resolve(source);
    delete args.template;
    var destiny = args.destiny || args[1];
    if (!destiny) {
        console.log('FATAL: No se ha indicado carpeta de destino.');
        process.exit(1);
    }
    destiny = path.resolve(destiny);
    delete args.destiny;
    var sandbox = {};
    for (var k in args) {
        if (isNaN(k) && k[0] !== '_')
            sandbox[k] = args[k];
    }
    if (sandbox.proyect) {
        destiny = path.join(destiny, sandbox.proyect);
    }
    else {
        sandbox.proyect = path.parse(destiny).name;
    }
    if (fs.existsSync(destiny)) {
        console.log("FATAL: Ya existe el destino " + destiny + ".");
        process.exit(0);
    }
    sandbox.workspace = sandbox.workspace || destiny;
    return {
        source: source,
        destiny: destiny,
        sandbox: sandbox
    };
}
exports.default = commandLineArgs;
function stretch(_a) {
    var source = _a.source, destiny = _a.destiny, sandbox = _a.sandbox;
    if (!path.parse(source).ext)
        source += '.zip';
    var sourceName = path.parse(source).name;
    var output;
    var dir;
    sandbox = sandbox || {};
    fs.createReadStream(source)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
        var file = entry.path, type = entry.type;
        if (type === 'File') {
            file = destiny + file.substr(sourceName.length);
            dir = path.parse(file).dir;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true
                });
            }
            output = fs.createWriteStream(file, 'utf8');
            if (EXTS.includes(path.parse(file).ext.toLowerCase())) {
                console.log(file);
                entry
                    .pipe(mmo_replacer_1.default.stream(sandbox))
                    .pipe(output);
            }
            else {
                entry.pipe(output);
            }
        }
    });
}
(function () {
    stretch(commandLineArgs());
}());
//# sourceMappingURL=index.js.map