'use strict';

var fs = require('fs-extra');
var LiveServer = require('@compodoc/live-server');
var _ = require('lodash');
var path = require('path');
var tsMorph = require('ts-morph');
var ts = require('typescript');
var i18next = require('i18next');
var semver = require('semver');
var htmlEntities = require('html-entities');
var JSON5 = require('json5');
var uuid = require('uuid');
var cosmiconfig = require('cosmiconfig');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var LiveServer__namespace = /*#__PURE__*/_interopNamespaceDefault(LiveServer);
var ___namespace = /*#__PURE__*/_interopNamespaceDefault(_);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var ts__namespace = /*#__PURE__*/_interopNamespaceDefault(ts);
var semver__namespace = /*#__PURE__*/_interopNamespaceDefault(semver);
var JSON5__namespace = /*#__PURE__*/_interopNamespaceDefault(JSON5);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var log = require('fancy-log');
var c = require('chalk');
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["INFO"] = 0] = "INFO";
    LEVEL[LEVEL["DEBUG"] = 1] = "DEBUG";
    LEVEL[LEVEL["ERROR"] = 2] = "ERROR";
    LEVEL[LEVEL["WARN"] = 3] = "WARN";
})(LEVEL || (LEVEL = {}));
var Logger = /** @class */ (function () {
    function Logger() {
        this.logger = log;
        this.silent = true;
    }
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.silent) {
            return;
        }
        this.logger(this.format.apply(this, __spreadArray([LEVEL.INFO], __read(args), false)));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logger(this.format.apply(this, __spreadArray([LEVEL.ERROR], __read(args), false)));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.silent) {
            return;
        }
        this.logger(this.format.apply(this, __spreadArray([LEVEL.WARN], __read(args), false)));
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.silent) {
            return;
        }
        this.logger(this.format.apply(this, __spreadArray([LEVEL.DEBUG], __read(args), false)));
    };
    Logger.prototype.format = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var pad = function (s, l, z) {
            if (z === void 0) { z = ''; }
            return s + Array(Math.max(0, l - s.length + 1)).join(z);
        };
        var msg = args.join(' ');
        if (args.length > 1) {
            msg = "".concat(pad(args.shift(), 15, ' '), ": ").concat(args.join(' '));
        }
        switch (level) {
            case LEVEL.INFO:
                msg = c.green(msg);
                break;
            case LEVEL.DEBUG:
                msg = c.cyan(msg);
                break;
            case LEVEL.WARN:
                msg = c.yellow(msg);
                break;
            case LEVEL.ERROR:
                msg = c.red(msg);
                break;
        }
        return [msg].join('');
    };
    return Logger;
}());
var logger = new Logger();

var COMPODOC_DEFAULTS = {
    title: 'Application documentation',
    additionalEntryName: 'Additional documentation',
    additionalEntryPath: 'additional-documentation',
    folder: './documentation/',
    hostname: '127.0.0.1',
    port: 8080,
    theme: 'gitbook',
    exportFormat: 'html',
    exportFormatsSupported: ['html', 'json', 'pdf'],
    base: '/',
    defaultCoverageThreshold: 70,
    defaultCoverageMinimumPerFile: 0,
    coverageTestThresholdFail: true,
    toggleMenuItems: ['all'],
    navTabConfig: [],
    disableSourceCode: false,
    disableDomTree: false,
    disableTemplateTab: false,
    disableStyleTab: false,
    disableGraph: false,
    disableMainGraph: false,
    disableCoverage: false,
    disablePrivate: false,
    disableProtected: false,
    disableInternal: false,
    disableLifeCycleHooks: false,
    disableRoutesGraph: false,
    disableDependencies: false,
    disableProperties: false,
    PAGE_TYPES: {
        ROOT: 'root',
        INTERNAL: 'internal'
    },
    gaSite: 'auto',
    coverageTestShowOnlyFailed: false,
    language: 'en-US',
    maxSearchResults: 15
};

var Configuration = /** @class */ (function () {
    function Configuration() {
        this._pages = [];
        this._mainData = {
            output: COMPODOC_DEFAULTS.folder,
            theme: COMPODOC_DEFAULTS.theme,
            extTheme: '',
            serve: false,
            hostname: COMPODOC_DEFAULTS.hostname,
            host: '',
            port: COMPODOC_DEFAULTS.port,
            open: false,
            assetsFolder: '',
            documentationMainName: COMPODOC_DEFAULTS.title,
            documentationMainDescription: '',
            base: COMPODOC_DEFAULTS.base,
            hideGenerator: false,
            hideDarkModeToggle: false,
            hasFilesToCoverage: false,
            modules: [],
            readme: false,
            changelog: '',
            contributing: '',
            license: '',
            todo: '',
            markdowns: [],
            additionalPages: [],
            pipes: [],
            classes: [],
            interfaces: [],
            components: [],
            controllers: [],
            entities: [],
            directives: [],
            injectables: [],
            interceptors: [],
            guards: [],
            miscellaneous: [],
            routes: [],
            tsconfig: '',
            toggleMenuItems: COMPODOC_DEFAULTS.toggleMenuItems,
            navTabConfig: [],
            templates: '',
            includes: '',
            includesName: COMPODOC_DEFAULTS.additionalEntryName,
            includesFolder: COMPODOC_DEFAULTS.additionalEntryPath,
            disableSourceCode: COMPODOC_DEFAULTS.disableSourceCode,
            disableDomTree: COMPODOC_DEFAULTS.disableDomTree,
            disableTemplateTab: COMPODOC_DEFAULTS.disableTemplateTab,
            disableStyleTab: COMPODOC_DEFAULTS.disableStyleTab,
            disableGraph: COMPODOC_DEFAULTS.disableGraph,
            disableMainGraph: COMPODOC_DEFAULTS.disableMainGraph,
            disableCoverage: COMPODOC_DEFAULTS.disableCoverage,
            disablePrivate: COMPODOC_DEFAULTS.disablePrivate,
            disableInternal: COMPODOC_DEFAULTS.disableInternal,
            disableProtected: COMPODOC_DEFAULTS.disableProtected,
            disableLifeCycleHooks: COMPODOC_DEFAULTS.disableLifeCycleHooks,
            disableRoutesGraph: COMPODOC_DEFAULTS.disableRoutesGraph,
            disableSearch: false,
            disableDependencies: COMPODOC_DEFAULTS.disableDependencies,
            disableProperties: COMPODOC_DEFAULTS.disableProperties,
            watch: false,
            mainGraph: '',
            coverageTest: false,
            coverageTestThreshold: COMPODOC_DEFAULTS.defaultCoverageThreshold,
            coverageTestThresholdFail: COMPODOC_DEFAULTS.coverageTestThresholdFail,
            coverageTestPerFile: false,
            coverageMinimumPerFile: COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile,
            unitTestCoverage: '',
            unitTestData: undefined,
            coverageTestShowOnlyFailed: COMPODOC_DEFAULTS.coverageTestShowOnlyFailed,
            routesLength: 0,
            angularVersion: '',
            exportFormat: COMPODOC_DEFAULTS.exportFormat,
            coverageData: {},
            customFavicon: '',
            customLogo: '',
            packageDependencies: [],
            packagePeerDependencies: [],
            packageProperties: {},
            gaID: '',
            gaSite: '',
            angularProject: false,
            angularJSProject: false,
            language: COMPODOC_DEFAULTS.language,
            maxSearchResults: 15
        };
    }
    Configuration.getInstance = function () {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    };
    Configuration.prototype.addPage = function (page) {
        var indexPage = ___namespace.findIndex(this._pages, { name: page.name });
        if (indexPage === -1) {
            this._pages.push(page);
        }
    };
    Configuration.prototype.hasPage = function (name) {
        var indexPage = ___namespace.findIndex(this._pages, { name: name });
        return indexPage !== -1;
    };
    Configuration.prototype.addAdditionalPage = function (page) {
        this._mainData.additionalPages.push(page);
    };
    Configuration.prototype.getAdditionalPageById = function (id) {
        return this._mainData.additionalPages.find(function (page) { return page.id === id; });
    };
    Configuration.prototype.resetPages = function () {
        this._pages = [];
    };
    Configuration.prototype.resetAdditionalPages = function () {
        this._mainData.additionalPages = [];
    };
    Configuration.prototype.resetRootMarkdownPages = function () {
        var indexPage = ___namespace.findIndex(this._pages, { name: 'index' });
        this._pages.splice(indexPage, 1);
        indexPage = ___namespace.findIndex(this._pages, { name: 'changelog' });
        this._pages.splice(indexPage, 1);
        indexPage = ___namespace.findIndex(this._pages, { name: 'contributing' });
        this._pages.splice(indexPage, 1);
        indexPage = ___namespace.findIndex(this._pages, { name: 'license' });
        this._pages.splice(indexPage, 1);
        indexPage = ___namespace.findIndex(this._pages, { name: 'todo' });
        this._pages.splice(indexPage, 1);
        this._mainData.markdowns = [];
    };
    Object.defineProperty(Configuration.prototype, "pages", {
        get: function () {
            return this._pages;
        },
        set: function (pages) {
            this._pages = [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "markDownPages", {
        get: function () {
            return this._pages.filter(function (page) { return page.markdown; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "mainData", {
        get: function () {
            return this._mainData;
        },
        set: function (data) {
            Object.assign(this._mainData, data);
        },
        enumerable: false,
        configurable: true
    });
    return Configuration;
}());
var Configuration$1 = Configuration.getInstance();

var AngularAPIs = require('../src/data/api-list.json');
var AngularApiUtil = /** @class */ (function () {
    function AngularApiUtil() {
    }
    AngularApiUtil.getInstance = function () {
        if (!AngularApiUtil.instance) {
            AngularApiUtil.instance = new AngularApiUtil();
        }
        return AngularApiUtil.instance;
    };
    AngularApiUtil.prototype.findApi = function (type) {
        var foundedApi;
        ___namespace.forEach(AngularAPIs, function (mainApi) {
            ___namespace.forEach(mainApi.items, function (api) {
                if (api.title === type) {
                    foundedApi = api;
                }
            });
        });
        return {
            source: 'external',
            data: foundedApi
        };
    };
    return AngularApiUtil;
}());
var AngularApiUtil$1 = AngularApiUtil.getInstance();

function extractLeadingText(string, completeTag) {
    var tagIndex = string.indexOf(completeTag);
    var leadingText = undefined;
    var leadingTextRegExp = /\[(.+?)\]/g;
    var leadingTextInfo = leadingTextRegExp.exec(string);
    // did we find leading text, and if so, does it immediately precede the tag?
    while (leadingTextInfo && leadingTextInfo.length) {
        if (leadingTextInfo.index + leadingTextInfo[0].length === tagIndex) {
            string = string.replace(leadingTextInfo[0], '');
            leadingText = leadingTextInfo[1];
            break;
        }
        leadingTextInfo = leadingTextRegExp.exec(string);
    }
    return {
        leadingText: leadingText,
        string: string
    };
}
function splitLinkText(text) {
    var linkText;
    var target;
    var splitIndex;
    // if a pipe is not present, we split on the first space
    splitIndex = text.indexOf('|');
    if (splitIndex === -1) {
        splitIndex = text.search(/\s/);
    }
    if (splitIndex !== -1) {
        linkText = text.substr(splitIndex + 1);
        // Normalize subsequent newlines to a single space.
        linkText = linkText.replace(/\n+/, ' ');
        target = text.substr(0, splitIndex);
    }
    return {
        linkText: linkText,
        target: target || text
    };
}
var LinkParser = (function () {
    var processTheLink = function (string, tagInfo, leadingText) {
        var leading = extractLeadingText(string, tagInfo.completeTag), linkText, split, target, stringtoReplace;
        linkText = leadingText ? leadingText : leading.leadingText || '';
        split = splitLinkText(tagInfo.text);
        target = split.target;
        if (leading.leadingText !== undefined) {
            stringtoReplace = '[' + leading.leadingText + ']' + tagInfo.completeTag;
        }
        else if (typeof split.linkText !== 'undefined') {
            stringtoReplace = tagInfo.completeTag;
            linkText = split.linkText;
        }
        if (linkText === '' || linkText == null || target == null) {
            return string;
        }
        return string.replace(stringtoReplace, '[' + linkText + '](' + target + ')');
    };
    /**
     * Convert
     * {@link http://www.google.com|Google} or {@link https://github.com GitHub} or [Github]{@link https://github.com} to [Github](https://github.com)
     */
    var replaceLinkTag = function (str) {
        if (typeof str === 'undefined') {
            return {
                newString: ''
            };
        }
        // new RegExp('\\[((?:.|\n)+?)]\\{@link\\s+((?:.|\n)+?)\\}', 'i').exec('ee [TO DO]{@link Todo} fo') -> "[TO DO]{@link Todo}", "TO DO", "Todo"
        // new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i').exec('ee [TODO]{@link Todo} fo') -> "{@link Todo}", "Todo"
        var tagRegExpLight = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i'), tagRegExpFull = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i'), tagRegExp, matches, previousString;
        tagRegExp = str.indexOf(']{') !== -1 ? tagRegExpFull : tagRegExpLight;
        function replaceMatch(replacer, tag, match, text, linkText) {
            var matchedTag = {
                completeTag: match,
                tag: tag,
                text: text
            };
            if (linkText) {
                return replacer(str, matchedTag, linkText);
            }
            else {
                return replacer(str, matchedTag);
            }
        }
        do {
            matches = tagRegExp.exec(str);
            if (matches) {
                previousString = str;
                if (matches.length === 2) {
                    str = replaceMatch(processTheLink, 'link', matches[0], matches[1]);
                }
                if (matches.length === 3) {
                    str = replaceMatch(processTheLink, 'link', matches[0], matches[2], matches[1]);
                }
            }
        } while (matches && previousString !== str);
        return {
            newString: str
        };
    };
    var _resolveLinks = function (str) {
        return replaceLinkTag(str).newString;
    };
    return {
        resolveLinks: _resolveLinks
    };
})();

var AngularLifecycleHooks;
(function (AngularLifecycleHooks) {
    AngularLifecycleHooks[AngularLifecycleHooks["ngOnChanges"] = 0] = "ngOnChanges";
    AngularLifecycleHooks[AngularLifecycleHooks["ngOnInit"] = 1] = "ngOnInit";
    AngularLifecycleHooks[AngularLifecycleHooks["ngDoCheck"] = 2] = "ngDoCheck";
    AngularLifecycleHooks[AngularLifecycleHooks["ngAfterContentInit"] = 3] = "ngAfterContentInit";
    AngularLifecycleHooks[AngularLifecycleHooks["ngAfterContentChecked"] = 4] = "ngAfterContentChecked";
    AngularLifecycleHooks[AngularLifecycleHooks["ngAfterViewInit"] = 5] = "ngAfterViewInit";
    AngularLifecycleHooks[AngularLifecycleHooks["ngAfterViewChecked"] = 6] = "ngAfterViewChecked";
    AngularLifecycleHooks[AngularLifecycleHooks["ngOnDestroy"] = 7] = "ngOnDestroy";
})(AngularLifecycleHooks || (AngularLifecycleHooks = {}));

var KindType;
(function (KindType) {
    KindType["UNKNOWN"] = "";
    KindType["STRING"] = "string";
    KindType["NUMBER"] = "number";
    KindType["ARRAY"] = "[]";
    KindType["VOID"] = "void";
    KindType["FUNCTION"] = "function";
    KindType["TEMPLATE_LITERAL"] = "template literal type";
    KindType["LITERAL"] = "literal type";
    KindType["BOOLEAN"] = "boolean";
    KindType["ANY"] = "any";
    KindType["NULL"] = "null";
    KindType["SYMBOL"] = "symbol";
    KindType["NEVER"] = "never";
    KindType["UNDEFINED"] = "undefined";
    KindType["OBJECT"] = "object";
})(KindType || (KindType = {}));
var IsKindType = {
    ANY: function (kind) {
        return kindToType(kind) === KindType.ANY;
    },
    ARRAY: function (kind) {
        return kindToType(kind) === KindType.ARRAY;
    },
    BOOLEAN: function (kind) {
        return kindToType(kind) === KindType.BOOLEAN;
    },
    FUNCTION: function (kind) {
        return kindToType(kind) === KindType.FUNCTION;
    },
    LITERAL: function (kind) {
        return kindToType(kind) === KindType.LITERAL;
    },
    NEVER: function (kind) {
        return kindToType(kind) === KindType.NEVER;
    },
    NULL: function (kind) {
        return kindToType(kind) === KindType.NULL;
    },
    NUMBER: function (kind) {
        return kindToType(kind) === KindType.NUMBER;
    },
    OBJECT: function (kind) {
        return kindToType(kind) === KindType.OBJECT;
    },
    STRING: function (kind) {
        return kindToType(kind) === KindType.STRING;
    },
    SYMBOL: function (kind) {
        return kindToType(kind) === KindType.SYMBOL;
    },
    TEMPLATE_LITERAL: function (kind) {
        return kindToType(kind) === KindType.TEMPLATE_LITERAL;
    },
    UNDEFINED: function (kind) {
        return kindToType(kind) === KindType.UNDEFINED;
    },
    UNKNOWN: function (kind) {
        return kindToType(kind) === KindType.UNKNOWN;
    },
    VOID: function (kind) {
        return kindToType(kind) === KindType.VOID;
    }
};
function kindToType(kind) {
    var _type = KindType.UNKNOWN;
    switch (kind) {
        case tsMorph.SyntaxKind.StringKeyword:
        case tsMorph.SyntaxKind.StringLiteral:
            _type = KindType.STRING;
            break;
        case tsMorph.SyntaxKind.NumberKeyword:
        case tsMorph.SyntaxKind.NumericLiteral:
            _type = KindType.NUMBER;
            break;
        case tsMorph.SyntaxKind.ArrayType:
        case tsMorph.SyntaxKind.ArrayLiteralExpression:
            _type = KindType.ARRAY;
            break;
        case tsMorph.SyntaxKind.VoidKeyword:
            _type = KindType.VOID;
            break;
        case tsMorph.SyntaxKind.FunctionType:
            _type = KindType.FUNCTION;
            break;
        case tsMorph.SyntaxKind.TemplateLiteralType:
            _type = KindType.TEMPLATE_LITERAL;
            break;
        case tsMorph.SyntaxKind.TypeLiteral:
            _type = KindType.LITERAL;
            break;
        case tsMorph.SyntaxKind.BooleanKeyword:
            _type = KindType.BOOLEAN;
            break;
        case tsMorph.SyntaxKind.AnyKeyword:
            _type = KindType.ANY;
            break;
        case tsMorph.SyntaxKind.NullKeyword:
            _type = KindType.NULL;
            break;
        case tsMorph.SyntaxKind.SymbolKeyword:
            _type = KindType.SYMBOL;
            break;
        case tsMorph.SyntaxKind.NeverKeyword:
            _type = KindType.NEVER;
            break;
        case tsMorph.SyntaxKind.UndefinedKeyword:
            _type = KindType.UNDEFINED;
            break;
        case tsMorph.SyntaxKind.ObjectKeyword:
        case tsMorph.SyntaxKind.ObjectLiteralExpression:
            _type = KindType.OBJECT;
            break;
    }
    return _type;
}

var tsany = ts__namespace;
// https://github.com/Microsoft/TypeScript/blob/v2.1.4/src/compiler/utilities.ts#L1423
function getJSDocCommentRanges(node, text) {
    return tsany.getJSDocCommentRanges.apply(this, arguments);
}

var JsdocParserUtil = /** @class */ (function () {
    function JsdocParserUtil() {
    }
    JsdocParserUtil.prototype.isVariableLike = function (node) {
        if (node) {
            switch (node.kind) {
                case tsMorph.SyntaxKind.BindingElement:
                case tsMorph.SyntaxKind.EnumMember:
                case tsMorph.SyntaxKind.Parameter:
                case tsMorph.SyntaxKind.PropertyAssignment:
                case tsMorph.SyntaxKind.PropertyDeclaration:
                case tsMorph.SyntaxKind.PropertySignature:
                case tsMorph.SyntaxKind.ShorthandPropertyAssignment:
                case tsMorph.SyntaxKind.VariableDeclaration:
                    return true;
            }
        }
        return false;
    };
    JsdocParserUtil.prototype.isTopmostModuleDeclaration = function (node) {
        if (node.nextContainer && node.nextContainer.kind === tsMorph.ts.SyntaxKind.ModuleDeclaration) {
            var next = node.nextContainer;
            if (node.name.end + 1 === next.name.pos) {
                return false;
            }
        }
        return true;
    };
    JsdocParserUtil.prototype.getRootModuleDeclaration = function (node) {
        while (node.parent && node.parent.kind === tsMorph.ts.SyntaxKind.ModuleDeclaration) {
            var parent = node.parent;
            if (node.name.pos === parent.name.end + 1) {
                node = parent;
            }
            else {
                break;
            }
        }
        return node;
    };
    JsdocParserUtil.prototype.getMainCommentOfNode = function (node, sourceFile) {
        var description = '';
        if (node.parent && node.parent.kind === tsMorph.ts.SyntaxKind.VariableDeclarationList) {
            node = node.parent.parent;
        }
        else if (node.kind === tsMorph.ts.SyntaxKind.ModuleDeclaration) {
            if (!this.isTopmostModuleDeclaration(node)) {
                return null;
            }
            else {
                node = this.getRootModuleDeclaration(node);
            }
        }
        var comments = getJSDocCommentRanges(node, sourceFile.text);
        if (comments && comments.length) {
            var comment = void 0;
            if (node.kind === tsMorph.ts.SyntaxKind.SourceFile) {
                if (comments.length === 1) {
                    return null;
                }
                comment = comments[0];
            }
            else {
                comment = comments[comments.length - 1];
            }
            description = sourceFile.text.substring(comment.pos, comment.end);
        }
        return description;
    };
    JsdocParserUtil.prototype.parseComment = function (text) {
        var comment = '';
        var shortText = 0;
        function readBareLine(line) {
            comment += '\n' + line;
            if (line === '' && shortText === 0) ;
            else if (line === '' && shortText === 1) {
                shortText = 2;
            }
            else {
                if (shortText === 2) {
                    comment += (comment === '' ? '' : '\n') + line;
                }
            }
        }
        var CODE_FENCE = /^\s*```(?!.*```)/;
        var inCode = false;
        var inExample = false; // first line with @example, end line with empty string or string or */
        function readLine(line, index) {
            line = line.replace(/^\s*\*? ?/, '');
            line = line.replace(/\s*$/, '');
            if (CODE_FENCE.test(line)) {
                inCode = !inCode;
            }
            if (line.indexOf('@example') !== -1) {
                inExample = true;
                line = '```html';
            }
            if (inExample && line === '') {
                inExample = false;
                line = '```';
            }
            if (!inCode) {
                var tag = /^@(\S+)/.exec(line);
                var SeeTag = /^@see/.exec(line);
                if (SeeTag) {
                    line = line.replace(/^@see/, 'See');
                }
                if (tag && !SeeTag) {
                    return;
                }
            }
            readBareLine(line);
        }
        text = text.replace(/^\s*\/\*+/, '');
        text = text.replace(/\*+\/\s*$/, '');
        text.split(/\r\n?|\n/).length;
        text.split(/\r\n?|\n/).forEach(readLine);
        return comment;
    };
    JsdocParserUtil.prototype.getJSDocTags = function (node, kind) {
        var e_1, _a;
        var docs = this.getJSDocs(node);
        if (docs) {
            var result = [];
            try {
                for (var docs_1 = __values(docs), docs_1_1 = docs_1.next(); !docs_1_1.done; docs_1_1 = docs_1.next()) {
                    var doc = docs_1_1.value;
                    if (tsMorph.ts.isJSDocParameterTag(doc)) {
                        if (doc.kind === kind) {
                            result.push(doc);
                        }
                    }
                    else if (tsMorph.ts.isJSDoc(doc)) {
                        result.push.apply(result, __spreadArray([], __read(___namespace.filter(doc.tags, function (tag) { return tag.kind === kind; })), false));
                    }
                    else {
                        throw new Error('Unexpected type');
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (docs_1_1 && !docs_1_1.done && (_a = docs_1.return)) _a.call(docs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        }
    };
    JsdocParserUtil.prototype.getJSDocs = function (node) {
        // TODO: jsDocCache is internal, see if there's a way around it
        var cache = node.jsDocCache;
        if (!cache) {
            cache = this.getJSDocsWorker(node, []).filter(function (x) { return x; });
            node.jsDocCache = cache;
        }
        return cache;
    };
    // Try to recognize this pattern when node is initializer
    // of variable declaration and JSDoc comments are on containing variable statement.
    // /**
    //   * @param {number} name
    //   * @returns {number}
    //   */
    // var x = function(name) { return name.length; }
    JsdocParserUtil.prototype.getJSDocsWorker = function (node, cache) {
        var parent = node.parent;
        var isInitializerOfVariableDeclarationInStatement = this.isVariableLike(parent) &&
            parent.initializer === node &&
            tsMorph.ts.isVariableStatement(parent.parent.parent);
        var isVariableOfVariableDeclarationStatement = this.isVariableLike(node) && tsMorph.ts.isVariableStatement(parent.parent);
        var variableStatementNode = isInitializerOfVariableDeclarationInStatement
            ? parent.parent.parent
            : isVariableOfVariableDeclarationStatement
                ? parent.parent
                : undefined;
        if (variableStatementNode) {
            cache = this.getJSDocsWorker(variableStatementNode, cache);
        }
        // Also recognize when the node is the RHS of an assignment expression
        var isSourceOfAssignmentExpressionStatement = parent &&
            parent.parent &&
            tsMorph.ts.isBinaryExpression(parent) &&
            parent.operatorToken.kind === tsMorph.SyntaxKind.EqualsToken &&
            tsMorph.ts.isExpressionStatement(parent.parent);
        if (isSourceOfAssignmentExpressionStatement) {
            cache = this.getJSDocsWorker(parent.parent, cache);
        }
        var isModuleDeclaration = tsMorph.ts.isModuleDeclaration(node) && parent && tsMorph.ts.isModuleDeclaration(parent);
        var isPropertyAssignmentExpression = parent && tsMorph.ts.isPropertyAssignment(parent);
        if (isModuleDeclaration || isPropertyAssignmentExpression) {
            cache = this.getJSDocsWorker(parent, cache);
        }
        // Pull parameter comments from declaring function as well
        if (tsMorph.ts.isParameter(node)) {
            cache = ___namespace.concat(cache, this.getJSDocParameterTags(node));
        }
        if (this.isVariableLike(node) && node.initializer) {
            cache = ___namespace.concat(cache, node.initializer.jsDoc);
        }
        cache = ___namespace.concat(cache, node.jsDoc);
        return cache;
    };
    JsdocParserUtil.prototype.getJSDocParameterTags = function (param) {
        var func = param.parent;
        var tags = this.getJSDocTags(func, tsMorph.SyntaxKind.JSDocParameterTag);
        if (!param.name) {
            // this is an anonymous jsdoc param from a `function(type1, type2): type3` specification
            var i = func.parameters.indexOf(param);
            var paramTags = ___namespace.filter(tags, function (tag) { return tsMorph.ts.isJSDocParameterTag(tag); });
            if (paramTags && 0 <= i && i < paramTags.length) {
                return [paramTags[i]];
            }
        }
        else if (tsMorph.ts.isIdentifier(param.name)) {
            var name_1 = param.name.text;
            return ___namespace.filter(tags, function (tag) {
                if (tsMorph.ts && tsMorph.ts.isJSDocParameterTag(tag)) {
                    var t = tag;
                    if (typeof t.parameterName !== 'undefined') {
                        return t.parameterName.text === name_1;
                    }
                    else if (typeof t.name !== 'undefined') {
                        if (typeof t.name.escapedText !== 'undefined') {
                            return t.name.escapedText === name_1;
                        }
                    }
                }
            });
        }
        else {
            // TODO: it's a destructured parameter, so it should look up an "object type" series of multiple lines
            // But multi-line object types aren't supported yet either
            return undefined;
        }
    };
    JsdocParserUtil.prototype.parseJSDocNode = function (node) {
        var rawDescription = '';
        if (typeof node.comment === 'string') {
            rawDescription += node.comment;
        }
        else {
            if (node.comment) {
                var len = node.comment.length;
                for (var i = 0; i < len; i++) {
                    var JSDocNode = node.comment[i];
                    switch (JSDocNode.kind) {
                        case tsMorph.SyntaxKind.JSDocComment:
                            rawDescription += JSDocNode.comment;
                            break;
                        case tsMorph.SyntaxKind.JSDocText:
                            rawDescription += JSDocNode.text;
                            break;
                        case tsMorph.SyntaxKind.JSDocLink:
                            if (JSDocNode.name) {
                                var text = JSDocNode.name.escapedText;
                                if (text === undefined &&
                                    JSDocNode.name.left &&
                                    JSDocNode.name.right) {
                                    text =
                                        JSDocNode.name.left.escapedText +
                                            '.' +
                                            JSDocNode.name.right.escapedText;
                                }
                                rawDescription += JSDocNode.text + '{@link ' + text + '}';
                            }
                            break;
                    }
                }
            }
        }
        return rawDescription;
    };
    return JsdocParserUtil;
}());

var marked = require('marked').marked;
marked.use({
    mangle: false,
    headerIds: false
});
var markedAcl = marked;

var getCurrentDirectory = tsMorph.ts.sys.getCurrentDirectory;
var useCaseSensitiveFileNames = tsMorph.ts.sys.useCaseSensitiveFileNames;
var newLine = tsMorph.ts.sys.newLine;
function getNewLine() {
    return newLine;
}
function cleanNameWithoutSpaceAndToLowerCase(name) {
    return name.toLowerCase().replace(/ /g, '-');
}
function getCanonicalFileName(fileName) {
    return useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
}
var formatDiagnosticsHost = {
    getCurrentDirectory: getCurrentDirectory,
    getCanonicalFileName: getCanonicalFileName,
    getNewLine: getNewLine
};
function markedtags(tags) {
    var jsdocParserUtil = new JsdocParserUtil();
    var mtags = tags;
    ___namespace.forEach(mtags, function (tag) {
        var rawComment = jsdocParserUtil.parseJSDocNode(tag);
        tag.comment = markedAcl(LinkParser.resolveLinks(rawComment));
    });
    return mtags;
}
function mergeTagsAndArgs(args, jsdoctags) {
    var margs = ___namespace.cloneDeep(args);
    ___namespace.forEach(margs, function (arg) {
        arg.tagName = {
            text: 'param'
        };
        if (jsdoctags) {
            ___namespace.forEach(jsdoctags, function (jsdoctag) {
                if (jsdoctag.name && jsdoctag.name.text === arg.name) {
                    arg.tagName = jsdoctag.tagName;
                    arg.name = jsdoctag.name;
                    arg.comment = jsdoctag.comment;
                    arg.typeExpression = jsdoctag.typeExpression;
                }
            });
        }
    });
    // Add example & returns & private
    if (jsdoctags) {
        ___namespace.forEach(jsdoctags, function (jsdoctag) {
            if (jsdoctag.tagName &&
                (jsdoctag.tagName.text === 'example' || jsdoctag.tagName.text === 'private')) {
                margs.push({
                    tagName: jsdoctag.tagName,
                    comment: jsdoctag.comment
                });
            }
            if (jsdoctag.tagName &&
                (jsdoctag.tagName.text === 'returns' || jsdoctag.tagName.text === 'return')) {
                var ret = {
                    tagName: jsdoctag.tagName,
                    comment: jsdoctag.comment
                };
                if (jsdoctag.typeExpression && jsdoctag.typeExpression.type) {
                    ret.returnType = kindToType(jsdoctag.typeExpression.type.kind);
                }
                margs.push(ret);
            }
        });
    }
    return margs;
}
function readConfig(configFile) {
    var result = tsMorph.ts.readConfigFile(configFile, tsMorph.ts.sys.readFile);
    if (result.error) {
        var message = tsMorph.ts.formatDiagnostics([result.error], formatDiagnosticsHost);
        throw new Error(message);
    }
    return result.config;
}
function stripBom(source) {
    if (source.charCodeAt(0) === 0xfeff) {
        return source.slice(1);
    }
    return source;
}
function hasBom(source) {
    return source.charCodeAt(0) === 0xfeff;
}
function cleanLifecycleHooksFromMethods(methods) {
    var result = [];
    if (typeof methods !== 'undefined') {
        var i = 0;
        var len = methods.length;
        for (i; i < len; i++) {
            if (!(methods[i].name in AngularLifecycleHooks)) {
                result.push(methods[i]);
            }
        }
    }
    return result;
}
function cleanSourcesForWatch(list) {
    return list.filter(function (element) {
        if (fs__namespace.existsSync(process.cwd() + path__namespace.sep + element)) {
            return element;
        }
    });
}
function getNamesCompareFn(name) {
    /**
     * Copyright https://github.com/ng-bootstrap/ng-bootstrap
     */
    name = name || 'name';
    var t = function (a, b) {
        if (a[name]) {
            return a[name].localeCompare(b[name]);
        }
        else {
            return 0;
        }
    };
    return t;
}
function isIgnore(member) {
    var e_1, _a, e_2, _b;
    if (member.jsDoc) {
        try {
            for (var _c = __values(member.jsDoc), _d = _c.next(); !_d.done; _d = _c.next()) {
                var doc = _d.value;
                if (doc.tags) {
                    try {
                        for (var _e = (e_2 = void 0, __values(doc.tags)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var tag = _f.value;
                            if (tag.tagName.text.indexOf('ignore') > -1) {
                                return true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return false;
}
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return (x === y ||
                    (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
function findMainSourceFolder(files) {
    var mainFolder = '';
    var mainFolderCount = 0;
    var rawFolders = files.map(function (filepath) {
        var shortPath = filepath.replace(process.cwd() + path__namespace.sep, '');
        return path__namespace.dirname(shortPath);
    });
    var folders = {};
    rawFolders = ___namespace.uniq(rawFolders);
    for (var i = 0; i < rawFolders.length; i++) {
        var sep = rawFolders[i].split(path__namespace.sep);
        sep.forEach(function (folder) {
            if (folders[folder]) {
                folders[folder] += 1;
            }
            else {
                folders[folder] = 1;
            }
        });
    }
    for (var f in folders) {
        if (folders[f] > mainFolderCount) {
            mainFolderCount = folders[f];
            mainFolder = f;
        }
    }
    return mainFolder;
}
// Create a compilerHost object to allow the compiler to read and write files
function compilerHost(transpileOptions) {
    var inputFileName = transpileOptions.fileName || (transpileOptions.jsx ? 'module.tsx' : 'module.ts');
    var toReturn = {
        getSourceFile: function (fileName) {
            if (fileName.lastIndexOf('.ts') !== -1 || fileName.lastIndexOf('.js') !== -1) {
                if (fileName === 'lib.d.ts') {
                    return undefined;
                }
                if (fileName.substr(-5) === '.d.ts') {
                    return undefined;
                }
                if (path__namespace.isAbsolute(fileName) === false) {
                    fileName = path__namespace.join(transpileOptions.tsconfigDirectory, fileName);
                }
                if (!fs__namespace.existsSync(fileName)) {
                    return undefined;
                }
                var libSource = '';
                try {
                    libSource = fs__namespace.readFileSync(fileName).toString();
                    if (hasBom(libSource)) {
                        libSource = stripBom(libSource);
                    }
                }
                catch (e) {
                    logger.debug(e, fileName);
                }
                return tsMorph.ts.createSourceFile(fileName, libSource, transpileOptions.target, false);
            }
            return undefined;
        },
        writeFile: function (name, text) { },
        getDefaultLibFileName: function () { return 'lib.d.ts'; },
        useCaseSensitiveFileNames: function () { return false; },
        getCanonicalFileName: function (fileName) { return fileName; },
        getCurrentDirectory: function () { return ''; },
        getNewLine: function () { return '\n'; },
        fileExists: function (fileName) { return fileName === inputFileName; },
        readFile: function () { return ''; },
        directoryExists: function () { return true; },
        getDirectories: function () { return []; }
    };
    return toReturn;
}
function detectIndent(str, count) {
    var stripIndent = function (stripedString) {
        var match = stripedString.match(/^[ \t]*(?=\S)/gm);
        if (!match) {
            return stripedString;
        }
        // TODO: use spread operator when targeting Node.js 6
        var indent = Math.min.apply(Math, match.map(function (x) { return x.length; })); // eslint-disable-line
        var re = new RegExp("^[ \\t]{".concat(indent, "}"), 'gm');
        return indent > 0 ? stripedString.replace(re, '') : stripedString;
    };
    var repeating = function (n, repeatString) {
        repeatString = repeatString === undefined ? ' ' : repeatString;
        if (typeof repeatString !== 'string') {
            throw new TypeError("Expected `input` to be a `string`, got `".concat(typeof repeatString, "`"));
        }
        if (n < 0) {
            throw new TypeError("Expected `count` to be a positive finite number, got `".concat(n, "`"));
        }
        var ret = '';
        do {
            if (n & 1) {
                ret += repeatString;
            }
            repeatString += repeatString;
        } while ((n >>= 1));
        return ret;
    };
    var indentString = function (indentedString, indentCount) {
        var indent = ' ';
        indentCount = indentCount === undefined ? 1 : indentCount;
        if (typeof indentedString !== 'string') {
            throw new TypeError("Expected `input` to be a `string`, got `".concat(typeof indentedString, "`"));
        }
        if (typeof indentCount !== 'number') {
            throw new TypeError("Expected `count` to be a `number`, got `".concat(typeof indentCount, "`"));
        }
        if (typeof indent !== 'string') {
            throw new TypeError("Expected `indent` to be a `string`, got `".concat(typeof indent, "`"));
        }
        if (indentCount === 0) {
            return indentedString;
        }
        indent = indentCount > 1 ? repeating(indentCount, indent) : indent;
        return indentedString.replace(/^(?!\s*$)/gm, indent);
    };
    return indentString(stripIndent(str), count || 0);
}
var INCLUDE_PATTERNS = ['**/*.ts', '**/*.tsx'];
var EXCLUDE_PATTERNS = ['**/.git', '**/node_modules', '**/*.d.ts', '**/*.spec.ts'];

var traverse$3 = require('traverse');
var DependenciesEngine = /** @class */ (function () {
    function DependenciesEngine() {
        this.miscellaneous = {
            variables: [],
            functions: [],
            typealiases: [],
            enumerations: [],
            groupedVariables: [],
            groupedFunctions: [],
            groupedEnumerations: [],
            groupedTypeAliases: []
        };
    }
    DependenciesEngine.getInstance = function () {
        if (!DependenciesEngine.instance) {
            DependenciesEngine.instance = new DependenciesEngine();
        }
        return DependenciesEngine.instance;
    };
    DependenciesEngine.prototype.updateModulesDeclarationsExportsTypes = function () {
        var _this = this;
        var mergeTypes = function (entry) {
            var directive = _this.findInCompodocDependencies(entry.name, _this.directives, entry.file);
            if (typeof directive.data !== 'undefined') {
                entry.type = 'directive';
                entry.id = directive.data.id;
            }
            var component = _this.findInCompodocDependencies(entry.name, _this.components, entry.file);
            if (typeof component.data !== 'undefined') {
                entry.type = 'component';
                entry.id = component.data.id;
            }
            var pipe = _this.findInCompodocDependencies(entry.name, _this.pipes, entry.file);
            if (typeof pipe.data !== 'undefined') {
                entry.type = 'pipe';
                entry.id = pipe.data.id;
            }
        };
        this.modules.forEach(function (module) {
            module.declarations.forEach(function (declaration) {
                mergeTypes(declaration);
            });
            module.exports.forEach(function (expt) {
                mergeTypes(expt);
            });
            module.entryComponents.forEach(function (ent) {
                mergeTypes(ent);
            });
        });
    };
    DependenciesEngine.prototype.init = function (data) {
        traverse$3(data).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
            }
        });
        this.rawData = data;
        this.modules = ___namespace.sortBy(this.rawData.modules, [function (el) { return el.name.toLowerCase(); }]);
        this.rawModulesForOverview = ___namespace.sortBy(data.modulesForGraph, [function (el) { return el.name.toLowerCase(); }]);
        this.rawModules = ___namespace.sortBy(data.modulesForGraph, [function (el) { return el.name.toLowerCase(); }]);
        this.components = ___namespace.sortBy(this.rawData.components, [function (el) { return el.name.toLowerCase(); }]);
        this.controllers = ___namespace.sortBy(this.rawData.controllers, [function (el) { return el.name.toLowerCase(); }]);
        this.entities = ___namespace.sortBy(this.rawData.entities, [function (el) { return el.name.toLowerCase(); }]);
        this.directives = ___namespace.sortBy(this.rawData.directives, [function (el) { return el.name.toLowerCase(); }]);
        this.injectables = ___namespace.sortBy(this.rawData.injectables, [function (el) { return el.name.toLowerCase(); }]);
        this.interceptors = ___namespace.sortBy(this.rawData.interceptors, [function (el) { return el.name.toLowerCase(); }]);
        this.guards = ___namespace.sortBy(this.rawData.guards, [function (el) { return el.name.toLowerCase(); }]);
        this.interfaces = ___namespace.sortBy(this.rawData.interfaces, [function (el) { return el.name.toLowerCase(); }]);
        this.pipes = ___namespace.sortBy(this.rawData.pipes, [function (el) { return el.name.toLowerCase(); }]);
        this.classes = ___namespace.sortBy(this.rawData.classes, [function (el) { return el.name.toLowerCase(); }]);
        this.miscellaneous = this.rawData.miscellaneous;
        this.prepareMiscellaneous();
        this.updateModulesDeclarationsExportsTypes();
        this.routes = this.rawData.routesTree;
        this.manageDuplicatesName();
        this.cleanRawModulesNames();
    };
    DependenciesEngine.prototype.cleanRawModulesNames = function () {
        this.rawModulesForOverview = this.rawModulesForOverview.map(function (module) {
            module.name = module.name.replace('$', '');
            return module;
        });
    };
    DependenciesEngine.prototype.findInCompodocDependencies = function (name, data, file) {
        var _result = {
            source: 'internal',
            data: undefined,
            score: 0
        };
        var nameFoundCounter = 0;
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (typeof name !== 'undefined') {
                    if (typeof file !== 'undefined') {
                        if (name === data[i].name &&
                            file.replace(/\\/g, '/').indexOf(data[i].file) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 2;
                        }
                        else if (name.indexOf(data[i].name) !== -1 &&
                            file.replace(/\\/g, '/').indexOf(data[i].file) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 1;
                        }
                    }
                    else {
                        if (name === data[i].name) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 2;
                        }
                        else if (name.indexOf(data[i].name) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 1;
                        }
                    }
                }
            }
            // Prevent wrong matching like MultiSelectOptionDirective with SelectOptionDirective, or QueryParamGroupService with QueryParamGroup
            if (nameFoundCounter > 1) {
                var found = false;
                for (var i = 0; i < data.length; i++) {
                    if (typeof name !== 'undefined') {
                        if (typeof file !== 'undefined') {
                            if (name === data[i].name) {
                                found = true;
                                _result.data = data[i];
                                _result.score = 2;
                            }
                        }
                        else {
                            if (name === data[i].name) {
                                found = true;
                                _result.data = data[i];
                                _result.score = 2;
                            }
                        }
                    }
                }
                if (!found) {
                    _result = {
                        source: 'internal',
                        data: undefined,
                        score: 0
                    };
                }
            }
        }
        return _result;
    };
    DependenciesEngine.prototype.manageDuplicatesName = function () {
        var processDuplicates = function (element, index, array) {
            var elementsWithSameName = ___namespace.filter(array, { name: element.name });
            if (elementsWithSameName.length > 1) {
                // First element is the reference for duplicates
                for (var i = 1; i < elementsWithSameName.length; i++) {
                    var elementToEdit = elementsWithSameName[i];
                    if (typeof elementToEdit.isDuplicate === 'undefined') {
                        elementToEdit.isDuplicate = true;
                        elementToEdit.duplicateId = i;
                        elementToEdit.duplicateName =
                            elementToEdit.name + '-' + elementToEdit.duplicateId;
                        elementToEdit.id = elementToEdit.id + '-' + elementToEdit.duplicateId;
                    }
                }
            }
            return element;
        };
        this.classes = this.classes.map(processDuplicates);
        this.interfaces = this.interfaces.map(processDuplicates);
        this.injectables = this.injectables.map(processDuplicates);
        this.pipes = this.pipes.map(processDuplicates);
        this.interceptors = this.interceptors.map(processDuplicates);
        this.guards = this.guards.map(processDuplicates);
        this.modules = this.modules.map(processDuplicates);
        this.components = this.components.map(processDuplicates);
        this.controllers = this.controllers.map(processDuplicates);
        this.entities = this.entities.map(processDuplicates);
        this.directives = this.directives.map(processDuplicates);
    };
    DependenciesEngine.prototype.find = function (name) {
        var e_1, _a;
        var _this = this;
        var searchFunctions = [
            function () { return _this.findInCompodocDependencies(name, _this.modules); },
            function () { return _this.findInCompodocDependencies(name, _this.injectables); },
            function () { return _this.findInCompodocDependencies(name, _this.interceptors); },
            function () { return _this.findInCompodocDependencies(name, _this.guards); },
            function () { return _this.findInCompodocDependencies(name, _this.interfaces); },
            function () { return _this.findInCompodocDependencies(name, _this.classes); },
            function () { return _this.findInCompodocDependencies(name, _this.components); },
            function () { return _this.findInCompodocDependencies(name, _this.controllers); },
            function () { return _this.findInCompodocDependencies(name, _this.entities); },
            function () { return _this.findInCompodocDependencies(name, _this.directives); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.variables); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.functions); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.typealiases); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.enumerations); },
            function () { return AngularApiUtil$1.findApi(name); }
        ];
        var bestScore = 0;
        var bestResult = undefined;
        try {
            for (var searchFunctions_1 = __values(searchFunctions), searchFunctions_1_1 = searchFunctions_1.next(); !searchFunctions_1_1.done; searchFunctions_1_1 = searchFunctions_1.next()) {
                var searchFunction = searchFunctions_1_1.value;
                var result = searchFunction();
                if (result.data && result.score > bestScore) {
                    bestScore = result.score;
                    bestResult = result;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (searchFunctions_1_1 && !searchFunctions_1_1.done && (_a = searchFunctions_1.return)) _a.call(searchFunctions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return bestResult;
    };
    DependenciesEngine.prototype.update = function (updatedData) {
        var _this = this;
        if (updatedData.modules.length > 0) {
            ___namespace.forEach(updatedData.modules, function (module) {
                var _index = ___namespace.findIndex(_this.modules, { name: module.name });
                _this.modules[_index] = module;
            });
        }
        if (updatedData.components.length > 0) {
            ___namespace.forEach(updatedData.components, function (component) {
                var _index = ___namespace.findIndex(_this.components, { name: component.name });
                _this.components[_index] = component;
            });
        }
        if (updatedData.controllers.length > 0) {
            ___namespace.forEach(updatedData.controllers, function (controller) {
                var _index = ___namespace.findIndex(_this.controllers, { name: controller.name });
                _this.controllers[_index] = controller;
            });
        }
        if (updatedData.entities.length > 0) {
            ___namespace.forEach(updatedData.entities, function (entity) {
                var _index = ___namespace.findIndex(_this.entities, { name: entity.name });
                _this.entities[_index] = entity;
            });
        }
        if (updatedData.directives.length > 0) {
            ___namespace.forEach(updatedData.directives, function (directive) {
                var _index = ___namespace.findIndex(_this.directives, { name: directive.name });
                _this.directives[_index] = directive;
            });
        }
        if (updatedData.injectables.length > 0) {
            ___namespace.forEach(updatedData.injectables, function (injectable) {
                var _index = ___namespace.findIndex(_this.injectables, { name: injectable.name });
                _this.injectables[_index] = injectable;
            });
        }
        if (updatedData.interceptors.length > 0) {
            ___namespace.forEach(updatedData.interceptors, function (interceptor) {
                var _index = ___namespace.findIndex(_this.interceptors, { name: interceptor.name });
                _this.interceptors[_index] = interceptor;
            });
        }
        if (updatedData.guards.length > 0) {
            ___namespace.forEach(updatedData.guards, function (guard) {
                var _index = ___namespace.findIndex(_this.guards, { name: guard.name });
                _this.guards[_index] = guard;
            });
        }
        if (updatedData.interfaces.length > 0) {
            ___namespace.forEach(updatedData.interfaces, function (int) {
                var _index = ___namespace.findIndex(_this.interfaces, { name: int.name });
                _this.interfaces[_index] = int;
            });
        }
        if (updatedData.pipes.length > 0) {
            ___namespace.forEach(updatedData.pipes, function (pipe) {
                var _index = ___namespace.findIndex(_this.pipes, { name: pipe.name });
                _this.pipes[_index] = pipe;
            });
        }
        if (updatedData.classes.length > 0) {
            ___namespace.forEach(updatedData.classes, function (classe) {
                var _index = ___namespace.findIndex(_this.classes, { name: classe.name });
                _this.classes[_index] = classe;
            });
        }
        /**
         * Miscellaneous update
         */
        if (updatedData.miscellaneous.variables.length > 0) {
            ___namespace.forEach(updatedData.miscellaneous.variables, function (variable) {
                var _index = ___namespace.findIndex(_this.miscellaneous.variables, {
                    name: variable.name,
                    file: variable.file
                });
                _this.miscellaneous.variables[_index] = variable;
            });
        }
        if (updatedData.miscellaneous.functions.length > 0) {
            ___namespace.forEach(updatedData.miscellaneous.functions, function (func) {
                var _index = ___namespace.findIndex(_this.miscellaneous.functions, {
                    name: func.name,
                    file: func.file
                });
                _this.miscellaneous.functions[_index] = func;
            });
        }
        if (updatedData.miscellaneous.typealiases.length > 0) {
            ___namespace.forEach(updatedData.miscellaneous.typealiases, function (typealias) {
                var _index = ___namespace.findIndex(_this.miscellaneous.typealiases, {
                    name: typealias.name,
                    file: typealias.file
                });
                _this.miscellaneous.typealiases[_index] = typealias;
            });
        }
        if (updatedData.miscellaneous.enumerations.length > 0) {
            ___namespace.forEach(updatedData.miscellaneous.enumerations, function (enumeration) {
                var _index = ___namespace.findIndex(_this.miscellaneous.enumerations, {
                    name: enumeration.name,
                    file: enumeration.file
                });
                _this.miscellaneous.enumerations[_index] = enumeration;
            });
        }
        this.prepareMiscellaneous();
    };
    DependenciesEngine.prototype.findInCompodoc = function (name) {
        var mergedData = ___namespace.concat([], this.modules, this.components, this.controllers, this.entities, this.directives, this.injectables, this.interceptors, this.guards, this.interfaces, this.pipes, this.classes, this.miscellaneous.enumerations, this.miscellaneous.typealiases, this.miscellaneous.variables, this.miscellaneous.functions);
        var result = ___namespace.find(mergedData, { name: name });
        return result || false;
    };
    DependenciesEngine.prototype.prepareMiscellaneous = function () {
        this.miscellaneous.variables.sort(getNamesCompareFn());
        this.miscellaneous.functions.sort(getNamesCompareFn());
        this.miscellaneous.enumerations.sort(getNamesCompareFn());
        this.miscellaneous.typealiases.sort(getNamesCompareFn());
        // group each subgoup by file
        this.miscellaneous.groupedVariables = ___namespace.groupBy(this.miscellaneous.variables, 'file');
        this.miscellaneous.groupedFunctions = ___namespace.groupBy(this.miscellaneous.functions, 'file');
        this.miscellaneous.groupedEnumerations = ___namespace.groupBy(this.miscellaneous.enumerations, 'file');
        this.miscellaneous.groupedTypeAliases = ___namespace.groupBy(this.miscellaneous.typealiases, 'file');
    };
    DependenciesEngine.prototype.getModule = function (name) {
        return ___namespace.find(this.modules, ['name', name]);
    };
    DependenciesEngine.prototype.getRawModule = function (name) {
        return ___namespace.find(this.rawModules, ['name', name]);
    };
    DependenciesEngine.prototype.getModules = function () {
        return this.modules;
    };
    DependenciesEngine.prototype.getComponents = function () {
        return this.components;
    };
    DependenciesEngine.prototype.getControllers = function () {
        return this.controllers;
    };
    DependenciesEngine.prototype.getEntities = function () {
        return this.entities;
    };
    DependenciesEngine.prototype.getDirectives = function () {
        return this.directives;
    };
    DependenciesEngine.prototype.getInjectables = function () {
        return this.injectables;
    };
    DependenciesEngine.prototype.getInterceptors = function () {
        return this.interceptors;
    };
    DependenciesEngine.prototype.getGuards = function () {
        return this.guards;
    };
    DependenciesEngine.prototype.getInterfaces = function () {
        return this.interfaces;
    };
    DependenciesEngine.prototype.getRoutes = function () {
        return this.routes;
    };
    DependenciesEngine.prototype.getPipes = function () {
        return this.pipes;
    };
    DependenciesEngine.prototype.getClasses = function () {
        return this.classes;
    };
    DependenciesEngine.prototype.getMiscellaneous = function () {
        return this.miscellaneous;
    };
    return DependenciesEngine;
}());
var DependenciesEngine$1 = DependenciesEngine.getInstance();

var FileEngine = /** @class */ (function () {
    function FileEngine() {
    }
    FileEngine.getInstance = function () {
        if (!FileEngine.instance) {
            FileEngine.instance = new FileEngine();
        }
        return FileEngine.instance;
    };
    FileEngine.prototype.get = function (filepath) {
        return new Promise(function (resolve, reject) {
            fs__namespace.readFile(path__namespace.resolve(filepath), 'utf8', function (err, data) {
                if (err) {
                    reject('Error during ' + filepath + ' read');
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    FileEngine.prototype.write = function (filepath, contents) {
        return new Promise(function (resolve, reject) {
            fs__namespace.outputFile(path__namespace.resolve(filepath), contents, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    FileEngine.prototype.writeSync = function (filepath, contents) {
        fs__namespace.outputFileSync(filepath, contents);
    };
    FileEngine.prototype.getSync = function (filepath) {
        return fs__namespace.readFileSync(path__namespace.resolve(filepath), 'utf8');
    };
    /**
     * @param file The file to check
     */
    FileEngine.prototype.existsSync = function (file) {
        return fs__namespace.existsSync(file);
    };
    return FileEngine;
}());
var FileEngine$1 = FileEngine.getInstance();

var traverse$2 = require('traverse');
var ExportJsonEngine = /** @class */ (function () {
    function ExportJsonEngine() {
    }
    ExportJsonEngine.getInstance = function () {
        if (!ExportJsonEngine.instance) {
            ExportJsonEngine.instance = new ExportJsonEngine();
        }
        return ExportJsonEngine.instance;
    };
    ExportJsonEngine.prototype.export = function (outputFolder, data) {
        var exportData = {};
        traverse$2(data).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
                if (Configuration$1.mainData.disableSourceCode) {
                    delete node.sourceCode;
                    delete node.templateData;
                    delete node.styleUrlsData;
                    delete node.stylesData;
                }
            }
        });
        exportData.pipes = data.pipes;
        exportData.interfaces = data.interfaces;
        exportData.injectables = data.injectables;
        exportData.guards = data.guards;
        exportData.interceptors = data.interceptors;
        exportData.classes = data.classes;
        exportData.directives = data.directives;
        exportData.components = data.components;
        exportData.modules = this.processModules();
        exportData.miscellaneous = data.miscellaneous;
        if (!Configuration$1.mainData.disableRoutesGraph) {
            exportData.routes = data.routes;
        }
        if (!Configuration$1.mainData.disableCoverage) {
            exportData.coverage = data.coverageData;
        }
        return FileEngine$1.write(outputFolder + path__namespace.sep + '/documentation.json', JSON.stringify(exportData, undefined, 4)).catch(function (err) {
            logger.error('Error during export file generation ', err);
            return Promise.reject(err);
        });
    };
    ExportJsonEngine.prototype.processModules = function () {
        var modules = DependenciesEngine$1.getModules();
        var _resultedModules = [];
        for (var moduleNr = 0; moduleNr < modules.length; moduleNr++) {
            var module_1 = modules[moduleNr];
            var moduleElement = {
                name: module_1.name,
                id: module_1.id,
                description: module_1.description,
                rawDescription: module_1.rawDescription,
                deprecationMessage: module_1.deprecationMessage,
                deprecated: module_1.deprecated,
                file: module_1.file,
                methods: module_1.methods,
                sourceCode: module_1.sourceCode,
                children: [
                    {
                        type: 'providers',
                        elements: []
                    },
                    {
                        type: 'declarations',
                        elements: []
                    },
                    {
                        type: 'imports',
                        elements: []
                    },
                    {
                        type: 'exports',
                        elements: []
                    },
                    {
                        type: 'bootstrap',
                        elements: []
                    },
                    {
                        type: 'classes',
                        elements: []
                    }
                ]
            };
            for (var k = 0; k < module_1.providers.length; k++) {
                var providerElement = {
                    name: module_1.providers[k].name
                };
                moduleElement.children[0].elements.push(providerElement);
            }
            for (var k = 0; k < module_1.declarations.length; k++) {
                var declarationElement = {
                    name: module_1.declarations[k].name
                };
                moduleElement.children[1].elements.push(declarationElement);
            }
            for (var k = 0; k < module_1.imports.length; k++) {
                var importElement = {
                    name: module_1.imports[k].name
                };
                moduleElement.children[2].elements.push(importElement);
            }
            for (var k = 0; k < module_1.exports.length; k++) {
                var exportElement = {
                    name: module_1.exports[k].name
                };
                moduleElement.children[3].elements.push(exportElement);
            }
            for (var k = 0; k < module_1.bootstrap.length; k++) {
                var bootstrapElement = {
                    name: module_1.bootstrap[k].name
                };
                moduleElement.children[4].elements.push(bootstrapElement);
            }
            _resultedModules.push(moduleElement);
        }
        return _resultedModules;
    };
    return ExportJsonEngine;
}());
var ExportJsonEngine$1 = ExportJsonEngine.getInstance();

var TRANSLATION_DE_DE = {
    accessors: 'Accessors',
    arguments: 'Argumente',
    bootstrap: 'Bootstrap',
    branches: 'Branches',
    browse: 'Durchsuche',
    classe: 'Klasse',
    classes: 'Klassen',
    component: 'Komponente',
    components: 'Komponenten',
    constructor: 'Konstruktor',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': 'Dokumentation Abdeckung',
    declarations: 'Declarations',
    decorators: 'Decorators',
    'default-value': 'Standardwert',
    'defined-in': 'Definiert in',
    dependencies: 'Abhängigkeiten',
    deprecated: 'Veraltet',
    description: 'Beschreibung',
    directive: 'Direktive',
    directives: 'Direktiven',
    'dom tree': 'DOM baum',
    entities: 'Entities',
    entity: 'Entity',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerations',
    enums: 'Enums',
    example: 'Beispiel',
    examples: 'Beispiele',
    exports: 'Exportiert',
    extends: 'Erweitert',
    file: 'Datei',
    functions: 'Funktionen',
    'generated-using': 'Dokumentation generiert mit',
    'getting-started': "Los geht's",
    guard: 'Guard',
    guards: 'Guards',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Html Element',
    'html-element-with-directive': 'Html-Element mit Direktive',
    identifier: 'Kennung',
    implements: 'Implementiert',
    imports: 'Importiert',
    index: 'Index',
    indexable: 'Indizierbar',
    info: 'Information',
    'inherited-from': 'Geerbt von',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Inputs',
    interceptors: 'Interceptors',
    interface: 'Interface',
    interfaces: 'Interfaces',
    legend: 'Legende',
    license: 'Lizenz',
    lines: 'Linien',
    metadata: 'Metadata',
    methods: 'Methoden',
    miscellaneous: 'Verschiedenes',
    module: 'Modul',
    modules: 'Module',
    name: 'Name',
    no: 'Nein',
    'no-graph': 'Kein Graph verfügbar.',
    'no-iframe': 'Dein Browser unterstützt keine iframes.',
    'no-result-matching': 'Kein passendes Ergebnis',
    'no-svg': 'Dein Browser unterstützt kein SVG',
    optional: 'Optional',
    outputs: 'Ausgaben',
    overview: 'Übersicht',
    parameters: 'Parameter',
    'peer-dependencies': 'Peer-Abhängigkeiten',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Präfix',
    properties: 'Eigenschaften',
    providers: 'Providers',
    pure: 'Pure',
    readme: 'README',
    required: 'Erforderlich',
    reset: 'Zurücksetzen',
    'results-matching': 'übereinstimmende Ergebnisse',
    returns: 'Returns',
    route: 'Route',
    routes: 'Routen',
    schemas: 'Schemata',
    'search-placeholder': 'Eingeben zur Suche',
    selector: 'Selektor',
    signature: 'Unterschrift',
    source: 'Quelle',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Stile',
    template: 'Vorlage',
    type: 'Typ',
    'type-aliases': 'Typ Aliase',
    'type-parameters': 'Typ Parameter',
    types: 'Typen',
    'unamed-property': 'Unbenannte Eigenschaft',
    'unit-test-coverage': 'Unit-Test-Abdeckung',
    value: 'Wert',
    variables: 'Variablen',
    yes: 'Ja',
    zoomin: 'Vergrößern',
    zoomout: 'Verkleinern'
};

var TRANSLATION_EN_US = {
    accessors: 'Accessors',
    arguments: 'Arguments',
    bootstrap: 'Bootstrap',
    branches: 'Branches',
    browse: 'Browse',
    classe: 'Class',
    classes: 'Classes',
    component: 'Component',
    components: 'Components',
    constructor: 'Constructor',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': 'Documentation coverage',
    declarations: 'Declarations',
    decorators: 'Decorators',
    'default-value': 'Default value',
    'defined-in': 'Defined in',
    dependencies: 'Dependencies',
    deprecated: 'Deprecated',
    description: 'Description',
    directive: 'Directive',
    directives: 'Directives',
    'dom tree': 'DOM tree',
    entities: 'Entities',
    entity: 'Entity',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerations',
    enums: 'Enums',
    example: 'Example',
    examples: 'Examples',
    exports: 'Exports',
    extends: 'Extends',
    file: 'File',
    functions: 'Functions',
    'generated-using': 'Documentation generated using',
    'getting-started': 'Getting started',
    guard: 'Guard',
    guards: 'Guards',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Html element',
    'html-element-with-directive': 'Html element with directive',
    identifier: 'Identifier',
    implements: 'Implements',
    imports: 'Imports',
    index: 'Index',
    indexable: 'Indexable',
    info: 'Information',
    'inherited-from': 'Inherited from',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Inputs',
    interceptors: 'Interceptors',
    interface: 'Interface',
    interfaces: 'Interfaces',
    legend: 'Legend',
    license: 'License',
    lines: 'Lines',
    metadata: 'Metadata',
    methods: 'Methods',
    miscellaneous: 'Miscellaneous',
    module: 'Module',
    modules: 'Modules',
    name: 'Name',
    no: 'No',
    'no-graph': 'No graph available.',
    'no-iframe': 'Your browser does not support iframes.',
    'no-result-matching': 'No results matching',
    'no-svg': 'Your browser does not support SVG',
    optional: 'Optional',
    outputs: 'Outputs',
    overview: 'Overview',
    parameters: 'Parameters',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Prefix',
    properties: 'Properties',
    providers: 'Providers',
    pure: 'Pure',
    readme: 'README',
    required: 'Required',
    reset: 'Reset',
    'results-matching': 'results matching',
    returns: 'Returns',
    route: 'Route',
    routes: 'Routes',
    schemas: 'Schemas',
    'search-placeholder': 'Type to search',
    selector: 'Selector',
    signature: 'Signature',
    source: 'Source',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Styles',
    template: 'Template',
    type: 'Type',
    'type-aliases': 'Type aliases',
    'type-parameters': 'Type parameters',
    types: 'Types',
    'unamed-property': 'Unamed property',
    'unit-test-coverage': 'Unit test coverage',
    value: 'Value',
    variables: 'Variables',
    yes: 'Yes',
    zoomin: 'Zoom in',
    zoomout: 'Zoom out'
};

var TRANSLATION_ES_ES = {
    accessors: 'Accesorios',
    arguments: 'Argumentos',
    bootstrap: 'Arranque',
    branches: 'Ramas',
    browse: 'Navegar',
    classe: 'Clase',
    classes: 'Clases',
    component: 'Componente',
    components: 'Componentes',
    constructor: 'Constructor',
    controllers: 'Controladores',
    controller: 'Controlador',
    'coverage-page-title': 'Cobertura de la documentación',
    declarations: 'Declaraciones',
    decorators: 'Decoradores',
    'default-value': 'Valor por defecto',
    'defined-in': 'Definido en',
    dependencies: 'Dependencias',
    deprecated: 'Obsoleta',
    description: 'Descripción',
    directive: 'Directiva',
    directives: 'Directivas',
    'dom tree': 'DOM arbol',
    entities: 'Entidades',
    entity: 'Entidad',
    entrycomponents: 'Componentes de entrada',
    enumerations: 'Enumeraciones',
    enums: 'Enums',
    example: 'Ejemplo',
    examples: 'Ejemplos',
    exports: 'Exporta',
    extends: 'Extiende',
    file: 'Fichero',
    functions: 'Funciones',
    'generated-using': 'Documentación generada utilizando',
    'getting-started': 'Comenzando',
    guard: 'Guardia',
    guards: 'Guardias',
    hostbindings: 'Fijaciones de Host',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'Escuchadores de Host',
    'html-element': 'Elemento Html',
    'html-element-with-directive': 'Elemento Html con directiva',
    identifier: 'Identificador',
    implements: 'Implementa',
    imports: 'Importa',
    index: 'Índice',
    indexable: 'Indexable',
    info: 'Información',
    'inherited-from': 'Heredado desde',
    injectable: 'Inyectable',
    injectables: 'Inyectables',
    inputs: 'Entradas',
    interceptors: 'Interceptores',
    interface: 'Interfaz',
    interfaces: 'Interfaces',
    legend: 'Leyenda',
    license: 'Licencia',
    lines: 'Líneas',
    metadata: 'Meta datos',
    methods: 'Métodos',
    miscellaneous: 'Miscelánea',
    module: 'Módulo',
    modules: 'Módulos',
    name: 'Nombre',
    no: 'No',
    'no-graph': 'No hay gráfica disponible.',
    'no-iframe': 'Tu navegador no soporta iframes.',
    'no-result-matching': 'No hay resultados que coincidan',
    'no-svg': 'Tu navegador no soporta SVG',
    optional: 'Opcional',
    outputs: 'Salidas',
    overview: 'Descripción general',
    parameters: 'Parámetros',
    'peer-dependencies': 'Dependencias entre pares',
    pipe: 'Tubería',
    pipes: 'Tuberías',
    prefix: 'Prefijo',
    properties: 'Propiedades',
    providers: 'Proveedores',
    pure: 'Puro',
    readme: 'Léeme',
    required: 'Requerido',
    reset: 'Restablecer',
    'results-matching': 'comparación de resultados',
    returns: 'Devuelve',
    route: 'Ruta',
    routes: 'Rutas',
    schemas: 'Esquemas',
    'search-placeholder': 'Escribe para buscar',
    selector: 'Selector',
    signature: 'Firma',
    source: 'Fuente',
    standalone: 'Standalone',
    statements: 'Declaraciones',
    styles: 'Estilos',
    template: 'Plantilla',
    type: 'Tipo',
    'type-aliases': 'Alias de tipo',
    'type-parameters': 'Parámetros de tipo',
    types: 'Tipos',
    'unamed-property': 'Propiedad sin nombre',
    'unit-test-coverage': 'Cobertura de las pruebas unitarias',
    value: 'Valor',
    variables: 'Variables',
    yes: 'Si',
    zoomin: 'Ampliar',
    zoomout: 'Alejar'
};

var TRANSLATION_FR_FR = {
    accessors: 'Accesseurs',
    arguments: 'Arguments',
    bootstrap: 'Bootstrap',
    branches: 'Branches',
    browse: 'Parcourir',
    classe: 'Class',
    classes: 'Classes',
    component: 'Composant',
    components: 'Composants',
    constructor: 'Constructeur',
    controllers: 'Contrôleurs',
    controller: 'Contrôleur',
    'coverage-page-title': 'Couverture de documentation',
    declarations: 'Déclarations',
    decorators: 'Décorateurs',
    'default-value': 'Valeur par défaut',
    'defined-in': 'Défini dans',
    dependencies: 'Dépendances',
    deprecated: 'Obsolète',
    description: 'Description',
    directive: 'Directive',
    directives: 'Directives',
    'dom tree': 'Arbre DOM',
    entities: 'Entités',
    entity: 'Entité',
    entrycomponents: "Composants d'entrée",
    enumerations: 'Enumérations',
    enums: 'Enumérations',
    example: 'Example',
    examples: 'Examples',
    exports: 'Exports',
    extends: 'Etend',
    file: 'Fichier',
    functions: 'Fonctions',
    'generated-using': 'Documentation générée avec',
    'getting-started': 'Démarrage',
    guard: 'Garde',
    guards: 'Gardes',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Elément Html',
    'html-element-with-directive': 'Elément Html avec une directive',
    identifier: 'Identifiant',
    implements: 'Implémente',
    imports: 'Imports',
    index: 'Index',
    indexable: 'Indexable',
    info: 'Information',
    'inherited-from': 'Hérité de',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Entrées',
    interceptors: 'Intercepteurs',
    interface: 'Interface',
    interfaces: 'Interfaces',
    legend: 'Légende',
    license: 'License',
    lines: 'Lignes',
    metadata: 'Métadonnées',
    methods: 'Méthodes',
    miscellaneous: 'Divers',
    module: 'Module',
    modules: 'Modules',
    name: 'Nom',
    no: 'Non',
    'no-graph': 'Aucun graphique disponible.',
    'no-iframe': 'Votre navigateur ne supporte pas les iframes.',
    'no-result-matching': 'Aucun résultat matchant',
    'no-svg': 'Votre navigateur ne supporte pas le SVG',
    optional: 'Optionnel',
    outputs: 'Sorties',
    overview: "Vue d'ensemble",
    parameters: 'Paramètres',
    'peer-dependencies': 'Dépendances de pair',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Préfixe',
    properties: 'Propriétés',
    providers: 'Providers',
    pure: 'Pure',
    readme: 'README',
    required: 'Requis',
    reset: 'Remise à zéro',
    'results-matching': 'résultats matchant',
    returns: 'Renvoie',
    route: 'Route',
    routes: 'Routes',
    schemas: 'Schémas',
    'search-placeholder': 'Saisissez un texte',
    selector: 'Sélecteur',
    signature: 'Signature',
    source: 'Source',
    standalone: 'Standalone',
    statements: 'Déclarations',
    styles: 'Styles',
    template: 'Template',
    'table-of-contents': 'Table des matières',
    type: 'Type',
    'type-aliases': 'Alias de type',
    'type-parameters': 'Paramètres de type',
    types: 'Types',
    'unamed-property': 'Propriété non nommée',
    'unit-test-coverage': 'Couverture de test unitaire',
    value: 'Valeur',
    variables: 'Variables',
    yes: 'Oui',
    zoomin: 'Zoom avant',
    zoomout: 'Zoom arrière'
};

var TRANSLATION_HU_HU = {
    accessors: 'Getter/setter metódusok',
    arguments: 'Argumentumok',
    bootstrap: 'Betöltés',
    branches: 'Branchek',
    browse: 'Böngészés',
    classe: 'Osztály',
    classes: 'Osztályok',
    component: 'Komponens',
    components: 'Komponensek',
    constructor: 'Konstruktor',
    controllers: 'Kontrollerek',
    controller: 'Kontroller',
    'coverage-page-title': 'Dokumentáció lefedettség',
    declarations: 'Deklarációk',
    decorators: 'Dekorátorok',
    'default-value': 'Alapértelmezett érték',
    'defined-in': 'Definíció helye:',
    dependencies: 'Függőségek',
    deprecated: 'Elavult',
    description: 'Leírás',
    directive: 'Direktíva',
    directives: 'Direktívák',
    'dom tree': 'DOM fa',
    entities: 'Entitások',
    entity: 'Entitás',
    entrycomponents: 'Entry komponensek',
    enumerations: 'Enumerációk',
    enums: 'Enumok',
    example: 'Példa',
    examples: 'Példák',
    exports: 'Exportok',
    extends: 'Ősosztály',
    file: 'File',
    functions: 'Függvények',
    'generated-using': 'A dokumentációt generálta:',
    'getting-started': 'Bevezető',
    guard: 'Guard',
    guards: 'Guardok',
    hostbindings: 'HostBindingok',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListenerek',
    'html-element': 'Html elem',
    'html-element-with-directive': 'Html elem direktívával',
    identifier: 'Azonosító',
    implements: 'Implementált interfészek',
    imports: 'Importok',
    index: 'Tartalomjegyzék',
    indexable: 'Indexelhető',
    info: 'Információ',
    'inherited-from': 'Örökölve innen:',
    injectable: 'Injektálható',
    injectables: 'Injektálhatók',
    inputs: 'Bemenetek',
    interceptors: 'Interceptorok',
    interface: 'Interfész',
    interfaces: 'Interfészek',
    legend: 'Jelmagyarázat',
    license: 'Licenc',
    lines: 'Sorok',
    metadata: 'Metaadatok',
    methods: 'Metódusok',
    miscellaneous: 'Egyéb',
    module: 'Modul',
    modules: 'Modulok',
    name: 'Név',
    no: 'Nem',
    'no-graph': 'Grafikon nem elérhető.',
    'no-iframe': 'A böngészője nem támogatja az iframe-eket.',
    'no-result-matching': 'Nincs találat',
    'no-svg': 'A böngészője nem támogatja az SVG formátumot.',
    optional: 'Opcionális',
    outputs: 'Kimenetek',
    overview: 'Áttekintés',
    parameters: 'Paraméterek',
    'peer-dependencies': 'Peer függőségek',
    pipe: 'Pipe',
    pipes: 'Pipe-ok',
    prefix: 'Előtag',
    properties: 'Tagváltozók',
    providers: 'Providerek',
    pure: 'Pure',
    readme: 'README',
    required: 'Kívánt',
    reset: 'Visszaállít',
    'results-matching': 'találat',
    returns: 'Visszatérési érték',
    route: 'Útvonal',
    routes: 'Útvonalak',
    schemas: 'Sémák',
    'search-placeholder': 'Keresendő kifejezés',
    selector: 'Szelektor',
    signature: 'Aláírás',
    source: 'Forrás',
    standalone: 'Standalone',
    statements: 'Utasítások',
    styles: 'Stílusok',
    template: 'Sablon',
    type: 'Típus',
    'type-aliases': 'Típus álnév',
    'type-parameters': 'Típus paraméterek',
    types: 'Típusok',
    'unamed-property': 'Névtelen property',
    'unit-test-coverage': 'Unit teszt lefedettség',
    value: 'Érték',
    variables: 'Változók',
    yes: 'Igen',
    zoomin: 'Nagyítás',
    zoomout: 'Kicsinyítés'
};

var TRANSLATION_IT_IT = {
    accessors: 'Accessori',
    arguments: 'Argomenti',
    bootstrap: 'Bootstrap',
    branches: 'Rami',
    browse: 'Cerca',
    classe: 'Classe',
    classes: 'Classi',
    component: 'Componente',
    components: 'Componenti',
    constructor: 'Costruttore',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': 'Copertura codice',
    declarations: 'Dichiarazioni',
    decorators: 'Decorators',
    'default-value': 'Valore predefinito',
    'defined-in': 'Definito in',
    dependencies: 'Dependencies',
    deprecated: 'Deprecata',
    description: 'Descrizione',
    directive: 'Direttiva',
    directives: 'Direttive',
    'dom tree': 'Albero DOM',
    entities: 'Entità',
    entity: 'Entità',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerations',
    enums: 'Enums',
    example: 'Esempio',
    examples: 'Esempi',
    exports: 'Exports',
    extends: 'Extends',
    file: 'File',
    functions: 'Funzioni',
    'generated-using': 'Documentazione generata usando',
    'getting-started': 'Iniziamo',
    guard: 'Guardia',
    guards: 'Guardie',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Elemento Html',
    'html-element-with-directive': 'Elemento html con direttive',
    identifier: 'Identificatore',
    implements: 'Implementa',
    imports: 'Importa',
    index: 'Indice',
    indexable: 'Indicizzabile',
    info: 'Informazione',
    'inherited-from': 'ereditato da',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Input',
    interceptors: 'Interceptors',
    interface: 'Interfaccia',
    interfaces: 'Interfacce',
    legend: 'Legenda',
    license: 'Licenza',
    lines: 'Linee',
    metadata: 'Metadati',
    methods: 'Metodi',
    miscellaneous: 'Varie',
    module: 'Modulo',
    modules: 'Moduli',
    name: 'Nome',
    no: 'No',
    'no-graph': 'Grafico non disponibile.',
    'no-iframe': 'Il tuo browser non supporta iframe.',
    'no-result-matching': 'Nessun risultato corrispondente',
    'no-svg': 'Il tuo browser non supporta SVG',
    optional: 'Opzionale',
    outputs: 'Output',
    overview: 'Sommario',
    parameters: 'Parametri',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Prefisso',
    properties: 'Proprietà',
    providers: 'Providers',
    pure: 'Pure',
    readme: 'README',
    required: 'Necessario',
    reset: 'Reset',
    'results-matching': 'corrispondenza',
    returns: 'Returns',
    route: 'Route',
    routes: 'Routes',
    schemas: 'Schemas',
    'search-placeholder': 'Digita per avviare la ricerca',
    selector: 'Selector',
    signature: 'Signature',
    source: 'Fonte',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Stili',
    template: 'Modello',
    type: 'Tipo',
    'type-aliases': 'Type aliases',
    'type-parameters': 'Type parameters',
    types: 'Tipi',
    'unamed-property': 'Proprietà senza nome',
    'unit-test-coverage': 'Copertura unit test',
    value: 'Valori',
    variables: 'Variabili',
    yes: 'Si',
    zoomin: 'Ingrandisci',
    zoomout: 'Rimpocciolisci'
};

var TRANSLATION_JA_JP = {
    accessors: 'アクセサ',
    arguments: '引数',
    bootstrap: 'ブートストラップ',
    branches: 'ブランチ',
    browse: 'ブラウズ',
    classe: 'クラス',
    classes: 'クラス',
    component: 'コンポーネント',
    components: 'コンポーネント',
    constructor: 'コンストラクタ',
    controllers: 'コントローラー',
    controller: 'コントローラー',
    'coverage-page-title': 'カバレッジ',
    declarations: '宣言',
    decorators: 'デコレーター',
    'default-value': '初期値',
    'defined-in': 'Defined in',
    dependencies: '依存関係',
    deprecated: '非推奨',
    description: '説明',
    directive: 'ディレクティブ',
    directives: 'ディレクティブ',
    'dom tree': 'DOM ツリー',
    entities: 'エンティティ',
    entity: '実在物',
    entrycomponents: 'エントリーコンポーネント',
    enumerations: '列挙型',
    enums: 'Enums',
    example: '例',
    examples: '例',
    exports: 'エクスポート',
    extends: '継承',
    file: 'ファイル',
    functions: '関数',
    'generated-using': 'このドキュメントは以下を使用して生成されています',
    'getting-started': 'はじめに',
    guard: 'ガード',
    guards: 'ガード',
    hostbindings: 'ホストバインディング',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'ホストリスナー',
    'html-element': 'Html要素',
    'html-element-with-directive': 'ディレクティブHtml要素',
    identifier: '識別子',
    implements: '実装',
    imports: 'インポート',
    index: '索引',
    indexable: 'インデクサブル',
    info: '情報',
    'inherited-from': 'Inherited from',
    injectable: 'インジェクタブル',
    injectables: 'インジェクタブル',
    inputs: '入力',
    interceptors: 'インターセプター',
    interface: 'インターフェイス',
    interfaces: 'インターフェイス',
    legend: '凡例',
    license: 'ライセンス',
    lines: '行数',
    metadata: 'メタデータ',
    methods: 'メソッド',
    miscellaneous: 'その他',
    module: 'モジュール',
    modules: 'モジュール',
    name: '名前',
    no: 'いいえ',
    'no-graph': '使用できるグラフがありません',
    'no-iframe': 'ブラウザがiframeを対応していません',
    'no-result-matching': '見つかりませんでした',
    'no-svg': 'ブラウザがSVGに対応してません',
    optional: 'オプション',
    outputs: '出力',
    overview: '概要',
    parameters: 'パラメータ',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'パイプ',
    pipes: 'パイプ',
    prefix: '接頭辞',
    properties: 'プロパティ',
    providers: 'プロバイダー',
    pure: 'Pure',
    readme: 'README',
    required: '必要',
    reset: 'リセット',
    'results-matching': '件の結果が一致しました',
    returns: '戻り値',
    route: 'ルート',
    routes: 'ルート',
    schemas: 'スキーマ',
    'search-placeholder': '入力して検索',
    selector: 'セレクタ',
    signature: 'シグネチャ',
    source: 'ソース',
    standalone: 'Standalone',
    statements: '文',
    styles: 'スタイル',
    template: 'テンプレート',
    type: '型',
    'type-aliases': 'タイプエイリアス',
    'type-parameters': '型パラメーター',
    types: '型',
    'unamed-property': '匿名プロパティ',
    'unit-test-coverage': 'ユニットテストカバレッジ',
    value: '値',
    variables: '変数',
    yes: 'はい',
    zoomin: '拡大',
    zoomout: '縮小'
};

var TRANSLATION_KA_GE = {
    accessors: 'აქსესორი',
    arguments: 'არგუმენტები',
    bootstrap: 'ჩამტვირთავი',
    branches: 'ტოტები',
    browse: 'დაათვალიერე',
    classe: 'კლასი',
    classes: 'კლასები',
    component: 'კომპონენტი',
    components: 'კომპონენტები',
    constructor: 'კონსტრუქტორი',
    controllers: 'კონტროლერები',
    controller: 'კონტროლერი',
    'coverage-page-title': 'დოკუმენტაციის გაშუქება',
    declarations: 'დეკლარაციები',
    decorators: 'დეკორატორები',
    'default-value': 'ნაგულისხმევი მნიშვნელობა',
    'defined-in': 'აღწერილია',
    dependencies: 'დამოკიდებულებები',
    deprecated: 'მოძველებულია',
    description: 'აღწერა',
    directive: 'დირექტივა',
    directives: 'დირექტივები',
    'dom tree': 'DOM ხე',
    entities: 'სუბიექტები',
    entity: 'სუბიექტი',
    entrycomponents: 'შესვლის კომპონენტები',
    enumerations: 'ჩამოთვლები',
    enums: 'ენამები',
    example: 'მაგალითი',
    examples: 'მაგალითები',
    exports: 'ექსპორტი',
    extends: 'აგრძელებს',
    file: 'ფაილი',
    functions: 'ფუნქციები',
    'generated-using': 'დოკუმენტაცია დაგენერირდა გამოყენებით',
    'getting-started': 'ვიწყებთ',
    guard: 'მცველი',
    guards: 'მცველები',
    hostbindings: 'ჰოსტის დამაკავშირებლები',
    hostdirectives: 'ჰოსტის დირექტივები',
    hostlisteners: 'ჰოსტის მსმენელები',
    'html-element': 'Html ელემენტი',
    'html-element-with-directive': 'Html ელემენტი დირექტივით',
    identifier: 'იდენტიფიკატორი',
    implements: 'ახორციელებს',
    imports: 'იმპორტი',
    index: 'ინდექსი',
    indexable: 'ინდექსირებადი',
    info: 'ინფორმაცია',
    'inherited-from': 'მემკვიდრეობით მიიღო',
    injectable: 'ინექცია',
    injectables: 'საინექციო საშუალებები',
    inputs: 'შეყვანები',
    interceptors: 'ჩამჭრელები',
    interface: 'ინტერფეისი',
    interfaces: 'ინტერფეისები',
    legend: 'ლეგენდა',
    license: 'ლიცენზია',
    lines: 'ხაზები',
    metadata: 'მეტამონაცემები',
    methods: 'მეთოდები',
    miscellaneous: 'სხვადასხვა',
    module: 'მოდული',
    modules: 'მოდულები',
    name: 'სახელები',
    no: 'არა',
    'no-graph': 'გრაფი არ არის ხელმისაწვდომი.',
    'no-iframe': 'თქვენს ბრაუზერს არ აქვს iframes-ის მხარდაჭერა.',
    'no-result-matching': 'არ არის შესაბამისი შედეგები',
    'no-svg': 'თქვენს ბრაუზერს არ აქვს SVG მხარდაჭერა',
    optional: 'სურვილისამებრ',
    outputs: 'შედეგები',
    overview: 'მიმოხილვა',
    parameters: 'პარამეტრები',
    'peer-dependencies': 'თანატოლებთან დამოკიდებულებები',
    pipe: 'მილი',
    pipes: 'მილები',
    prefix: 'პრეფიქსი',
    properties: 'თვისება',
    providers: 'პროვაიდერი',
    pure: 'წმინდა',
    readme: 'README',
    required: 'აუცილებელი',
    reset: 'გადატვირთვა',
    'results-matching': 'შედეგები ემთხვევა',
    returns: 'ბრუნდება',
    route: 'მარშრუტი',
    routes: 'მარშრუტები',
    schemas: 'სქემები',
    'search-placeholder': 'დაწერე მოსაძებნად',
    selector: 'სელექტორი',
    signature: 'ხელმოწერა',
    source: 'წყარო',
    standalone: 'დამოუკიდებელი',
    statements: 'განცხადებები',
    styles: 'სტილები',
    template: 'შაბლონი',
    type: 'ტიპი',
    'type-aliases': 'მეტსახელის ტიპი',
    'type-parameters': 'პარამეტრების ტიპი',
    types: 'ტიპები',
    'unamed-property': 'უსახელო თვისება',
    'unit-test-coverage': 'ერთეული ტესტის გაშუქება',
    value: 'მნიშვნელობა',
    variables: 'ცვლადები',
    yes: 'კი',
    zoomin: 'მიახლოვება',
    zoomout: 'მასშტაბირება'
};

var TRANSLATION_KO_KR = {
    accessors: '접근자',
    arguments: '인수',
    bootstrap: 'Bootstrap',
    branches: '브랜치',
    browse: '탐색',
    classe: '클래스',
    classes: '클래스',
    component: '컴포넌트',
    components: '컴포넌트',
    constructor: '생성자',
    controllers: '컨트롤러',
    controller: '컨트롤러',
    'coverage-page-title': '문서 커버리지',
    declarations: '선언',
    decorators: '데코레이터',
    'default-value': '기본 값',
    'defined-in': '다음에 정의됨',
    dependencies: '의존성',
    deprecated: '비추천',
    description: '설명',
    directive: 'Directive',
    directives: 'Directives',
    'dom tree': '돔 트리',
    entities: '엔티티',
    entity: '실재',
    entrycomponents: 'EntryComponents',
    enumerations: '열거',
    enums: 'Enums',
    example: '예시',
    examples: '예',
    exports: '내보내기',
    extends: 'Extends',
    file: '파일',
    functions: '함수',
    'generated-using': '이 문서는 다음을 이용하여 생성되었습니다',
    'getting-started': '시작하기',
    guard: '가드',
    guards: '가드',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'HTML 요소',
    'html-element-with-directive': '지시어가 있는 HTML 요소',
    identifier: '식별자',
    implements: '구현',
    imports: '가져오기',
    index: '색인',
    indexable: 'Indexable',
    info: '정보',
    'inherited-from': '다음에서 상속됨',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: '입력',
    interceptors: 'Interceptors',
    interface: '인터페이스',
    interfaces: '인터페이스',
    legend: '범례',
    license: '라이선스',
    lines: '줄',
    metadata: '메타데이터',
    methods: '메소드',
    miscellaneous: '기타',
    module: '모듈',
    modules: '모듈',
    name: '이름',
    no: '아니오',
    'no-graph': '사용할 수 있는 그래프가 없습니다.',
    'no-iframe': '사용중인 브라우저가 iframe을 지원하지 않습니다',
    'no-result-matching': '검색 결과가 없습니다',
    'no-svg': '브라우저가 SVG를 지원하지 않습니다',
    optional: '선택적',
    outputs: '결과물',
    overview: '개요',
    parameters: '매개변수',
    'peer-dependencies': '상호 의존성',
    pipe: '파이프',
    pipes: '파이프',
    prefix: '접두어',
    properties: '속성',
    providers: '제공자',
    pure: 'Pure',
    readme: 'README',
    required: '필수의',
    reset: '초기화',
    'results-matching': '개의 결과가 일치했습니다',
    returns: '반환',
    route: 'Route',
    routes: 'Routes',
    schemas: '스키마',
    'search-placeholder': '검색어 입력',
    selector: '선택자',
    signature: 'Signature',
    source: '출처',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: '스타일',
    template: '주형',
    type: '타입',
    'type-aliases': '타입 별칭',
    'type-parameters': '타입 매개 변수',
    types: '타입',
    'unamed-property': '익명 속성',
    'unit-test-coverage': '단위 테스트 커버리지',
    value: '값',
    variables: '변수',
    yes: '네',
    zoomin: '확대',
    zoomout: '축소'
};

var TRANSLATION_NL_NL = {
    accessors: 'Accessors',
    arguments: 'Argumenten',
    bootstrap: 'Bootstrap',
    branches: 'Branches',
    browse: 'Browse',
    classe: 'Klasse',
    classes: 'Klassen',
    component: 'Component',
    components: 'Componenten',
    constructor: 'Constructor',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': 'Documentatie coverage',
    declarations: 'Declaraties',
    decorators: 'Decorators',
    'default-value': 'Default waarde',
    'defined-in': 'Gedefinieerd in',
    dependencies: 'Dependencies',
    deprecated: 'Verouderd',
    description: 'Omschrijving',
    directive: 'Directive',
    directives: 'Directives',
    'dom tree': 'DOM boom',
    entities: 'Entiteiten',
    entity: 'Entiteit',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerations',
    enums: 'Enums',
    example: 'Voorbeeld',
    examples: 'Voorbeelden',
    exports: 'Exports',
    extends: 'Extends',
    file: 'Bestand',
    functions: 'Functies',
    'generated-using': 'Documentatie gegenereed met',
    'getting-started': 'Aan de slag',
    guard: 'Guard',
    guards: 'Guards',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Html element',
    'html-element-with-directive': 'Html element met directive',
    identifier: 'Identifier',
    implements: 'Implementeert',
    imports: 'Imports',
    index: 'Index',
    indexable: 'Indexeerbaar',
    info: 'Informatie',
    'inherited-from': 'Inherited van',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Inputs',
    interceptors: 'Interceptors',
    interface: 'Interface',
    interfaces: 'Interfaces',
    legend: 'Legenda',
    license: 'Licentie',
    lines: 'Regels',
    metadata: 'Metadata',
    methods: 'Methods',
    miscellaneous: 'Diversen',
    module: 'Module',
    modules: 'Modules',
    name: 'Naam',
    no: 'Nee',
    'no-graph': 'Geen diagram beschikbaar.',
    'no-iframe': 'Uw browser ondersteund geen iframes.',
    'no-result-matching': 'Geen overeenkomende resultaten',
    'no-svg': 'Uw browser ondersteund geen SVG',
    optional: 'Optioneel',
    outputs: 'Outputs',
    overview: 'Overzicht',
    parameters: 'Parameters',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Voorvoegsel',
    properties: 'Properties',
    providers: 'Providers',
    pure: 'Puur',
    readme: 'README',
    required: 'Vereist',
    reset: 'Reset',
    'results-matching': 'overeenkomende resultaten',
    returns: 'Returns',
    route: 'Route',
    routes: 'Routes',
    schemas: "Schema's",
    'search-placeholder': 'Type om te zoeken',
    selector: 'Selector',
    signature: 'Handtekening',
    source: 'Bron',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Stijlen',
    template: 'Sjabloon',
    type: 'Type',
    'type-aliases': 'Type aliassen',
    'type-parameters': 'Type parameters',
    types: 'Types',
    'unamed-property': 'Naamloze property',
    'unit-test-coverage': 'Unit test coverage',
    value: 'Waarde',
    variables: 'Variabelen',
    yes: 'Ja',
    zoomin: 'Zoom in',
    zoomout: 'Zoom uit'
};

var TRANSLATION_PL_PL = {
    accessors: 'Akcesor',
    arguments: 'Argumenty',
    bootstrap: 'Uruchomienie',
    branches: 'Gałęzie',
    browse: 'Przeglądaj',
    classe: 'Klasa',
    classes: 'Klasy',
    component: 'Komponent',
    components: 'Komponenty',
    constructor: 'Konstruktor',
    controllers: 'Kontrolery',
    controller: 'Kontroler',
    'coverage-page-title': 'Pokrycie dokumentacją',
    declarations: 'Deklaracje',
    decorators: 'Dekoratory',
    'default-value': 'Domyślna wartość',
    'defined-in': 'Zdefiniowane w',
    dependencies: 'Biblioteki',
    deprecated: 'Przestarzałe',
    description: 'Opis',
    directive: 'Dyrektywa',
    directives: 'Dyrektywy',
    'dom tree': 'DOM drzewo',
    entities: 'Podmioty',
    entity: 'Podmiot',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumeracje',
    enums: 'Enumy',
    example: 'Przykład',
    examples: 'Przykłady',
    exports: 'Exporty',
    extends: 'Rozszerza',
    file: 'Plik',
    functions: 'Funkcje',
    'generated-using': 'Dokumentacja wygenerowana przy użyciu',
    'getting-started': 'Start',
    guard: 'Guard',
    guards: "Guard'y",
    hostbindings: 'HostBindingi',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListenery',
    'html-element': 'Html element',
    'html-element-with-directive': 'Html element z dyrektywą',
    identifier: 'Identyfikator',
    implements: 'Implementuje',
    imports: 'Importuje',
    index: 'Indeks',
    indexable: 'Indeksowany',
    info: 'Informatie',
    'inherited-from': 'Dziedziczy z',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Inputy',
    interceptors: 'Interceptory',
    interface: 'Interfejs',
    interfaces: 'Interfejsy',
    legend: 'Legenda',
    license: 'Licencja',
    lines: 'Linie',
    metadata: 'Metadane',
    methods: 'Metody',
    miscellaneous: 'Różne',
    module: 'Moduł',
    modules: 'Moduły',
    name: 'Nazwa',
    no: 'Nie',
    'no-graph': 'Graf niedostępny.',
    'no-iframe': "Twoja przeglądarka nie wspiera iframe'ów.",
    'no-result-matching': 'Brak pasujących wyników',
    'no-svg': 'Twoja przeglądarka nie wspiera SVG',
    optional: 'Opcjonalne',
    outputs: 'Outputy',
    overview: 'Przegląd',
    parameters: 'Parametry',
    'peer-dependencies': 'Biblioteki zależne',
    pipe: 'Pipe',
    pipes: "Pipe'y",
    prefix: 'Prefiks',
    properties: 'Włąściwości',
    providers: 'Dostarczyciele',
    pure: 'Czysty',
    readme: 'README',
    required: 'Wymagany',
    reset: 'Reset',
    'results-matching': 'pasujących wyników',
    returns: 'Zwraca',
    route: 'Route',
    routes: "Route'y",
    schemas: 'Schematy',
    'search-placeholder': 'Wprowadź tekst wyszukiwania',
    selector: 'Selektor',
    signature: 'Podpis',
    source: 'Source',
    standalone: 'Standalone',
    statements: 'Instrukcje',
    styles: 'Estilos',
    template: 'Modelo',
    type: 'Typ',
    'type-aliases': 'Aliasy typów',
    'type-parameters': 'Parametry typów',
    types: 'Typy',
    'unamed-property': 'Nienazwana właśność',
    'unit-test-coverage': 'Pokrycie testami jednostkowymi',
    value: 'Wartość',
    variables: 'Zmienne',
    yes: 'Tak',
    zoomin: 'Przybliż',
    zoomout: 'Oddal'
};

var TRANSLATION_PT_BR = {
    accessors: 'Acessores',
    arguments: 'Argumentos',
    bootstrap: 'Bootstrap',
    branches: 'Branches',
    browse: 'Navegar',
    classe: 'Classe',
    classes: 'Classes',
    component: 'Componente',
    components: 'Componentes',
    constructor: 'Construtor',
    controllers: 'Controladores',
    controller: 'Controlador',
    'coverage-page-title': 'Cobertura da documentação',
    declarations: 'Declarações',
    decorators: 'Decoradores',
    'default-value': 'Valor padrão',
    'defined-in': 'Definido em',
    dependencies: 'Dependências',
    deprecated: 'Descontinuada',
    description: 'Descrição',
    directive: 'Diretiva',
    directives: 'Diretivas',
    'dom tree': 'Arvore DOM',
    entities: 'Entidades',
    entity: 'Entidade',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerações',
    enums: 'Enums',
    example: 'Exemplo',
    examples: 'Exemplos',
    exports: 'Exports',
    extends: 'Extende',
    file: 'Arquivo',
    functions: 'Funções',
    'generated-using': 'Documentação gerada usando',
    'getting-started': 'Começando',
    guard: 'Guarda',
    guards: 'Guardas',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'Elemento HTML',
    'html-element-with-directive': 'Elemento HTML com diretiva',
    identifier: 'Identificador',
    implements: 'Implementa',
    imports: 'Imports',
    index: 'Index',
    indexable: 'Indexável',
    info: 'Informação',
    'inherited-from': 'Herdado de',
    injectable: 'Injetável',
    injectables: 'Injetáveis',
    inputs: 'Inputs',
    interceptors: 'Interceptors',
    interface: 'Interface',
    interfaces: 'Interfaces',
    legend: 'Legend',
    license: 'Licença',
    lines: 'Linhas',
    metadata: 'Metadata',
    methods: 'Métodos',
    miscellaneous: 'Miscelânea',
    module: 'Módulo',
    modules: 'Módulos',
    name: 'Nome',
    no: 'Não',
    'no-graph': 'Sem gráfico disponível.',
    'no-iframe': 'Seu browser não tem suporte a iframes.',
    'no-result-matching': 'Nenhum resultado correspondente',
    'no-svg': 'Seu browser não tem suporte a SVG',
    optional: 'Opcional',
    outputs: 'Outputs',
    overview: 'Visão geral',
    parameters: 'Parâmetros',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Prefixo',
    properties: 'Propriedades',
    providers: 'Providers',
    pure: 'Puro',
    readme: 'README',
    required: 'Obrigatório',
    reset: 'Resetar',
    'results-matching': 'resultados correspondentes',
    returns: 'Retorna',
    route: 'Rota',
    routes: 'Rotas',
    schemas: 'Esquemas',
    'search-placeholder': 'Digite para pesquisar',
    selector: 'Seletor',
    signature: 'Assinatura',
    source: 'Fonte',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Estilos',
    template: 'Modelo',
    type: 'Tipo',
    'type-aliases': 'Aliases de tipo',
    'type-parameters': 'Parâmetros de tipo',
    types: 'Tipos',
    'unamed-property': 'Propriedade não-nomeada',
    'unit-test-coverage': 'Cobertura de teste unitário',
    value: 'Valor',
    variables: 'Variáveis',
    yes: 'Sim',
    zoomin: 'Zoom in',
    zoomout: 'Zoom out'
};

var TRANSLATION_RU_RU = {
    accessors: 'Аксессор',
    arguments: 'Аргументы',
    bootstrap: 'Загрузчик',
    branches: 'Ветки',
    browse: 'Обзор',
    classe: 'Класс',
    classes: 'Классы',
    component: 'Компонент',
    components: 'Компоненты',
    constructor: 'Конструктор',
    controllers: 'Контроллеры',
    controller: 'Контроллер',
    'coverage-page-title': 'Покрытие документацией',
    declarations: 'Декларации',
    decorators: 'Декораторы',
    'default-value': 'Значение по умолчанию',
    'defined-in': 'Определен в',
    dependencies: 'Зависимости',
    deprecated: 'Устаревшая',
    description: 'Описание',
    directive: 'Директива',
    directives: 'Директивы',
    'dom tree': 'DOM-дерево',
    entities: 'Сущности',
    entity: 'Сущность',
    entrycomponents: 'Входные компоненты',
    enumerations: 'Перечисления',
    enums: 'Перечисления',
    example: 'Пример',
    examples: 'Примеры',
    exports: 'Экспорт',
    extends: 'Расширяет',
    file: 'Файл',
    functions: 'Функции',
    'generated-using': 'Документация создана с помощью',
    'getting-started': 'Начало работы',
    guard: 'Защитник',
    guards: 'Защитники',
    hostbindings: 'Привязки хоста',
    hostdirectives: 'Директивы хоста',
    hostlisteners: 'Слушатели хоста',
    'html-element': 'Html-элемент',
    'html-element-with-directive': 'Html-элемент с директивой',
    identifier: 'Идентификатор',
    implements: 'Реализует',
    imports: 'Импорт',
    index: 'Индекс',
    indexable: 'Индексируемый',
    info: 'Информация',
    'inherited-from': 'Наследуемый из',
    injectable: 'Внедрение',
    injectables: 'Внедрения',
    inputs: 'Входные данные',
    interceptors: 'Перехватчики',
    interface: 'Интерфейс',
    interfaces: 'Интерфейсы',
    legend: 'Легенда',
    license: 'Лицензия',
    lines: 'Строки',
    metadata: 'Метаданные',
    methods: 'Методы',
    miscellaneous: 'Разное',
    module: 'Модуль',
    modules: 'Модули',
    name: 'Имя',
    no: 'Нет',
    'no-graph': 'Диаграмма недоступна.',
    'no-iframe': 'Браузер не поддерживает iframes.',
    'no-result-matching': 'Результаты не найдены',
    'no-svg': 'Браузер не поддерживает SVG',
    optional: 'Опциональный',
    outputs: 'Выходные данные',
    overview: 'Обзор',
    parameters: 'Параметры',
    'peer-dependencies': 'Одноранговые зависимости',
    pipe: 'Конвейер',
    pipes: 'Конвейеры',
    prefix: 'Префикс',
    properties: 'Свойства',
    providers: 'Провайдеры',
    pure: 'Чистый',
    readme: 'README',
    required: 'Требуемый',
    reset: 'Сброс',
    'results-matching': 'результатов найдено',
    returns: 'Тип возвращаемого значения',
    route: 'Маршрут',
    routes: 'Маршруты',
    schemas: 'Схемы',
    'search-placeholder': 'Введите для поиска',
    selector: 'Селектор',
    signature: 'Сигнатура',
    source: 'Источник',
    standalone: 'Автономный',
    statements: 'Утверждения',
    styles: 'Стили',
    template: 'Шаблон',
    type: 'Тип',
    'type-aliases': 'Псевдонимы типов',
    'type-parameters': 'Типы параметров',
    types: 'Типы',
    'unamed-property': 'Безымянное свойство',
    'unit-test-coverage': 'Покрытие модульными тестами',
    value: 'Значение',
    variables: 'Переменные',
    yes: 'Да',
    zoomin: 'Приблизить',
    zoomout: 'Отдалить'
};

var TRANSLATION_SK_SK = {
    accessors: 'Modifikátory prístupu',
    arguments: 'Argumenty',
    bootstrap: 'Bootstrap',
    branches: 'Vetvy',
    browse: 'Prezerať',
    classe: 'Trieda',
    classes: 'Triedy',
    component: 'Komponent',
    components: 'Komponenty',
    constructor: 'Konštruktor',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': 'Pokrytie dokumentáciou',
    declarations: 'Deklarácie',
    decorators: 'Dekorátory',
    'default-value': 'Predvolená hodnota',
    'defined-in': 'Definované v',
    dependencies: 'Závislosti',
    deprecated: 'Zastarel',
    description: 'Popis',
    directive: 'Direktíva',
    directives: 'Direktívy',
    'dom tree': 'DOM strom',
    entities: 'Subjektov',
    entity: 'Subjekt',
    entrycomponents: 'EntryComponents',
    enumerations: 'Enumerátory',
    enums: 'Enumerátory',
    example: 'Príklad',
    examples: 'Príklady',
    exports: 'Exporty',
    extends: 'Rozširuje',
    file: 'Súbor',
    functions: 'Funkcie',
    'generated-using': 'Dokumentácia vytvorená pomocou',
    'getting-started': 'Začíname',
    guard: 'Guard',
    guards: 'Guards',
    hostbindings: 'HostBindings',
    hostdirectives: 'HostDirectives',
    hostlisteners: 'HostListeners',
    'html-element': 'HTML element',
    'html-element-with-directive': 'HTML element s direktívou',
    identifier: 'Identifikátor',
    implements: 'Implementuje',
    imports: 'Importuje',
    index: 'Index',
    indexable: 'Indexovateľný',
    info: 'Informácie',
    'inherited-from': 'Zdedené od',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: 'Vstupy',
    interceptors: 'Interceptors',
    interface: 'Rozhranie',
    interfaces: 'Rozhrania',
    legend: 'Legenda',
    license: 'Licencia',
    lines: 'Riadky',
    metadata: 'Metadáta',
    methods: 'Metódy',
    miscellaneous: 'Rôzne',
    module: 'Modul',
    modules: 'Moduly',
    name: 'Názov',
    no: 'Nie',
    'no-graph': 'Nie je k dispozícii žiadny graf.',
    'no-iframe': 'Váš prehliadač nepodporuje iframe',
    'no-result-matching': 'Nenájdené žiadne výsledky pre',
    'no-svg': 'Váš prehliadač nepodporuje SVG',
    optional: 'Voliteľný',
    outputs: 'Výstupy',
    overview: 'Prehľad',
    parameters: 'Parametre',
    'peer-dependencies': 'Peer dependencies',
    pipe: 'Pipe',
    pipes: 'Pipes',
    prefix: 'Prefix',
    properties: 'Vlastnosti',
    providers: 'Providers',
    pure: 'Pure',
    readme: 'README',
    required: 'Požadovaný',
    reset: 'Resetovať',
    'results-matching': 'výsledkov pre',
    returns: 'Návratová hodnota',
    route: 'Route',
    routes: 'Routes',
    schemas: 'Schémy',
    'search-placeholder': 'Zadajte hľadaný text',
    selector: 'Selektor',
    signature: 'Podpis',
    source: 'Zdroj',
    standalone: 'Standalone',
    statements: 'Statements',
    styles: 'Štýly',
    template: 'Šablóna',
    type: 'Typ',
    'type-aliases': 'Type aliases',
    'type-parameters': 'Type parameters',
    types: 'Typy',
    'unamed-property': 'Nepomenovaný atribút',
    'unit-test-coverage': 'Pokrytie unit testami',
    value: 'Hodnota',
    variables: 'Premenné',
    yes: 'Áno',
    zoomin: 'Priblížiť',
    zoomout: 'Oddialiť'
};

var TRANSLATION_ZH_CN = {
    accessors: '存取器',
    arguments: 'Arguments',
    bootstrap: '根组件',
    branches: '分支',
    browse: '查看',
    classe: '类',
    classes: '类列表',
    component: '组件',
    components: '组件列表',
    constructor: '构造方法',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': '文档概览',
    declarations: '可声明对象列表',
    decorators: '装饰器列表',
    'default-value': '缺省值',
    'defined-in': '被定义在',
    dependencies: '依赖项',
    deprecated: '已弃用',
    description: '描述',
    directive: '指令',
    directives: '指令列表',
    'dom tree': 'DOM 树',
    entities: '实体',
    entity: '实体',
    entrycomponents: '入口组件列表',
    enumerations: '列举',
    enums: '枚举列表',
    example: '例子',
    examples: '例子',
    exports: '导出',
    extends: '继承',
    file: '文件',
    functions: '函数',
    'generated-using': '文档生成使用',
    'getting-started': '入门指南',
    guard: '路由守卫',
    guards: '路由守卫列表',
    hostbindings: '宿主绑定',
    hostdirectives: 'Host Directives',
    hostlisteners: '宿主监听',
    'html-element': 'Html 元素',
    'html-element-with-directive': '带指令的Html元素',
    identifier: '标识符',
    implements: '实现',
    imports: '引入',
    index: '索引',
    indexable: 'Indexable',
    info: '信息',
    'inherited-from': '继承自',
    injectable: '可注入的',
    injectables: '可注入的',
    inputs: '输入属性',
    interceptors: '拦截器',
    interface: '接口',
    interfaces: '接口',
    legend: '图例',
    license: '许可协议',
    lines: 'Lines',
    metadata: '元数据',
    methods: '方法',
    miscellaneous: '其他',
    module: '模块',
    modules: '模块列表',
    name: '名称',
    no: '否',
    'no-graph': '无数据显示',
    'no-iframe': '你的浏览器不支持iframes',
    'no-result-matching': '无匹配的结果',
    'no-svg': '你的浏览器不支持SVG',
    optional: '可选的',
    outputs: '输出属性',
    overview: '概述',
    parameters: '参数列表',
    'peer-dependencies': '同级依赖',
    pipe: '管道',
    pipes: '管道列表',
    prefix: '字首',
    properties: '属性列表',
    providers: '提供商列表',
    pure: 'Pure',
    readme: '手册',
    required: '必需的',
    reset: '重置',
    'results-matching': '匹配的结果',
    returns: '返回',
    route: '路由',
    routes: '路由列表',
    schemas: '模式',
    'search-placeholder': '请输入查询关键字',
    selector: '选择器',
    signature: '签名',
    source: '来源',
    standalone: 'Standalone',
    statements: '注释',
    styles: '样式',
    template: '模板',
    type: '类型',
    'type-aliases': '类型别名',
    'type-parameters': '类型参数',
    types: '类型',
    'unamed-property': '未命名属性',
    'unit-test-coverage': '单元测试概览',
    value: '值',
    variables: '变量',
    yes: '是',
    zoomin: '放大',
    zoomout: '缩小'
};

var TRANSLATION_ZH_TW = {
    accessors: '存取器',
    arguments: '參數',
    bootstrap: '根元件',
    branches: '分支',
    browse: '瀏覽',
    classe: '類別',
    classes: '類別',
    component: '元件',
    components: '元件列表',
    constructor: '建構式方法',
    controllers: 'Controllers',
    controller: 'Controller',
    'coverage-page-title': '覆蓋率頁面標題',
    declarations: 'Declarations',
    decorators: '裝飾器列表',
    'default-value': '預設值',
    'defined-in': '被定義在',
    dependencies: '依賴項',
    deprecated: '已棄用',
    description: '描述',
    directive: '指令 (Directive)',
    directives: '指令 (Directives)',
    'dom tree': 'DOM 樹',
    entities: '實體',
    entity: '實體',
    entrycomponents: 'Entrycomponents',
    enumerations: '列舉',
    enums: '枚舉列表',
    example: '範例',
    examples: '範例',
    exports: '匯出',
    extends: '繼承',
    file: '檔案',
    functions: '函數',
    'generated-using': '產生文件使用',
    'getting-started': '快速上手',
    guard: '路由守衛',
    guards: '路由守衛列表',
    hostbindings: 'Host Bindings',
    hostdirectives: 'Host Directives',
    hostlisteners: 'Host Listeners',
    'html-element': 'HTML 元素',
    'html-element-with-directive': '帶指令的 HTML 元素',
    identifier: '識別符號',
    implements: '實作',
    imports: '匯入',
    index: '索引',
    indexable: 'Indexable',
    info: '資訊',
    'inherited-from': '繼承自',
    injectable: 'Injectable',
    injectables: 'Injectables',
    inputs: '輸入屬性',
    interceptors: '攔截器',
    interface: '介面',
    interfaces: '介面',
    legend: '圖例',
    license: '授權協議',
    lines: 'Lines',
    metadata: '元數據',
    methods: '方法',
    miscellaneous: '其他',
    module: '模組',
    modules: '模組列表',
    name: '名稱',
    no: '否',
    'no-graph': '無數據顯示',
    'no-iframe': '你的瀏覽器不支援 iframes',
    'no-result-matching': '無匹配的結果',
    'no-svg': '你的瀏覽器不支援 SVG',
    optional: '可選的',
    outputs: '輸出屬性',
    overview: '概述',
    parameters: '參數列表',
    'peer-dependencies': 'Peer Dependencies',
    pipe: '管道',
    pipes: '管道列表',
    prefix: '前置詞',
    properties: '屬性列表',
    providers: '提供者列表',
    pure: 'Pure',
    readme: 'README',
    required: '必需的',
    reset: '重設',
    'results-matching': '匹配的結果',
    returns: '回傳值',
    route: '路由',
    routes: '路由列表',
    schemas: 'Schemas',
    'search-placeholder': '請輸入查詢關鍵字',
    selector: '選擇器',
    signature: '簽名',
    source: '來源',
    standalone: 'Standalone',
    statements: '陳述式',
    styles: '樣式',
    template: '範本',
    type: '型別',
    'type-aliases': '型別別名',
    'type-parameters': '型別參數',
    types: '型別',
    'unamed-property': '未命名屬性',
    'unit-test-coverage': '單元測試覆蓋率',
    value: '值',
    variables: '變數',
    yes: '是',
    zoomin: '放大',
    zoomout: '縮小'
};

var I18nEngine = /** @class */ (function () {
    function I18nEngine() {
        this.availablesLanguages = {
            'bg-BG': 'bg-BG',
            'de-DE': 'de-DE',
            'en-US': 'en-US',
            'es-ES': 'es-ES',
            'fr-FR': 'fr-FR',
            'hu-HU': 'hu-HU',
            'it-IT': 'it-IT',
            'ja-JP': 'ja-JP',
            'ka-GE': 'ka-GE',
            'ko-KR': 'ko-KR',
            'nl-NL': 'nl-NL',
            'pl-PL': 'pl-PL',
            'pt-BR': 'pt-BR',
            'ru-RU': 'ru-RU',
            'sk-SK': 'sk-SK',
            'zh-CN': 'zh-CN',
            'zh-TW': 'zh-TW'
        };
        this.fallbackLanguage = 'en-US';
    }
    I18nEngine.getInstance = function () {
        if (!I18nEngine.instance) {
            I18nEngine.instance = new I18nEngine();
        }
        return I18nEngine.instance;
    };
    I18nEngine.prototype.init = function (language) {
        i18next.init({
            lng: language,
            fallbackLng: this.fallbackLanguage,
            interpolation: {
                skipOnVariables: false
            }
        });
        i18next.addResources('de-DE', 'translation', TRANSLATION_DE_DE);
        i18next.addResources('en-US', 'translation', TRANSLATION_EN_US);
        i18next.addResources('es-ES', 'translation', TRANSLATION_ES_ES);
        i18next.addResources('fr-FR', 'translation', TRANSLATION_FR_FR);
        i18next.addResources('hu-HU', 'translation', TRANSLATION_HU_HU);
        i18next.addResources('it-IT', 'translation', TRANSLATION_IT_IT);
        i18next.addResources('ja-JP', 'translation', TRANSLATION_JA_JP);
        i18next.addResources('ka-GE', 'translation', TRANSLATION_KA_GE);
        i18next.addResources('ko-KR', 'translation', TRANSLATION_KO_KR);
        i18next.addResources('nl-NL', 'translation', TRANSLATION_NL_NL);
        i18next.addResources('pl-PL', 'translation', TRANSLATION_PL_PL);
        i18next.addResources('pt-BR', 'translation', TRANSLATION_PT_BR);
        i18next.addResources('ru-RU', 'translation', TRANSLATION_RU_RU);
        i18next.addResources('sk-SK', 'translation', TRANSLATION_SK_SK);
        i18next.addResources('zh-CN', 'translation', TRANSLATION_ZH_CN);
        i18next.addResources('zh-TW', 'translation', TRANSLATION_ZH_TW);
    };
    I18nEngine.prototype.translate = function (key) {
        return i18next.t(key);
    };
    I18nEngine.prototype.exists = function (key) {
        return i18next.exists(key);
    };
    I18nEngine.prototype.supportLanguage = function (language) {
        return typeof this.availablesLanguages[language] !== 'undefined';
    };
    return I18nEngine;
}());
var I18nEngine$1 = I18nEngine.getInstance();

var decache$1 = require('decache');
var MarkdownToPDFEngine = /** @class */ (function () {
    function MarkdownToPDFEngine() {
        var _this = this;
        this.convertedTokens = [];
        decache$1('marked');
        var marked = require('marked').marked;
        this.markedInstance = marked;
        var renderer = new this.markedInstance.Renderer();
        renderer.strong = function (text) {
            // console.log('MarkdownToPDFEngine strong: ', text);
            return { text: text, bold: true };
        };
        renderer.em = function (text) {
            // console.log('MarkdownToPDFEngine em: ', text);
            _this.convertedTokens.push({ text: text, italics: true });
            return text;
        };
        renderer.paragraph = function (text) {
            // console.log('MarkdownToPDFEngine paragraph: ', text);
            return text;
        };
        // TODO Add custom parser... -> https://github.com/markedjs/marked/issues/504
        this.markedInstance.setOptions({
            renderer: renderer,
            gfm: true,
            breaks: false
        });
    }
    MarkdownToPDFEngine.getInstance = function () {
        if (!MarkdownToPDFEngine.instance) {
            MarkdownToPDFEngine.instance = new MarkdownToPDFEngine();
        }
        return MarkdownToPDFEngine.instance;
    };
    MarkdownToPDFEngine.prototype.convert = function (stringToConvert) {
        this.convertedTokens = [];
        // console.log('MarkdownToPDFEngine convert: ', stringToConvert);
        var tokens = this.markedInstance.lexer(stringToConvert);
        // console.log(tokens);
        this.markedInstance.Parser.parse(tokens);
        // console.log(this.convertedTokens);
        var result = {
            text: this.convertedTokens
        };
        return result;
    };
    return MarkdownToPDFEngine;
}());
var MarkdownToPdfEngine = MarkdownToPDFEngine.getInstance();

var PdfPrinter = require('pdfmake');
var ExportPdfEngine = /** @class */ (function () {
    function ExportPdfEngine() {
    }
    ExportPdfEngine.getInstance = function () {
        if (!ExportPdfEngine.instance) {
            ExportPdfEngine.instance = new ExportPdfEngine();
        }
        return ExportPdfEngine.instance;
    };
    ExportPdfEngine.prototype.export = function (outputFolder) {
        var fonts = {
            Roboto: {
                normal: path__namespace.join(__dirname, '../src/resources/fonts/roboto-v15-latin-regular.ttf'),
                bold: path__namespace.join(__dirname, '../src/resources/fonts/roboto-v15-latin-700.ttf'),
                italics: path__namespace.join(__dirname, '../src/resources/fonts/roboto-v15-latin-italic.ttf')
            }
        };
        var printer = new PdfPrinter(fonts);
        var docDefinition = {
            info: {
                title: Configuration$1.mainData.documentationMainName
            },
            content: [],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    color: '#008cff',
                    margin: [0, 0, 0, 15]
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                }
            }
        };
        docDefinition.content.push({
            text: Configuration$1.mainData.documentationMainName,
            alignment: 'center',
            bold: true,
            fontSize: 22,
            margin: [10, 350, 10, 270]
        });
        Configuration$1.mainData.hideDarkModeToggle = true;
        if (!Configuration$1.mainData.hideGenerator) {
            docDefinition.content.push({
                text: I18nEngine$1.translate('generated-using'),
                alignment: 'center'
            });
            docDefinition.content.push({
                image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAUgAA/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAEqAAAB+0AAAr7AAAPLf/bAIQAAgEBAQIBAgICAgMCAgIDBAMCAgMEBAMDBAMDBAUEBQUFBQQFBQYHBwcGBQkJCQkJCQwMDAwMDAwMDAwMDAwMDAECAgIEBAQIBQUIDAkICQwODg4ODg4ODAwMDAwODgwMDAwMDA4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgARgBGAwERAAIRAQMRAf/EAOoAAAIDAQEBAQAAAAAAAAAAAAAIBAYHBQIBCQEBAAIDAQEBAAAAAAAAAAAAAAQHAgUGAwgBEAABBAIBAgUDBQAAAAAAAAAEAQIDBQAGByATEBESFBVAMSIhMzUWCBEAAQIDAwcGCwcFAAAAAAAAAQIDERMEABIFITFBUSIyFBAgYUIzFXGBkaHBUmIjcyQG8LFykkM0NdGC4lMWEgABAwMCAwgDAAAAAAAAAAABABECEDESIEHwIQMwQFBRYYGhIrEyExMBAAEDAwMEAwEBAQAAAAAAAREAITFBUWEQcYEg8JGhscHh0UDx/9oADAMBAAIRAxEAAAF/gADn4SvT8nZxgAONlChfvhZsNorWW8per7lk+uou+6bdycPTjZQsBlV/u8XvbBjsER5b6NYHoqX7vT1tjvT8o0Ff2Pkfzx119ujk7juPajxujVWsbqdm1fneTl5Lnts6N2VYtjTNrZXQnX6tf/HqzIsP3G27a7um8sg9rguss5tN7RfZ9IHL0MuNF9fz1k3i5+6pTWPXU5TB7fSZnITco4AFX8NxZ/fT/SISwAS0gFYOmaUdM0o04AA5ZMJAAB//2gAIAQEAAQUC6LO0ACCr7OuKg6Ly8CAC1rZhLEXP9Ib20KPgJYrPb9n5JqK2zELGnGy8vAgApZbm6ude14OvDzkW0Wy2LgnUQ67UuQOP4bKHS90PpT/l6z4zaYTpTtLBqYarORb34/UQiorBwgsMAmc0yaywirl2H+l2tUMWMi2VZZVlmMUN/oLe6+O84DqISrvORuRhqgbSdJtdgtf6/TfDZa1QxY1RUDAibuIyz2PhbUEp9Bzb+Kam0uK+vDFD6LvTNXscRE8sBNFJC8bGHf8A23w26kWVlX8j1mrwQ8iSh6bBsaKMJfQ6tqX8z0XXwvxAntfa9H//2gAIAQIAAQUC6FXyxF6UTFTw9v3EaK5jhwXPa5qouImfbFXwfP8AnG9ytCN9GFCpKnbd6ijyoCgrBhDMld5NhAf3k8BrLtLI+L12FewhiLMDMCcwhk7VXB2frksvlkcfqz0p5ZYV7CGVlY0ZnfXG/bHwIqonS6NF+o//2gAIAQMAAQUC6IYXSOlhcxeiedI0GJSRMr7BBpLG7hmgIsGxua5FTJ50jRVfM8cdI0wARrILaOJk5wPcwQtYl7rfS4OKaJgPY8Kkbuzyt7WPerlxdbkLZHBP6YZlYv4ytliVi0EscWbAYnaypqVnWxsWCs9y/uZDMrFmmWRWU7GsO/dwC7fCyWVz3dA580X1H//aAAgBAgIGPwLtuadMdXIrmmNk4usd1lK/wyyjV64ysoy4ZYyXDELKK5aWpjJeu/gX/9oACAEDAgY/AtGMbppBtLmuZi6aF0ycUc6B05e6I6YZOLpjZZbLFNQBHqHZOaGcLj5Uum3t6vVijKe6EYm9Mpfr+VjG+wX9H+2gCJYojyphfyWUr6frLvH/2gAIAQEBBj8C5i6iqcDTKIXln2jAZrTKZ9D6PWQoKHm5peePw29KjaKdh5Has6ukdHJQYYE358X6iBhBKdlHlMfJYvtLWluibK3k5U5VbKQYfbJZqmKS+qPzN39NJ9PRZDzKw404IoWMxHIXnj8NvSo29Zat1PUQi0tvacV2rulR5KupKb9OpctgkRQUN5B5c9lVKGg27iS5ivho2Uek+OxqaYBFcgeAOAaD06jZVPUJUaUqg+wd5CtYtxk5PC3b87q3bLTV5/04bt32bDh9pw/uFHevf05Kt4GDriZTP43MnmGW1PhrSDOqVIazbKY5z4rNMtiDbKQhseykQHIzD+TPaBGaV7fTqtid3+M93MKs0yajc9Nri8hG4vSDbUoflUm0xv8AuTpBtS4UtSkBlE5xcNiY5kAjrAHns/iUQtukRdaUMomu/wCMeSQxBzEHBspzhsHrK9AsuoqFq4a9GqqjvKV6qen7rd38Ong7lyRoh9tPJcXkI3F6QbHSuEXXPBatxCY4w9VuEqyxF0ZEhSTqAtStKCZ9VGpqFJFyKnd3J+ADkaqws06ifnAnrpGrUbN09O2GmWhBCBzY1dG24v8A27q/zJgeVmoYXMZqEJcZXrQsRBy9HM+pi2zj/wD05fq+CeQX+7uCvAolZZMZW5DavWZp6BGPsfTj2L4ciFUqrbrEtqpnxVmKjNS1EpiTkjmsmsL2MoLtHjbWILfcqShtqlAFGdvIgw3Tps67h4+oDgb3dhxebxPHuRvGqNLf95AxEbniyWIxNvGR9O8XW92NL4w1wR8vw82V8xc7W7e6I9WzDBZxNGJt4VRN4ElsVMlFQlgCDsv3YId7SZ1bVPGIr+859TFa+K4Ph5ypV0/t4S7sBnz6Y82o7xk8BLPF8TdkStN+/sw8Nm5F2TdEm5C5chkuwyQhzf/aAAgBAQMBPyH0Z6rshBiLloU785aMmHj0yIFsHin7afFrBl/IXRNcl2LM5uPCspYSGzxlViaRVDmyy+9XCj8qZlHSRAtg8U/bQcDHCQT9B996PhYLn8oaHTjXpAVJGHyqwgFzqB+CnsQEd/wNsPWiAh2E3CamtfI6+T+Zm2aICD2Gh4e2pg2NkPa7bP8AZ6eROPVnMnhUaumRcBZcC9cUadEXwdEpxDaNiz/7I4iolcRS4WHd8I5inB5R+0blecA9+KNJfD+E1OvYmuVYnJdqEiXCLiSJsJdzogf/AN/qPZGQrTnKrqOVq/4H4Nrn7zN9U3z0cHlH7RuUmzNYNLoDYqLZqOCUMIjipniCRAwYQKb9ATriTGz2MT5yX0OEfD9rq+lzhofnDy0AAQFgMR0NoKogfGg3XoBFCmLOrSEA4Jiuf7Iem5CFda5btRSkCbLpWkJFOob7ZhLsb0PIrbHgSB2bK6VAD0ESMrhDNlySpBYj+SHOlhWNx6f9Tm3jucK/TvW+qI9P/9oACAECAwE/IfQYloXHpkqPotQYipJhS7HbmsCE6SVYVP0BWT7okuaR/wDnrx3O9aR2U/8AG17Tj7nmvkUaj7116TDWc2nz73oQR0Mri+uf5VwL3Z7HPFagNHUfeStip7HH47189zUffzVp0U97p0xzNI5cV2DpqA0dR95Kihd5f5xTNcmnMukyoAg9OTP+j//aAAgBAwMBPyH0DBlVJkuben2Uat6zqdJUikbR23aT5CWS5rO3Fmime/FGkkenso1yL6Co6Z1ehWCxIb3b3OMVGEGe+v8AlAP/AH15/jatQ7q2K31Gu477+9ukj4LvY/3HmmDLSe/HmmOZZ+egRxgnXt/cadr0chZexYN96kBSe/bpgAkGIxaNb9/xV+Semx/Y+OmCh9g/bQUC3scvH5rvhM+/cW6SArjOlIAgvFxeRzS0DKLEDHHRfD9D/lIklenKQbZPh/6P/9oADAMBAAIRAxEAABAADIAAEUBAJBiqBCnAtSQhDBOICAAYiAACASAAAAAf/9oACAEBAwE/EPQ0Vyd+zkJMsfVQdesoiZOQKE19N+ymQOSG4DsB4EgAwvAsJBsGLNnSazPqxJiQhRhiFO2A8prqSQwEZTsrkOxaFkS+XDcilaaaLwEdEwjcbN+l+ymQOSG4DsB4F/Kla5RW91dyt0FGgAJADzdNy3Kq0sJdcSncyDhuqxoE84dVAiw0pb87bALJYAEJ9Bpb/keEZqjTAbw18fXx6szNrNhhV6us10zH5arOVaVBMIYBYLxGIvfoZ4QxCMiWhFqpAFxlFE44KjS7N/jwA6LhRFMkL4jC26U6KoZhIe8+rtHkdS+gAAtMm68neEfic3VPiVFnI7JUfkQsWvwbOEotp8IuIFrwAb7T5HaQLKDEDJ0pB4EgJY9VlM5aE/7WX4QoJ1AMt6ADuUk2e6Z7u3eXS+gAAtMm68neEY8wnlRYKUKYC7QMVsGMcUsbFCZjPn3pgoloNiegCWw7JJLWTiiXDQO+4mD3VWVCqKqqqvpvqGZduIlRWwhxR9jg0AWADoFwg3hQAKgg3uei7zCjSUWEiLmyhHvBcRMAGYuUaGBARTnIrq0yGnW4b7j3EsA4ThUXVFvgEZRh2oooc22B33E/RFmA1gvOm0wSpWIk30fuUn+a9pm1ex9gmi0oiLen/9oACAECAwE/EPRLGAouUJx6XcFI+OgIUh3nvsUZEyhGz++blChhGWr9HO9OAUQj0dwUFBHL0iSDoNhva5T4leJ2oEkr2Tjc8l8gkLOAbPGzpWsbo3T71xF8U4cCxfdW3FvhcwGi6xFl8J/WA8hW7DY80II3WRZTvbnVvQgMHRqFXdn+G/kXsy6bQCRdSsWYfi00nCBc/KNx7CbIJH3dF7r7WjlbCjCXwnhP6cDyENA5JN/ijI05bv8AOhnI/qnqcnetIwiOicIFz8o3HsJsgi5rV3Y0Gg01cuxOxCbTZOyVEXEk3Z++hKcb8/2jQQHpx0v3/wBH/9oACAEDAwE/EPQxWZAReBXMGBrgtIV95OS3pev2NVsft0qU2Pg5NzoKaaY7CshILRJZzenPUxhDlq0XI3pyk5w0ft1jbxQJgSJ0ev2NVsft0rf6wewB996yLXcX/Nj99HC6AGpSTq0aUV84AmHNAtokgQSNqfgAPB2ednw2w/Bv5Fuc7mvetP2zsj3pmbZqVSVf7XvxhLYoTbKu++wfD7ahpLfcw8KKCBR5b2Mdyt5pHJcndUv30NYRlYBpcSGHYwmL0hHLUsZrL7D5vFaH9TRPeGtwD8r/AH89q+CjolTLsFq1gDVhOhC9OPXyoS2xbdQ7uhoFt3Cj6PgwXxjTAMDABgaGVY1TXfkZ/ERaMaEW6aH9TRPeGg5ESgd9+WjJ4iVmuygLeLFDCQSYTELCxLOLbdEMCDe5tHfNizNphs4lsq6/zQCwWLekmOYPyAdwmlVl/wCf/9k=",
                width: 70,
                alignment: 'center',
                pageBreak: 'after'
            });
        }
        docDefinition.content.push({
            toc: {
                title: {
                    text: I18nEngine$1.translate('table-of-contents'),
                    bold: true,
                    alignment: 'center',
                    fontSize: 18,
                    margin: [10, 10, 10, 50]
                },
                numberStyle: {
                    bold: true
                }
            },
            pageBreak: 'after'
        });
        // Add README page if available
        docDefinition.content.push(this.generateMarkdownContent());
        // Add CHANGELOG page if available
        // Add CONTRIBUTING page if available
        // Add LICENSE page if available
        // Add TODO page if available
        // Add Dependencies page if available
        // Add Additional pages if available
        docDefinition.content.push(this.generateModulesContent());
        docDefinition.content.push(this.generateComponentsContent());
        // Classes
        // Injectables
        // Interceptors
        // Guards
        // Interfaces
        // Pipes
        // Miscellaneous
        // Routes
        // Coverage - docDefinition.content.push(...this.coverageEngine.calculateTable());
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        return new Promise(function (resolve, reject) {
            fs__namespace.ensureFile(outputFolder + path__namespace.sep + 'documentation.pdf', function (err) {
                if (err) {
                    reject("Error during pdf generation: ".concat(err));
                }
                else {
                    pdfDoc.pipe(fs__namespace.createWriteStream(outputFolder + path__namespace.sep + 'documentation.pdf'));
                    pdfDoc.end();
                    resolve();
                }
            });
        });
    };
    ExportPdfEngine.prototype.firstCharacterUpperCase = function (sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    };
    ExportPdfEngine.prototype.generateMarkdownContent = function () {
        var _this = this;
        var pages = Configuration$1.markDownPages;
        var data = [];
        pages.forEach(function (page) {
            data.push({
                text: "".concat(_this.firstCharacterUpperCase(page.name)),
                tocItem: true,
                style: 'header'
            });
            var convertedMarkdownObject = MarkdownToPdfEngine.convert(page.data);
            convertedMarkdownObject.margin = [0, 10];
            data.push(convertedMarkdownObject);
        });
        this.insertPageReturn(data);
        return data;
    };
    ExportPdfEngine.prototype.insertPageReturn = function (data) {
        data.push({
            text: " ",
            margin: [0, 0, 0, 20],
            pageBreak: 'after'
        });
    };
    ExportPdfEngine.prototype.generateModulesContent = function () {
        var data = [];
        data.push({
            text: 'Modules',
            tocItem: true,
            style: 'header'
        });
        ___namespace.forEach(Configuration$1.mainData.modules, function (module) {
            data.push({
                text: "".concat(module.name),
                style: 'subheader',
                margin: [0, 15, 0, 15]
            });
            data.push({
                text: [
                    {
                        text: "Filename : ",
                        bold: true
                    },
                    {
                        text: module.file
                    }
                ],
                margin: [0, 10]
            });
            if (module.rawdescription != '') {
                data.push({
                    text: "Description :",
                    bold: true,
                    margin: [0, 10]
                });
                data.push({
                    text: "".concat(module.rawdescription),
                    margin: [0, 5]
                });
            }
            if (module.declarations.length > 0) {
                data.push({
                    text: "Declarations :",
                    bold: true,
                    margin: [0, 10]
                });
                var list_1 = { ul: [] };
                ___namespace.forEach(module.declarations, function (declaration) {
                    list_1.ul.push({
                        text: "".concat(declaration.name)
                    });
                });
                data.push(list_1);
            }
            if (module.providers.length > 0) {
                data.push({
                    text: "Providers :",
                    bold: true,
                    margin: [0, 10]
                });
                var list_2 = { ul: [] };
                ___namespace.forEach(module.providers, function (provider) {
                    list_2.ul.push({
                        text: "".concat(provider.name)
                    });
                });
                data.push(list_2);
            }
            if (module.imports.length > 0) {
                data.push({
                    text: "Imports :",
                    bold: true,
                    margin: [0, 10]
                });
                var list_3 = { ul: [] };
                ___namespace.forEach(module.imports, function (importRef) {
                    list_3.ul.push({
                        text: "".concat(importRef.name)
                    });
                });
                data.push(list_3);
            }
            if (module.exports.length > 0) {
                data.push({
                    text: "Exports :",
                    bold: true,
                    margin: [0, 10]
                });
                var list_4 = { ul: [] };
                ___namespace.forEach(module.exports, function (exportRef) {
                    list_4.ul.push({
                        text: "".concat(exportRef.name)
                    });
                });
                data.push(list_4);
            }
            data.push({
                text: " ",
                margin: [0, 0, 0, 20]
            });
        });
        this.insertPageReturn(data);
        return data;
    };
    ExportPdfEngine.prototype.generateComponentsContent = function () {
        var data = [];
        data.push({
            text: 'Components',
            tocItem: true,
            style: 'header'
        });
        ___namespace.forEach(Configuration$1.mainData.components, function (component) {
            data.push({
                text: "".concat(component.name),
                style: 'subheader',
                margin: [0, 15, 0, 15]
            });
            data.push({
                text: [
                    {
                        text: "Filename : ",
                        bold: true
                    },
                    {
                        text: component.file
                    }
                ],
                margin: [0, 10]
            });
            if (component.rawdescription != '') {
                data.push({
                    text: "Description :",
                    bold: true,
                    margin: [0, 10]
                });
                data.push({
                    text: "".concat(component.rawdescription),
                    margin: [0, 5]
                });
            }
            data.push({
                text: " ",
                margin: [0, 0, 0, 20]
            });
        });
        this.insertPageReturn(data);
        return data;
    };
    return ExportPdfEngine;
}());
var ExportPdfEngine$1 = ExportPdfEngine.getInstance();

var ExportEngine = /** @class */ (function () {
    function ExportEngine() {
    }
    ExportEngine.getInstance = function () {
        if (!ExportEngine.instance) {
            ExportEngine.instance = new ExportEngine();
        }
        return ExportEngine.instance;
    };
    ExportEngine.prototype.export = function (outputFolder, data) {
        switch (Configuration$1.mainData.exportFormat) {
            case 'json':
                return ExportJsonEngine$1.export(outputFolder, data);
            case 'pdf':
                return ExportPdfEngine$1.export(outputFolder);
        }
    };
    return ExportEngine;
}());
var ExportEngine$1 = ExportEngine.getInstance();

var Handlebars$9 = require('handlebars');
var BreakCommaHelper = /** @class */ (function () {
    function BreakCommaHelper(bars) {
        this.bars = bars;
    }
    BreakCommaHelper.prototype.helperFunc = function (context, text) {
        text = this.bars.Utils.escapeExpression(text);
        text = text.replace(/,/g, ',<br>');
        return new Handlebars$9.SafeString(text);
    };
    return BreakCommaHelper;
}());

var Handlebars$8 = require('handlebars');
var BreakLinesHelper = /** @class */ (function () {
    function BreakLinesHelper(bars) {
        this.bars = bars;
    }
    BreakLinesHelper.prototype.helperFunc = function (context, text) {
        text = this.bars.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        text = text.replace(/ /gm, '&nbsp;');
        text = text.replace(/	/gm, '&nbsp;&nbsp;&nbsp;&nbsp;');
        return new Handlebars$8.SafeString(text);
    };
    return BreakLinesHelper;
}());

require('handlebars');
var CapitalizeHelper = /** @class */ (function () {
    function CapitalizeHelper() {
    }
    CapitalizeHelper.prototype.helperFunc = function (context, text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    return CapitalizeHelper;
}());

var Handlebars$7 = require('handlebars');
var CleanParagraphHelper = /** @class */ (function () {
    function CleanParagraphHelper() {
    }
    CleanParagraphHelper.prototype.helperFunc = function (context, text) {
        text = text.replace(/<p>/gm, '');
        text = text.replace(/<\/p>/gm, '');
        return new Handlebars$7.SafeString(text);
    };
    return CleanParagraphHelper;
}());

var CompareHelper = /** @class */ (function () {
    function CompareHelper() {
    }
    CompareHelper.prototype.helperFunc = function (context, a, operator, b, options) {
        if (arguments.length < 4) {
            throw new Error('handlebars Helper {{compare}} expects 4 arguments');
        }
        var result;
        switch (operator) {
            case 'indexof':
                result = b.indexOf(a) !== -1;
                break;
            case '===':
                result = a === b;
                break;
            case '!==':
                result = a !== b;
                break;
            case '>':
                result = a > b;
                break;
            default: {
                throw new Error('helper {{compare}}: invalid operator: `' + operator + '`');
            }
        }
        if (result === false) {
            return options.inverse(context);
        }
        return options.fn(context);
    };
    return CompareHelper;
}());

var DebugHelper = /** @class */ (function () {
    function DebugHelper() {
    }
    DebugHelper.prototype.helperFunc = function (context, optionalValue) {
        console.log('Current Context');
        console.log('====================');
        console.log(context);
        if (optionalValue) {
            console.log('OptionalValue');
            console.log('====================');
            console.log(optionalValue);
        }
    };
    return DebugHelper;
}());

var ElementAloneHelper = /** @class */ (function () {
    function ElementAloneHelper() {
    }
    ElementAloneHelper.prototype.helperFunc = function (context, elements, elementType, options) {
        var alones = [];
        var modules = DependenciesEngine$1.modules;
        elements.forEach(function (element) {
            var foundInOneModule = false;
            modules.forEach(function (module) {
                module.declarations.forEach(function (declaration) {
                    if (declaration.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (declaration.file === element.file) {
                        foundInOneModule = true;
                    }
                });
                module.bootstrap.forEach(function (boostrapedElement) {
                    if (boostrapedElement.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (boostrapedElement.file === element.file) {
                        foundInOneModule = true;
                    }
                });
                module.controllers.forEach(function (controller) {
                    if (controller.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (controller.file === element.file) {
                        foundInOneModule = true;
                    }
                });
                module.providers.forEach(function (provider) {
                    if (provider.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (provider.file === element.file) {
                        foundInOneModule = true;
                    }
                });
            });
            if (!foundInOneModule) {
                alones.push(element);
            }
        });
        if (alones.length > 0) {
            switch (elementType) {
                case 'component':
                    context.components = alones;
                    break;
                case 'directive':
                    context.directives = alones;
                    break;
                case 'controller':
                    context.controllers = alones;
                    break;
                case 'injectable':
                    context.injectables = alones;
                    break;
                case 'pipe':
                    context.pipes = alones;
                    break;
            }
            return options.fn(context);
        }
    };
    return ElementAloneHelper;
}());

var EscapeSimpleQuoteHelper = /** @class */ (function () {
    function EscapeSimpleQuoteHelper() {
    }
    EscapeSimpleQuoteHelper.prototype.helperFunc = function (context, text) {
        if (!text) {
            return;
        }
        text = text.replace(/'/g, "\\'");
        text = text.replace(/(\r\n|\n|\r)/gm, '');
        return text;
    };
    return EscapeSimpleQuoteHelper;
}());

var FilterAngular2ModulesHelper = /** @class */ (function () {
    function FilterAngular2ModulesHelper() {
    }
    FilterAngular2ModulesHelper.prototype.helperFunc = function (context, text, options) {
        var NG2_MODULES = [
            'BrowserModule',
            'FormsModule',
            'HttpModule',
            'RouterModule'
        ];
        var len = NG2_MODULES.length;
        var i = 0;
        var result = false;
        for (i; i < len; i++) {
            if (text.indexOf(NG2_MODULES[i]) > -1) {
                result = true;
            }
        }
        if (result) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return FilterAngular2ModulesHelper;
}());

var AngularVersionUtil = /** @class */ (function () {
    function AngularVersionUtil() {
    }
    AngularVersionUtil.getInstance = function () {
        if (!AngularVersionUtil.instance) {
            AngularVersionUtil.instance = new AngularVersionUtil();
        }
        return AngularVersionUtil.instance;
    };
    AngularVersionUtil.prototype.cleanVersion = function (version) {
        return version
            .replace('~', '')
            .replace('^', '')
            .replace('=', '')
            .replace('<', '')
            .replace('>', '');
    };
    AngularVersionUtil.prototype.getAngularVersionOfProject = function (packageData) {
        var _result = '';
        if (packageData.dependencies) {
            var angularCore = packageData.dependencies[AngularVersionUtil.CorePackage];
            if (angularCore) {
                _result = this.cleanVersion(angularCore);
            }
        }
        return _result;
    };
    AngularVersionUtil.prototype.isAngularVersionArchived = function (version) {
        var result;
        try {
            result = semver__namespace.compare(version, '2.4.10') <= 0;
        }
        catch (e) { }
        return result;
    };
    AngularVersionUtil.prototype.prefixOfficialDoc = function (version) {
        return this.isAngularVersionArchived(version) ? 'v2.' : '';
    };
    AngularVersionUtil.prototype.getApiLink = function (api, angularVersion) {
        var angularDocPrefix = this.prefixOfficialDoc(angularVersion);
        return "https://".concat(angularDocPrefix, "angular.io/").concat(api.path);
    };
    AngularVersionUtil.CorePackage = '@angular/core';
    return AngularVersionUtil;
}());
var AngularVersionUtil$1 = AngularVersionUtil.getInstance();

var BasicTypes;
(function (BasicTypes) {
    BasicTypes[BasicTypes["number"] = 0] = "number";
    BasicTypes[BasicTypes["boolean"] = 1] = "boolean";
    BasicTypes[BasicTypes["string"] = 2] = "string";
    BasicTypes[BasicTypes["object"] = 3] = "object";
    BasicTypes[BasicTypes["date"] = 4] = "date";
    BasicTypes[BasicTypes["function"] = 5] = "function";
})(BasicTypes || (BasicTypes = {}));
var BasicTypeScriptTypes;
(function (BasicTypeScriptTypes) {
    BasicTypeScriptTypes[BasicTypeScriptTypes["any"] = 0] = "any";
    BasicTypeScriptTypes[BasicTypeScriptTypes["void"] = 1] = "void";
})(BasicTypeScriptTypes || (BasicTypeScriptTypes = {}));
var BasicTypeUtil = /** @class */ (function () {
    function BasicTypeUtil() {
    }
    BasicTypeUtil.getInstance = function () {
        if (!BasicTypeUtil.instance) {
            BasicTypeUtil.instance = new BasicTypeUtil();
        }
        return BasicTypeUtil.instance;
    };
    /**
     * Checks if a given types is a basic javascript type
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isJavascriptType = function (type) {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypes;
        }
        else {
            return false;
        }
    };
    /**
     * Checks if a given type is a typescript type (That is not a javascript type)
     * https://www.typescriptlang.org/docs/handbook/basic-types.html
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isTypeScriptType = function (type) {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypeScriptTypes;
        }
        else {
            return false;
        }
    };
    /**
     * Check if the type is a typescript or javascript type
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isKnownType = function (type) {
        return this.isJavascriptType(type) || this.isTypeScriptType(type);
    };
    /**
     * Returns a official documentation link to either the javascript or typescript type
     * @param type The type to check
     * @returns The documentation link or undefined if type not found
     */
    BasicTypeUtil.prototype.getTypeUrl = function (type) {
        if (this.isJavascriptType(type)) {
            return "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/".concat(type);
        }
        if (this.isTypeScriptType(type)) {
            return "https://www.typescriptlang.org/docs/handbook/basic-types.html";
        }
        return undefined;
    };
    return BasicTypeUtil;
}());
var BasicTypeUtil$1 = BasicTypeUtil.getInstance();

var Handlebars$6 = require('handlebars');
var FunctionSignatureHelper = /** @class */ (function () {
    function FunctionSignatureHelper() {
    }
    FunctionSignatureHelper.prototype.handleFunction = function (arg) {
        var _this = this;
        if (arg.function.length === 0) {
            return "".concat(arg.name).concat(this.getOptionalString(arg), ": () => void");
        }
        var argums = arg.function.map(function (argu) {
            var _result = DependenciesEngine$1.find(argu.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path = _result.data.type;
                    if (_result.data.type === 'class') {
                        path = 'classe';
                    }
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"../").concat(path, "s/").concat(_result.data.name, ".html\">").concat(argu.type, "</a>");
                }
                else {
                    var path = AngularVersionUtil$1.getApiLink(_result.data, Configuration$1.mainData.angularVersion);
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(argu.type, "</a>");
                }
            }
            else if (BasicTypeUtil$1.isKnownType(argu.type)) {
                var path = BasicTypeUtil$1.getTypeUrl(argu.type);
                return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(argu.type, "</a>");
            }
            else {
                if (argu.name && argu.type) {
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": ").concat(argu.type);
                }
                else {
                    if (argu.name) {
                        return "".concat(argu.name.text);
                    }
                    else {
                        return '';
                    }
                }
            }
        });
        return "".concat(arg.name).concat(this.getOptionalString(arg), ": (").concat(argums, ") => void");
    };
    FunctionSignatureHelper.prototype.getOptionalString = function (arg) {
        return arg.optional ? '?' : '';
    };
    FunctionSignatureHelper.prototype.helperFunc = function (context, method) {
        var _this = this;
        var args = '';
        var argDestructuredCounterInitial = 0;
        var argDestructuredCounterReal = 0;
        if (method.args) {
            method.args.forEach(function (arg) {
                if (arg.destructuredParameter) {
                    argDestructuredCounterInitial += 1;
                }
            });
            method.args.forEach(function (arg, index) {
                var _result = DependenciesEngine$1.find(arg.type);
                if (arg.destructuredParameter) {
                    if (argDestructuredCounterReal === 0) {
                        args += '__namedParameters: {';
                    }
                    argDestructuredCounterReal += 1;
                }
                if (_result) {
                    if (_result.source === 'internal') {
                        var path = _result.data.type;
                        if (_result.data.type === 'class') {
                            path = 'classe';
                        }
                        args += "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"../").concat(path, "s/").concat(_result.data.name, ".html\" target=\"_self\">").concat(Handlebars$6.escapeExpression(arg.type), "</a>");
                    }
                    else {
                        var path = AngularVersionUtil$1.getApiLink(_result.data, Configuration$1.mainData.angularVersion);
                        args += "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(Handlebars$6.escapeExpression(arg.type), "</a>");
                    }
                }
                else if (arg.dotDotDotToken) {
                    args += "...".concat(arg.name, ": ").concat(arg.type);
                }
                else if (arg.function) {
                    args += _this.handleFunction(arg);
                }
                else if (BasicTypeUtil$1.isKnownType(arg.type)) {
                    var path = BasicTypeUtil$1.getTypeUrl(arg.type);
                    args += "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(Handlebars$6.escapeExpression(arg.type), "</a>");
                }
                else {
                    if (arg.type) {
                        args += "".concat(arg.name).concat(_this.getOptionalString(arg), ": ").concat(arg.type);
                    }
                    else {
                        args += "".concat(arg.name).concat(_this.getOptionalString(arg));
                    }
                }
                if (arg.destructuredParameter) {
                    if (argDestructuredCounterReal === argDestructuredCounterInitial) {
                        args += '}';
                    }
                }
                if (index < method.args.length - 1) {
                    args += ', ';
                }
            });
        }
        if (method.name) {
            return "".concat(method.name, "(").concat(args, ")");
        }
        else {
            return "(".concat(args, ")");
        }
    };
    return FunctionSignatureHelper;
}());

var HasOwnHelper = /** @class */ (function () {
    function HasOwnHelper() {
    }
    HasOwnHelper.prototype.helperFunc = function (context, entity, key, options) {
        if (Object.hasOwnProperty.call(entity, key)) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return HasOwnHelper;
}());

require('handlebars');
var I18nHelper = /** @class */ (function () {
    function I18nHelper() {
    }
    I18nHelper.prototype.helperFunc = function (context, i18n_key) {
        if (I18nEngine$1.exists(i18n_key)) {
            return I18nEngine$1.translate(i18n_key.toLowerCase());
        }
        else {
            return i18n_key;
        }
    };
    return I18nHelper;
}());

var IfStringHelper = /** @class */ (function () {
    function IfStringHelper() {
    }
    IfStringHelper.prototype.helperFunc = function (context, a, options) {
        if (typeof a === 'string') {
            return options.fn(context);
        }
        return options.inverse(context);
    };
    return IfStringHelper;
}());

var IndexableSignatureHelper = /** @class */ (function () {
    function IndexableSignatureHelper() {
    }
    IndexableSignatureHelper.prototype.helperFunc = function (context, method) {
        var args = method.args.map(function (arg) { return "".concat(arg.name, ": ").concat(arg.type); }).join(', ');
        if (method.name) {
            return "".concat(method.name, "[").concat(args, "]");
        }
        else {
            return "[".concat(args, "]");
        }
    };
    return IndexableSignatureHelper;
}());

var IsInitialTabHelper = /** @class */ (function () {
    function IsInitialTabHelper() {
    }
    IsInitialTabHelper.prototype.helperFunc = function (context, tabs, tabId, options) {
        return tabs[0].id === tabId ? options.fn(context) : options.inverse(context);
    };
    return IsInitialTabHelper;
}());

var IsNotToggleHelper = /** @class */ (function () {
    function IsNotToggleHelper() {
    }
    IsNotToggleHelper.prototype.helperFunc = function (context, type, options) {
        var result = Configuration$1.mainData.toggleMenuItems.indexOf(type);
        if (Configuration$1.mainData.toggleMenuItems.indexOf('all') !== -1) {
            return options.inverse(context);
        }
        else if (result !== -1) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return IsNotToggleHelper;
}());

var IsTabEnabledHelper = /** @class */ (function () {
    function IsTabEnabledHelper() {
    }
    IsTabEnabledHelper.prototype.helperFunc = function (context, tabs, tabId, options) {
        var isTabEnabled = -1 !== ___namespace.findIndex(tabs, { id: tabId });
        return isTabEnabled ? options.fn(context) : options.inverse(context);
    };
    return IsTabEnabledHelper;
}());

var JsdocCodeExampleHelper = /** @class */ (function () {
    function JsdocCodeExampleHelper() {
    }
    JsdocCodeExampleHelper.prototype.cleanTag = function (comment) {
        if (comment.charAt(0) === '*') {
            comment = comment.substring(1, comment.length);
        }
        if (comment.charAt(0) === ' ') {
            comment = comment.substring(1, comment.length);
        }
        if (comment.indexOf('<p>') === 0) {
            comment = comment.substring(3, comment.length);
        }
        if (comment.substr(-1) === '\n') {
            comment = comment.substring(0, comment.length - 1);
        }
        if (comment.substr(-4) === '</p>') {
            comment = comment.substring(0, comment.length - 4);
        }
        return comment;
    };
    JsdocCodeExampleHelper.prototype.getHtmlEntities = function (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    JsdocCodeExampleHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var tags = [];
        var type = 'html';
        if (options.hash.type) {
            type = options.hash.type;
        }
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'example') {
                    var tag = {};
                    if (jsdocTags[i].comment) {
                        if (jsdocTags[i].comment.indexOf('<caption>') !== -1) {
                            tag.comment = jsdocTags[i].comment
                                .replace(/<caption>/g, '<b><i>')
                                .replace(/\/caption>/g, '/b></i>');
                        }
                        else {
                            tag.comment =
                                "<pre class=\"line-numbers\"><code class=\"language-".concat(type, "\">") +
                                    this.getHtmlEntities(this.cleanTag(jsdocTags[i].comment)) +
                                    "</code></pre>";
                        }
                        tags.push(tag);
                    }
                }
            }
        }
        if (tags.length > 0) {
            context.tags = tags;
            return options.fn(context);
        }
    };
    return JsdocCodeExampleHelper;
}());

var JsdocDefaultHelper = /** @class */ (function () {
    function JsdocDefaultHelper() {
    }
    JsdocDefaultHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        if (jsdocTags) {
            var i = 0;
            var len = jsdocTags.length;
            var tag = {};
            var defaultValue = false;
            for (i; i < len; i++) {
                if (jsdocTags[i].tagName) {
                    if (jsdocTags[i].tagName.text === 'default') {
                        defaultValue = true;
                        if (jsdocTags[i].typeExpression && jsdocTags[i].typeExpression.type.name) {
                            tag.type = jsdocTags[i].typeExpression.type.name.text;
                        }
                        if (jsdocTags[i].comment) {
                            tag.comment = jsdocTags[i].comment;
                        }
                        if (jsdocTags[i].name) {
                            tag.name = jsdocTags[i].name.text;
                        }
                    }
                }
            }
            if (defaultValue) {
                context.tag = tag;
                return options.fn(context);
            }
        }
    };
    return JsdocDefaultHelper;
}());

var JsdocExampleHelper = /** @class */ (function () {
    function JsdocExampleHelper() {
    }
    JsdocExampleHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var tags = [];
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'example') {
                    var tag = {};
                    if (jsdocTags[i].comment) {
                        tag.comment = jsdocTags[i].comment
                            .replace(/<caption>/g, '<b><i>')
                            .replace(/\/caption>/g, '/b></i>');
                    }
                    tags.push(tag);
                }
            }
        }
        if (tags.length > 0) {
            context.tags = tags;
            return options.fn(context);
        }
    };
    return JsdocExampleHelper;
}());

var JsdocParamsValidHelper = /** @class */ (function () {
    function JsdocParamsValidHelper() {
    }
    JsdocParamsValidHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var valid = false;
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'param') {
                    valid = true;
                }
            }
        }
        if (valid) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return JsdocParamsValidHelper;
}());

var JsdocParamsHelper = /** @class */ (function () {
    function JsdocParamsHelper() {
    }
    JsdocParamsHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var tags = [];
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'param') {
                    var tag = {};
                    if (jsdocTags[i].typeExpression && jsdocTags[i].typeExpression.type.kind) {
                        tag.type = kindToType(jsdocTags[i].typeExpression.type.kind);
                    }
                    if (jsdocTags[i].typeExpression && jsdocTags[i].typeExpression.type.name) {
                        tag.type = jsdocTags[i].typeExpression.type.name.text;
                    }
                    else {
                        tag.type = jsdocTags[i].type;
                    }
                    if (jsdocTags[i].comment) {
                        tag.comment = jsdocTags[i].comment;
                    }
                    if (jsdocTags[i].defaultValue) {
                        tag.defaultValue = jsdocTags[i].defaultValue;
                    }
                    if (jsdocTags[i].name) {
                        if (jsdocTags[i].name.text) {
                            tag.name = jsdocTags[i].name.text;
                        }
                        else {
                            tag.name = jsdocTags[i].name;
                        }
                    }
                    if (jsdocTags[i].optional) {
                        tag.optional = true;
                    }
                    tags.push(tag);
                }
            }
        }
        if (tags.length >= 1) {
            context.tags = tags;
            return options.fn(context);
        }
    };
    return JsdocParamsHelper;
}());

var JsdocReturnsCommentHelper = /** @class */ (function () {
    function JsdocReturnsCommentHelper() {
    }
    JsdocReturnsCommentHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var result;
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'returns' ||
                    jsdocTags[i].tagName.text === 'return') {
                    result = jsdocTags[i].comment;
                    break;
                }
            }
        }
        return result;
    };
    return JsdocReturnsCommentHelper;
}());

var LinkTypeHelper = /** @class */ (function () {
    function LinkTypeHelper() {
    }
    LinkTypeHelper.prototype.helperFunc = function (context, name, options) {
        var _result = DependenciesEngine$1.find(name);
        var angularDocPrefix = AngularVersionUtil$1.prefixOfficialDoc(Configuration$1.mainData.angularVersion);
        if (_result) {
            context.type = {
                raw: name
            };
            if (_result.source === 'internal') {
                if (_result.data.type === 'class') {
                    _result.data.type = 'classe';
                }
                context.type.href = '../' + _result.data.type + 's/' + _result.data.name + '.html';
                if (_result.data.type === 'miscellaneous' ||
                    (_result.data.ctype && _result.data.ctype === 'miscellaneous')) {
                    var mainpage = '';
                    switch (_result.data.subtype) {
                        case 'enum':
                            mainpage = 'enumerations';
                            break;
                        case 'function':
                            mainpage = 'functions';
                            break;
                        case 'typealias':
                            mainpage = 'typealiases';
                            break;
                        case 'variable':
                            mainpage = 'variables';
                    }
                    context.type.href =
                        '../' + _result.data.ctype + '/' + mainpage + '.html#' + _result.data.name;
                }
                context.type.target = '_self';
            }
            else {
                context.type.href = "https://".concat(angularDocPrefix, "angular.io/").concat(_result.data.path);
                context.type.target = '_blank';
            }
            return options.fn(context);
        }
        else if (BasicTypeUtil$1.isKnownType(name)) {
            context.type = {
                raw: name
            };
            context.type.target = '_blank';
            context.type.href = BasicTypeUtil$1.getTypeUrl(name);
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return LinkTypeHelper;
}());

var ModifIconHelper = /** @class */ (function () {
    function ModifIconHelper() {
    }
    ModifIconHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case tsMorph.SyntaxKind.PrivateKeyword:
                _kindText = 'lock'; // private
                break;
            case tsMorph.SyntaxKind.ProtectedKeyword:
                _kindText = 'lock'; // protected
                break;
            case tsMorph.SyntaxKind.StaticKeyword:
                _kindText = 'reset'; // static
                break;
            case tsMorph.SyntaxKind.ExportKeyword:
                _kindText = 'export'; // export
                break;
            default:
                _kindText = 'reset';
                break;
        }
        return _kindText;
    };
    return ModifIconHelper;
}());

var Handlebars$5 = require('handlebars');
var ModifKindHelper = /** @class */ (function () {
    function ModifKindHelper() {
    }
    /**
     * Transform SyntaxKind into string
     * @param  {any}           context Handlebars context
     * @param  {SyntaxKind[]} kind  SyntaxKind concatenated
     * @return {string}                Parsed string
     */
    ModifKindHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case tsMorph.SyntaxKind.PrivateKeyword:
                _kindText = 'Private';
                break;
            case tsMorph.SyntaxKind.ReadonlyKeyword:
                _kindText = 'Readonly';
                break;
            case tsMorph.SyntaxKind.ProtectedKeyword:
                _kindText = 'Protected';
                break;
            case tsMorph.SyntaxKind.PublicKeyword:
                _kindText = 'Public';
                break;
            case tsMorph.SyntaxKind.StaticKeyword:
                _kindText = 'Static';
                break;
            case tsMorph.SyntaxKind.AsyncKeyword:
                _kindText = 'Async';
                break;
            case tsMorph.SyntaxKind.AbstractKeyword:
                _kindText = 'Abstract';
                break;
        }
        return new Handlebars$5.SafeString(_kindText);
    };
    return ModifKindHelper;
}());

var ObjectLengthHelper = /** @class */ (function () {
    function ObjectLengthHelper() {
    }
    ObjectLengthHelper.prototype.helperFunc = function (context, obj, operator, length) {
        var len = arguments.length - 1;
        var options = arguments[len];
        if (typeof obj !== 'object') {
            return options.inverse(context);
        }
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        var result;
        switch (operator) {
            case '===':
                result = size === length;
                break;
            case '!==':
                result = size !== length;
                break;
            case '>':
                result = size > length;
                break;
            default: {
                throw new Error('helper {{objectLength}}: invalid operator: `' + operator + '`');
            }
        }
        if (result === false) {
            return options.inverse(context);
        }
        return options.fn(context);
    };
    return ObjectLengthHelper;
}());

var Handlebars$4 = require('handlebars');
var ObjectHelper = /** @class */ (function () {
    function ObjectHelper() {
    }
    ObjectHelper.prototype.helperFunc = function (context, text) {
        text = JSON.stringify(text);
        text = text.replace(/{"/, '{<br>&nbsp;&nbsp;&nbsp;&nbsp;"');
        text = text.replace(/,"/, ',<br>&nbsp;&nbsp;&nbsp;&nbsp;"');
        text = text.replace(/}$/, '<br>}');
        return new Handlebars$4.SafeString(text);
    };
    return ObjectHelper;
}());

var OneParameterHasHelper = /** @class */ (function () {
    function OneParameterHasHelper() {
    }
    OneParameterHasHelper.prototype.helperFunc = function (context, tags, typeToCheck) {
        var result = false;
        var len = arguments.length - 1;
        var options = arguments[len];
        var i = 0, leng = tags.length;
        for (i; i < leng; i++) {
            if (typeof tags[i][typeToCheck] !== 'undefined' && tags[i][typeToCheck] !== '') {
                result = true;
            }
        }
        if (result) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return OneParameterHasHelper;
}());

var OrLengthHelper = /** @class */ (function () {
    function OrLengthHelper() {
    }
    OrLengthHelper.prototype.helperFunc = function (context /* any, any, ..., options */) {
        var len = arguments.length - 1;
        var options = arguments[len];
        // We start at 1 because of options
        for (var i = 1; i < len; i++) {
            if (typeof arguments[i] !== 'undefined') {
                if (Object.keys(arguments[i]).length > 0) {
                    return options.fn(context);
                }
            }
        }
        return options.inverse(context);
    };
    return OrLengthHelper;
}());

var OrHelper = /** @class */ (function () {
    function OrHelper() {
    }
    OrHelper.prototype.helperFunc = function (context /* any, any, ..., options */) {
        var len = arguments.length - 1;
        var options = arguments[len];
        // We start at 1 because of options
        for (var i = 1; i < len; i++) {
            if (arguments[i]) {
                return options.fn(context);
            }
        }
        return options.inverse(context);
    };
    return OrHelper;
}());

var ParseDescriptionHelper = /** @class */ (function () {
    function ParseDescriptionHelper() {
    }
    ParseDescriptionHelper.prototype.helperFunc = function (context, description, depth) {
        var tagRegExpLight = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExpFull = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExp;
        var matches;
        var previousString;
        tagRegExp = description.indexOf(']{') !== -1 ? tagRegExpFull : tagRegExpLight;
        var processTheLink = function (originalDescription, matchedTag, leadingText) {
            var leading = extractLeadingText(originalDescription, matchedTag.completeTag);
            var split;
            var resultInCompodoc;
            var newLink;
            var rootPath;
            var stringtoReplace;
            var anchor = '';
            var label;
            var pageName;
            split = splitLinkText(matchedTag.text);
            if (typeof split.linkText !== 'undefined') {
                resultInCompodoc = DependenciesEngine$1.findInCompodoc(split.target);
            }
            else {
                var info = matchedTag.text;
                if (matchedTag.text.indexOf('#') !== -1) {
                    anchor = matchedTag.text.substr(matchedTag.text.indexOf('#'), matchedTag.text.length);
                    info = matchedTag.text.substr(0, matchedTag.text.indexOf('#'));
                }
                resultInCompodoc = DependenciesEngine$1.findInCompodoc(info);
            }
            if (resultInCompodoc) {
                label = resultInCompodoc.name;
                pageName = resultInCompodoc.name;
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                if (resultInCompodoc.type === 'class') {
                    resultInCompodoc.type = 'classes';
                }
                else if (resultInCompodoc.type === 'miscellaneous' ||
                    (resultInCompodoc.ctype && resultInCompodoc.ctype === 'miscellaneous')) {
                    resultInCompodoc.type = 'miscellaneous'; // Not a typo, it is for matching other single types : component, module etc
                    label = resultInCompodoc.name;
                    anchor = '#' + resultInCompodoc.name;
                    if (resultInCompodoc.subtype === 'enum') {
                        pageName = 'enumerations';
                    }
                    else if (resultInCompodoc.subtype === 'function') {
                        pageName = 'functions';
                    }
                    else if (resultInCompodoc.subtype === 'typealias') {
                        pageName = 'typealiases';
                    }
                    else if (resultInCompodoc.subtype === 'variable') {
                        pageName = 'variables';
                    }
                }
                rootPath = '';
                switch (depth) {
                    case 0:
                        rootPath = './';
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        rootPath = '../'.repeat(depth);
                        break;
                }
                if (leading.leadingText !== undefined) {
                    label = leading.leadingText;
                }
                if (typeof split.linkText !== 'undefined') {
                    label = split.linkText;
                }
                if (resultInCompodoc.type === 'miscellaneous' ||
                    resultInCompodoc.type === 'classes') {
                    newLink = "<a href=\"".concat(rootPath).concat(resultInCompodoc.type, "/").concat(pageName, ".html").concat(anchor, "\">").concat(label, "</a>");
                }
                else {
                    newLink = "<a href=\"".concat(rootPath).concat(resultInCompodoc.type, "s/").concat(pageName, ".html").concat(anchor, "\">").concat(label, "</a>");
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && typeof split.linkText !== 'undefined') {
                newLink = "<a href=\"".concat(split.target, "\">").concat(split.linkText, "</a>");
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && leading && typeof leading.leadingText !== 'undefined') {
                newLink = "<a href=\"".concat(split.target, "\">").concat(leading.leadingText, "</a>");
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && typeof split.linkText === 'undefined') {
                newLink = "<a href=\"".concat(split.target, "\">").concat(split.target, "</a>");
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else {
                return originalDescription;
            }
        };
        function replaceMatch(replacer, tag, match, text, linkText) {
            var matchedTag = {
                completeTag: match,
                tag: tag,
                text: text
            };
            if (linkText) {
                return replacer(description, matchedTag, linkText);
            }
            else {
                return replacer(description, matchedTag);
            }
        }
        // Clean description for marked a tag parsed too early
        if (description.indexOf('href=') !== -1) {
            var insideMarkedATagResults = description.match(/<a [^>]+>([^<]+)<\/a>/g);
            if (insideMarkedATagResults && insideMarkedATagResults.length > 0) {
                for (var i = 0; i < insideMarkedATagResults.length; i++) {
                    var markedATagRegExp = new RegExp('<a [^>]+>([^<]+)</a>', 'gm');
                    var parsedATag = markedATagRegExp.exec(description);
                    if (parsedATag && parsedATag.length === 2) {
                        var insideMarkedATag = parsedATag[1];
                        description = description.replace("{@link <a href=\"".concat(encodeURI(insideMarkedATag), "\">").concat(insideMarkedATag, "</a>"), "{@link ".concat(insideMarkedATag));
                    }
                }
            }
        }
        do {
            matches = tagRegExp.exec(description);
            // Did we have {@link ?
            if (matches) {
                previousString = description;
                if (matches.length === 2) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[1]);
                }
                if (matches.length === 3) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[2], matches[1]);
                }
            }
        } while (matches && previousString !== description);
        return description;
    };
    return ParseDescriptionHelper;
}());

require('handlebars');
var ParsePropertyHelper = /** @class */ (function () {
    function ParsePropertyHelper() {
    }
    ParsePropertyHelper.prototype.helperFunc = function (context, text) {
        var prop = text;
        if (!!text && text.constructor === Object && text['url'] !== undefined) {
            prop = text['url'];
        }
        if (!!text && text.constructor === Object && text['name'] !== undefined) {
            prop = text['name'];
        }
        if (!!text && text.constructor === Object && Object.keys(text).length === 0) {
            prop = '';
        }
        if (prop instanceof String && prop !== '' && prop.indexOf('https') !== -1) {
            return "<a href=\"".concat(prop, "\" target=\"_blank\">").concat(prop, "</a>");
        }
        else if (prop !== '' && prop instanceof Array && prop.length > 0) {
            prop = JSON.stringify(prop);
            prop = prop.replace(/","/g, ', ');
            prop = prop.replace(/\["/g, '');
            prop = prop.replace(/"]/g, '');
            return prop;
        }
        else {
            return prop;
        }
    };
    return ParsePropertyHelper;
}());

var RelativeURLHelper = /** @class */ (function () {
    function RelativeURLHelper() {
    }
    RelativeURLHelper.prototype.helperFunc = function (context, currentDepth, options) {
        switch (currentDepth) {
            case 0:
                return './';
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return '../'.repeat(currentDepth);
        }
        return '';
    };
    return RelativeURLHelper;
}());

var ShortURLHelper = /** @class */ (function () {
    function ShortURLHelper() {
    }
    ShortURLHelper.prototype.helperFunc = function (context, url, options) {
        var newUrl = url;
        var firstIndexOfSlash = newUrl.indexOf('/');
        var lastIndexOfSlash = newUrl.lastIndexOf('/');
        if (firstIndexOfSlash !== -1 || lastIndexOfSlash !== -1) {
            newUrl =
                newUrl.substr(0, firstIndexOfSlash + 1) +
                    '...' +
                    newUrl.substr(lastIndexOfSlash, newUrl.length);
        }
        return newUrl;
    };
    return ShortURLHelper;
}());

var StripURLHelper = /** @class */ (function () {
    function StripURLHelper() {
    }
    StripURLHelper.prototype.helperFunc = function (context, prefix, url, options) {
        return prefix + url.split("/").pop();
    };
    return StripURLHelper;
}());

var Handlebars$3 = require('handlebars');
var HtmlEngineHelpers = /** @class */ (function () {
    function HtmlEngineHelpers() {
    }
    HtmlEngineHelpers.prototype.registerHelpers = function (bars) {
        this.registerHelper(bars, 'compare', new CompareHelper());
        this.registerHelper(bars, 'or', new OrHelper());
        this.registerHelper(bars, 'functionSignature', new FunctionSignatureHelper());
        this.registerHelper(bars, 'isNotToggle', new IsNotToggleHelper());
        this.registerHelper(bars, 'isInitialTab', new IsInitialTabHelper());
        this.registerHelper(bars, 'isTabEnabled', new IsTabEnabledHelper());
        this.registerHelper(bars, 'ifString', new IfStringHelper());
        this.registerHelper(bars, 'orLength', new OrLengthHelper());
        this.registerHelper(bars, 'filterAngular2Modules', new FilterAngular2ModulesHelper());
        this.registerHelper(bars, 'debug', new DebugHelper());
        this.registerHelper(bars, 'breaklines', new BreakLinesHelper(bars));
        this.registerHelper(bars, 'clean-paragraph', new CleanParagraphHelper());
        this.registerHelper(bars, 'escapeSimpleQuote', new EscapeSimpleQuoteHelper());
        this.registerHelper(bars, 'breakComma', new BreakCommaHelper(bars));
        this.registerHelper(bars, 'modifKind', new ModifKindHelper());
        this.registerHelper(bars, 'modifIcon', new ModifIconHelper());
        this.registerHelper(bars, 'relativeURL', new RelativeURLHelper());
        this.registerHelper(bars, 'jsdoc-returns-comment', new JsdocReturnsCommentHelper());
        this.registerHelper(bars, 'jsdoc-code-example', new JsdocCodeExampleHelper());
        this.registerHelper(bars, 'jsdoc-example', new JsdocExampleHelper());
        this.registerHelper(bars, 'jsdoc-params', new JsdocParamsHelper());
        this.registerHelper(bars, 'jsdoc-params-valid', new JsdocParamsValidHelper());
        this.registerHelper(bars, 'jsdoc-default', new JsdocDefaultHelper());
        this.registerHelper(bars, 'linkType', new LinkTypeHelper());
        this.registerHelper(bars, 'indexableSignature', new IndexableSignatureHelper());
        this.registerHelper(bars, 'object', new ObjectHelper());
        this.registerHelper(bars, 'objectLength', new ObjectLengthHelper());
        this.registerHelper(bars, 'parseDescription', new ParseDescriptionHelper());
        this.registerHelper(bars, 'one-parameter-has', new OneParameterHasHelper());
        this.registerHelper(bars, 'element-alone', new ElementAloneHelper());
        this.registerHelper(bars, 'hasOwn', new HasOwnHelper());
        this.registerHelper(bars, 'short-url', new ShortURLHelper());
        this.registerHelper(bars, 'strip-url', new StripURLHelper());
        this.registerHelper(bars, 't', new I18nHelper());
        this.registerHelper(bars, 'capitalize', new CapitalizeHelper());
        this.registerHelper(bars, 'parse-property', new ParsePropertyHelper());
    };
    HtmlEngineHelpers.prototype.registerHelper = function (bars, key, helper) {
        Handlebars$3.registerHelper(key, function () {
            // tslint:disable-next-line:no-invalid-this
            return helper.helperFunc.apply(helper, __spreadArray([this], __read(___namespace.slice(arguments)), false));
        });
    };
    return HtmlEngineHelpers;
}());

var Handlebars$2 = require('handlebars');
var HtmlEngine = /** @class */ (function () {
    function HtmlEngine() {
        this.cache = {};
        var helper = new HtmlEngineHelpers();
        helper.registerHelpers(Handlebars$2);
    }
    HtmlEngine.getInstance = function () {
        if (!HtmlEngine.instance) {
            HtmlEngine.instance = new HtmlEngine();
        }
        return HtmlEngine.instance;
    };
    HtmlEngine.prototype.init = function (templatePath) {
        var _this = this;
        var partials = [
            'overview',
            'markdown',
            'modules',
            'module',
            'component',
            'controller',
            'entity',
            'component-detail',
            'directive',
            'injectable',
            'interceptor',
            'guard',
            'pipe',
            'class',
            'interface',
            'routes',
            'index',
            'index-misc',
            'search-results',
            'search-input',
            'link-type',
            'block-method',
            'block-host-listener',
            'block-enum',
            'block-property',
            'block-index',
            'block-constructor',
            'block-typealias',
            'block-accessors',
            'block-input',
            'block-output',
            'coverage-report',
            'unit-test-report',
            'miscellaneous-functions',
            'miscellaneous-variables',
            'miscellaneous-typealiases',
            'miscellaneous-enumerations',
            'additional-page',
            'package-dependencies',
            'package-properties'
        ];
        if (templatePath) {
            if (FileEngine$1.existsSync(path__namespace.resolve(process.cwd() + path__namespace.sep + templatePath)) ===
                false) {
                logger.warn('Template path specificed but does not exist...using default templates');
            }
        }
        return Promise.all(partials.map(function (partial) {
            var partialPath = _this.determineTemplatePath(templatePath, 'partials/' + partial + '.hbs');
            return FileEngine$1.get(partialPath).then(function (data) {
                return Handlebars$2.registerPartial(partial, data);
            });
        }))
            .then(function () {
            var pagePath = _this.determineTemplatePath(templatePath, 'page.hbs');
            return FileEngine$1.get(pagePath).then(function (data) {
                _this.cache.page = data;
                _this.compiledPage = Handlebars$2.compile(_this.cache.page, {
                    preventIndent: true,
                    strict: true
                });
            });
        })
            .then(function () {
            var menuPath = _this.determineTemplatePath(templatePath, 'partials/menu.hbs');
            return FileEngine$1.get(menuPath).then(function (menuTemplate) {
                _this.precompiledMenu = Handlebars$2.compile(menuTemplate, {
                    preventIndent: true,
                    strict: true
                });
            });
        });
    };
    HtmlEngine.prototype.renderMenu = function (templatePath, data) {
        var menuPath = this.determineTemplatePath(templatePath, 'partials/menu.hbs');
        return FileEngine$1.get(menuPath).then(function (menuTemplate) {
            data.menu = 'normal';
            return Handlebars$2.compile(menuTemplate, {
                preventIndent: true,
                strict: true
            })(__assign({}, data));
        });
    };
    HtmlEngine.prototype.render = function (mainData, page) {
        var o = mainData;
        Object.assign(o, page);
        // let mem = process.memoryUsage();
        // console.log(`heapTotal: ${mem.heapTotal} | heapUsed: ${mem.heapUsed}`);
        return this.compiledPage({
            data: o
        });
    };
    HtmlEngine.prototype.determineTemplatePath = function (templatePath, filePath) {
        var outPath = path__namespace.resolve(__dirname + '/../src/templates/' + filePath);
        if (templatePath) {
            var testPath = path__namespace.resolve(process.cwd() + path__namespace.sep + templatePath + path__namespace.sep + filePath);
            outPath = FileEngine$1.existsSync(testPath) ? testPath : outPath;
        }
        return outPath;
    };
    HtmlEngine.prototype.generateCoverageBadge = function (outputFolder, label, coverageData) {
        return FileEngine$1.get(path__namespace.resolve(__dirname + '/../src/templates/partials/coverage-badge.hbs')).then(function (data) {
            var template = Handlebars$2.compile(data);
            coverageData.label = label;
            var result = template({
                data: coverageData
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (testOutputDir && testOutputDir.length > 0) {
                outputFolder = outputFolder.replace(process.cwd() + path__namespace.sep, '');
            }
            return FileEngine$1.write(outputFolder + path__namespace.sep + '/images/coverage-badge-' + label + '.svg', result).catch(function (err) {
                logger.error('Error during coverage badge ' + label + ' file generation ', err);
                return Promise.reject(err);
            });
        }, function (err) { return Promise.reject('Error during coverage badge generation'); });
    };
    return HtmlEngine;
}());
var HtmlEngine$1 = HtmlEngine.getInstance();

var decache = require('decache');
var MarkdownEngine = /** @class */ (function () {
    function MarkdownEngine() {
        var _this = this;
        /**
         * List of markdown files without .md extension
         */
        this.markdownFiles = ['README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING', 'TODO'];
        decache('marked');
        this.markedInstance = markedAcl;
        var renderer = new this.markedInstance.Renderer();
        renderer.code = function (code, language) {
            var highlighted = code;
            if (!language) {
                language = 'none';
            }
            highlighted = _this.escape(code);
            return "<b>".concat(I18nEngine$1.translate('example'), " :</b><div><pre class=\"line-numbers\"><code class=\"language-").concat(language, "\">").concat(highlighted, "</code></pre></div>");
        };
        renderer.table = function (header, body) {
            return ('<table class="table table-bordered compodoc-table">\n' +
                '<thead>\n' +
                header +
                '</thead>\n' +
                '<tbody>\n' +
                body +
                '</tbody>\n' +
                '</table>\n');
        };
        renderer.image = function (href, title, text) {
            var out = '<img src="' + href + '" alt="' + text + '" class="img-responsive"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>';
            return out;
        };
        this.markedInstance.setOptions({
            renderer: renderer,
            gfm: true,
            breaks: false
        });
    }
    MarkdownEngine.getInstance = function () {
        if (!MarkdownEngine.instance) {
            MarkdownEngine.instance = new MarkdownEngine();
        }
        return MarkdownEngine.instance;
    };
    MarkdownEngine.prototype.getTraditionalMarkdown = function (filepath) {
        var _this = this;
        return FileEngine$1.get(process.cwd() + path__namespace.sep + filepath + '.md')
            .catch(function (err) { return FileEngine$1.get(process.cwd() + path__namespace.sep + filepath).then(); })
            .then(function (data) {
            var returnedData = {
                markdown: _this.markedInstance(data),
                rawData: data
            };
            return returnedData;
        });
    };
    MarkdownEngine.prototype.getTraditionalMarkdownSync = function (filepath) {
        return this.markedInstance(FileEngine$1.getSync(process.cwd() + path__namespace.sep + filepath));
    };
    MarkdownEngine.prototype.getReadmeFile = function () {
        var _this = this;
        return FileEngine$1.get(process.cwd() + path__namespace.sep + 'README.md').then(function (data) {
            return _this.markedInstance(data);
        });
    };
    MarkdownEngine.prototype.readNeighbourReadmeFile = function (file) {
        var dirname = path__namespace.dirname(file);
        var readmeFile = dirname + path__namespace.sep + path__namespace.basename(file, '.ts') + '.md';
        return fs__namespace.readFileSync(readmeFile, 'utf8');
    };
    MarkdownEngine.prototype.hasNeighbourReadmeFile = function (file) {
        var dirname = path__namespace.dirname(file);
        var readmeFile = dirname + path__namespace.sep + path__namespace.basename(file, '.ts') + '.md';
        return FileEngine$1.existsSync(readmeFile);
    };
    MarkdownEngine.prototype.componentReadmeFile = function (file) {
        var dirname = path__namespace.dirname(file);
        var readmeFile = dirname + path__namespace.sep + 'README.md';
        var readmeAlternativeFile = dirname + path__namespace.sep + path__namespace.basename(file, '.ts') + '.md';
        var finalPath = '';
        if (FileEngine$1.existsSync(readmeFile)) {
            finalPath = readmeFile;
        }
        else {
            finalPath = readmeAlternativeFile;
        }
        return finalPath;
    };
    /**
     * Checks if any of the markdown files is exists with or without endings
     */
    MarkdownEngine.prototype.hasRootMarkdowns = function () {
        return this.addEndings(this.markdownFiles).some(function (x) {
            return FileEngine$1.existsSync(process.cwd() + path__namespace.sep + x);
        });
    };
    MarkdownEngine.prototype.listRootMarkdowns = function () {
        var foundFiles = this.markdownFiles.filter(function (x) {
            return FileEngine$1.existsSync(process.cwd() + path__namespace.sep + x + '.md') ||
                FileEngine$1.existsSync(process.cwd() + path__namespace.sep + x);
        });
        return this.addEndings(foundFiles);
    };
    MarkdownEngine.prototype.escape = function (html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/@/g, '&#64;');
    };
    /**
     * ['README'] => ['README', 'README.md']
     */
    MarkdownEngine.prototype.addEndings = function (files) {
        return ___namespace.flatMap(files, function (x) { return [x, x + '.md']; });
    };
    return MarkdownEngine;
}());
var MarkdownEngine$1 = MarkdownEngine.getInstance();

var ngdT = require('@compodoc/ngd-transformer');
var NgdEngine = /** @class */ (function () {
    function NgdEngine() {
    }
    NgdEngine.getInstance = function () {
        if (!NgdEngine.instance) {
            NgdEngine.instance = new NgdEngine();
        }
        return NgdEngine.instance;
    };
    NgdEngine.prototype.init = function (outputpath) {
        this.engine = new ngdT.DotEngine({
            output: outputpath,
            displayLegend: true,
            outputFormats: 'svg',
            silent: true
        });
    };
    NgdEngine.prototype.renderGraph = function (filepath, outputpath, type, name) {
        this.engine.updateOutput(outputpath);
        if (type === 'f') {
            return this.engine.generateGraph([DependenciesEngine$1.getRawModule(name)]);
        }
        else {
            return this.engine.generateGraph(DependenciesEngine$1.rawModulesForOverview);
        }
    };
    NgdEngine.prototype.readGraph = function (filepath, name) {
        return FileEngine$1.get(filepath).catch(function (err) {
            return Promise.reject('Error during graph read ' + name);
        });
    };
    return NgdEngine;
}());
var NgdEngine$1 = NgdEngine.getInstance();

var COMPODOC_CONSTANTS = {
    navTabDefinitions: [
        {
            id: 'info',
            href: '#info',
            'data-link': 'info',
            label: 'Info',
            depTypes: ['all']
        },
        {
            id: 'readme',
            href: '#readme',
            'data-link': 'readme',
            label: 'README',
            depTypes: ['all']
        },
        {
            id: 'source',
            href: '#source',
            'data-link': 'source',
            label: 'Source',
            depTypes: ['all']
        },
        {
            id: 'templateData',
            href: '#templateData',
            'data-link': 'template',
            label: 'Template',
            depTypes: ['component']
        },
        {
            id: 'styleData',
            href: '#styleData',
            'data-link': 'style',
            label: 'Styles',
            depTypes: ['component']
        },
        {
            id: 'tree',
            href: '#tree',
            'data-link': 'dom-tree',
            label: 'DOM Tree',
            depTypes: ['component']
        },
        {
            id: 'example',
            href: '#example',
            'data-link': 'example',
            label: 'Examples',
            depTypes: ['component', 'directive', 'injectable', 'pipe']
        }
    ]
};
/**
 * Max length for the string of a file during Lunr search engine indexing.
 * Prevent stack size exceeded
 */
var MAX_SIZE_FILE_SEARCH_INDEX = 50000;
/**
 * Max length for the string of a file during cheerio parsing.
 * Prevent stack size exceeded
 */
var MAX_SIZE_FILE_CHEERIO_PARSING = 400000000;

var Handlebars$1 = require('handlebars');
var lunr = require('lunr');
var cheerio = require('cheerio');
var SearchEngine = /** @class */ (function () {
    function SearchEngine() {
        this.searchDocuments = [];
        this.documentsStore = {};
        this.amountOfMemory = 0;
    }
    SearchEngine.getInstance = function () {
        if (!SearchEngine.instance) {
            SearchEngine.instance = new SearchEngine();
        }
        return SearchEngine.instance;
    };
    SearchEngine.prototype.indexPage = function (page) {
        var text;
        this.amountOfMemory += page.rawData.length;
        if (this.amountOfMemory < MAX_SIZE_FILE_CHEERIO_PARSING) {
            var indexStartContent = page.rawData.indexOf('<!-- START CONTENT -->');
            var indexEndContent = page.rawData.indexOf('<!-- END CONTENT -->');
            var $ = cheerio.load(page.rawData.substring(indexStartContent + 1, indexEndContent));
            text = $('.content').html();
            text = htmlEntities.decode(text);
            text = text.replace(/(<([^>]+)>)/gi, '');
            page.url = page.url.replace(Configuration$1.mainData.output, '');
            var doc = {
                url: page.url,
                title: page.infos.context + ' - ' + page.infos.name,
                body: text
            };
            if (!this.documentsStore.hasOwnProperty(doc.url) &&
                doc.body.length < MAX_SIZE_FILE_SEARCH_INDEX) {
                this.documentsStore[doc.url] = doc;
                this.searchDocuments.push(doc);
            }
        }
    };
    SearchEngine.prototype.generateSearchIndexJson = function (outputFolder) {
        var _this = this;
        var that = this;
        var searchIndex = lunr(function () {
            /* tslint:disable:no-invalid-this */
            this.ref('url');
            this.field('title');
            this.field('body');
            this.pipeline.remove(lunr.stemmer);
            var i = 0;
            var len = that.searchDocuments.length;
            for (i; i < len; i++) {
                this.add(that.searchDocuments[i]);
            }
        });
        return FileEngine$1.get(__dirname + '/../src/templates/partials/search-index.hbs').then(function (data) {
            var template = Handlebars$1.compile(data);
            var result = template({
                index: JSON.stringify(searchIndex),
                store: JSON.stringify(_this.documentsStore)
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (testOutputDir && testOutputDir.length > 0) {
                outputFolder = outputFolder.replace(process.cwd() + path__namespace.sep, '');
            }
            return FileEngine$1.write(outputFolder + path__namespace.sep + '/js/search/search_index.js', result).catch(function (err) {
                logger.error('Error during search index file generation ', err);
                return Promise.reject(err);
            });
        }, function (err) { return Promise.reject('Error during search index generation'); });
    };
    return SearchEngine;
}());
var SearchEngine$1 = SearchEngine.getInstance();

var $ = require('cheerio');
var ComponentsTreeEngine = /** @class */ (function () {
    function ComponentsTreeEngine() {
        this.components = [];
        this.componentsForTree = [];
    }
    ComponentsTreeEngine.getInstance = function () {
        if (!ComponentsTreeEngine.instance) {
            ComponentsTreeEngine.instance = new ComponentsTreeEngine();
        }
        return ComponentsTreeEngine.instance;
    };
    ComponentsTreeEngine.prototype.addComponent = function (component) {
        this.components.push(component);
    };
    ComponentsTreeEngine.prototype.readTemplates = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = _this.componentsForTree.length;
            var loop = function () {
                if (i <= len - 1) {
                    if (_this.componentsForTree[i].templateUrl) {
                        var filePath = process.cwd() +
                            path__namespace.sep +
                            path__namespace.dirname(_this.componentsForTree[i].file) +
                            path__namespace.sep +
                            _this.componentsForTree[i].templateUrl;
                        FileEngine$1.get(filePath).then(function (templateData) {
                            _this.componentsForTree[i].templateData = templateData;
                            i++;
                            loop();
                        }, function (e) {
                            logger.error(e);
                            reject();
                        });
                    }
                    else {
                        _this.componentsForTree[i].templateData = _this.componentsForTree[i].template;
                        i++;
                        loop();
                    }
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    ComponentsTreeEngine.prototype.findChildrenAndParents = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ___namespace.forEach(_this.componentsForTree, function (component) {
                var $component = $(component.templateData);
                ___namespace.forEach(_this.componentsForTree, function (componentToFind) {
                    if ($component.find(componentToFind.selector).length > 0) {
                        console.log(componentToFind.name + ' found in ' + component.name);
                        component.children.push(componentToFind.name);
                    }
                });
            });
            resolve();
        });
    };
    ComponentsTreeEngine.prototype.createTreesForComponents = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ___namespace.forEach(_this.components, function (component) {
                var _component = {
                    name: component.name,
                    file: component.file,
                    selector: component.selector,
                    children: [],
                    template: '',
                    templateUrl: ''
                };
                if (typeof component.template !== 'undefined') {
                    _component.template = component.template;
                }
                if (component.templateUrl.length > 0) {
                    _component.templateUrl = component.templateUrl[0];
                }
                _this.componentsForTree.push(_component);
            });
            _this.readTemplates().then(function () {
                _this.findChildrenAndParents().then(function () {
                    // console.log('this.componentsForTree: ', this.componentsForTree);
                    resolve();
                }, function (e) {
                    logger.error(e);
                    reject();
                });
            }, function (e) {
                logger.error(e);
            });
        });
    };
    return ComponentsTreeEngine;
}());
var ComponentsTreeEngine$1 = ComponentsTreeEngine.getInstance();

var ast$1 = new tsMorph.Project();
var ImportsUtil = /** @class */ (function () {
    function ImportsUtil() {
    }
    ImportsUtil.getInstance = function () {
        if (!ImportsUtil.instance) {
            ImportsUtil.instance = new ImportsUtil();
        }
        return ImportsUtil.instance;
    };
    /**
     * Find for a sourceFile a variable value in a local enum
     * @param srcFile
     * @param variableName
     * @param variableValue
     */
    ImportsUtil.prototype.findInEnums = function (srcFile, variableName, variableValue) {
        var res = '';
        srcFile.getEnum(function (e) {
            if (e.getName() === variableName) {
                e.getMember(function (m) {
                    if (m.getName() === variableValue) {
                        res = m.getValue();
                    }
                });
            }
        });
        return res;
    };
    /**
     * Find for a sourceFile a variable value in a local static class
     * @param srcFile
     * @param variableName
     * @param variableValue
     */
    ImportsUtil.prototype.findInClasses = function (srcFile, variableName, variableValue) {
        var res = '';
        srcFile.getClass(function (c) {
            var staticProperty = c.getStaticProperty(variableValue);
            if (staticProperty) {
                if (staticProperty.getInitializer()) {
                    res = staticProperty.getInitializer().getText();
                }
            }
        });
        return res;
    };
    /**
     * Find a value in a local variable declaration like an object
     * @param variableDeclaration
     * @param variablesAttributes
     */
    ImportsUtil.prototype.findInObjectVariableDeclaration = function (variableDeclaration, variablesAttributes) {
        var variableKind = variableDeclaration.getKind();
        if (variableKind && variableKind === tsMorph.SyntaxKind.VariableDeclaration) {
            var initializer = variableDeclaration.getInitializer();
            if (initializer) {
                var initializerKind = initializer.getKind();
                if (initializerKind && initializerKind === tsMorph.SyntaxKind.ObjectLiteralExpression) {
                    var compilerNode = initializer.compilerNode, finalValue_1 = '';
                    // Find thestring from AVAR.BVAR.thestring inside properties
                    var depth_1 = 0;
                    var loopProperties_1 = function (properties) {
                        properties.forEach(function (prop) {
                            if (prop.name) {
                                if (variablesAttributes[depth_1 + 1]) {
                                    if (prop.name.getText() === variablesAttributes[depth_1 + 1]) {
                                        if (prop.initializer) {
                                            if (prop.initializer.properties) {
                                                depth_1 += 1;
                                                loopProperties_1(prop.initializer.properties);
                                            }
                                            else {
                                                finalValue_1 = prop.initializer.text;
                                            }
                                        }
                                        else {
                                            finalValue_1 = prop.initializer.text;
                                        }
                                    }
                                }
                            }
                        });
                    };
                    loopProperties_1(compilerNode.properties);
                    return finalValue_1;
                }
            }
        }
    };
    /**
     * Find in imports something like myvar
     * @param  {string} inputVariableName              like myvar
     * @return {[type]}                                myvar value
     */
    ImportsUtil.prototype.findValueInImportOrLocalVariables = function (inputVariableName, sourceFile, decoratorType) {
        var e_1, _a;
        var metadataVariableName = inputVariableName, searchedImport, aliasOriginalName = '', foundWithNamedImport = false, foundWithAlias = false;
        var file = typeof ast$1.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast$1.getSourceFile(sourceFile.fileName)
            : ast$1.addSourceFileAtPathIfExists(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasNode()) {
                        importAlias = namedImports[j].getAliasNode().getText();
                    }
                    if (importName === metadataVariableName) {
                        foundWithNamedImport = true;
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === metadataVariableName) {
                        foundWithNamedImport = true;
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
            var namespaceImport = i.getNamespaceImport();
            if (namespaceImport) {
                var namespaceImportLocalName = namespaceImport.getText();
                if (namespaceImportLocalName === metadataVariableName) {
                    searchedImport = i;
                }
            }
            if (!foundWithNamedImport) {
                var defaultImport = i.getDefaultImport();
                if (defaultImport) {
                    var defaultImportText = defaultImport.getText();
                    if (defaultImportText === metadataVariableName) {
                        searchedImport = i;
                    }
                }
            }
        });
        function hasFoundValues(variableDeclaration) {
            var variableKind = variableDeclaration.getKind();
            if (variableKind && variableKind === tsMorph.SyntaxKind.VariableDeclaration) {
                var initializer = variableDeclaration.getInitializer();
                if (initializer) {
                    var initializerKind = initializer.getKind();
                    if (initializerKind && initializerKind === tsMorph.SyntaxKind.ObjectLiteralExpression) {
                        var compilerNode = initializer.compilerNode;
                        return compilerNode.properties;
                    }
                }
            }
        }
        if (typeof searchedImport !== 'undefined') {
            var importPathReference = searchedImport.getModuleSpecifierSourceFile();
            var importPath = void 0;
            if (typeof importPathReference !== 'undefined') {
                importPath = importPathReference.compilerNode.fileName;
                var sourceFileImport = typeof ast$1.getSourceFile(importPath) !== 'undefined'
                    ? ast$1.getSourceFile(importPath)
                    : ast$1.addSourceFileAtPathIfExists(importPath); // tslint:disable-line
                if (sourceFileImport) {
                    var variableName_1 = foundWithAlias ? aliasOriginalName : metadataVariableName;
                    var variableDeclaration = sourceFileImport.getVariableDeclaration(variableName_1);
                    if (variableDeclaration) {
                        return hasFoundValues(variableDeclaration);
                    }
                    else {
                        // Try with exports
                        var exportDeclarations = sourceFileImport.getExportedDeclarations();
                        if (exportDeclarations && exportDeclarations.size > 0) {
                            try {
                                for (var exportDeclarations_1 = __values(exportDeclarations), exportDeclarations_1_1 = exportDeclarations_1.next(); !exportDeclarations_1_1.done; exportDeclarations_1_1 = exportDeclarations_1.next()) {
                                    var _b = __read(exportDeclarations_1_1.value, 2), exportDeclarationKey = _b[0], exportDeclarationValues = _b[1];
                                    exportDeclarationValues.forEach(function (exportDeclarationValue) {
                                        if (exportDeclarationValue instanceof tsMorph.VariableDeclaration &&
                                            exportDeclarationValue.getName() === variableName_1) {
                                            return hasFoundValues(exportDeclarationValue);
                                        }
                                    });
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (exportDeclarations_1_1 && !exportDeclarations_1_1.done && (_a = exportDeclarations_1.return)) _a.call(exportDeclarations_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                    }
                }
            }
            if (!importPathReference &&
                decoratorType === 'template' &&
                searchedImport.getModuleSpecifierValue().indexOf('.html') !== -1) {
                var originalSourceFilePath = sourceFile.path;
                var originalSourceFilePathFolder = originalSourceFilePath.substring(0, originalSourceFilePath.lastIndexOf('/'));
                var finalImportedPath = originalSourceFilePathFolder + '/' + searchedImport.getModuleSpecifierValue();
                var finalImportedPathData = FileEngine$1.getSync(finalImportedPath);
                return finalImportedPathData;
            }
        }
        else {
            // Find in local variables of the file
            var variableDeclaration = file.getVariableDeclaration(metadataVariableName);
            if (variableDeclaration) {
                var variableKind = variableDeclaration.getKind();
                if (variableKind && variableKind === tsMorph.SyntaxKind.VariableDeclaration) {
                    var initializer = variableDeclaration.getInitializer();
                    if (initializer) {
                        var initializerKind = initializer.getKind();
                        if (initializerKind &&
                            initializerKind === tsMorph.SyntaxKind.ObjectLiteralExpression) {
                            var compilerNode = initializer.compilerNode;
                            return compilerNode.properties;
                        }
                        else if (initializerKind &&
                            (initializerKind === tsMorph.SyntaxKind.StringLiteral ||
                                initializerKind === tsMorph.SyntaxKind.NoSubstitutionTemplateLiteral)) {
                            if (decoratorType === 'template') {
                                return initializer.getText();
                            }
                            else {
                                return variableDeclaration.compilerNode;
                            }
                        }
                        else if (initializerKind) {
                            return variableDeclaration.compilerNode;
                        }
                    }
                }
            }
        }
        return [];
    };
    ImportsUtil.prototype.getFileNameOfImport = function (variableName, sourceFile) {
        var file = typeof ast$1.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast$1.getSourceFile(sourceFile.fileName)
            : ast$1.addSourceFileAtPath(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        var searchedImport, finalPath = '';
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasNode()) {
                        importAlias = namedImports[j].getAliasNode().getText();
                    }
                    if (importName === variableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === variableName) {
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        if (typeof searchedImport !== 'undefined') {
            var importPath = path__namespace.resolve(path__namespace.dirname(sourceFile.fileName) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
            var cleaner = (process.cwd() + path__namespace.sep).replace(/\\/g, '/');
            finalPath = importPath.replace(cleaner, '');
        }
        return finalPath;
    };
    /**
     * Find the file path of imported variable
     * @param  {string} inputVariableName  like thestring
     * @return {[type]}                    thestring destination path
     */
    ImportsUtil.prototype.findFilePathOfImportedVariable = function (inputVariableName, sourceFilePath) {
        var searchedImport, finalPath = '';
        var file = typeof ast$1.getSourceFile(sourceFilePath) !== 'undefined'
            ? ast$1.getSourceFile(sourceFilePath)
            : ast$1.addSourceFileAtPath(sourceFilePath); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasNode()) {
                        importAlias = namedImports[j].getAliasNode().getText();
                    }
                    if (importName === inputVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === inputVariableName) {
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        if (typeof searchedImport !== 'undefined') {
            finalPath = path__namespace.resolve(path__namespace.dirname(sourceFilePath) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
        }
        return finalPath;
    };
    /**
     * Find in imports something like VAR.AVAR.BVAR.thestring
     * @param  {string} inputVariableName                   like VAR.AVAR.BVAR.thestring
     * @return {[type]}                                thestring value
     */
    ImportsUtil.prototype.findPropertyValueInImportOrLocalVariables = function (inputVariableName, sourceFile) {
        var variablesAttributes = inputVariableName.split('.'), metadataVariableName = variablesAttributes[0], searchedImport, aliasOriginalName = '', foundWithAlias = false;
        var file = typeof ast$1.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast$1.getSourceFile(sourceFile.fileName)
            : ast$1.addSourceFileAtPath(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasNode()) {
                        importAlias = namedImports[j].getAliasNode().getText();
                    }
                    if (importName === metadataVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === metadataVariableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        var fileToSearchIn, variableDeclaration;
        if (typeof searchedImport !== 'undefined') {
            var importPath = path__namespace.resolve(path__namespace.dirname(sourceFile.fileName) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
            var sourceFileImport = typeof ast$1.getSourceFile(importPath) !== 'undefined'
                ? ast$1.getSourceFile(importPath)
                : ast$1.addSourceFileAtPath(importPath); // tslint:disable-line
            if (sourceFileImport) {
                fileToSearchIn = sourceFileImport;
                var variableName = foundWithAlias ? aliasOriginalName : metadataVariableName;
                variableDeclaration = fileToSearchIn.getVariableDeclaration(variableName);
            }
        }
        else {
            fileToSearchIn = file;
            // Find in local variables of the file
            variableDeclaration = fileToSearchIn.getVariableDeclaration(metadataVariableName);
        }
        if (variableDeclaration) {
            return this.findInObjectVariableDeclaration(variableDeclaration, variablesAttributes);
        }
        // Try find it in enums
        if (variablesAttributes.length > 0) {
            if (typeof fileToSearchIn !== 'undefined') {
                var val = this.findInEnums(fileToSearchIn, metadataVariableName, variablesAttributes[1]);
                if (val !== '') {
                    return val;
                }
                val = this.findInClasses(fileToSearchIn, metadataVariableName, variablesAttributes[1]);
                if (val !== '') {
                    return val;
                }
            }
        }
    };
    return ImportsUtil;
}());
var ImportsUtil$1 = ImportsUtil.getInstance();

var Handlebars = require('handlebars');
var traverse$1 = require('traverse');
var ast = new tsMorph.Project();
var RouterParserUtil = /** @class */ (function () {
    function RouterParserUtil() {
        this.scannedFiles = [];
        this.routes = [];
        this.incompleteRoutes = [];
        this.modules = [];
        this.modulesWithRoutes = [];
        this.transformAngular8ImportSyntax = /(['"]loadChildren['"]:)\(\)(:[^)]+?)?=>"import\((\\'|'|"|`)([^'"]+?)(\\'|'|"|`)\)\.then\(\(?\w+?\)?=>\S+?\.([^)]+?)\)(\\'|'|")/g;
        this.transformAngular8ImportSyntaxComponent = /(['"]loadComponent['"]:)\(\)(:[^)]+?)?=>"import\((\\'|'|"|`)([^'"]+?)(\\'|'|"|`)\)\.then\(\(?\w+?\)?=>\S+?\.([^)]+?)\)(\\'|'|")/g;
        this.transformAngular8ImportSyntaxAsyncAwait = /(['"]loadChildren['"]:)\(\)(:[^)]+?)?=>\("import\((\\'|'|"|`)([^'"]+?)(\\'|'|"|`)\)"\)\.['"]([^)]+?)['"]/g;
        this.transformAngular8ImportSyntaxComponentAsyncAwait = /(['"]loadComponent['"]:)\(\)(:[^)]+?)?=>\("import\((\\'|'|"|`)([^'"]+?)(\\'|'|"|`)\)"\)\.['"]([^)]+?)['"]/g;
    }
    RouterParserUtil.getInstance = function () {
        if (!RouterParserUtil.instance) {
            RouterParserUtil.instance = new RouterParserUtil();
        }
        return RouterParserUtil.instance;
    };
    RouterParserUtil.prototype.addRoute = function (route) {
        this.routes.push(route);
        this.routes = ___namespace.sortBy(___namespace.uniqWith(this.routes, ___namespace.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addIncompleteRoute = function (route) {
        this.incompleteRoutes.push(route);
        this.incompleteRoutes = ___namespace.sortBy(___namespace.uniqWith(this.incompleteRoutes, ___namespace.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModuleWithRoutes = function (moduleName, moduleImports, filename) {
        this.modulesWithRoutes.push({
            name: moduleName,
            importsNode: moduleImports,
            filename: filename
        });
        this.modulesWithRoutes = ___namespace.sortBy(___namespace.uniqWith(this.modulesWithRoutes, ___namespace.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModule = function (moduleName, moduleImports) {
        this.modules.push({
            name: moduleName,
            importsNode: moduleImports
        });
        this.modules = ___namespace.sortBy(___namespace.uniqWith(this.modules, ___namespace.isEqual), ['name']);
    };
    RouterParserUtil.prototype.cleanRawRouteParsed = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntax, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxAsyncAwait, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxComponent, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxComponentAsyncAwait, '$1"$4#$6"');
        return JSON5__namespace.parse(routesWithoutSpaces);
    };
    RouterParserUtil.prototype.cleanRawRoute = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntax, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxAsyncAwait, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxComponent, '$1"$4#$6"');
        routesWithoutSpaces = routesWithoutSpaces.replace(this.transformAngular8ImportSyntaxComponentAsyncAwait, '$1"$4#$6"');
        return routesWithoutSpaces;
    };
    RouterParserUtil.prototype.setRootModule = function (module) {
        this.rootModule = module;
    };
    RouterParserUtil.prototype.hasRouterModuleInImports = function (imports) {
        for (var i = 0; i < imports.length; i++) {
            if (imports[i].name.indexOf('RouterModule.forChild') !== -1 ||
                imports[i].name.indexOf('RouterModule.forRoot') !== -1 ||
                imports[i].name.indexOf('RouterModule') !== -1) {
                return true;
            }
        }
        return false;
    };
    RouterParserUtil.prototype.fixIncompleteRoutes = function (miscellaneousVariables) {
        var matchingVariables = [];
        // For each incompleteRoute, scan if one misc variable is in code
        // if ok, try recreating complete route
        for (var i = 0; i < this.incompleteRoutes.length; i++) {
            for (var j = 0; j < miscellaneousVariables.length; j++) {
                if (this.incompleteRoutes[i].data.indexOf(miscellaneousVariables[j].name) !== -1) {
                    console.log('found one misc var inside incompleteRoute');
                    console.log(miscellaneousVariables[j].name);
                    matchingVariables.push(miscellaneousVariables[j]);
                }
            }
            // Clean incompleteRoute
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace('[', '');
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace(']', '');
        }
    };
    RouterParserUtil.prototype.linkModulesAndRoutes = function () {
        var _this = this;
        var i = 0;
        var len = this.modulesWithRoutes.length;
        for (i; i < len; i++) {
            ___namespace.forEach(this.modulesWithRoutes[i].importsNode, function (node) {
                var initializer = node.initializer;
                if (initializer) {
                    if (initializer.elements) {
                        ___namespace.forEach(initializer.elements, function (element) {
                            // find element with arguments
                            if (element.arguments) {
                                ___namespace.forEach(element.arguments, function (argument) {
                                    ___namespace.forEach(_this.routes, function (route) {
                                        if (argument.text &&
                                            route.name === argument.text &&
                                            route.filename === _this.modulesWithRoutes[i].filename) {
                                            route.module = _this.modulesWithRoutes[i].name;
                                        }
                                        else if (argument.text &&
                                            route.name === argument.text &&
                                            route.filename !== _this.modulesWithRoutes[i].filename) {
                                            var argumentImportPath = ImportsUtil$1.findFilePathOfImportedVariable(argument.text, _this.modulesWithRoutes[i].filename);
                                            argumentImportPath = argumentImportPath
                                                .replace(process.cwd() + path__namespace.sep, '')
                                                .replace(/\\/g, '/');
                                            if (argument.text &&
                                                route.name === argument.text &&
                                                route.filename === argumentImportPath) {
                                                route.module = _this.modulesWithRoutes[i].name;
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
                /**
                 * direct support of for example
                 * export const HomeRoutingModule: ModuleWithProviders = RouterModule.forChild(HOME_ROUTES);
                 */
                if (tsMorph.ts.isCallExpression(node)) {
                    if (node.arguments) {
                        ___namespace.forEach(node.arguments, function (argument) {
                            ___namespace.forEach(_this.routes, function (route) {
                                if (argument.text &&
                                    route.name === argument.text &&
                                    route.filename === _this.modulesWithRoutes[i].filename) {
                                    route.module = _this.modulesWithRoutes[i].name;
                                }
                            });
                        });
                    }
                }
            });
        }
    };
    RouterParserUtil.prototype.foundRouteWithModuleName = function (moduleName) {
        return ___namespace.find(this.routes, { module: moduleName });
    };
    RouterParserUtil.prototype.foundLazyModuleWithPath = function (modulePath) {
        // path is like app/customers/customers.module#CustomersModule
        var split = modulePath.split('#');
        var lazyModuleName = split[1];
        return lazyModuleName;
    };
    RouterParserUtil.prototype.foundLazyComponentWithPath = function (componentPath) {
        // path is like app/customers/customers.component#CustomersComponent
        var split = componentPath.split('#');
        var lazyComponentName = split[1];
        return lazyComponentName;
    };
    RouterParserUtil.prototype.constructRoutesTree = function () {
        var _this = this;
        // routes[] contains routes with module link
        // modulesTree contains modules tree
        // make a final routes tree with that
        traverse$1(this.modulesTree).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
                if (node.importsNode) {
                    delete node.importsNode;
                }
            }
        });
        this.cleanModulesTree = ___namespace.cloneDeep(this.modulesTree);
        var routesTree = {
            name: '<root>',
            kind: 'module',
            className: this.rootModule,
            children: []
        };
        var loopModulesParser = function (node) {
            if (node.children && node.children.length > 0) {
                // If module has child modules
                for (var i in node.children) {
                    var route = _this.foundRouteWithModuleName(node.children[i].name);
                    if (route && route.data) {
                        try {
                            route.children = JSON5__namespace.parse(route.data);
                        }
                        catch (e) {
                            logger.error('Error during generation of routes JSON file, maybe a trailing comma or an external variable inside one route.');
                        }
                        delete route.data;
                        route.kind = 'module';
                        routesTree.children.push(route);
                    }
                    if (node.children[i].children) {
                        loopModulesParser(node.children[i]);
                    }
                }
            }
            else {
                // else routes are directly inside the module
                var rawRoutes = _this.foundRouteWithModuleName(node.name);
                if (rawRoutes) {
                    var routes = JSON5__namespace.parse(rawRoutes.data);
                    if (routes) {
                        var i = 0;
                        var len = routes.length;
                        var routeAddedOnce = false;
                        for (i; i < len; i++) {
                            var route = routes[i];
                            if (routes[i].component) {
                                routeAddedOnce = true;
                                routesTree.children.push({
                                    kind: 'component',
                                    component: routes[i].component,
                                    path: routes[i].path
                                });
                            }
                        }
                        if (!routeAddedOnce) {
                            routesTree.children = __spreadArray(__spreadArray([], __read(routesTree.children), false), __read(routes), false);
                        }
                    }
                }
            }
        };
        var startModule = ___namespace.find(this.cleanModulesTree, { name: this.rootModule });
        if (startModule) {
            loopModulesParser(startModule);
            // Loop twice for routes with lazy loading
            // loopModulesParser(routesTree);
        }
        var cleanedRoutesTree = undefined;
        var cleanRoutesTree = function (route) {
            for (var i in route.children) {
                route.children[i].routes;
            }
            return route;
        };
        cleanedRoutesTree = cleanRoutesTree(routesTree);
        // Try updating routes with lazy loading
        var loopInsideModule = function (mod, _rawModule) {
            if (mod.children) {
                for (var z in mod.children) {
                    var route = _this.foundRouteWithModuleName(mod.children[z].name);
                    if (typeof route !== 'undefined') {
                        if (route.data) {
                            route.children = JSON5__namespace.parse(route.data);
                            delete route.data;
                            route.kind = 'module';
                            _rawModule.children.push(route);
                        }
                    }
                }
            }
            else {
                var route = _this.foundRouteWithModuleName(mod.name);
                if (typeof route !== 'undefined') {
                    if (route.data) {
                        route.children = JSON5__namespace.parse(route.data);
                        delete route.data;
                        route.kind = 'module';
                        _rawModule.children.push(route);
                    }
                }
            }
        };
        var loopRoutesParser = function (route) {
            if (route.children) {
                for (var i in route.children) {
                    if (route.children[i].loadChildren) {
                        var child = _this.foundLazyModuleWithPath(route.children[i].loadChildren);
                        var module_1 = ___namespace.find(_this.cleanModulesTree, {
                            name: child
                        });
                        if (module_1) {
                            var _rawModule = {};
                            _rawModule.kind = 'module';
                            _rawModule.children = [];
                            _rawModule.module = module_1.name;
                            loopInsideModule(module_1, _rawModule);
                            route.children[i].children = [];
                            route.children[i].children.push(_rawModule);
                        }
                    }
                    if (route.children[i].loadComponent) {
                        var child = _this.foundLazyComponentWithPath(route.children[i].loadComponent);
                        if (child) {
                            route.children[i].component = child;
                        }
                    }
                    loopRoutesParser(route.children[i]);
                }
            }
        };
        loopRoutesParser(cleanedRoutesTree);
        return cleanedRoutesTree;
    };
    RouterParserUtil.prototype.constructModulesTree = function () {
        var _this = this;
        var getNestedChildren = function (arr, parent) {
            var out = [];
            for (var i in arr) {
                if (arr[i].parent === parent) {
                    var children = getNestedChildren(arr, arr[i].name);
                    if (children.length) {
                        arr[i].children = children;
                    }
                    out.push(arr[i]);
                }
            }
            return out;
        };
        // Scan each module and add parent property
        ___namespace.forEach(this.modules, function (firstLoopModule) {
            ___namespace.forEach(firstLoopModule.importsNode, function (importNode) {
                ___namespace.forEach(_this.modules, function (module) {
                    if (module.name === importNode.name) {
                        module.parent = firstLoopModule.name;
                    }
                });
            });
        });
        this.modulesTree = getNestedChildren(this.modules);
    };
    RouterParserUtil.prototype.generateRoutesIndex = function (outputFolder, routes) {
        return FileEngine$1.get(__dirname + '/../src/templates/partials/routes-index.hbs').then(function (data) {
            var template = Handlebars.compile(data);
            var result = template({
                routes: JSON.stringify(routes)
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (testOutputDir && testOutputDir.length > 0) {
                outputFolder = outputFolder.replace(process.cwd() + path__namespace.sep, '');
            }
            return FileEngine$1.write(outputFolder + path__namespace.sep + '/js/routes/routes_index.js', result);
        }, function (err) { return Promise.reject('Error during routes index generation'); });
    };
    RouterParserUtil.prototype.routesLength = function () {
        var _n = 0;
        var routesParser = function (route) {
            if (typeof route.path !== 'undefined') {
                _n += 1;
            }
            if (route.children) {
                for (var j in route.children) {
                    routesParser(route.children[j]);
                }
            }
        };
        for (var i in this.routes) {
            routesParser(this.routes[i]);
        }
        return _n;
    };
    RouterParserUtil.prototype.printRoutes = function () {
        console.log('');
        console.log('printRoutes: ');
        console.log(this.routes);
    };
    RouterParserUtil.prototype.printModulesRoutes = function () {
        console.log('');
        console.log('printModulesRoutes: ');
        console.log(this.modulesWithRoutes);
    };
    RouterParserUtil.prototype.isVariableRoutes = function (node) {
        var result = false;
        if (node.declarationList && node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                if (node.declarationList.declarations[i].type) {
                    if (node.declarationList.declarations[i].type.typeName &&
                        node.declarationList.declarations[i].type.typeName.text === 'Routes') {
                        result = true;
                    }
                }
            }
        }
        return result;
    };
    RouterParserUtil.prototype.cleanFileIdentifiers = function (sourceFile) {
        var e_1, _a, e_2, _b;
        var _this = this;
        var file = sourceFile;
        var identifiers = file.getDescendantsOfKind(tsMorph.SyntaxKind.Identifier).filter(function (p) {
            return (tsMorph.Node.isArrayLiteralExpression(p.getParentOrThrow()) ||
                tsMorph.Node.isPropertyAssignment(p.getParentOrThrow()));
        });
        var identifiersInRoutesVariableStatement = [];
        var _loop_1 = function (identifier) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            identifier.getParentWhile(function (n) {
                if (n.getKind() === tsMorph.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                identifiersInRoutesVariableStatement.push(identifier);
            }
        };
        try {
            for (var identifiers_1 = __values(identifiers), identifiers_1_1 = identifiers_1.next(); !identifiers_1_1.done; identifiers_1_1 = identifiers_1.next()) {
                var identifier = identifiers_1_1.value;
                _loop_1(identifier);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (identifiers_1_1 && !identifiers_1_1.done && (_a = identifiers_1.return)) _a.call(identifiers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // inline the property access expressions
            for (var identifiersInRoutesVariableStatement_1 = __values(identifiersInRoutesVariableStatement), identifiersInRoutesVariableStatement_1_1 = identifiersInRoutesVariableStatement_1.next(); !identifiersInRoutesVariableStatement_1_1.done; identifiersInRoutesVariableStatement_1_1 = identifiersInRoutesVariableStatement_1.next()) {
                var identifier = identifiersInRoutesVariableStatement_1_1.value;
                var identifierDeclaration = identifier
                    .getSymbolOrThrow()
                    .getValueDeclarationOrThrow();
                if (!tsMorph.Node.isPropertyAssignment(identifierDeclaration) &&
                    tsMorph.Node.isVariableDeclaration(identifierDeclaration) &&
                    tsMorph.Node.isPropertyAssignment(identifierDeclaration) &&
                    !tsMorph.Node.isVariableDeclaration(identifierDeclaration)) {
                    throw new Error("Not implemented referenced declaration kind: ".concat(identifierDeclaration.getKindName()));
                }
                if (tsMorph.Node.isVariableDeclaration(identifierDeclaration)) {
                    identifier.replaceWithText(identifierDeclaration.getInitializerOrThrow().getText());
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (identifiersInRoutesVariableStatement_1_1 && !identifiersInRoutesVariableStatement_1_1.done && (_b = identifiersInRoutesVariableStatement_1.return)) _b.call(identifiersInRoutesVariableStatement_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return file;
    };
    RouterParserUtil.prototype.cleanFileSpreads = function (sourceFile) {
        var e_3, _a, e_4, _b;
        var _this = this;
        var file = sourceFile;
        var spreadElements = file
            .getDescendantsOfKind(tsMorph.SyntaxKind.SpreadElement)
            .filter(function (p) { return tsMorph.Node.isArrayLiteralExpression(p.getParentOrThrow()); });
        var spreadElementsInRoutesVariableStatement = [];
        var _loop_2 = function (spreadElement) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            spreadElement.getParentWhile(function (n) {
                if (n.getKind() === tsMorph.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                spreadElementsInRoutesVariableStatement.push(spreadElement);
            }
        };
        try {
            for (var spreadElements_1 = __values(spreadElements), spreadElements_1_1 = spreadElements_1.next(); !spreadElements_1_1.done; spreadElements_1_1 = spreadElements_1.next()) {
                var spreadElement = spreadElements_1_1.value;
                _loop_2(spreadElement);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (spreadElements_1_1 && !spreadElements_1_1.done && (_a = spreadElements_1.return)) _a.call(spreadElements_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var _loop_3 = function (spreadElement) {
            var spreadElementIdentifier = spreadElement.getExpression().getText(), searchedImport, aliasOriginalName = '', foundWithAliasInImports = false, foundWithAlias = false;
            // Try to find it in imports
            var imports = file.getImportDeclarations();
            imports.forEach(function (i) {
                var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
                if (namedImportsLength > 0) {
                    for (j; j < namedImportsLength; j++) {
                        var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                        if (namedImports[j].getAliasNode()) {
                            importAlias = namedImports[j].getAliasNode().getText();
                        }
                        if (importName === spreadElementIdentifier) {
                            foundWithAliasInImports = true;
                            searchedImport = i;
                            break;
                        }
                        if (importAlias === spreadElementIdentifier) {
                            foundWithAliasInImports = true;
                            foundWithAlias = true;
                            aliasOriginalName = importName;
                            searchedImport = i;
                            break;
                        }
                    }
                }
            });
            var referencedDeclaration = void 0;
            if (foundWithAliasInImports) {
                if (typeof searchedImport !== 'undefined') {
                    var routePathIsBad = function (path) {
                        var result = _this.scannedFiles.find(function (scannedFile) { return path === scannedFile.path; });
                        return !result;
                    };
                    var getIndicesOf = function (searchStr, str, caseSensitive) {
                        var searchStrLen = searchStr.length;
                        if (searchStrLen == 0) {
                            return [];
                        }
                        var startIndex = 0, index, indices = [];
                        if (!caseSensitive) {
                            str = str.toLowerCase();
                            searchStr = searchStr.toLowerCase();
                        }
                        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                            indices.push(index);
                            startIndex = index + searchStrLen;
                        }
                        return indices;
                    };
                    var dirNamePath = path__namespace.dirname(file.getFilePath());
                    var searchedImportPath = searchedImport.getModuleSpecifierValue();
                    var leadingFilePath = searchedImportPath.split('/').shift();
                    var importPath = path__namespace.resolve(dirNamePath + '/' + searchedImport.getModuleSpecifierValue() + '.ts');
                    if (routePathIsBad(importPath)) {
                        var leadingIndices = getIndicesOf(leadingFilePath, importPath, true);
                        if (leadingIndices.length > 1) {
                            // Nested route fixes
                            var startIndex = leadingIndices[0];
                            var endIndex = leadingIndices[leadingIndices.length - 1];
                            importPath =
                                importPath.slice(0, startIndex) + importPath.slice(endIndex);
                        }
                        else {
                            // Top level route fixes
                            importPath =
                                path__namespace.dirname(dirNamePath) + '/' + searchedImportPath + '.ts';
                        }
                    }
                    var sourceFileImport = typeof ast.getSourceFile(importPath) !== 'undefined'
                        ? ast.getSourceFile(importPath)
                        : ast.addSourceFileAtPath(importPath);
                    if (sourceFileImport) {
                        var variableName = foundWithAlias
                            ? aliasOriginalName
                            : spreadElementIdentifier;
                        referencedDeclaration =
                            sourceFileImport.getVariableDeclaration(variableName);
                    }
                }
            }
            else {
                // if not, try directly in file
                referencedDeclaration = spreadElement
                    .getExpression()
                    .getSymbolOrThrow()
                    .getValueDeclarationOrThrow();
            }
            if (!tsMorph.Node.isVariableDeclaration(referencedDeclaration)) {
                throw new Error("Not implemented referenced declaration kind: ".concat(referencedDeclaration.getKindName()));
            }
            var referencedArray = referencedDeclaration.getInitializerIfKindOrThrow(tsMorph.SyntaxKind.ArrayLiteralExpression);
            var spreadElementArray = spreadElement.getParentIfKindOrThrow(tsMorph.SyntaxKind.ArrayLiteralExpression);
            var insertIndex = spreadElementArray.getElements().indexOf(spreadElement);
            spreadElementArray.removeElement(spreadElement);
            spreadElementArray.insertElements(insertIndex, referencedArray.getElements().map(function (e) { return e.getText(); }));
        };
        try {
            // inline the ArrayLiteralExpression SpreadElements
            for (var spreadElementsInRoutesVariableStatement_1 = __values(spreadElementsInRoutesVariableStatement), spreadElementsInRoutesVariableStatement_1_1 = spreadElementsInRoutesVariableStatement_1.next(); !spreadElementsInRoutesVariableStatement_1_1.done; spreadElementsInRoutesVariableStatement_1_1 = spreadElementsInRoutesVariableStatement_1.next()) {
                var spreadElement = spreadElementsInRoutesVariableStatement_1_1.value;
                _loop_3(spreadElement);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (spreadElementsInRoutesVariableStatement_1_1 && !spreadElementsInRoutesVariableStatement_1_1.done && (_b = spreadElementsInRoutesVariableStatement_1.return)) _b.call(spreadElementsInRoutesVariableStatement_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return file;
    };
    RouterParserUtil.prototype.cleanFileDynamics = function (sourceFile) {
        var e_5, _a, e_6, _b;
        var _this = this;
        var file = sourceFile;
        var propertyAccessExpressions = file
            .getDescendantsOfKind(tsMorph.SyntaxKind.PropertyAccessExpression)
            .filter(function (p) { return !tsMorph.Node.isPropertyAccessExpression(p.getParentOrThrow()); });
        var propertyAccessExpressionsInRoutesVariableStatement = [];
        var _loop_4 = function (propertyAccessExpression) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            propertyAccessExpression.getParentWhile(function (n) {
                if (n.getKind() === tsMorph.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                propertyAccessExpressionsInRoutesVariableStatement.push(propertyAccessExpression);
            }
        };
        try {
            for (var propertyAccessExpressions_1 = __values(propertyAccessExpressions), propertyAccessExpressions_1_1 = propertyAccessExpressions_1.next(); !propertyAccessExpressions_1_1.done; propertyAccessExpressions_1_1 = propertyAccessExpressions_1.next()) {
                var propertyAccessExpression = propertyAccessExpressions_1_1.value;
                _loop_4(propertyAccessExpression);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (propertyAccessExpressions_1_1 && !propertyAccessExpressions_1_1.done && (_a = propertyAccessExpressions_1.return)) _a.call(propertyAccessExpressions_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            // inline the property access expressions
            for (var propertyAccessExpressionsInRoutesVariableStatement_1 = __values(propertyAccessExpressionsInRoutesVariableStatement), propertyAccessExpressionsInRoutesVariableStatement_1_1 = propertyAccessExpressionsInRoutesVariableStatement_1.next(); !propertyAccessExpressionsInRoutesVariableStatement_1_1.done; propertyAccessExpressionsInRoutesVariableStatement_1_1 = propertyAccessExpressionsInRoutesVariableStatement_1.next()) {
                var propertyAccessExpression = propertyAccessExpressionsInRoutesVariableStatement_1_1.value;
                var propertyAccessExpressionNodeName = propertyAccessExpression.getNameNode();
                if (propertyAccessExpressionNodeName) {
                    try {
                        var propertyAccessExpressionNodeNameSymbol = propertyAccessExpressionNodeName.getSymbolOrThrow();
                        if (propertyAccessExpressionNodeNameSymbol) {
                            var referencedDeclaration = propertyAccessExpressionNodeNameSymbol.getValueDeclarationOrThrow();
                            if (!tsMorph.Node.isPropertyAssignment(referencedDeclaration) &&
                                tsMorph.Node.isEnumMember(referencedDeclaration) &&
                                tsMorph.Node.isPropertyAssignment(referencedDeclaration) &&
                                !tsMorph.Node.isEnumMember(referencedDeclaration)) {
                                throw new Error("Not implemented referenced declaration kind: ".concat(referencedDeclaration.getKindName()));
                            }
                            if (typeof referencedDeclaration.getInitializerOrThrow !== 'undefined') {
                                propertyAccessExpression.replaceWithText(referencedDeclaration.getInitializerOrThrow().getText());
                            }
                        }
                    }
                    catch (e) { }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (propertyAccessExpressionsInRoutesVariableStatement_1_1 && !propertyAccessExpressionsInRoutesVariableStatement_1_1.done && (_b = propertyAccessExpressionsInRoutesVariableStatement_1.return)) _b.call(propertyAccessExpressionsInRoutesVariableStatement_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return file;
    };
    /**
     * replace callexpressions with string : utils.doWork() -> 'utils.doWork()' doWork() -> 'doWork()'
     * @param sourceFile ts.SourceFile
     */
    RouterParserUtil.prototype.cleanCallExpressions = function (sourceFile) {
        var e_7, _a;
        var file = sourceFile;
        var variableStatements = sourceFile.getVariableDeclaration(function (v) {
            var result = false;
            var type = v.compilerNode.type;
            if (typeof type !== 'undefined' && typeof type.typeName !== 'undefined') {
                result = type.typeName.text === 'Routes';
            }
            return result;
        });
        var initializer = variableStatements.getInitializer();
        var _loop_5 = function (callExpr) {
            if (callExpr.wasForgotten()) {
                return "continue";
            }
            callExpr.replaceWithText(function (writer) { return writer.quote(callExpr.getText()); });
        };
        try {
            for (var _b = __values(initializer.getDescendantsOfKind(tsMorph.SyntaxKind.CallExpression)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callExpr = _c.value;
                _loop_5(callExpr);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return file;
    };
    /**
     * Clean routes definition with imported data, for example path, children, or dynamic stuff inside data
     *
     * const MY_ROUTES: Routes = [
     *     {
     *         path: 'home',
     *         component: HomeComponent
     *     },
     *     {
     *         path: PATHS.home,
     *         component: HomeComponent
     *     }
     * ];
     *
     * The initializer is an array (ArrayLiteralExpression - 177 ), it has elements, objects (ObjectLiteralExpression - 178)
     * with properties (PropertyAssignment - 261)
     *
     * For each know property (https://angular.io/api/router/Routes#description), we try to see if we have what we want
     *
     * Ex: path and pathMatch want a string, component a component reference.
     *
     * It is an imperative approach, not a generic way, parsing all the tree
     * and find something like this which willl break JSON.stringify : MYIMPORT.path
     *
     * @param  {ts.Node} initializer The node of routes definition
     * @return {ts.Node}             The edited node
     */
    RouterParserUtil.prototype.cleanRoutesDefinitionWithImport = function (initializer, node, sourceFile) {
        initializer.elements.forEach(function (element) {
            element.properties.forEach(function (property) {
                var propertyName = property.name.getText(), propertyInitializer = property.initializer;
                switch (propertyName) {
                    case 'path':
                    case 'redirectTo':
                    case 'outlet':
                    case 'pathMatch':
                        if (propertyInitializer) {
                            if (propertyInitializer.kind !== tsMorph.SyntaxKind.StringLiteral) {
                                // Identifier(71) won't break parsing, but it will be better to retrive them
                                // PropertyAccessExpression(179) ex: MYIMPORT.path will break it, find it in import
                                if (propertyInitializer.kind === tsMorph.SyntaxKind.PropertyAccessExpression) {
                                    var lastObjectLiteralAttributeName = propertyInitializer.name.getText(), firstObjectLiteralAttributeName = void 0;
                                    if (propertyInitializer.expression) {
                                        firstObjectLiteralAttributeName =
                                            propertyInitializer.expression.getText();
                                        var result = ImportsUtil$1.findPropertyValueInImportOrLocalVariables(firstObjectLiteralAttributeName +
                                            '.' +
                                            lastObjectLiteralAttributeName, sourceFile); // tslint:disable-line
                                        if (result !== '') {
                                            propertyInitializer.kind = 9;
                                            propertyInitializer.text = result;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
            });
        });
        return initializer;
    };
    return RouterParserUtil;
}());
var RouterParserUtil$1 = RouterParserUtil.getInstance();

function isModuleWithProviders(node) {
    var result = false;
    if (node.declarationList) {
        if (node.declarationList.declarations && node.declarationList.declarations.length > 0) {
            var i = 0; node.declarationList.declarations; var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var declaration = node.declarationList.declarations[i];
                if (declaration.type) {
                    var type = declaration.type;
                    if (type.typeName) {
                        var text = type.typeName.getText();
                        if (text === 'ModuleWithProviders') {
                            result = true;
                        }
                    }
                }
            }
        }
    }
    return result;
}

function getModuleWithProviders(node) {
    var result;
    if (node.declarationList) {
        if (node.declarationList.declarations && node.declarationList.declarations.length > 0) {
            var i = 0, len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var declaration = node.declarationList.declarations[i];
                if (declaration.type) {
                    var type = declaration.type;
                    if (type.typeName) {
                        var text = type.typeName.getText();
                        if (text === 'ModuleWithProviders') {
                            result = declaration.initializer;
                        }
                    }
                }
            }
        }
    }
    return result;
}

function StringifyArrowFunction(af) {
    var i = 0, result = '(';
    var len = af.parameters.length;
    if (len === 1) {
        result = '';
    }
    for (i; i < len; i++) {
        if (af.parameters[i].name && af.parameters[i].name.escapedText) {
            result += af.parameters[i].name.escapedText;
        }
        if (i < len - 1) {
            result += ', ';
        }
    }
    if (len > 1 || len === 0) {
        result += ')';
    }
    // body
    result += ' => ';
    if (af.body) {
        if (af.body.kind === tsMorph.SyntaxKind.Identifier && af.body.escapedText) {
            result += af.body.escapedText;
        }
        else if (af.body.kind === tsMorph.SyntaxKind.PropertyAccessExpression &&
            af.body.expression &&
            af.body.name) {
            result += af.body.expression.escapedText;
            result += '.' + af.body.name.escapedText;
        }
        else if (af.body.kind === tsMorph.SyntaxKind.StringLiteral && af.body.text) {
            result += af.body.text;
        }
    }
    return result;
}

function StringifyObjectLiteralExpression(ole) {
    var returnedString = '{';
    if (ole.properties && ole.properties.length > 0) {
        ole.properties.forEach(function (property, index) {
            if (property.name) {
                returnedString += property.name.text + ': ';
            }
            if (property.initializer) {
                if (property.initializer.kind === tsMorph.SyntaxKind.StringLiteral) {
                    returnedString += "'" + property.initializer.text + "'";
                }
                else if (property.initializer.kind === tsMorph.SyntaxKind.TrueKeyword) {
                    returnedString += "true";
                }
                else if (property.initializer.kind === tsMorph.SyntaxKind.FalseKeyword) {
                    returnedString += "false";
                }
                else if (property.initializer.kind === tsMorph.SyntaxKind.ArrowFunction) {
                    returnedString += StringifyArrowFunction(property.initializer);
                }
                else {
                    returnedString += property.initializer.text;
                }
            }
            if (index < ole.properties.length - 1) {
                returnedString += ', ';
            }
        });
    }
    returnedString += '}';
    return returnedString;
}

function nodeHasDecorator(node) {
    var result = false;
    var nodeModifiers = node.modifiers; // ts.getModifiers(node);
    if (nodeModifiers && nodeModifiers.length > 0) {
        nodeModifiers.forEach(function (nodeModifier) {
            if (nodeModifier.kind === tsMorph.ts.SyntaxKind.Decorator) {
                result = true;
            }
        });
    }
    return result;
}
function getNodeDecorators(node) {
    var result = [];
    var nodeModifiers = node.modifiers; // ts.getModifiers(node);
    if (nodeModifiers && nodeModifiers.length > 0) {
        nodeModifiers.forEach(function (nodeModifier) {
            if (nodeModifier.kind === tsMorph.ts.SyntaxKind.Decorator) {
                result.push(nodeModifier);
            }
        });
    }
    return result;
}

var crypto$7 = require('crypto');
var ClassHelper = /** @class */ (function () {
    function ClassHelper(typeChecker) {
        this.typeChecker = typeChecker;
        this.jsdocParserUtil = new JsdocParserUtil();
    }
    /**
     * HELPERS
     */
    ClassHelper.prototype.stringifyDefaultValue = function (node) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (node.getText()) {
            return node.getText();
        }
        else if (node.kind === tsMorph.SyntaxKind.FalseKeyword) {
            return 'false';
        }
        else if (node.kind === tsMorph.SyntaxKind.TrueKeyword) {
            return 'true';
        }
    };
    ClassHelper.prototype.checkForDeprecation = function (tags, result) {
        ___namespace.forEach(tags, function (tag) {
            if (tag.tagName && tag.tagName.text && tag.tagName.text.indexOf('deprecated') > -1) {
                result.deprecated = true;
                result.deprecationMessage = tag.comment || '';
            }
        });
    };
    ClassHelper.prototype.getDecoratorOfType = function (node, decoratorType) {
        var decorators = getNodeDecorators(node) || [];
        var result = [];
        var len = decorators.length;
        if (len > 1) {
            for (var i = 0; i < decorators.length; i++) {
                if (decorators[i].expression.expression) {
                    if (decorators[i].expression.expression.text === decoratorType) {
                        result.push(decorators[i]);
                    }
                }
            }
            if (result.length > 0) {
                return result;
            }
        }
        else {
            if (len === 1 && decorators[0].expression && decorators[0].expression.expression) {
                if (decorators[0].expression.expression.text === decoratorType) {
                    result.push(decorators[0]);
                    return result;
                }
            }
        }
        return undefined;
    };
    ClassHelper.prototype.formatDecorators = function (decorators) {
        var _this = this;
        var _decorators = [];
        ___namespace.forEach(decorators, function (decorator) {
            if (decorator.expression) {
                if (decorator.expression.text) {
                    _decorators.push({ name: decorator.expression.text });
                }
                if (decorator.expression.expression) {
                    var info = { name: decorator.expression.expression.text };
                    if (decorator.expression.arguments) {
                        info.stringifiedArguments = _this.stringifyArguments(decorator.expression.arguments);
                    }
                    _decorators.push(info);
                }
            }
        });
        return _decorators;
    };
    ClassHelper.prototype.handleFunction = function (arg) {
        var _this = this;
        if (arg.function.length === 0) {
            return "".concat(arg.name).concat(this.getOptionalString(arg), ": () => void");
        }
        var argums = arg.function.map(function (argu) {
            var _result = DependenciesEngine$1.find(argu.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path = _result.data.type;
                    if (_result.data.type === 'class') {
                        path = 'classe';
                    }
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"../").concat(path, "s/").concat(_result.data.name, ".html\">").concat(argu.type, "</a>");
                }
                else {
                    var path = AngularVersionUtil$1.getApiLink(_result.data, Configuration$1.mainData.angularVersion);
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(argu.type, "</a>");
                }
            }
            else if (BasicTypeUtil$1.isKnownType(argu.type)) {
                var path = BasicTypeUtil$1.getTypeUrl(argu.type);
                return "".concat(argu.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(argu.type, "</a>");
            }
            else {
                if (argu.name && argu.type) {
                    return "".concat(argu.name).concat(_this.getOptionalString(arg), ": ").concat(argu.type);
                }
                else {
                    if (argu.name) {
                        return "".concat(argu.name.text);
                    }
                    else {
                        return '';
                    }
                }
            }
        });
        return "".concat(arg.name).concat(this.getOptionalString(arg), ": (").concat(argums, ") => void");
    };
    ClassHelper.prototype.getOptionalString = function (arg) {
        return arg.optional ? '?' : '';
    };
    ClassHelper.prototype.stringifyArguments = function (args) {
        var _this = this;
        var stringifyArgs = [];
        stringifyArgs = args
            .map(function (arg) {
            var _result = DependenciesEngine$1.find(arg.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path = _result.data.type;
                    if (_result.data.type === 'class') {
                        path = 'classe';
                    }
                    return "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"../").concat(path, "s/").concat(_result.data.name, ".html\">").concat(arg.type, "</a>");
                }
                else {
                    var path = AngularVersionUtil$1.getApiLink(_result.data, Configuration$1.mainData.angularVersion);
                    return "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(arg.type, "</a>");
                }
            }
            else if (arg.dotDotDotToken) {
                return "...".concat(arg.name, ": ").concat(arg.type);
            }
            else if (arg.function) {
                return _this.handleFunction(arg);
            }
            else if (arg.expression && arg.name) {
                return arg.expression.text + '.' + arg.name.text;
            }
            else if (arg.expression && arg.kind === tsMorph.SyntaxKind.NewExpression) {
                return 'new ' + arg.expression.text + '()';
            }
            else if (arg.kind && arg.kind === tsMorph.SyntaxKind.StringLiteral) {
                return "'" + arg.text + "'";
            }
            else if (arg.kind &&
                arg.kind === tsMorph.SyntaxKind.ArrayLiteralExpression &&
                arg.elements &&
                arg.elements.length > 0) {
                var i = 0, len = arg.elements.length, result = '[';
                for (i; i < len; i++) {
                    result += "'" + arg.elements[i].text + "'";
                    if (i < len - 1) {
                        result += ', ';
                    }
                }
                result += ']';
                return result;
            }
            else if (arg.kind &&
                arg.kind === tsMorph.SyntaxKind.ArrowFunction &&
                arg.parameters &&
                arg.parameters.length > 0) {
                return StringifyArrowFunction(arg);
            }
            else if (arg.kind && arg.kind === tsMorph.SyntaxKind.ObjectLiteralExpression) {
                return StringifyObjectLiteralExpression(arg);
            }
            else if (BasicTypeUtil$1.isKnownType(arg.type)) {
                var path = BasicTypeUtil$1.getTypeUrl(arg.type);
                return "".concat(arg.name).concat(_this.getOptionalString(arg), ": <a href=\"").concat(path, "\" target=\"_blank\">").concat(arg.type, "</a>");
            }
            else {
                if (arg.type) {
                    var finalStringifiedArgument = '';
                    var separator = ':';
                    if (arg.name) {
                        finalStringifiedArgument += arg.name;
                    }
                    if (arg.kind === tsMorph.SyntaxKind.AsExpression &&
                        arg.expression &&
                        arg.expression.text) {
                        finalStringifiedArgument += arg.expression.text;
                        separator = ' as';
                    }
                    if (arg.optional) {
                        finalStringifiedArgument += _this.getOptionalString(arg);
                    }
                    if (arg.type) {
                        finalStringifiedArgument += separator + ' ' + _this.visitType(arg.type);
                    }
                    return finalStringifiedArgument;
                }
                else if (arg.text) {
                    return "".concat(arg.text);
                }
                else {
                    return "".concat(arg.name).concat(_this.getOptionalString(arg));
                }
            }
        })
            .join(', ');
        return stringifyArgs;
    };
    ClassHelper.prototype.getPosition = function (node, sourceFile) {
        var position;
        if (node.name && node.name.end) {
            position = tsMorph.ts.getLineAndCharacterOfPosition(sourceFile, node.name.end);
        }
        else {
            position = tsMorph.ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
        }
        return position;
    };
    ClassHelper.prototype.addAccessor = function (accessors, nodeAccessor, sourceFile) {
        var _this = this;
        var nodeName = '';
        if (nodeAccessor.name) {
            nodeName = nodeAccessor.name.text;
            var jsdoctags = this.jsdocParserUtil.getJSDocs(nodeAccessor);
            if (!accessors[nodeName]) {
                accessors[nodeName] = {
                    name: nodeName,
                    setSignature: undefined,
                    getSignature: undefined
                };
            }
            if (nodeAccessor.kind === tsMorph.SyntaxKind.SetAccessor) {
                var setSignature = {
                    name: nodeName,
                    type: 'void',
                    deprecated: false,
                    deprecationMessage: '',
                    args: nodeAccessor.parameters.map(function (param) { return _this.visitArgument(param); }),
                    returnType: nodeAccessor.type ? this.visitType(nodeAccessor.type) : 'void',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    var comment = this.jsdocParserUtil.getMainCommentOfNode(nodeAccessor, sourceFile);
                    if (typeof comment !== 'undefined') {
                        var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
                        setSignature.rawdescription = cleanedDescription;
                        setSignature.description = markedAcl(cleanedDescription);
                    }
                }
                if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                    this.checkForDeprecation(jsdoctags[0].tags, setSignature);
                    setSignature.jsdoctags = markedtags(jsdoctags[0].tags);
                }
                if (setSignature.jsdoctags && setSignature.jsdoctags.length > 0) {
                    setSignature.jsdoctags = mergeTagsAndArgs(setSignature.args, setSignature.jsdoctags);
                }
                else if (setSignature.args && setSignature.args.length > 0) {
                    setSignature.jsdoctags = mergeTagsAndArgs(setSignature.args);
                }
                accessors[nodeName].setSignature = setSignature;
            }
            if (nodeAccessor.kind === tsMorph.SyntaxKind.GetAccessor) {
                var getSignature = {
                    name: nodeName,
                    type: nodeAccessor.type ? kindToType(nodeAccessor.type.kind) : '',
                    returnType: nodeAccessor.type ? this.visitType(nodeAccessor.type) : '',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    var comment = this.jsdocParserUtil.getMainCommentOfNode(nodeAccessor, sourceFile);
                    if (typeof comment !== 'undefined') {
                        var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
                        getSignature.rawdescription = cleanedDescription;
                        getSignature.description = markedAcl(cleanedDescription);
                    }
                }
                if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                    this.checkForDeprecation(jsdoctags[0].tags, getSignature);
                    getSignature.jsdoctags = markedtags(jsdoctags[0].tags);
                }
                accessors[nodeName].getSignature = getSignature;
            }
        }
    };
    ClassHelper.prototype.isDirectiveDecorator = function (decorator) {
        if (decorator.expression.expression) {
            var decoratorIdentifierText = decorator.expression.expression.text;
            return (decoratorIdentifierText === 'Directive' || decoratorIdentifierText === 'Component');
        }
        else {
            return false;
        }
    };
    ClassHelper.prototype.isServiceDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'Injectable'
            : false;
    };
    ClassHelper.prototype.isPrivate = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (member.modifiers) {
            var isPrivate = member.modifiers.some(function (modifier) { return modifier.kind === tsMorph.SyntaxKind.PrivateKeyword; });
            if (isPrivate) {
                return true;
            }
        }
        // Check for ECMAScript Private Fields
        if (member.name && member.name.escapedText) {
            var isPrivate = member.name.escapedText.indexOf('#') === 0;
            if (isPrivate) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isProtected = function (member) {
        if (member.modifiers) {
            var isProtected = member.modifiers.some(function (modifier) { return modifier.kind === tsMorph.SyntaxKind.ProtectedKeyword; });
            if (isProtected) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isInternal = function (member) {
        var e_1, _a, e_2, _b;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['internal'];
        if (member.jsDoc) {
            try {
                for (var _c = __values(member.jsDoc), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var doc = _d.value;
                    if (doc.tags) {
                        try {
                            for (var _e = (e_2 = void 0, __values(doc.tags)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var tag = _f.value;
                                if (internalTags.indexOf(tag.tagName.text) > -1) {
                                    return true;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return false;
    };
    ClassHelper.prototype.isPublic = function (member) {
        if (member.modifiers) {
            var isPublic = member.modifiers.some(function (modifier) { return modifier.kind === tsMorph.SyntaxKind.PublicKeyword; });
            if (isPublic) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isHiddenMember = function (member) {
        var e_3, _a, e_4, _b;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['hidden'];
        if (member.jsDoc) {
            try {
                for (var _c = __values(member.jsDoc), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var doc = _d.value;
                    if (doc.tags) {
                        try {
                            for (var _e = (e_4 = void 0, __values(doc.tags)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var tag = _f.value;
                                if (internalTags.indexOf(tag.tagName.text) > -1) {
                                    return true;
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return false;
    };
    ClassHelper.prototype.isPipeDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'Pipe'
            : false;
    };
    ClassHelper.prototype.isControllerDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'Controller'
            : false;
    };
    ClassHelper.prototype.isModuleDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'NgModule' ||
                decorator.expression.expression.text === 'Module'
            : false;
    };
    /**
     * VISITERS
     */
    ClassHelper.prototype.visitClassDeclaration = function (fileName, classDeclaration, sourceFile, astFile) {
        var symbol = this.typeChecker.getSymbolAtLocation(classDeclaration.name);
        var rawdescription = '';
        var deprecated = false;
        var deprecationMessage = '';
        var description = '';
        var jsdoctags = [];
        if (symbol) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(classDeclaration, sourceFile);
            rawdescription = this.jsdocParserUtil.parseComment(comment);
            description = markedAcl(rawdescription);
            if (symbol.valueDeclaration && isIgnore(symbol.valueDeclaration)) {
                return [{ ignore: true }];
            }
            if (symbol.declarations && symbol.declarations.length > 0) {
                var declarationsjsdoctags = this.jsdocParserUtil.getJSDocs(symbol.declarations[0]);
                if (declarationsjsdoctags &&
                    declarationsjsdoctags.length >= 1 &&
                    declarationsjsdoctags[0].tags) {
                    var deprecation = { deprecated: false, deprecationMessage: '' };
                    this.checkForDeprecation(declarationsjsdoctags[0].tags, deprecation);
                    deprecated = deprecation.deprecated;
                    deprecationMessage = deprecation.deprecationMessage;
                }
                if (isIgnore(symbol.declarations[0])) {
                    return [{ ignore: true }];
                }
            }
            if (symbol.valueDeclaration) {
                jsdoctags = this.jsdocParserUtil.getJSDocs(symbol.valueDeclaration);
                if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                    var deprecation = { deprecated: false, deprecationMessage: '' };
                    this.checkForDeprecation(jsdoctags[0].tags, deprecation);
                    deprecated = deprecation.deprecated;
                    deprecationMessage = deprecation.deprecationMessage;
                    jsdoctags = markedtags(jsdoctags[0].tags);
                }
            }
        }
        var className = classDeclaration.name.text;
        var members;
        var implementsElements = [];
        var extendsElements = [];
        if (typeof tsMorph.ts.getEffectiveImplementsTypeNodes !== 'undefined') {
            var implementedTypes = tsMorph.ts.getEffectiveImplementsTypeNodes(classDeclaration);
            if (implementedTypes) {
                var i = 0;
                var len = implementedTypes.length;
                for (i; i < len; i++) {
                    if (implementedTypes[i].expression) {
                        implementsElements.push(implementedTypes[i].expression.text);
                    }
                }
            }
        }
        if (typeof tsMorph.ts.getClassExtendsHeritageElement !== 'undefined') {
            if (astFile) {
                var interfaceOrClassNode = astFile.getInterface(className);
                if (!interfaceOrClassNode) {
                    interfaceOrClassNode = astFile.getClass(className);
                }
                if (interfaceOrClassNode) {
                    var extendsListRaw = interfaceOrClassNode.getExtends();
                    var extendsList_1 = [];
                    if (extendsListRaw) {
                        if (Array.isArray(extendsListRaw)) {
                            if (extendsListRaw.length > 0) {
                                extendsListRaw.forEach(function (extendElement) {
                                    var extendElementExpression = extendElement.getExpression();
                                    if (extendElementExpression) {
                                        var text = extendElementExpression.getText();
                                        if (text) {
                                            extendsList_1.push(text);
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            var extendElementExpression = extendsListRaw.getExpression();
                            if (extendElementExpression) {
                                var text = extendElementExpression.getText();
                                if (text) {
                                    extendsList_1.push(text);
                                }
                            }
                        }
                    }
                    extendsElements = extendsList_1;
                }
            }
        }
        members = this.visitMembers(classDeclaration.members, sourceFile);
        if (nodeHasDecorator(classDeclaration)) {
            var classDecorators = getNodeDecorators(classDeclaration);
            // Loop and search for official decorators at top-level :
            // Angular : @NgModule, @Component, @Directive, @Injectable, @Pipe
            // Nestjs : @Controller, @Module, @Injectable
            // Stencil : @Component
            var isDirective = false;
            var isService = false;
            var isPipe = false;
            var isModule = false;
            var isController = false;
            for (var a = 0; a < classDecorators.length; a++) {
                //console.log(classDeclaration.decorators[i].expression);
                // RETURN TOO EARLY FOR MANY DECORATORS !!!!
                // iterating through the decorators array we have to keep the flags `true` values from the previous loop iteration
                isDirective = isDirective || this.isDirectiveDecorator(classDecorators[a]);
                isService = isService || this.isServiceDecorator(classDecorators[a]);
                isPipe = isPipe || this.isPipeDecorator(classDecorators[a]);
                isModule = isModule || this.isModuleDecorator(classDecorators[a]);
                isController = isController || this.isControllerDecorator(classDecorators[a]);
            }
            if (isDirective) {
                return {
                    deprecated: deprecated,
                    deprecationMessage: deprecationMessage,
                    description: description,
                    rawdescription: rawdescription,
                    inputs: members.inputs,
                    outputs: members.outputs,
                    hostBindings: members.hostBindings,
                    hostListeners: members.hostListeners,
                    properties: members.properties,
                    methods: members.methods,
                    indexSignatures: members.indexSignatures,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElements,
                    implements: implementsElements,
                    accessors: members.accessors
                };
            }
            else if (isService) {
                return [
                    {
                        fileName: fileName,
                        className: className,
                        deprecated: deprecated,
                        deprecationMessage: deprecationMessage,
                        description: description,
                        rawdescription: rawdescription,
                        methods: members.methods,
                        indexSignatures: members.indexSignatures,
                        properties: members.properties,
                        kind: members.kind,
                        constructor: members.constructor,
                        jsdoctags: jsdoctags,
                        extends: extendsElements,
                        implements: implementsElements,
                        accessors: members.accessors
                    }
                ];
            }
            else if (isPipe) {
                return [
                    {
                        fileName: fileName,
                        className: className,
                        deprecated: deprecated,
                        deprecationMessage: deprecationMessage,
                        description: description,
                        rawdescription: rawdescription,
                        jsdoctags: jsdoctags,
                        properties: members.properties,
                        methods: members.methods
                    }
                ];
            }
            else if (isModule) {
                return [
                    {
                        fileName: fileName,
                        className: className,
                        deprecated: deprecated,
                        deprecationMessage: deprecationMessage,
                        description: description,
                        rawdescription: rawdescription,
                        jsdoctags: jsdoctags,
                        methods: members.methods
                    }
                ];
            }
            else {
                return [
                    {
                        deprecated: deprecated,
                        deprecationMessage: deprecationMessage,
                        description: description,
                        rawdescription: rawdescription,
                        methods: members.methods,
                        indexSignatures: members.indexSignatures,
                        properties: members.properties,
                        kind: members.kind,
                        constructor: members.constructor,
                        jsdoctags: jsdoctags,
                        extends: extendsElements,
                        implements: implementsElements,
                        accessors: members.accessors
                    }
                ];
            }
        }
        else if (description) {
            return [
                {
                    deprecated: deprecated,
                    deprecationMessage: deprecationMessage,
                    description: description,
                    rawdescription: rawdescription,
                    inputs: members.inputs,
                    outputs: members.outputs,
                    hostBindings: members.hostBindings,
                    hostListeners: members.hostListeners,
                    methods: members.methods,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElements,
                    implements: implementsElements,
                    accessors: members.accessors
                }
            ];
        }
        else {
            return [
                {
                    deprecated: deprecated,
                    deprecationMessage: deprecationMessage,
                    methods: members.methods,
                    inputs: members.inputs,
                    outputs: members.outputs,
                    hostBindings: members.hostBindings,
                    hostListeners: members.hostListeners,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElements,
                    implements: implementsElements,
                    accessors: members.accessors
                }
            ];
        }
    };
    ClassHelper.prototype.visitMembers = function (members, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var inputs = [];
        var outputs = [];
        var methods = [];
        var properties = [];
        var indexSignatures = [];
        var kind;
        var inputDecorator;
        var hostBindings = [];
        var hostListeners = [];
        var constructor;
        var outputDecorator;
        var accessors = {};
        var result = {};
        for (var i = 0; i < members.length; i++) {
            // Allows typescript guess type when using ts.is*
            var member = members[i];
            inputDecorator = this.getDecoratorOfType(member, 'Input');
            outputDecorator = this.getDecoratorOfType(member, 'Output');
            var parsedHostBindings = this.getDecoratorOfType(member, 'HostBinding');
            var parsedHostListeners = this.getDecoratorOfType(member, 'HostListener');
            kind = member.kind;
            if (isIgnore(member)) {
                continue;
            }
            if (this.isInternal(member) && Configuration$1.mainData.disableInternal) {
                continue;
            }
            if (inputDecorator && inputDecorator.length > 0) {
                inputs.push(this.visitInputAndHostBinding(member, inputDecorator[0], sourceFile));
                if (tsMorph.ts.isSetAccessorDeclaration(member)) {
                    this.addAccessor(accessors, members[i], sourceFile);
                }
            }
            else if (outputDecorator && outputDecorator.length > 0) {
                outputs.push(this.visitOutput(member, outputDecorator[0], sourceFile));
            }
            else if (parsedHostBindings && parsedHostBindings.length > 0) {
                var k = 0;
                var lenHB = parsedHostBindings.length;
                for (k; k < lenHB; k++) {
                    hostBindings.push(this.visitInputAndHostBinding(member, parsedHostBindings[k], sourceFile));
                }
            }
            else if (parsedHostListeners && parsedHostListeners.length > 0) {
                var l = 0;
                var lenHL = parsedHostListeners.length;
                for (l; l < lenHL; l++) {
                    hostListeners.push(this.visitHostListener(member, parsedHostListeners[l], sourceFile));
                }
            }
            if (!this.isHiddenMember(member)) {
                if (!(this.isPrivate(member) && Configuration$1.mainData.disablePrivate)) {
                    if (!(this.isInternal(member) && Configuration$1.mainData.disableInternal)) {
                        if (!(this.isProtected(member) && Configuration$1.mainData.disableProtected)) {
                            if (tsMorph.ts.isMethodDeclaration(member) || tsMorph.ts.isMethodSignature(member)) {
                                methods.push(this.visitMethodDeclaration(member, sourceFile));
                            }
                            else if (tsMorph.ts.isPropertyDeclaration(member) ||
                                tsMorph.ts.isPropertySignature(member)) {
                                if (!inputDecorator && !outputDecorator) {
                                    properties.push(this.visitProperty(member, sourceFile));
                                }
                            }
                            else if (tsMorph.ts.isCallSignatureDeclaration(member)) {
                                properties.push(this.visitCallDeclaration(member, sourceFile));
                            }
                            else if (tsMorph.ts.isGetAccessorDeclaration(member) ||
                                tsMorph.ts.isSetAccessorDeclaration(member)) {
                                this.addAccessor(accessors, members[i], sourceFile);
                            }
                            else if (tsMorph.ts.isIndexSignatureDeclaration(member)) {
                                indexSignatures.push(this.visitIndexDeclaration(member, sourceFile));
                            }
                            else if (tsMorph.ts.isConstructorDeclaration(member)) {
                                var _constructorProperties = this.visitConstructorProperties(member, sourceFile);
                                var j = 0;
                                var len = _constructorProperties.length;
                                for (j; j < len; j++) {
                                    properties.push(_constructorProperties[j]);
                                }
                                constructor = this.visitConstructorDeclaration(member, sourceFile);
                            }
                        }
                    }
                }
            }
        }
        inputs.sort(getNamesCompareFn());
        outputs.sort(getNamesCompareFn());
        hostBindings.sort(getNamesCompareFn());
        hostListeners.sort(getNamesCompareFn());
        properties.sort(getNamesCompareFn());
        methods.sort(getNamesCompareFn());
        indexSignatures.sort(getNamesCompareFn());
        result = {
            inputs: inputs,
            outputs: outputs,
            hostBindings: hostBindings,
            hostListeners: hostListeners,
            methods: methods,
            properties: properties,
            indexSignatures: indexSignatures,
            kind: kind,
            constructor: constructor
        };
        if (Object.keys(accessors).length) {
            result['accessors'] = accessors;
        }
        return result;
    };
    ClassHelper.prototype.visitTypeName = function (typeName) {
        if (typeName.escapedText) {
            return typeName.escapedText;
        }
        if (typeName.text) {
            return typeName.text;
        }
        if (typeName.left && typeName.right) {
            return this.visitTypeName(typeName.left) + '.' + this.visitTypeName(typeName.right);
        }
        return '';
    };
    ClassHelper.prototype.visitType = function (node) {
        var e_5, _a;
        var _this = this;
        var _return = 'void';
        if (!node) {
            return _return;
        }
        if (node.typeName) {
            _return = this.visitTypeName(node.typeName);
        }
        else if (node.type) {
            if (node.type.kind) {
                _return = kindToType(node.type.kind);
            }
            if (node.type.typeName) {
                _return = this.visitTypeName(node.type.typeName);
            }
            if (node.type.typeArguments) {
                _return += '<';
                var typeArguments = [];
                try {
                    for (var _b = __values(node.type.typeArguments), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var argument = _c.value;
                        typeArguments.push(this.visitType(argument));
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                _return += typeArguments.join(' | ');
                _return += '>';
            }
            if (node.type.elementType) {
                var _firstPart = this.visitType(node.type.elementType);
                _return = _firstPart + kindToType(node.type.kind);
                if (node.type.elementType.kind === tsMorph.SyntaxKind.ParenthesizedType) {
                    _return = '(' + _firstPart + ')' + kindToType(node.type.kind);
                }
            }
            var parseTypesOrElements = function (arr, separator) {
                var e_6, _a;
                var i = 0;
                var len = arr.length;
                for (i; i < len; i++) {
                    var type = arr[i];
                    if (type.elementType) {
                        var _firstPart = _this.visitType(type.elementType);
                        if (type.elementType.kind === tsMorph.SyntaxKind.ParenthesizedType) {
                            _return += '(' + _firstPart + ')' + kindToType(type.kind);
                        }
                        else {
                            _return += _firstPart + kindToType(type.kind);
                        }
                    }
                    else {
                        if (tsMorph.ts.isLiteralTypeNode(type) && type.literal) {
                            if (type.literal.text) {
                                _return += '"' + type.literal.text + '"';
                            }
                            else {
                                _return += kindToType(type.literal.kind);
                            }
                        }
                        else {
                            _return += kindToType(type.kind);
                        }
                        if (type.typeName) {
                            _return += _this.visitTypeName(type.typeName);
                        }
                        if (type.kind === tsMorph.SyntaxKind.RestType && type.type) {
                            _return += '...' + _this.visitType(type.type);
                        }
                        if (type.typeArguments) {
                            _return += '<';
                            var typeArguments = [];
                            try {
                                for (var _b = (e_6 = void 0, __values(type.typeArguments)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    var argument = _c.value;
                                    typeArguments.push(_this.visitType(argument));
                                }
                            }
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_6) throw e_6.error; }
                            }
                            _return += typeArguments.join(separator);
                            _return += '>';
                        }
                    }
                    if (i < len - 1) {
                        _return += separator;
                    }
                }
            };
            if (node.type.elements && tsMorph.ts.isTupleTypeNode(node.type)) {
                _return += '[';
                parseTypesOrElements(node.type.elements, ', ');
                _return += ']';
            }
            if (node.type.types && tsMorph.ts.isUnionTypeNode(node.type)) {
                parseTypesOrElements(node.type.types, ' | ');
            }
            if (node.type.elementTypes) {
                var elementTypes = node.type.elementTypes;
                var i = 0;
                var len = elementTypes.length;
                if (len > 0) {
                    _return = '[';
                    for (i; i < len; i++) {
                        var type = elementTypes[i];
                        if (type.kind === tsMorph.SyntaxKind.ArrayType && type.elementType) {
                            _return += kindToType(type.elementType.kind);
                            _return += kindToType(type.kind);
                        }
                        else {
                            _return += kindToType(type.kind);
                        }
                        if (tsMorph.ts.isLiteralTypeNode(type) && type.literal) {
                            if (type.literal.text) {
                                _return += '"' + type.literal.text + '"';
                            }
                            else {
                                _return += kindToType(type.literal.kind);
                            }
                        }
                        if (type.typeName) {
                            _return += this.visitTypeName(type.typeName);
                        }
                        if (type.kind === tsMorph.SyntaxKind.RestType && type.type) {
                            _return += '...' + this.visitType(type.type);
                        }
                        if (type.kind === tsMorph.SyntaxKind.TypeReference &&
                            type.typeName &&
                            typeof type.typeName.escapedText !== 'undefined' &&
                            type.typeName.escapedText === '') {
                            continue;
                        }
                        if (i < len - 1) {
                            _return += ', ';
                        }
                    }
                    _return += ']';
                }
            }
        }
        else if (node.elementType) {
            _return = kindToType(node.elementType.kind) + kindToType(node.kind);
            if (node.elementType.typeName) {
                _return = this.visitTypeName(node.elementType.typeName) + kindToType(node.kind);
            }
        }
        else if (node.types && tsMorph.ts.isUnionTypeNode(node)) {
            _return = '';
            var i = 0;
            var len = node.types.length;
            for (i; i < len; i++) {
                var type = node.types[i];
                _return += kindToType(type.kind);
                if (tsMorph.ts.isLiteralTypeNode(type) && type.literal) {
                    if (type.literal.text) {
                        _return += '"' + type.literal.text + '"';
                    }
                    else {
                        _return += kindToType(type.literal.kind);
                    }
                }
                if (type.typeName) {
                    _return += this.visitTypeName(type.typeName);
                }
                if (i < len - 1) {
                    _return += ' | ';
                }
            }
        }
        else if (node.dotDotDotToken) {
            _return = 'any[]';
        }
        else {
            _return = kindToType(node.kind);
            if (_return === '' &&
                node.initializer &&
                node.initializer.kind &&
                (node.kind === tsMorph.SyntaxKind.PropertyDeclaration || node.kind === tsMorph.SyntaxKind.Parameter)) {
                _return = kindToType(node.initializer.kind);
            }
            if (node.kind === tsMorph.SyntaxKind.TypeParameter) {
                _return = node.name.text;
            }
            if (node.kind === tsMorph.SyntaxKind.LiteralType) {
                _return = node.literal.text;
            }
        }
        if (node.typeArguments && node.typeArguments.length > 0) {
            _return += '<';
            var i = 0, len = node.typeArguments.length;
            for (i; i < len; i++) {
                var argument = node.typeArguments[i];
                _return += this.visitType(argument);
                if (i >= 0 && i < len - 1) {
                    _return += ', ';
                }
            }
            _return += '>';
        }
        return _return;
    };
    ClassHelper.prototype.visitCallDeclaration = function (method, sourceFile) {
        var _this = this;
        var sourceCode = sourceFile.getText();
        var hash = crypto$7.createHash('sha512').update(sourceCode).digest('hex');
        var result = {
            id: 'call-declaration-' + hash,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1,
            deprecated: false,
            deprecationMessage: ''
        };
        if (method.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(method, sourceFile);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            result.rawdescription = cleanedDescription;
            result.description = markedAcl(cleanedDescription);
        }
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
        }
        return result;
    };
    ClassHelper.prototype.visitIndexDeclaration = function (method, sourceFile) {
        var _this = this;
        var sourceCode = sourceFile.getText();
        var hash = crypto$7.createHash('sha512').update(sourceCode).digest('hex');
        var result = {
            id: 'index-declaration-' + hash,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1,
            deprecated: false,
            deprecationMessage: ''
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (method.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(method, sourceFile);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            result.rawdescription = cleanedDescription;
            result.description = markedAcl(cleanedDescription);
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                this.checkForDeprecation(jsdoctags[0].tags, result);
                if (method.jsDoc) {
                    result.jsdoctags = markedtags(jsdoctags[0].tags);
                }
            }
        }
        return result;
    };
    ClassHelper.prototype.visitConstructorDeclaration = function (method, sourceFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var result = {
            name: 'constructor',
            description: '',
            deprecated: false,
            deprecationMessage: '',
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (method.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(method, sourceFile);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            result.rawdescription = cleanedDescription;
            result.description = markedAcl(cleanedDescription);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (___namespace.indexOf(kinds, tsMorph.SyntaxKind.PublicKeyword) !== -1 &&
                    ___namespace.indexOf(kinds, tsMorph.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== tsMorph.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args);
        }
        return result;
    };
    ClassHelper.prototype.visitProperty = function (property, sourceFile) {
        var result = {
            name: property.name.text,
            defaultValue: property.initializer
                ? this.stringifyDefaultValue(property.initializer)
                : undefined,
            deprecated: false,
            deprecationMessage: '',
            type: this.visitType(property),
            optional: typeof property.questionToken !== 'undefined',
            description: '',
            line: this.getPosition(property, sourceFile).line + 1
        };
        var jsdoctags;
        if (property.initializer && property.initializer.kind === tsMorph.SyntaxKind.ArrowFunction) {
            result.defaultValue = '() => {...}';
        }
        if (typeof result.name === 'undefined' && typeof property.name.expression !== 'undefined') {
            result.name = property.name.expression.text;
        }
        jsdoctags = this.jsdocParserUtil.getJSDocs(property);
        if (property.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(property, sourceFile);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            result.rawdescription = cleanedDescription;
            result.description = markedAcl(cleanedDescription);
        }
        if (nodeHasDecorator(property)) {
            var propertyDecorators = getNodeDecorators(property);
            result.decorators = this.formatDecorators(propertyDecorators);
        }
        if (property.modifiers) {
            if (property.modifiers.length > 0) {
                var kinds = property.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (___namespace.indexOf(kinds, tsMorph.SyntaxKind.PublicKeyword) !== -1 &&
                    ___namespace.indexOf(kinds, tsMorph.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== tsMorph.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        // Check for ECMAScript Private Fields
        if (this.isPrivate(property)) {
            if (!result.modifierKind) {
                result.modifierKind = [];
            }
            var hasAlreadyPrivateLeyword_1 = false;
            result.modifierKind.forEach(function (modifierKind) {
                if (modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                    hasAlreadyPrivateLeyword_1 = true;
                }
            });
            if (!hasAlreadyPrivateLeyword_1) {
                result.modifierKind.push(tsMorph.SyntaxKind.PrivateKeyword);
            }
        }
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            if (property.jsDoc) {
                result.jsdoctags = markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    ClassHelper.prototype.visitConstructorProperties = function (constr, sourceFile) {
        if (constr.parameters) {
            var _parameters_1 = [];
            var i = 0;
            var len = constr.parameters.length;
            for (i; i < len; i++) {
                var parameterOfConstructor = constr.parameters[i];
                if (isIgnore(parameterOfConstructor)) {
                    continue;
                }
                if (this.isInternal(parameterOfConstructor) &&
                    Configuration$1.mainData.disableInternal) {
                    continue;
                }
                if (this.isPublic(parameterOfConstructor)) {
                    _parameters_1.push(this.visitProperty(constr.parameters[i], sourceFile));
                }
            }
            /**
             * Merge JSDoc tags description from constructor with parameters
             */
            if (constr.jsDoc) {
                if (constr.jsDoc.length > 0) {
                    var constrTags = constr.jsDoc[0].tags;
                    if (constrTags && constrTags.length > 0) {
                        constrTags.forEach(function (tag) {
                            _parameters_1.forEach(function (param) {
                                if (tag.tagName &&
                                    tag.tagName.escapedText &&
                                    tag.tagName.escapedText === 'param') {
                                    if (tag.name &&
                                        tag.name.escapedText &&
                                        tag.name.escapedText === param.name) {
                                        param.description = tag.comment;
                                    }
                                }
                            });
                        });
                    }
                }
            }
            return _parameters_1;
        }
        else {
            return [];
        }
    };
    ClassHelper.prototype.visitMethodDeclaration = function (method, sourceFile) {
        var _this = this;
        var result = {
            name: method.name.text,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            optional: typeof method.questionToken !== 'undefined',
            returnType: this.visitType(method.type),
            typeParameters: [],
            line: this.getPosition(method, sourceFile).line + 1,
            deprecated: false,
            deprecationMessage: ''
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type === 'undefined') {
            // Try to get inferred type
            if (method.symbol) {
                var symbol = method.symbol;
                if (symbol.valueDeclaration) {
                    var symbolType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    if (symbolType) {
                        try {
                            var signature = this.typeChecker.getSignatureFromDeclaration(method);
                            var returnType = signature.getReturnType();
                            result.returnType = this.typeChecker.typeToString(returnType);
                            // tslint:disable-next-line:no-empty
                        }
                        catch (error) { }
                    }
                }
            }
        }
        if (method.typeParameters && method.typeParameters.length > 0) {
            result.typeParameters = method.typeParameters.map(function (typeParameter) {
                return _this.visitType(typeParameter);
            });
        }
        if (method.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(method, sourceFile);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            result.rawdescription = cleanedDescription;
            result.description = markedAcl(cleanedDescription);
        }
        if (nodeHasDecorator(method)) {
            var methodDecorators = getNodeDecorators(method);
            result.decorators = this.formatDecorators(methodDecorators);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (___namespace.indexOf(kinds, tsMorph.SyntaxKind.PublicKeyword) !== -1 &&
                    ___namespace.indexOf(kinds, tsMorph.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== tsMorph.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        // Check for ECMAScript Private Fields
        if (this.isPrivate(method)) {
            if (!result.modifierKind) {
                result.modifierKind = [];
            }
            var hasAlreadyPrivateLeyword_2 = false;
            result.modifierKind.forEach(function (modifierKind) {
                if (modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                    hasAlreadyPrivateLeyword_2 = true;
                }
            });
            if (!hasAlreadyPrivateLeyword_2) {
                result.modifierKind.push(tsMorph.SyntaxKind.PrivateKeyword);
            }
        }
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args);
        }
        return result;
    };
    ClassHelper.prototype.visitOutput = function (property, outDecorator, sourceFile) {
        var inArgs = outDecorator.expression.arguments;
        var _return = {
            name: inArgs.length > 0 ? inArgs[0].text : property.name.text,
            defaultValue: property.initializer
                ? this.stringifyDefaultValue(property.initializer)
                : undefined,
            deprecated: false,
            deprecationMessage: ''
        };
        if (property.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(property, sourceFile);
            var jsdoctags = this.jsdocParserUtil.getJSDocs(property);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            _return.rawdescription = cleanedDescription;
            _return.description = markedAcl(cleanedDescription);
            if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                this.checkForDeprecation(jsdoctags[0].tags, _return);
                _return.jsdoctags = markedtags(jsdoctags[0].tags);
            }
        }
        if (!_return.description) {
            if (property.jsDoc && property.jsDoc.length > 0) {
                if (typeof property.jsDoc[0].comment !== 'undefined') {
                    var rawDescription = property.jsDoc[0].comment;
                    _return.rawdescription = rawDescription;
                    _return.description = markedAcl(rawDescription);
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (tsMorph.ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
        }
        return _return;
    };
    ClassHelper.prototype.visitArgument = function (arg) {
        var _this = this;
        var _result = {
            name: arg.name.text,
            type: this.visitType(arg),
            deprecated: false,
            deprecationMessage: ''
        };
        if (arg.dotDotDotToken) {
            _result.dotDotDotToken = true;
        }
        if (arg.questionToken) {
            _result.optional = true;
        }
        if (arg.type) {
            if (arg.type.kind) {
                if (tsMorph.ts.isFunctionTypeNode(arg.type)) {
                    _result.function = arg.type.parameters
                        ? arg.type.parameters.map(function (prop) { return _this.visitArgument(prop); })
                        : [];
                }
            }
        }
        if (arg.initializer) {
            _result.defaultValue = this.stringifyDefaultValue(arg.initializer);
        }
        var jsdoctags = this.jsdocParserUtil.getJSDocs(arg);
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, _result);
        }
        return _result;
    };
    ClassHelper.prototype.visitInputAndHostBinding = function (property, inDecorator, sourceFile) {
        var inArgs = inDecorator.expression.arguments;
        var _return = {};
        var isInputConfigStringLiteral = false;
        var isInputConfigObjectLiteralExpression = false;
        var hasRequiredField = false;
        var hasAlias = false;
        var getRequiredField = function () {
            return inArgs[0].properties.find(function (property) { return property.name.escapedText === 'required'; });
        };
        var getAliasProperty = function () {
            return inArgs[0].properties.find(function (property) { return property.name.escapedText === 'alias'; });
        };
        if (inArgs.length > 0) {
            isInputConfigStringLiteral = inArgs[0] && tsMorph.ts.isStringLiteral(inArgs[0]);
            isInputConfigObjectLiteralExpression =
                inArgs[0] && tsMorph.ts.isObjectLiteralExpression(inArgs[0]);
            if (isInputConfigObjectLiteralExpression && inArgs[0].properties) {
                hasRequiredField = isInputConfigObjectLiteralExpression && !!getRequiredField();
                hasAlias = isInputConfigObjectLiteralExpression ? !!getAliasProperty() : false;
                _return.required = !!getRequiredField();
            }
            _return.name = isInputConfigStringLiteral
                ? inArgs[0].text
                : hasAlias
                    ? getAliasProperty().initializer.text
                    : property.name.text;
        }
        else {
            _return.name = property.name.text;
        }
        _return.defaultValue = property.initializer
            ? this.stringifyDefaultValue(property.initializer)
            : undefined;
        _return.deprecated = false;
        _return.deprecationMessage = '';
        if (inArgs.length > 0 && inArgs[0].properties && hasRequiredField) {
            _return.optional = getRequiredField().initializer.kind !== tsMorph.SyntaxKind.TrueKeyword;
        }
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    var jsdoctags = this.jsdocParserUtil.getJSDocs(property);
                    if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                        this.checkForDeprecation(jsdoctags[0].tags, _return);
                        _return.jsdoctags = markedtags(jsdoctags[0].tags);
                    }
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        var comment = this.jsdocParserUtil.getMainCommentOfNode(property, sourceFile);
                        var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
                        _return.rawdescription = cleanedDescription;
                        _return.description = markedAcl(cleanedDescription);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (tsMorph.ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
            // Try to get inferred type
            if (property.symbol) {
                var symbol = property.symbol;
                if (symbol.valueDeclaration) {
                    var symbolType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    if (symbolType) {
                        _return.type = this.typeChecker.typeToString(symbolType);
                    }
                }
            }
        }
        if (property.kind === tsMorph.SyntaxKind.SetAccessor) {
            // For setter accessor, find type in first parameter
            if (property.parameters && property.parameters.length === 1) {
                if (property.parameters[0].type) {
                    _return.type = this.visitType(property.parameters[0].type);
                }
            }
        }
        if (nodeHasDecorator(property)) {
            var propertyDecorators = getNodeDecorators(property);
            _return.decorators = this.formatDecorators(propertyDecorators).filter(function (item) { return item.name !== 'Input' && item.name !== 'HostBinding'; });
        }
        return _return;
    };
    ClassHelper.prototype.visitHostListener = function (property, hostListenerDecorator, sourceFile) {
        var _this = this;
        var inArgs = hostListenerDecorator.expression.arguments;
        var _return = {};
        _return.name = inArgs.length > 0 ? inArgs[0].text : property.name.text;
        _return.args = property.parameters
            ? property.parameters.map(function (prop) { return _this.visitArgument(prop); })
            : [];
        _return.argsDecorator =
            inArgs.length > 1
                ? inArgs[1].elements.map(function (prop) {
                    return prop.text;
                })
                : [];
        _return.deprecated = false;
        _return.deprecationMessage = '';
        if (property.jsDoc) {
            var comment = this.jsdocParserUtil.getMainCommentOfNode(property, sourceFile);
            var jsdoctags = this.jsdocParserUtil.getJSDocs(property);
            var cleanedDescription = this.jsdocParserUtil.parseComment(comment);
            _return.rawdescription = cleanedDescription;
            _return.description = markedAcl(cleanedDescription);
            if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                this.checkForDeprecation(jsdoctags[0].tags, _return);
                _return.jsdoctags = markedtags(jsdoctags[0].tags);
            }
        }
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        var rawDescription = property.jsDoc[0].comment;
                        _return.rawdescription = rawDescription;
                        _return.description = markedAcl(rawDescription);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        return _return;
    };
    return ClassHelper;
}());

var TsPrinterUtil = /** @class */ (function () {
    function TsPrinterUtil() {
        this.printer = tsMorph.ts.createPrinter({
            newLine: tsMorph.ts.NewLineKind.LineFeed
        });
    }
    TsPrinterUtil.prototype.print = function (node) {
        return this.printer.printNode(tsMorph.ts.EmitHint.Unspecified, node, tsMorph.ts.createSourceFile('', '', tsMorph.ts.ScriptTarget.Latest));
    };
    return TsPrinterUtil;
}());

var SymbolHelper = /** @class */ (function () {
    function SymbolHelper() {
        this.unknown = '???';
    }
    SymbolHelper.prototype.parseDeepIndentifier = function (name, srcFile) {
        var result = {
            name: '',
            type: ''
        };
        if (typeof name === 'undefined') {
            return result;
        }
        var nsModule = name.split('.');
        var type = this.getType(name);
        if (nsModule.length > 1) {
            result.ns = nsModule[0];
            result.name = name;
            result.type = type;
            return result;
        }
        if (typeof srcFile !== 'undefined') {
            result.file = ImportsUtil$1.getFileNameOfImport(name, srcFile);
        }
        result.name = name;
        result.type = type;
        return result;
    };
    SymbolHelper.prototype.getType = function (name) {
        var type;
        if (name.toLowerCase().indexOf('component') !== -1) {
            type = 'component';
        }
        else if (name.toLowerCase().indexOf('pipe') !== -1) {
            type = 'pipe';
        }
        else if (name.toLowerCase().indexOf('controller') !== -1) {
            type = 'controller';
        }
        else if (name.toLowerCase().indexOf('module') !== -1) {
            type = 'module';
        }
        else if (name.toLowerCase().indexOf('directive') !== -1) {
            type = 'directive';
        }
        else if (name.toLowerCase().indexOf('injectable') !== -1 ||
            name.toLowerCase().indexOf('service') !== -1) {
            type = 'injectable';
        }
        return type;
    };
    /**
     * Output
     * RouterModule.forRoot 179
     */
    SymbolHelper.prototype.buildIdentifierName = function (node, name) {
        if (tsMorph.ts.isIdentifier(node) && !tsMorph.ts.isPropertyAccessExpression(node)) {
            return "".concat(node.text, ".").concat(name);
        }
        name = name ? ".".concat(name) : '';
        var nodeName = this.unknown;
        if (node.name) {
            nodeName = node.name.text;
        }
        else if (node.text) {
            nodeName = node.text;
        }
        else if (node.expression) {
            if (node.expression.text) {
                nodeName = node.expression.text;
            }
            else if (node.expression.elements) {
                if (tsMorph.ts.isArrayLiteralExpression(node.expression)) {
                    nodeName = node.expression.elements.map(function (el) { return el.text; }).join(', ');
                    nodeName = "[".concat(nodeName, "]");
                }
            }
        }
        if (tsMorph.ts.isSpreadElement(node)) {
            return "...".concat(nodeName);
        }
        return "".concat(this.buildIdentifierName(node.expression, nodeName)).concat(name);
    };
    /**
     * parse expressions such as:
     * { provide: APP_BASE_HREF, useValue: '/' }
     * { provide: 'Date', useFactory: (d1, d2) => new Date(), deps: ['d1', 'd2'] }
     */
    SymbolHelper.prototype.parseProviderConfiguration = function (node) {
        if (node.kind && node.kind === tsMorph.SyntaxKind.ObjectLiteralExpression) {
            // Search for provide: HTTP_INTERCEPTORS
            // and if true, return type: 'interceptor' + name
            var interceptorName_1, hasInterceptor_1;
            if (node.properties) {
                if (node.properties.length > 0) {
                    ___namespace.forEach(node.properties, function (property) {
                        if (property.kind && property.kind === tsMorph.SyntaxKind.PropertyAssignment) {
                            if (property.name.text === 'provide') {
                                if (property.initializer.text === 'HTTP_INTERCEPTORS') {
                                    hasInterceptor_1 = true;
                                }
                            }
                            if (property.name.text === 'useClass' ||
                                property.name.text === 'useExisting') {
                                interceptorName_1 = property.initializer.text;
                            }
                        }
                    });
                }
            }
            if (hasInterceptor_1) {
                return interceptorName_1;
            }
            else {
                return new TsPrinterUtil().print(node);
            }
        }
        else {
            return new TsPrinterUtil().print(node);
        }
    };
    /**
     * Kind
     *  181 CallExpression => "RouterModule.forRoot(args)"
     *   71 Identifier     => "RouterModule" "TodoStore"
     *    9 StringLiteral  => "./app.component.css" "./tab.scss"
     */
    SymbolHelper.prototype.parseSymbolElements = function (node) {
        // parse expressions such as: AngularFireModule.initializeApp(firebaseConfig)
        // if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        if ((tsMorph.ts.isCallExpression(node) && tsMorph.ts.isPropertyAccessExpression(node.expression)) ||
            (tsMorph.ts.isNewExpression(node) && tsMorph.ts.isElementAccessExpression(node.expression))) {
            var className = this.buildIdentifierName(node.expression);
            // function arguments could be really complex. There are so
            // many use cases that we can't handle. Just print "args" to indicate
            // that we have arguments.
            var functionArgs = node.arguments.length > 0 ? 'args' : '';
            var text = "".concat(className, "(").concat(functionArgs, ")");
            return text;
        }
        else if (tsMorph.ts.isPropertyAccessExpression(node)) {
            // parse expressions such as: Shared.Module
            return this.buildIdentifierName(node);
        }
        else if (tsMorph.ts.isIdentifier(node)) {
            // parse expressions such as: MyComponent
            if (node.text) {
                return node.text;
            }
            if (node.escapedText) {
                return node.escapedText;
            }
        }
        else if (tsMorph.ts.isSpreadElement(node)) {
            // parse expressions such as: ...MYARRAY
            // Resolve MYARRAY in imports or local file variables after full scan, just return the name of the variable
            if (node.expression && node.expression.text) {
                return node.expression.text;
            }
        }
        return node.text ? node.text : this.parseProviderConfiguration(node);
    };
    /**
     * Kind
     *  177 ArrayLiteralExpression
     *  122 BooleanKeyword
     *    9 StringLiteral
     */
    SymbolHelper.prototype.parseSymbols = function (node, srcFile, decoratorType) {
        var _this = this;
        var localNode = node;
        if (tsMorph.ts.isShorthandPropertyAssignment(localNode) && decoratorType !== 'template') {
            localNode = ImportsUtil$1.findValueInImportOrLocalVariables(node.name.text, srcFile, decoratorType);
        }
        if (tsMorph.ts.isShorthandPropertyAssignment(localNode) && decoratorType === 'template') {
            var data = ImportsUtil$1.findValueInImportOrLocalVariables(node.name.text, srcFile, decoratorType);
            return [data];
        }
        if (localNode.initializer && tsMorph.ts.isArrayLiteralExpression(localNode.initializer)) {
            return localNode.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
        else if ((localNode.initializer && tsMorph.ts.isStringLiteral(localNode.initializer)) ||
            (localNode.initializer && tsMorph.ts.isTemplateLiteral(localNode.initializer)) ||
            (localNode.initializer &&
                tsMorph.ts.isPropertyAssignment(localNode) &&
                localNode.initializer.text)) {
            return [localNode.initializer.text];
        }
        else if (localNode.initializer &&
            localNode.initializer.kind &&
            (localNode.initializer.kind === tsMorph.SyntaxKind.TrueKeyword ||
                localNode.initializer.kind === tsMorph.SyntaxKind.FalseKeyword)) {
            return [localNode.initializer.kind === tsMorph.SyntaxKind.TrueKeyword ? true : false];
        }
        else if (localNode.initializer && tsMorph.ts.isPropertyAccessExpression(localNode.initializer)) {
            var identifier = this.parseSymbolElements(localNode.initializer);
            return [identifier];
        }
        else if (localNode.initializer &&
            localNode.initializer.elements &&
            localNode.initializer.elements.length > 0) {
            // Node replaced by ts-simple-ast & kind = 265
            return localNode.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
    };
    SymbolHelper.prototype.getSymbolDeps = function (props, decoratorType, srcFile, multiLine) {
        var _this = this;
        if (props.length === 0) {
            return [];
        }
        var i = 0, len = props.length, filteredProps = [];
        for (i; i < len; i++) {
            if (props[i].name && props[i].name.text === decoratorType) {
                filteredProps.push(props[i]);
            }
        }
        return filteredProps.map(function (x) { return _this.parseSymbols(x, srcFile, decoratorType); }).pop() || [];
    };
    SymbolHelper.prototype.getSymbolDepsRaw = function (props, type, multiLine) {
        return props.filter(function (node) { return node.name.text === type; });
    };
    return SymbolHelper;
}());

var ComponentHelper = /** @class */ (function () {
    function ComponentHelper(classHelper, symbolHelper) {
        if (symbolHelper === void 0) { symbolHelper = new SymbolHelper(); }
        this.classHelper = classHelper;
        this.symbolHelper = symbolHelper;
    }
    ComponentHelper.prototype.getComponentChangeDetection = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'changeDetection', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentEncapsulation = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'encapsulation', srcFile);
    };
    ComponentHelper.prototype.getComponentPure = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'pure', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentName = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'name', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentExportAs = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'exportAs', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentHostDirectives = function (props) {
        var hostDirectiveSymbolParsed = this.symbolHelper.getSymbolDepsRaw(props, 'hostDirectives');
        var hostDirectiveSymbol = null;
        if (hostDirectiveSymbolParsed.length > 0) {
            hostDirectiveSymbol = hostDirectiveSymbolParsed.pop();
        }
        var result = [];
        if (hostDirectiveSymbol &&
            hostDirectiveSymbol.initializer &&
            hostDirectiveSymbol.initializer.elements &&
            hostDirectiveSymbol.initializer.elements.length > 0) {
            hostDirectiveSymbol.initializer.elements.forEach(function (element) {
                if (element.kind === tsMorph.SyntaxKind.Identifier) {
                    result.push({
                        name: element.escapedText
                    });
                }
                else if (element.kind === tsMorph.SyntaxKind.ObjectLiteralExpression &&
                    element.properties &&
                    element.properties.length > 0) {
                    var parsedDirective_1 = {
                        name: '',
                        inputs: [],
                        outputs: []
                    };
                    element.properties.forEach(function (property) {
                        if (property.name.escapedText === 'directive') {
                            parsedDirective_1.name = property.initializer.escapedText;
                        }
                        else if (property.name.escapedText === 'inputs') {
                            if (property.initializer &&
                                property.initializer.elements &&
                                property.initializer.elements.length > 0) {
                                property.initializer.elements.forEach(function (propertyElement) {
                                    parsedDirective_1.inputs.push(propertyElement.text);
                                });
                            }
                        }
                        else if (property.name.escapedText === 'outputs') {
                            if (property.initializer &&
                                property.initializer.elements &&
                                property.initializer.elements.length > 0) {
                                property.initializer.elements.forEach(function (propertyElement) {
                                    parsedDirective_1.outputs.push(propertyElement.text);
                                });
                            }
                        }
                    });
                    result.push(parsedDirective_1);
                }
            });
        }
        return result;
    };
    ComponentHelper.prototype.getComponentHost = function (props) {
        return this.getSymbolDepsObject(props, 'host');
    };
    ComponentHelper.prototype.getComponentTag = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'tag', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentInputsMetadata = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'inputs', srcFile);
    };
    ComponentHelper.prototype.getComponentStandalone = function (props, srcFile) {
        var result = null;
        var parsedData = this.symbolHelper.getSymbolDeps(props, 'standalone', srcFile);
        if (parsedData.length === 1) {
            result = JSON.parse(parsedData[0]);
        }
        return result;
    };
    ComponentHelper.prototype.getComponentTemplate = function (props, srcFile) {
        var t = this.symbolHelper.getSymbolDeps(props, 'template', srcFile, true).pop();
        if (t) {
            t = detectIndent(t, 0);
            t = t.replace(/\n/, '');
            t = t.replace(/ +$/gm, '');
        }
        return t;
    };
    ComponentHelper.prototype.getComponentStyleUrls = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'styleUrls', srcFile);
    };
    ComponentHelper.prototype.getComponentStyleUrl = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'styleUrl', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentShadow = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'shadow', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentScoped = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'scoped', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentAssetsDir = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'assetsDir', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentAssetsDirs = function (props, srcFile) {
        return this.sanitizeUrls(this.symbolHelper.getSymbolDeps(props, 'assetsDir', srcFile));
    };
    ComponentHelper.prototype.getComponentStyles = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'styles', srcFile);
    };
    ComponentHelper.prototype.getComponentModuleId = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'moduleId', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentOutputs = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'outputs', srcFile);
    };
    ComponentHelper.prototype.getComponentProviders = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'providers', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ComponentHelper.prototype.getComponentImports = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'imports', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ComponentHelper.prototype.getComponentEntryComponents = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'entryComponents', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ComponentHelper.prototype.getComponentViewProviders = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'viewProviders', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ComponentHelper.prototype.getComponentTemplateUrl = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'templateUrl', srcFile);
    };
    ComponentHelper.prototype.getComponentExampleUrls = function (text) {
        var exampleUrlsMatches = text.match(/<example-url>(.*?)<\/example-url>/g);
        var exampleUrls = undefined;
        if (exampleUrlsMatches && exampleUrlsMatches.length) {
            exampleUrls = exampleUrlsMatches.map(function (val) {
                return val.replace(/<\/?example-url>/g, '');
            });
        }
        return exampleUrls;
    };
    ComponentHelper.prototype.getComponentPreserveWhitespaces = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'preserveWhitespaces', srcFile).pop();
    };
    ComponentHelper.prototype.getComponentSelector = function (props, srcFile) {
        return this.symbolHelper.getSymbolDeps(props, 'selector', srcFile).pop();
    };
    ComponentHelper.prototype.parseProperties = function (node) {
        var obj = new Map();
        var properties = node.initializer.properties || [];
        properties.forEach(function (prop) {
            obj.set(prop.name.text, prop.initializer.text);
        });
        return obj;
    };
    ComponentHelper.prototype.getSymbolDepsObject = function (props, type, multiLine) {
        var _this = this;
        var i = 0, len = props.length, filteredProps = [];
        for (i; i < len; i++) {
            if (props[i].name && props[i].name.text === type) {
                filteredProps.push(props[i]);
            }
        }
        return filteredProps.map(function (x) { return _this.parseProperties(x); }).pop();
    };
    ComponentHelper.prototype.getComponentIO = function (filename, sourceFile, node, fileBody, astFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (tsMorph.ts.isClassDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile, astFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    ComponentHelper.prototype.sanitizeUrls = function (urls) {
        return urls.map(function (url) { return url.replace('./', ''); });
    };
    return ComponentHelper;
}());
var ComponentCache = /** @class */ (function () {
    function ComponentCache() {
        this.cache = new Map();
    }
    ComponentCache.prototype.get = function (key) {
        return this.cache.get(key);
    };
    ComponentCache.prototype.set = function (key, value) {
        this.cache.set(key, value);
    };
    return ComponentCache;
}());

var FrameworkDependencies = /** @class */ (function () {
    function FrameworkDependencies(files, options) {
        this.files = files;
        var transpileOptions = {
            target: tsMorph.ts.ScriptTarget.ES5,
            module: tsMorph.ts.ModuleKind.CommonJS,
            tsconfigDirectory: options.tsconfigDirectory,
            allowJs: true
        };
        this.program = tsMorph.ts.createProgram(this.files, transpileOptions, compilerHost(transpileOptions));
        this.typeChecker = this.program.getTypeChecker();
        this.classHelper = new ClassHelper(this.typeChecker);
        this.componentHelper = new ComponentHelper(this.classHelper);
    }
    return FrameworkDependencies;
}());

var ExtendsMerger = /** @class */ (function () {
    function ExtendsMerger() {
    }
    ExtendsMerger.getInstance = function () {
        if (!ExtendsMerger.instance) {
            ExtendsMerger.instance = new ExtendsMerger();
        }
        return ExtendsMerger.instance;
    };
    ExtendsMerger.prototype.merge = function (deps) {
        var _this = this;
        this.components = deps.components;
        this.classes = deps.classes;
        this.injectables = deps.injectables;
        this.directives = deps.directives;
        this.controllers = deps.controllers;
        var mergeExtendedProperties = function (component) {
            var ext;
            if (typeof component.extends !== 'undefined') {
                ext = _this.findInDependencies(component.extends[0]);
                if (ext) {
                    var recursiveScanWithInheritance_1 = function (cls) {
                        // From class to component
                        if (typeof cls.methods !== 'undefined' && cls.methods.length > 0) {
                            var newMethods = _.cloneDeep(cls.methods);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof component.methodsClass !== 'undefined') {
                                _this.mergeInheritance(component, 'methodsClass', newMethods);
                            }
                        }
                        if (typeof cls.properties !== 'undefined' && cls.properties.length > 0) {
                            var newProperties = _.cloneDeep(cls.properties);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof component.propertiesClass !== 'undefined') {
                                _this.mergeInheritance(component, 'propertiesClass', newProperties);
                            }
                        }
                        // From component to component or directive to component
                        if (typeof cls.inputsClass !== 'undefined' && cls.inputsClass.length > 0) {
                            var newInputs = _.cloneDeep(cls.inputsClass);
                            newInputs = _this.markInheritance(newInputs, cls);
                            if (typeof component.inputsClass !== 'undefined') {
                                _this.mergeInheritance(component, 'inputsClass', newInputs);
                            }
                        }
                        if (typeof cls.outputsClass !== 'undefined' &&
                            cls.outputsClass.length > 0) {
                            var newOutputs = _.cloneDeep(cls.outputsClass);
                            newOutputs = _this.markInheritance(newOutputs, cls);
                            if (typeof component.outputsClass !== 'undefined') {
                                _this.mergeInheritance(component, 'outputsClass', newOutputs);
                            }
                        }
                        if (typeof cls.methodsClass !== 'undefined' &&
                            cls.methodsClass.length > 0) {
                            var newMethods = _.cloneDeep(cls.methodsClass);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof component.methodsClass !== 'undefined') {
                                _this.mergeInheritance(component, 'methodsClass', newMethods);
                            }
                        }
                        if (typeof cls.propertiesClass !== 'undefined' &&
                            cls.propertiesClass.length > 0) {
                            var newProperties = _.cloneDeep(cls.propertiesClass);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof component.propertiesClass !== 'undefined') {
                                _this.mergeInheritance(component, 'propertiesClass', newProperties);
                            }
                        }
                        if (typeof cls.hostBindings !== 'undefined' &&
                            cls.hostBindings.length > 0) {
                            var newHostBindings = _.cloneDeep(cls.hostBindings);
                            newHostBindings = _this.markInheritance(newHostBindings, cls);
                            if (typeof component.hostBindings !== 'undefined') {
                                _this.mergeInheritance(component, 'hostBindings', newHostBindings);
                            }
                        }
                        if (typeof cls.hostListeners !== 'undefined' &&
                            cls.hostListeners.length > 0) {
                            var newHostListeners = _.cloneDeep(cls.hostListeners);
                            newHostListeners = _this.markInheritance(newHostListeners, cls);
                            if (typeof component.hostListeners !== 'undefined') {
                                _this.mergeInheritance(component, 'hostListeners', newHostListeners);
                            }
                        }
                        if (Configuration$1.mainData.disableLifeCycleHooks) {
                            component.methodsClass = cleanLifecycleHooksFromMethods(component.methodsClass);
                        }
                        if (cls.extends) {
                            recursiveScanWithInheritance_1(_this.findInDependencies(cls.extends[0]));
                        }
                    };
                    // From class to class
                    recursiveScanWithInheritance_1(ext);
                }
            }
        };
        this.components.forEach(mergeExtendedProperties);
        this.directives.forEach(mergeExtendedProperties);
        this.controllers.forEach(mergeExtendedProperties);
        var mergeExtendedClasses = function (el) {
            var ext;
            if (typeof el.extends !== 'undefined') {
                ext = _this.findInDependencies(el.extends[0]);
                if (ext) {
                    var recursiveScanWithInheritance_2 = function (cls) {
                        if (typeof cls.methods !== 'undefined' && cls.methods.length > 0) {
                            var newMethods = _.cloneDeep(cls.methods);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof el.methods !== 'undefined') {
                                _this.mergeInheritance(el, 'methods', newMethods);
                            }
                        }
                        if (typeof cls.properties !== 'undefined' && cls.properties.length > 0) {
                            var newProperties = _.cloneDeep(cls.properties);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof el.properties !== 'undefined') {
                                _this.mergeInheritance(el, 'properties', newProperties);
                            }
                        }
                        if (cls.extends) {
                            recursiveScanWithInheritance_2(_this.findInDependencies(cls.extends[0]));
                        }
                    };
                    // From elss to elss
                    recursiveScanWithInheritance_2(ext);
                }
            }
        };
        this.classes.forEach(mergeExtendedClasses);
        this.injectables.forEach(mergeExtendedClasses);
        this.directives.forEach(mergeExtendedClasses);
        this.controllers.forEach(mergeExtendedClasses);
        return deps;
    };
    ExtendsMerger.prototype.markInheritance = function (data, originalource) {
        return data.map(function (el) {
            var newElement = el;
            newElement.inheritance = {
                file: originalource.name
            };
            return newElement;
        });
    };
    ExtendsMerger.prototype.mergeInheritance = function (component, metaPropertyId, newMembers) {
        newMembers.forEach(function (newMember) {
            var overriddenMethod = component[metaPropertyId].find(function (componentMember) { return componentMember.name === newMember.name; });
            if (overriddenMethod) {
                overriddenMethod.inheritance = newMember.inheritance;
            }
            else {
                component[metaPropertyId].push(newMember);
            }
        });
    };
    ExtendsMerger.prototype.findInDependencies = function (name) {
        var mergedData = _.concat([], this.components, this.classes, this.injectables, this.directives, this.controllers);
        var result = _.find(mergedData, { name: name });
        return result || false;
    };
    return ExtendsMerger;
}());
var ExtendsMerger$1 = ExtendsMerger.getInstance();

var CodeGenerator = /** @class */ (function () {
    function CodeGenerator() {
    }
    CodeGenerator.prototype.generate = function (node) {
        return this.visitAndRecognize(node, []).join('');
    };
    CodeGenerator.prototype.visitAndRecognize = function (node, code, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        this.recognize(node, code);
        node.getChildren().forEach(function (c) { return _this.visitAndRecognize(c, code, depth + 1); });
        return code;
    };
    CodeGenerator.prototype.recognize = function (node, code) {
        var _this = this;
        var conversion = TsKindConversion.find(function (x) { return x.kinds.some(function (z) { return z === node.kind; }); });
        if (conversion) {
            var result = conversion.output(node);
            result.forEach(function (text) { return _this.gen(text, code); });
        }
    };
    CodeGenerator.prototype.gen = function (token, code) {
        if (!token) {
            return;
        }
        if (token === '\n') {
            code.push('');
        }
        else {
            code.push(token);
        }
    };
    return CodeGenerator;
}());
var TsKindsToText = /** @class */ (function () {
    function TsKindsToText(output, kinds) {
        this.output = output;
        this.kinds = kinds;
    }
    return TsKindsToText;
}());
var TsKindConversion = [
    new TsKindsToText(function (node) { return ['"', node.text, '"']; }, [tsMorph.SyntaxKind.FirstLiteralToken, tsMorph.SyntaxKind.Identifier]),
    new TsKindsToText(function (node) { return ['"', node.text, '"']; }, [tsMorph.SyntaxKind.StringLiteral]),
    new TsKindsToText(function (node) { return []; }, [tsMorph.SyntaxKind.ArrayLiteralExpression]),
    new TsKindsToText(function (node) { return ['import', ' ']; }, [tsMorph.SyntaxKind.ImportKeyword]),
    new TsKindsToText(function (node) { return ['from', ' ']; }, [tsMorph.SyntaxKind.FromKeyword]),
    new TsKindsToText(function (node) { return ['\n', 'export', ' ']; }, [tsMorph.SyntaxKind.ExportKeyword]),
    new TsKindsToText(function (node) { return ['class', ' ']; }, [tsMorph.SyntaxKind.ClassKeyword]),
    new TsKindsToText(function (node) { return ['this']; }, [tsMorph.SyntaxKind.ThisKeyword]),
    new TsKindsToText(function (node) { return ['constructor']; }, [tsMorph.SyntaxKind.ConstructorKeyword]),
    new TsKindsToText(function (node) { return ['false']; }, [tsMorph.SyntaxKind.FalseKeyword]),
    new TsKindsToText(function (node) { return ['true']; }, [tsMorph.SyntaxKind.TrueKeyword]),
    new TsKindsToText(function (node) { return ['null']; }, [tsMorph.SyntaxKind.NullKeyword]),
    new TsKindsToText(function (node) { return []; }, [tsMorph.SyntaxKind.AtToken]),
    new TsKindsToText(function (node) { return ['+']; }, [tsMorph.SyntaxKind.PlusToken]),
    new TsKindsToText(function (node) { return [' => ']; }, [tsMorph.SyntaxKind.EqualsGreaterThanToken]),
    new TsKindsToText(function (node) { return ['(']; }, [tsMorph.SyntaxKind.OpenParenToken]),
    new TsKindsToText(function (node) { return ['{', ' ']; }, [tsMorph.SyntaxKind.ImportClause, tsMorph.SyntaxKind.ObjectLiteralExpression]),
    new TsKindsToText(function (node) { return ['{', '\n']; }, [tsMorph.SyntaxKind.Block]),
    new TsKindsToText(function (node) { return ['}']; }, [tsMorph.SyntaxKind.CloseBraceToken]),
    new TsKindsToText(function (node) { return [')']; }, [tsMorph.SyntaxKind.CloseParenToken]),
    new TsKindsToText(function (node) { return ['[']; }, [tsMorph.SyntaxKind.OpenBracketToken]),
    new TsKindsToText(function (node) { return [']']; }, [tsMorph.SyntaxKind.CloseBracketToken]),
    new TsKindsToText(function (node) { return [';', '\n']; }, [tsMorph.SyntaxKind.SemicolonToken]),
    new TsKindsToText(function (node) { return [',', ' ']; }, [tsMorph.SyntaxKind.CommaToken]),
    new TsKindsToText(function (node) { return [' ', ':', ' ']; }, [tsMorph.SyntaxKind.ColonToken]),
    new TsKindsToText(function (node) { return ['.']; }, [tsMorph.SyntaxKind.DotToken]),
    new TsKindsToText(function (node) { return []; }, [tsMorph.SyntaxKind.DoStatement]),
    new TsKindsToText(function (node) { return []; }, [tsMorph.SyntaxKind.Decorator]),
    new TsKindsToText(function (node) { return [' = ']; }, [tsMorph.SyntaxKind.FirstAssignment]),
    new TsKindsToText(function (node) { return [' ']; }, [tsMorph.SyntaxKind.FirstPunctuation]),
    new TsKindsToText(function (node) { return ['private', ' ']; }, [tsMorph.SyntaxKind.PrivateKeyword]),
    new TsKindsToText(function (node) { return ['public', ' ']; }, [tsMorph.SyntaxKind.PublicKeyword])
];

var crypto$6 = require('crypto');
var ComponentDepFactory = /** @class */ (function () {
    function ComponentDepFactory(helper) {
        this.helper = helper;
    }
    ComponentDepFactory.prototype.create = function (file, srcFile, name, props, IO) {
        // console.log(util.inspect(props, { showHidden: true, depth: 10 }));
        var sourceCode = srcFile.getText();
        var hash = crypto$6.createHash('sha512').update(sourceCode).digest('hex');
        var componentDep = {
            name: name,
            id: 'component-' + name + '-' + hash,
            file: file,
            // animations?: string[]; // TODO
            changeDetection: this.helper.getComponentChangeDetection(props, srcFile),
            encapsulation: this.helper.getComponentEncapsulation(props, srcFile),
            entryComponents: this.helper.getComponentEntryComponents(props, srcFile),
            exportAs: this.helper.getComponentExportAs(props, srcFile),
            host: this.helper.getComponentHost(props),
            inputs: this.helper.getComponentInputsMetadata(props, srcFile),
            // interpolation?: string; // TODO waiting doc infos
            moduleId: this.helper.getComponentModuleId(props, srcFile),
            outputs: this.helper.getComponentOutputs(props, srcFile),
            providers: this.helper.getComponentProviders(props, srcFile),
            // queries?: Deps[]; // TODO
            selector: this.helper.getComponentSelector(props, srcFile),
            styleUrls: this.helper.getComponentStyleUrls(props, srcFile),
            styles: this.helper.getComponentStyles(props, srcFile),
            template: this.helper.getComponentTemplate(props, srcFile),
            templateUrl: this.helper.getComponentTemplateUrl(props, srcFile),
            viewProviders: this.helper.getComponentViewProviders(props, srcFile),
            hostDirectives: __spreadArray([], __read(this.helper.getComponentHostDirectives(props)), false),
            inputsClass: IO.inputs,
            outputsClass: IO.outputs,
            propertiesClass: IO.properties,
            methodsClass: IO.methods,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage,
            hostBindings: IO.hostBindings,
            hostListeners: IO.hostListeners,
            standalone: this.helper.getComponentStandalone(props, srcFile) ? true : false,
            imports: this.helper.getComponentImports(props, srcFile),
            description: IO.description,
            rawdescription: IO.rawdescription,
            type: 'component',
            sourceCode: srcFile.getText(),
            exampleUrls: this.helper.getComponentExampleUrls(srcFile.getText()),
            tag: this.helper.getComponentTag(props, srcFile),
            styleUrl: this.helper.getComponentStyleUrl(props, srcFile),
            shadow: this.helper.getComponentShadow(props, srcFile),
            scoped: this.helper.getComponentScoped(props, srcFile),
            assetsDir: this.helper.getComponentAssetsDir(props, srcFile),
            assetsDirs: this.helper.getComponentAssetsDirs(props, srcFile),
            styleUrlsData: '',
            stylesData: ''
        };
        if (typeof this.helper.getComponentPreserveWhitespaces(props, srcFile) !== 'undefined') {
            componentDep.preserveWhitespaces = this.helper.getComponentPreserveWhitespaces(props, srcFile);
        }
        if (Configuration$1.mainData.disableLifeCycleHooks) {
            componentDep.methodsClass = cleanLifecycleHooksFromMethods(componentDep.methodsClass);
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            componentDep.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.constructor) {
            componentDep.constructorObj = IO.constructor;
        }
        if (IO.extends) {
            componentDep.extends = IO.extends;
        }
        if (IO.implements && IO.implements.length > 0) {
            componentDep.implements = IO.implements;
        }
        if (IO.accessors) {
            componentDep.accessors = IO.accessors;
        }
        return componentDep;
    };
    return ComponentDepFactory;
}());

var crypto$5 = require('crypto');
var ControllerDepFactory = /** @class */ (function () {
    function ControllerDepFactory() {
    }
    ControllerDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto$5.createHash('sha512').update(sourceCode).digest('hex');
        var infos = {
            name: name,
            id: 'controller-' + name + '-' + hash,
            file: file,
            methodsClass: IO.methods,
            type: 'controller',
            description: IO.description,
            rawdescription: IO.rawdescription,
            sourceCode: srcFile.text,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage
        };
        if (properties && properties.length === 1) {
            if (properties[0].text) {
                infos.prefix = properties[0].text;
            }
        }
        if (IO.extends) {
            infos.extends = IO.extends;
        }
        return infos;
    };
    return ControllerDepFactory;
}());

var crypto$4 = require('crypto');
var DirectiveDepFactory = /** @class */ (function () {
    function DirectiveDepFactory(helper) {
        this.helper = helper;
    }
    DirectiveDepFactory.prototype.create = function (file, srcFile, name, props, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto$4.createHash('sha512').update(sourceCode).digest('hex');
        var directiveDeps = {
            name: name,
            id: 'directive-' + name + '-' + hash,
            file: file,
            type: 'directive',
            description: IO.description,
            rawdescription: IO.rawdescription,
            sourceCode: srcFile.getText(),
            selector: this.helper.getComponentSelector(props, srcFile),
            providers: this.helper.getComponentProviders(props, srcFile),
            exportAs: this.helper.getComponentExportAs(props, srcFile),
            hostDirectives: __spreadArray([], __read(this.helper.getComponentHostDirectives(props)), false),
            standalone: this.helper.getComponentStandalone(props, srcFile) ? true : false,
            inputsClass: IO.inputs,
            outputsClass: IO.outputs,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage,
            hostBindings: IO.hostBindings,
            hostListeners: IO.hostListeners,
            propertiesClass: IO.properties,
            methodsClass: IO.methods,
            exampleUrls: this.helper.getComponentExampleUrls(srcFile.getText())
        };
        if (Configuration$1.mainData.disableLifeCycleHooks) {
            directiveDeps.methodsClass = cleanLifecycleHooksFromMethods(directiveDeps.methodsClass);
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            directiveDeps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.extends) {
            directiveDeps.extends = IO.extends;
        }
        if (IO.implements && IO.implements.length > 0) {
            directiveDeps.implements = IO.implements;
        }
        if (IO.constructor) {
            directiveDeps.constructorObj = IO.constructor;
        }
        if (IO.accessors) {
            directiveDeps.accessors = IO.accessors;
        }
        return directiveDeps;
    };
    return DirectiveDepFactory;
}());

var JsDocHelper = /** @class */ (function () {
    function JsDocHelper() {
    }
    JsDocHelper.prototype.hasJSDocInternalTag = function (filename, sourceFile, node) {
        if (typeof sourceFile.statements !== 'undefined') {
            return this.checkStatements(sourceFile.statements, node);
        }
        return false;
    };
    JsDocHelper.prototype.checkStatements = function (statements, node) {
        var _this = this;
        return statements.some(function (x) { return _this.checkStatement(x, node); });
    };
    JsDocHelper.prototype.checkStatement = function (statement, node) {
        if (statement.pos === node.pos && statement.end === node.end) {
            if (node.jsDoc && node.jsDoc.length > 0) {
                return this.checkJsDocs(node.jsDoc);
            }
        }
        return false;
    };
    JsDocHelper.prototype.checkJsDocs = function (jsDocs) {
        var _this = this;
        return jsDocs
            .filter(function (x) { return x.tags && x.tags.length > 0; })
            .some(function (x) { return _this.checkJsDocTags(x.tags); });
    };
    JsDocHelper.prototype.checkJsDocTags = function (tags) {
        return tags.some(function (x) { return x.tagName && x.tagName.text === 'internal'; });
    };
    return JsDocHelper;
}());

var ModuleHelper = /** @class */ (function () {
    function ModuleHelper(cache, symbolHelper) {
        if (symbolHelper === void 0) { symbolHelper = new SymbolHelper(); }
        this.cache = cache;
        this.symbolHelper = symbolHelper;
    }
    ModuleHelper.prototype.getModuleProviders = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'providers', srcFile)
            .map(function (providerName) { return _this.symbolHelper.parseDeepIndentifier(providerName, srcFile); });
    };
    ModuleHelper.prototype.getModuleControllers = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'controllers', srcFile)
            .map(function (providerName) { return _this.symbolHelper.parseDeepIndentifier(providerName, srcFile); });
    };
    ModuleHelper.prototype.getModuleDeclarations = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper.getSymbolDeps(props, 'declarations', srcFile).map(function (name) {
            var component = _this.cache.get(name);
            if (component) {
                return component;
            }
            return _this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    };
    ModuleHelper.prototype.getModuleEntryComponents = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper.getSymbolDeps(props, 'entryComponents', srcFile).map(function (name) {
            var component = _this.cache.get(name);
            if (component) {
                return component;
            }
            return _this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    };
    ModuleHelper.prototype.cleanImportForRootForChild = function (name) {
        var nsModule = name.split('.');
        if (nsModule.length > 0) {
            name = nsModule[0];
        }
        return name;
    };
    ModuleHelper.prototype.getModuleImports = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'imports', srcFile)
            .map(function (name) { return _this.cleanImportForRootForChild(name); })
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ModuleHelper.prototype.getModuleExports = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'exports', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name, srcFile); });
    };
    ModuleHelper.prototype.getModuleImportsRaw = function (props, srcFile) {
        return this.symbolHelper.getSymbolDepsRaw(props, 'imports');
    };
    ModuleHelper.prototype.getModuleId = function (props, srcFile) {
        var _id = this.symbolHelper.getSymbolDeps(props, 'id', srcFile), id;
        if (_id.length === 1) {
            id = _id[0];
        }
        return id;
    };
    ModuleHelper.prototype.getModuleSchemas = function (props, srcFile) {
        var schemas = this.symbolHelper.getSymbolDeps(props, 'schemas', srcFile);
        return schemas;
    };
    ModuleHelper.prototype.getModuleBootstrap = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'bootstrap', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name, srcFile); });
    };
    return ModuleHelper;
}());

var crypto$3 = require('crypto');
var ModuleDepFactory = /** @class */ (function () {
    function ModuleDepFactory(moduleHelper) {
        this.moduleHelper = moduleHelper;
    }
    ModuleDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto$3.createHash('sha512').update(sourceCode).digest('hex');
        return {
            name: name,
            id: 'module-' + name + '-' + hash,
            file: file,
            ngid: this.moduleHelper.getModuleId(properties, srcFile),
            providers: this.moduleHelper.getModuleProviders(properties, srcFile),
            declarations: this.moduleHelper.getModuleDeclarations(properties, srcFile),
            controllers: this.moduleHelper.getModuleControllers(properties, srcFile),
            entryComponents: this.moduleHelper.getModuleEntryComponents(properties, srcFile),
            imports: this.moduleHelper.getModuleImports(properties, srcFile),
            exports: this.moduleHelper.getModuleExports(properties, srcFile),
            schemas: this.moduleHelper.getModuleSchemas(properties, srcFile),
            bootstrap: this.moduleHelper.getModuleBootstrap(properties, srcFile),
            type: 'module',
            rawdescription: IO.rawdescription,
            methods: IO.methods,
            description: IO.description,
            sourceCode: srcFile.text,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage
        };
    };
    return ModuleDepFactory;
}());

var crypto$2 = require('crypto');
var EntityDepFactory = /** @class */ (function () {
    function EntityDepFactory() {
    }
    EntityDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto$2.createHash('sha512').update(sourceCode).digest('hex');
        var infos = {
            name: name,
            id: 'controller-' + name + '-' + hash,
            file: file,
            type: 'entity',
            description: IO.description,
            rawdescription: IO.rawdescription,
            sourceCode: srcFile.text,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage,
            properties: IO.properties
        };
        return infos;
    };
    return EntityDepFactory;
}());

var crypto$1 = require('crypto');
var project = new tsMorph.Project();
// TypeScript reference : https://github.com/Microsoft/TypeScript/blob/master/lib/typescript.d.ts
var AngularDependencies = /** @class */ (function (_super) {
    __extends(AngularDependencies, _super);
    function AngularDependencies(files, options) {
        var _this = _super.call(this, files, options) || this;
        _this.cache = new ComponentCache();
        _this.moduleHelper = new ModuleHelper(_this.cache);
        _this.jsDocHelper = new JsDocHelper();
        _this.symbolHelper = new SymbolHelper();
        _this.jsdocParserUtil = new JsdocParserUtil();
        return _this;
    }
    AngularDependencies.prototype.getDependencies = function () {
        var _this = this;
        var deps = {
            modules: [],
            modulesForGraph: [],
            components: [],
            controllers: [],
            entities: [],
            injectables: [],
            interceptors: [],
            guards: [],
            pipes: [],
            directives: [],
            routes: [],
            classes: [],
            interfaces: [],
            miscellaneous: {
                variables: [],
                functions: [],
                typealiases: [],
                enumerations: []
            },
            routesTree: undefined
        };
        var sourceFiles = this.program.getSourceFiles() || [];
        RouterParserUtil$1.scannedFiles = sourceFiles;
        sourceFiles.map(function (file) {
            var filePath = file.fileName;
            if (path__namespace.extname(filePath) === '.ts' || path__namespace.extname(filePath) === '.tsx') {
                if (!Configuration$1.mainData.angularJSProject && path__namespace.extname(filePath) === '.js') {
                    logger.info('parsing', filePath);
                    _this.getSourceFileDecorators(file, deps);
                }
                else {
                    if (filePath.lastIndexOf('.d.ts') === -1 &&
                        filePath.lastIndexOf('spec.ts') === -1) {
                        logger.info('parsing', filePath);
                        _this.getSourceFileDecorators(file, deps);
                    }
                }
            }
            return deps;
        });
        // End of file scanning
        // Try merging inside the same file declarated variables & modules with imports | exports | declarations | providers
        if (deps.miscellaneous.variables.length > 0) {
            deps.miscellaneous.variables.forEach(function (_variable) {
                var newVar = [];
                // link ...VAR to VAR values, recursively
                (function (_var, _newVar) {
                    // getType pr reconstruire....
                    var elementsMatcher = function (variabelToReplace) {
                        if (variabelToReplace.initializer) {
                            if (variabelToReplace.initializer.elements) {
                                if (variabelToReplace.initializer.elements.length > 0) {
                                    variabelToReplace.initializer.elements.forEach(function (element) {
                                        // Direct value -> Kind 79
                                        if (element.text &&
                                            element.kind === tsMorph.SyntaxKind.Identifier) {
                                            newVar.push({
                                                name: element.text,
                                                type: _this.symbolHelper.getType(element.text)
                                            });
                                        }
                                        // if _variable is ArrayLiteralExpression 203
                                        // and has SpreadElements in his elements
                                        // merge them
                                        if (element.kind === tsMorph.SyntaxKind.SpreadElement &&
                                            element.expression) {
                                            var el = deps.miscellaneous.variables.find(function (variable) {
                                                return variable.name === element.expression.text;
                                            });
                                            if (el) {
                                                elementsMatcher(el);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    };
                    elementsMatcher(_var);
                })(_variable);
                var onLink = function (mod) {
                    var process = function (initialArray, _var) {
                        var indexToClean = 0;
                        var found = false;
                        var findVariableInArray = function (el, index) {
                            if (el.name === _var.name) {
                                indexToClean = index;
                                found = true;
                            }
                        };
                        initialArray.forEach(findVariableInArray);
                        // Clean indexes to replace
                        if (found) {
                            initialArray.splice(indexToClean, 1);
                            // Add variable
                            newVar.forEach(function (newEle) {
                                if (typeof ___namespace.find(initialArray, { name: newEle.name }) ===
                                    'undefined') {
                                    initialArray.push(newEle);
                                }
                            });
                        }
                    };
                    process(mod.imports, _variable);
                    process(mod.exports, _variable);
                    process(mod.controllers, _variable);
                    process(mod.declarations, _variable);
                    process(mod.providers, _variable);
                };
                deps.modules.forEach(onLink);
                deps.modulesForGraph.forEach(onLink);
            });
        }
        /**
         * If one thing extends another, merge them, only for internal sources
         * - classes
         * - components
         * - injectables
         * - directives
         * for
         * - inputs
         * - outputs
         * - properties
         * - methods
         */
        deps = ExtendsMerger$1.merge(deps);
        // RouterParserUtil.printModulesRoutes();
        // RouterParserUtil.printRoutes();
        if (!Configuration$1.mainData.disableRoutesGraph) {
            RouterParserUtil$1.linkModulesAndRoutes();
            RouterParserUtil$1.constructModulesTree();
            deps.routesTree = RouterParserUtil$1.constructRoutesTree();
        }
        return deps;
    };
    AngularDependencies.prototype.processClass = function (node, file, srcFile, outputSymbols, fileBody, astFile) {
        var name = this.getSymboleName(node);
        var IO = this.getClassIO(file, srcFile, node, fileBody, astFile);
        var sourceCode = srcFile.getText();
        var hash = crypto$1.createHash('sha512').update(sourceCode).digest('hex');
        var deps = {
            name: name,
            id: 'class-' + name + '-' + hash,
            file: file,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage,
            type: 'class',
            sourceCode: srcFile.getText()
        };
        var excludeFromClassArray = false;
        if (IO.constructor) {
            deps.constructorObj = IO.constructor;
        }
        if (IO.properties) {
            deps.properties = IO.properties;
        }
        if (IO.description) {
            deps.description = IO.description;
        }
        if (IO.rawdescription) {
            deps.rawdescription = IO.rawdescription;
        }
        if (IO.methods) {
            deps.methods = IO.methods;
        }
        if (IO.indexSignatures) {
            deps.indexSignatures = IO.indexSignatures;
        }
        if (IO.extends) {
            deps.extends = IO.extends;
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            deps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.accessors) {
            deps.accessors = IO.accessors;
        }
        if (IO.inputs) {
            deps.inputsClass = IO.inputs;
        }
        if (IO.outputs) {
            deps.outputsClass = IO.outputs;
        }
        if (IO.hostBindings) {
            deps.hostBindings = IO.hostBindings;
        }
        if (IO.hostListeners) {
            deps.hostListeners = IO.hostListeners;
        }
        if (Configuration$1.mainData.disableLifeCycleHooks) {
            deps.methods = cleanLifecycleHooksFromMethods(deps.methods);
        }
        if (IO.implements && IO.implements.length > 0) {
            deps.implements = IO.implements;
            if (this.isGuard(IO.implements)) {
                // We don't want the Guard to show up in the Classes menu
                excludeFromClassArray = true;
                deps.type = 'guard';
                outputSymbols.guards.push(deps);
            }
        }
        if (typeof IO.ignore === 'undefined') {
            this.debug(deps);
            if (!excludeFromClassArray) {
                outputSymbols.classes.push(deps);
            }
        }
        else {
            this.ignore(deps);
        }
    };
    AngularDependencies.prototype.getSourceFileDecorators = function (initialSrcFile, outputSymbols) {
        var _this = this;
        var cleaner = (process.cwd() + path__namespace.sep).replace(/\\/g, '/');
        var fileName = initialSrcFile.fileName.replace(cleaner, '');
        var scannedFile = initialSrcFile;
        // Search in file for variable statement as routes definitions
        var astFile = typeof project.getSourceFile(initialSrcFile.fileName) !== 'undefined'
            ? project.getSourceFile(initialSrcFile.fileName)
            : project.addSourceFileAtPath(initialSrcFile.fileName);
        var variableRoutesStatements = astFile.getVariableStatements();
        var hasRoutesStatements = false;
        if (variableRoutesStatements.length > 0) {
            // Clean file for spread and dynamics inside routes definitions
            variableRoutesStatements.forEach(function (s) {
                var variableDeclarations = s.getDeclarations();
                var len = variableDeclarations.length;
                var i = 0;
                for (i; i < len; i++) {
                    if (variableDeclarations[i].compilerNode.type) {
                        if (variableDeclarations[i].compilerNode.type.typeName &&
                            variableDeclarations[i].compilerNode.type.typeName.text === 'Routes') {
                            hasRoutesStatements = true;
                        }
                    }
                }
            });
        }
        if (hasRoutesStatements && !Configuration$1.mainData.disableRoutesGraph) {
            // Clean file for spread and dynamics inside routes definitions
            logger.info('Analysing routes definitions and clean them if necessary');
            // scannedFile = RouterParserUtil.cleanFileIdentifiers(astFile).compilerNode;
            RouterParserUtil$1.cleanFileSpreads(astFile);
            scannedFile = RouterParserUtil$1.cleanCallExpressions(astFile).compilerNode;
            scannedFile = RouterParserUtil$1.cleanFileDynamics(astFile).compilerNode;
            scannedFile.kind = tsMorph.SyntaxKind.SourceFile;
        }
        tsMorph.ts.forEachChild(scannedFile, function (initialNode) {
            if (_this.jsDocHelper.hasJSDocInternalTag(fileName, scannedFile, initialNode) &&
                Configuration$1.mainData.disableInternal) {
                return;
            }
            var parseNode = function (file, srcFile, node, fileBody, astFile) {
                var sourceCode = srcFile.getText();
                var hash = crypto$1.createHash('sha512').update(sourceCode).digest('hex');
                if (nodeHasDecorator(node)) {
                    var classWithCustomDecorator_1 = false;
                    var nodeDecorators_1 = getNodeDecorators(node);
                    var visitDecorator = function (visitedDecorator, index) {
                        var deps;
                        var name = _this.getSymboleName(node);
                        var props = _this.findProperties(visitedDecorator, srcFile);
                        var IO = _this.componentHelper.getComponentIO(file, srcFile, node, fileBody, astFile);
                        if (_this.isModule(visitedDecorator)) {
                            var moduleDep = new ModuleDepFactory(_this.moduleHelper).create(file, srcFile, name, props, IO);
                            if (RouterParserUtil$1.hasRouterModuleInImports(moduleDep.imports)) {
                                RouterParserUtil$1.addModuleWithRoutes(name, _this.moduleHelper.getModuleImportsRaw(props, srcFile), file);
                            }
                            deps = moduleDep;
                            if (typeof IO.ignore === 'undefined') {
                                RouterParserUtil$1.addModule(name, moduleDep.imports);
                                outputSymbols.modules.push(moduleDep);
                                outputSymbols.modulesForGraph.push(moduleDep);
                            }
                        }
                        else if (_this.isComponent(visitedDecorator)) {
                            if (props.length === 0) {
                                return;
                            }
                            var componentDep = new ComponentDepFactory(_this.componentHelper).create(file, srcFile, name, props, IO);
                            deps = componentDep;
                            if (typeof IO.ignore === 'undefined') {
                                ComponentsTreeEngine$1.addComponent(componentDep);
                                outputSymbols.components.push(componentDep);
                            }
                        }
                        else if (_this.isController(visitedDecorator)) {
                            var controllerDep = new ControllerDepFactory().create(file, srcFile, name, props, IO);
                            deps = controllerDep;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.controllers.push(controllerDep);
                            }
                        }
                        else if (_this.isEntity(visitedDecorator)) {
                            var entityDep = new EntityDepFactory().create(file, srcFile, name, props, IO);
                            deps = entityDep;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.entities.push(entityDep);
                            }
                        }
                        else if (_this.isInjectable(visitedDecorator)) {
                            var injectableDeps = {
                                name: name,
                                id: 'injectable-' + name + '-' + hash,
                                file: file,
                                properties: IO.properties,
                                methods: IO.methods,
                                deprecated: IO.deprecated,
                                deprecationMessage: IO.deprecationMessage,
                                description: IO.description,
                                rawdescription: IO.rawdescription,
                                sourceCode: srcFile.getText(),
                                exampleUrls: _this.componentHelper.getComponentExampleUrls(srcFile.getText())
                            };
                            if (IO.constructor) {
                                injectableDeps.constructorObj = IO.constructor;
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                injectableDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            if (IO.accessors) {
                                injectableDeps.accessors = IO.accessors;
                            }
                            if (IO.extends) {
                                injectableDeps.extends = IO.extends;
                            }
                            if (Configuration$1.mainData.disableLifeCycleHooks) {
                                injectableDeps.methods = cleanLifecycleHooksFromMethods(injectableDeps.methods);
                            }
                            deps = injectableDeps;
                            if (typeof IO.ignore === 'undefined') {
                                if (___namespace.includes(IO.implements, 'HttpInterceptor')) {
                                    injectableDeps.type = 'interceptor';
                                    outputSymbols.interceptors.push(injectableDeps);
                                }
                                else if (_this.isGuard(IO.implements)) {
                                    injectableDeps.type = 'guard';
                                    outputSymbols.guards.push(injectableDeps);
                                }
                                else {
                                    injectableDeps.type = 'injectable';
                                    _this.addNewEntityInStore(injectableDeps, outputSymbols.injectables);
                                }
                            }
                        }
                        else if (_this.isPipe(visitedDecorator)) {
                            var pipeDeps = {
                                name: name,
                                id: 'pipe-' + name + '-' + hash,
                                file: file,
                                type: 'pipe',
                                deprecated: IO.deprecated,
                                deprecationMessage: IO.deprecationMessage,
                                description: IO.description,
                                rawdescription: IO.rawdescription,
                                properties: IO.properties,
                                methods: IO.methods,
                                standalone: _this.componentHelper.getComponentStandalone(props, srcFile)
                                    ? true
                                    : false,
                                pure: _this.componentHelper.getComponentPure(props, srcFile),
                                ngname: _this.componentHelper.getComponentName(props, srcFile),
                                sourceCode: srcFile.getText(),
                                exampleUrls: _this.componentHelper.getComponentExampleUrls(srcFile.getText())
                            };
                            if (Configuration$1.mainData.disableLifeCycleHooks) {
                                pipeDeps.methods = cleanLifecycleHooksFromMethods(pipeDeps.methods);
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                pipeDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            deps = pipeDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.pipes.push(pipeDeps);
                            }
                        }
                        else if (_this.isDirective(visitedDecorator)) {
                            var directiveDeps = new DirectiveDepFactory(_this.componentHelper).create(file, srcFile, name, props, IO);
                            deps = directiveDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.directives.push(directiveDeps);
                            }
                        }
                        else {
                            var hasMultipleDecoratorsWithInternalOne = _this.hasInternalDecorator(nodeDecorators_1);
                            // Just a class
                            if (!classWithCustomDecorator_1 &&
                                !hasMultipleDecoratorsWithInternalOne) {
                                classWithCustomDecorator_1 = true;
                                _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                            }
                        }
                        _this.cache.set(name, deps);
                        if (typeof IO.ignore === 'undefined') {
                            _this.debug(deps);
                        }
                        else {
                            _this.ignore(deps);
                        }
                    };
                    var filterByDecorators = function (filteredNode) {
                        if (filteredNode.expression && filteredNode.expression.expression) {
                            var _test = /(NgModule|Component|Injectable|Pipe|Directive)/.test(filteredNode.expression.expression.text);
                            if (!_test && tsMorph.ts.isClassDeclaration(node)) {
                                _test = true;
                            }
                            return _test;
                        }
                        if (tsMorph.ts.isClassDeclaration(node)) {
                            return true;
                        }
                        return false;
                    };
                    nodeDecorators_1.filter(filterByDecorators).forEach(visitDecorator);
                }
                else if (node.symbol) {
                    if (node.symbol.flags === tsMorph.ts.SymbolFlags.Class) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody, astFile);
                    }
                    else if (node.symbol.flags === tsMorph.ts.SymbolFlags.Interface) {
                        var name = _this.getSymboleName(node);
                        var IO = _this.getInterfaceIO(file, srcFile, node, fileBody, astFile);
                        var interfaceDeps = {
                            name: name,
                            id: 'interface-' + name + '-' + hash,
                            file: file,
                            deprecated: IO.deprecated,
                            deprecationMessage: IO.deprecationMessage,
                            type: 'interface',
                            sourceCode: srcFile.getText()
                        };
                        if (IO.properties) {
                            interfaceDeps.properties = IO.properties;
                        }
                        if (IO.indexSignatures) {
                            interfaceDeps.indexSignatures = IO.indexSignatures;
                        }
                        if (IO.kind) {
                            interfaceDeps.kind = IO.kind;
                        }
                        if (IO.description) {
                            interfaceDeps.description = IO.description;
                            interfaceDeps.rawdescription = IO.rawdescription;
                        }
                        if (IO.methods) {
                            interfaceDeps.methods = IO.methods;
                        }
                        if (IO.extends) {
                            interfaceDeps.extends = IO.extends;
                        }
                        if (typeof IO.ignore === 'undefined') {
                            _this.debug(interfaceDeps);
                            outputSymbols.interfaces.push(interfaceDeps);
                        }
                        else {
                            _this.ignore(interfaceDeps);
                        }
                    }
                    else if (tsMorph.ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var functionDep = {
                            name: name,
                            file: file,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (!(_this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                Configuration$1.mainData.disablePrivate)) {
                                _this.debug(functionDep);
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    }
                    else if (tsMorph.ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var enumDeps = {
                            name: name,
                            childs: infos.members,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        if (!isIgnore(node)) {
                            _this.debug(enumDeps);
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    }
                    else if (tsMorph.ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var typeAliasDeps = {
                            name: name,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            typeAliasDeps.kind = node.type.kind;
                            if (typeAliasDeps.rawtype === '') {
                                typeAliasDeps.rawtype = _this.classHelper.visitType(node);
                            }
                        }
                        if (typeAliasDeps.kind &&
                            typeAliasDeps.kind === tsMorph.SyntaxKind.TemplateLiteralType &&
                            node.type) {
                            typeAliasDeps.rawtype = srcFile.text.substring(node.type.pos, node.type.end);
                        }
                        if (!isIgnore(node)) {
                            outputSymbols.miscellaneous.typealiases.push(typeAliasDeps);
                        }
                        if (typeof infos.ignore === 'undefined') {
                            _this.debug(typeAliasDeps);
                        }
                    }
                    else if (tsMorph.ts.isModuleDeclaration(node)) {
                        if (node.body) {
                            if (node.body.statements && node.body.statements.length > 0) {
                                node.body.statements.forEach(function (statement) {
                                    return parseNode(file, srcFile, statement, node.body, astFile);
                                });
                            }
                        }
                    }
                }
                else {
                    var IO = _this.getRouteIO(file, srcFile, node);
                    if (IO.routes) {
                        var newRoutes = void 0;
                        try {
                            newRoutes = RouterParserUtil$1.cleanRawRouteParsed(IO.routes);
                        }
                        catch (e) {
                            // tslint:disable-next-line:max-line-length
                            logger.error('Routes parsing error, maybe a trailing comma or an external variable, trying to fix that later after sources scanning.');
                            newRoutes = IO.routes.replace(/ /gm, '');
                            RouterParserUtil$1.addIncompleteRoute({
                                data: newRoutes,
                                file: file
                            });
                            return true;
                        }
                        outputSymbols.routes = __spreadArray(__spreadArray([], __read(outputSymbols.routes), false), __read(newRoutes), false);
                    }
                    if (tsMorph.ts.isClassDeclaration(node)) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    if (tsMorph.ts.isExpressionStatement(node) || tsMorph.ts.isIfStatement(node)) {
                        var bootstrapModuleReference = 'bootstrapModule';
                        // Find the root module with bootstrapModule call
                        // 1. find a simple call : platformBrowserDynamic().bootstrapModule(AppModule);
                        // 2. or inside a call :
                        // () => {
                        //     platformBrowserDynamic().bootstrapModule(AppModule);
                        // });
                        // 3. with a catch : platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
                        // 4. with parameters : platformBrowserDynamic().bootstrapModule(AppModule, {}).catch(error => console.error(error));
                        // Find recusively in expression nodes one with name 'bootstrapModule'
                        var rootModule_1;
                        var resultNode = void 0;
                        if (srcFile.text.indexOf(bootstrapModuleReference) !== -1) {
                            if (node.expression) {
                                resultNode = _this.findExpressionByNameInExpressions(node.expression, 'bootstrapModule');
                            }
                            if (typeof node.thenStatement !== 'undefined') {
                                if (node.thenStatement.statements &&
                                    node.thenStatement.statements.length > 0) {
                                    var firstStatement = node.thenStatement.statements[0];
                                    resultNode = _this.findExpressionByNameInExpressions(firstStatement.expression, 'bootstrapModule');
                                }
                            }
                            if (!resultNode) {
                                if (node.expression &&
                                    node.expression.arguments &&
                                    node.expression.arguments.length > 0) {
                                    resultNode = _this.findExpressionByNameInExpressionArguments(node.expression.arguments, 'bootstrapModule');
                                }
                            }
                            if (resultNode) {
                                if (resultNode.arguments.length > 0) {
                                    ___namespace.forEach(resultNode.arguments, function (argument) {
                                        if (argument.text) {
                                            rootModule_1 = argument.text;
                                        }
                                    });
                                }
                                if (rootModule_1) {
                                    RouterParserUtil$1.setRootModule(rootModule_1);
                                }
                            }
                        }
                    }
                    if (tsMorph.ts.isVariableStatement(node) && !RouterParserUtil$1.isVariableRoutes(node)) {
                        var isDestructured = false;
                        // Check for destructuring array
                        var nodeVariableDeclarations = node.declarationList.declarations;
                        if (nodeVariableDeclarations) {
                            if (nodeVariableDeclarations.length > 0) {
                                if (nodeVariableDeclarations[0].name &&
                                    nodeVariableDeclarations[0].name.kind ===
                                        tsMorph.SyntaxKind.ArrayBindingPattern) {
                                    isDestructured = true;
                                }
                            }
                        }
                        var visitVariableNode = function (variableNode) {
                            var infos = _this.visitVariableDeclaration(variableNode);
                            if (infos) {
                                var name = infos.name;
                                var deprecated = infos.deprecated;
                                var deprecationMessage = infos.deprecationMessage;
                                var deps = {
                                    name: name,
                                    ctype: 'miscellaneous',
                                    subtype: 'variable',
                                    file: file,
                                    deprecated: deprecated,
                                    deprecationMessage: deprecationMessage
                                };
                                deps.type = infos.type ? infos.type : '';
                                if (infos.defaultValue) {
                                    deps.defaultValue = infos.defaultValue;
                                }
                                if (infos.initializer) {
                                    deps.initializer = infos.initializer;
                                }
                                if (variableNode.jsDoc &&
                                    variableNode.jsDoc.length > 0 &&
                                    variableNode.jsDoc[0].comment) {
                                    var rawDescription = _this.jsdocParserUtil.parseJSDocNode(variableNode.jsDoc[0]);
                                    deps.rawdescription = rawDescription;
                                    deps.description = markedAcl(rawDescription);
                                }
                                if (isModuleWithProviders(variableNode)) {
                                    var routingInitializer = getModuleWithProviders(variableNode);
                                    RouterParserUtil$1.addModuleWithRoutes(name, [routingInitializer], file);
                                    RouterParserUtil$1.addModule(name, [routingInitializer]);
                                }
                                if (!isIgnore(variableNode)) {
                                    _this.debug(deps);
                                    outputSymbols.miscellaneous.variables.push(deps);
                                }
                            }
                        };
                        if (isDestructured) {
                            if (nodeVariableDeclarations[0].name.elements) {
                                var destructuredVariables = nodeVariableDeclarations[0].name.elements;
                                for (var i = 0; i < destructuredVariables.length; i++) {
                                    var destructuredVariable = destructuredVariables[i];
                                    var name = destructuredVariable.name
                                        ? destructuredVariable.name.escapedText
                                        : '';
                                    var deps = {
                                        name: name,
                                        ctype: 'miscellaneous',
                                        subtype: 'variable',
                                        file: file
                                    };
                                    if (nodeVariableDeclarations[0].initializer) {
                                        if (nodeVariableDeclarations[0].initializer.elements) {
                                            deps.initializer =
                                                nodeVariableDeclarations[0].initializer.elements[i];
                                        }
                                        deps.defaultValue = deps.initializer
                                            ? _this.classHelper.stringifyDefaultValue(deps.initializer)
                                            : undefined;
                                    }
                                    if (!isIgnore(destructuredVariables[i])) {
                                        _this.debug(deps);
                                        outputSymbols.miscellaneous.variables.push(deps);
                                    }
                                }
                            }
                        }
                        else {
                            visitVariableNode(node);
                        }
                    }
                    if (tsMorph.ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var deps = {
                            name: name,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            deps.kind = node.type.kind;
                        }
                        if (deps.kind &&
                            deps.kind === tsMorph.SyntaxKind.TemplateLiteralType &&
                            node.type) {
                            deps.rawtype = srcFile.text.substring(node.type.pos, node.type.end);
                        }
                        if (!isIgnore(node)) {
                            _this.debug(deps);
                            outputSymbols.miscellaneous.typealiases.push(deps);
                        }
                    }
                    if (tsMorph.ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var functionDep = {
                            name: name,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            file: file,
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (!(_this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                Configuration$1.mainData.disablePrivate)) {
                                _this.debug(functionDep);
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    }
                    if (tsMorph.ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name = infos.name;
                        var deprecated = infos.deprecated;
                        var deprecationMessage = infos.deprecationMessage;
                        var enumDeps = {
                            name: name,
                            childs: infos.members,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            deprecated: deprecated,
                            deprecationMessage: deprecationMessage,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        if (!isIgnore(node)) {
                            _this.debug(enumDeps);
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    }
                }
            };
            parseNode(fileName, scannedFile, initialNode, null, astFile);
        });
    };
    /**
     * Function to in a specific store an entity, and check before is there is not the same one
     * in that store : same name, id and file
     * @param entity Entity to store
     * @param store Store
     */
    AngularDependencies.prototype.addNewEntityInStore = function (entity, store) {
        var findSameEntityInStore = ___namespace.filter(store, {
            name: entity.name,
            id: entity.id,
            file: entity.file
        });
        if (findSameEntityInStore.length === 0) {
            store.push(entity);
        }
    };
    AngularDependencies.prototype.debug = function (deps) {
        if (deps) {
            logger.debug('found', "".concat(deps.name));
        }
        else {
            return;
        }
        ['imports', 'exports', 'declarations', 'providers', 'bootstrap'].forEach(function (symbols) {
            if (deps[symbols] && deps[symbols].length > 0) {
                logger.debug('', "- ".concat(symbols, ":"));
                deps[symbols]
                    .map(function (i) { return i.name; })
                    .forEach(function (d) {
                    logger.debug('', "\t- ".concat(d));
                });
            }
        });
    };
    AngularDependencies.prototype.ignore = function (deps) {
        if (deps) {
            logger.warn('ignore', "".concat(deps.name));
        }
        else {
            return;
        }
    };
    AngularDependencies.prototype.checkForDeprecation = function (tags, result) {
        ___namespace.forEach(tags, function (tag) {
            if (tag.tagName && tag.tagName.text && tag.tagName.text.indexOf('deprecated') > -1) {
                result.deprecated = true;
                result.deprecationMessage = tag.comment || '';
            }
        });
    };
    AngularDependencies.prototype.findExpressionByNameInExpressions = function (entryNode, name) {
        var result;
        var loop = function (node, z) {
            if (node) {
                if (node.expression && !node.expression.name) {
                    loop(node.expression, z);
                }
                if (node.expression && node.expression.name) {
                    if (node.expression.name.text === z) {
                        result = node;
                    }
                    else {
                        loop(node.expression, z);
                    }
                }
            }
        };
        loop(entryNode, name);
        return result;
    };
    AngularDependencies.prototype.findExpressionByNameInExpressionArguments = function (arg, name) {
        var result;
        var that = this;
        var i = 0;
        var len = arg.length;
        var loop = function (node, z) {
            if (node.body) {
                if (node.body.statements && node.body.statements.length > 0) {
                    var j = 0;
                    var leng = node.body.statements.length;
                    for (j; j < leng; j++) {
                        result = that.findExpressionByNameInExpressions(node.body.statements[j], z);
                    }
                }
            }
        };
        for (i; i < len; i++) {
            loop(arg[i], name);
        }
        return result;
    };
    AngularDependencies.prototype.parseDecorators = function (decorators, type) {
        var result = false;
        if (decorators.length > 1) {
            ___namespace.forEach(decorators, function (decorator) {
                if (decorator.expression.expression) {
                    if (decorator.expression.expression.text === type) {
                        result = true;
                    }
                }
            });
        }
        else {
            if (decorators[0].expression.expression) {
                if (decorators[0].expression.expression.text === type) {
                    result = true;
                }
            }
        }
        return result;
    };
    AngularDependencies.prototype.parseDecorator = function (decorator, type) {
        var result = false;
        if (decorator.expression.expression) {
            if (decorator.expression.expression.text === type) {
                result = true;
            }
        }
        return result;
    };
    AngularDependencies.prototype.isController = function (metadata) {
        return this.parseDecorator(metadata, 'Controller');
    };
    AngularDependencies.prototype.isEntity = function (metadata) {
        return this.parseDecorator(metadata, 'Entity');
    };
    AngularDependencies.prototype.isComponent = function (metadata) {
        return this.parseDecorator(metadata, 'Component');
    };
    AngularDependencies.prototype.isPipe = function (metadata) {
        return this.parseDecorator(metadata, 'Pipe');
    };
    AngularDependencies.prototype.isDirective = function (metadata) {
        return this.parseDecorator(metadata, 'Directive');
    };
    AngularDependencies.prototype.isInjectable = function (metadata) {
        return this.parseDecorator(metadata, 'Injectable');
    };
    AngularDependencies.prototype.isModule = function (metadata) {
        return this.parseDecorator(metadata, 'NgModule') || this.parseDecorator(metadata, 'Module');
    };
    AngularDependencies.prototype.hasInternalDecorator = function (metadatas) {
        return (this.parseDecorators(metadatas, 'Controller') ||
            this.parseDecorators(metadatas, 'Component') ||
            this.parseDecorators(metadatas, 'Pipe') ||
            this.parseDecorators(metadatas, 'Directive') ||
            this.parseDecorators(metadatas, 'Injectable') ||
            this.parseDecorators(metadatas, 'NgModule') ||
            this.parseDecorators(metadatas, 'Module'));
    };
    AngularDependencies.prototype.isGuard = function (ioImplements) {
        return (___namespace.includes(ioImplements, 'CanActivate') ||
            ___namespace.includes(ioImplements, 'CanActivateChild') ||
            ___namespace.includes(ioImplements, 'CanDeactivate') ||
            ___namespace.includes(ioImplements, 'Resolve') ||
            ___namespace.includes(ioImplements, 'CanLoad'));
    };
    AngularDependencies.prototype.getSymboleName = function (node) {
        return node.name.text;
    };
    AngularDependencies.prototype.findProperties = function (visitedNode, sourceFile) {
        if (visitedNode.expression &&
            visitedNode.expression.arguments &&
            visitedNode.expression.arguments.length > 0) {
            var pop = visitedNode.expression.arguments[0];
            if (pop && pop.properties && pop.properties.length >= 0) {
                return pop.properties;
            }
            else if (pop && pop.kind && pop.kind === tsMorph.SyntaxKind.StringLiteral) {
                return [pop];
            }
            else {
                logger.warn('Empty metadatas, trying to find it with imports.');
                return ImportsUtil$1.findValueInImportOrLocalVariables(pop.text, sourceFile);
            }
        }
        return [];
    };
    AngularDependencies.prototype.isAngularLifecycleHook = function (methodName) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var ANGULAR_LIFECYCLE_METHODS = [
            'ngOnInit',
            'ngOnChanges',
            'ngDoCheck',
            'ngOnDestroy',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'writeValue',
            'registerOnChange',
            'registerOnTouched',
            'setDisabledState'
        ];
        return ANGULAR_LIFECYCLE_METHODS.indexOf(methodName) >= 0;
    };
    AngularDependencies.prototype.visitTypeDeclaration = function (node) {
        var result = {
            deprecated: false,
            deprecationMessage: '',
            name: node.name.text,
            kind: node.kind
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
        }
        return result;
    };
    AngularDependencies.prototype.visitArgument = function (arg) {
        var _this = this;
        if (arg.name && arg.name.kind == tsMorph.SyntaxKind.ObjectBindingPattern) {
            var results = [];
            var destrucuredGroupId_1 = uuid.v4();
            results = arg.name.elements.map(function (element) { return _this.visitArgument(element); });
            results = results.map(function (result) {
                result.destrucuredGroupId = destrucuredGroupId_1;
                return result;
            });
            if (arg.name.elements && arg.type && arg.type.members) {
                if (arg.name.elements.length === arg.type.members.length) {
                    for (var i = 0; i < arg.name.elements.length; i++) {
                        results[i].type = this.classHelper.visitType(arg.type.members[i]);
                    }
                }
            }
            if (arg.name.elements && arg.type && arg.type.typeName) {
                results[0].type = this.classHelper.visitType(arg.type);
            }
            return results;
        }
        else {
            var result = {
                name: arg.name.text,
                type: this.classHelper.visitType(arg),
                deprecated: false,
                deprecationMessage: ''
            };
            if (arg.dotDotDotToken) {
                result.dotDotDotToken = true;
            }
            if (arg.questionToken) {
                result.optional = true;
            }
            if (arg.initializer) {
                result.defaultValue = arg.initializer
                    ? this.classHelper.stringifyDefaultValue(arg.initializer)
                    : undefined;
            }
            if (arg.type) {
                result.type = this.mapType(arg.type.kind);
                if (arg.type.kind === tsMorph.SyntaxKind.TypeReference) {
                    // try replace TypeReference with typeName
                    if (arg.type.typeName) {
                        result.type = arg.type.typeName.text;
                    }
                }
            }
            var jsdoctags = this.jsdocParserUtil.getJSDocs(arg);
            if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                this.checkForDeprecation(jsdoctags[0].tags, result);
            }
            return result;
        }
    };
    AngularDependencies.prototype.mapType = function (type) {
        switch (type) {
            case tsMorph.SyntaxKind.NullKeyword:
                return 'null';
            case tsMorph.SyntaxKind.AnyKeyword:
                return 'any';
            case tsMorph.SyntaxKind.BooleanKeyword:
                return 'boolean';
            case tsMorph.SyntaxKind.NeverKeyword:
                return 'never';
            case tsMorph.SyntaxKind.NumberKeyword:
                return 'number';
            case tsMorph.SyntaxKind.StringKeyword:
                return 'string';
            case tsMorph.SyntaxKind.UndefinedKeyword:
                return 'undefined';
            case tsMorph.SyntaxKind.TypeReference:
                return 'typeReference';
        }
    };
    AngularDependencies.prototype.hasPrivateJSDocTag = function (tags) {
        var result = false;
        if (tags) {
            tags.forEach(function (tag) {
                if (tag.tagName && tag.tagName.text && tag.tagName.text === 'private') {
                    result = true;
                }
            });
        }
        return result;
    };
    AngularDependencies.prototype.visitFunctionDeclaration = function (method) {
        var methodName = method.name ? method.name.text : 'Unnamed function';
        var resultArguments = [];
        var result = {
            deprecated: false,
            deprecationMessage: '',
            name: methodName
        };
        for (var i = 0; i < method.parameters.length; i++) {
            var argument = method.parameters[i];
            if (argument) {
                var argumentParsed = this.visitArgument(argument);
                if (argumentParsed.length > 0) {
                    for (var j = 0; j < argumentParsed.length; j++) {
                        var argumentParsedInside = argumentParsed[j];
                        argumentParsedInside.destructuredParameter = true;
                        resultArguments.push(argumentParsedInside);
                    }
                }
                else {
                    resultArguments.push(argumentParsed);
                }
            }
        }
        result.args = resultArguments;
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type !== 'undefined') {
            result.returnType = this.classHelper.visitType(method.type);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers
                    .map(function (modifier) {
                    return modifier.kind;
                })
                    .reverse();
                if (___namespace.indexOf(kinds, tsMorph.SyntaxKind.PublicKeyword) !== -1 &&
                    ___namespace.indexOf(kinds, tsMorph.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== tsMorph.SyntaxKind.PublicKeyword; });
                }
            }
        }
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
            ___namespace.forEach(jsdoctags[0].tags, function (tag) {
                if (tag.tagName) {
                    if (tag.tagName.text) {
                        if (tag.tagName.text.indexOf('ignore') > -1) {
                            result.ignore = true;
                        }
                    }
                }
            });
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args);
        }
        return result;
    };
    AngularDependencies.prototype.visitVariableDeclaration = function (node) {
        if (node.declarationList && node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var result = {
                    name: node.declarationList.declarations[i].name.text,
                    defaultValue: node.declarationList.declarations[i].initializer
                        ? this.classHelper.stringifyDefaultValue(node.declarationList.declarations[i].initializer)
                        : undefined,
                    deprecated: false,
                    deprecationMessage: ''
                };
                if (node.declarationList.declarations[i].initializer) {
                    result.initializer = node.declarationList.declarations[i].initializer;
                }
                if (node.declarationList.declarations[i].type) {
                    result.type = this.classHelper.visitType(node.declarationList.declarations[i].type);
                }
                if (typeof result.type === 'undefined' && result.initializer) {
                    result.type = kindToType(result.initializer.kind);
                }
                var jsdoctags = this.jsdocParserUtil.getJSDocs(node.declarationList.declarations[i]);
                if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
                    this.checkForDeprecation(jsdoctags[0].tags, result);
                }
                return result;
            }
        }
    };
    AngularDependencies.prototype.visitEnumTypeAliasFunctionDeclarationDescription = function (node) {
        var description = '';
        if (node.jsDoc) {
            if (node.jsDoc.length > 0) {
                if (typeof node.jsDoc[0].comment !== 'undefined') {
                    var rawDescription = this.jsdocParserUtil.parseJSDocNode(node.jsDoc[0]);
                    description = markedAcl(rawDescription);
                }
            }
        }
        return description;
    };
    AngularDependencies.prototype.visitEnumDeclaration = function (node) {
        var result = {
            deprecated: false,
            deprecationMessage: '',
            name: node.name.text,
            members: []
        };
        if (node.members) {
            var i = 0;
            var len = node.members.length;
            var memberjsdoctags = [];
            for (i; i < len; i++) {
                var member = {
                    name: node.members[i].name.text,
                    deprecated: false,
                    deprecationMessage: ''
                };
                if (node.members[i].initializer) {
                    // if the initializer kind is a number do cast to the number type
                    member.value = IsKindType.NUMBER(node.members[i].initializer.kind)
                        ? Number(node.members[i].initializer.text)
                        : node.members[i].initializer.text;
                }
                memberjsdoctags = this.jsdocParserUtil.getJSDocs(node.members[i]);
                if (memberjsdoctags && memberjsdoctags.length >= 1 && memberjsdoctags[0].tags) {
                    this.checkForDeprecation(memberjsdoctags[0].tags, member);
                }
                result.members.push(member);
            }
        }
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        if (jsdoctags && jsdoctags.length >= 1 && jsdoctags[0].tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
        }
        return result;
    };
    AngularDependencies.prototype.visitEnumDeclarationForRoutes = function (fileName, node) {
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var routesInitializer = node.declarationList.declarations[i].initializer;
                var data = new CodeGenerator().generate(routesInitializer);
                RouterParserUtil$1.addRoute({
                    name: node.declarationList.declarations[i].name.text,
                    data: RouterParserUtil$1.cleanRawRoute(data),
                    filename: fileName
                });
                return [
                    {
                        routes: data
                    }
                ];
            }
        }
        return [];
    };
    AngularDependencies.prototype.getRouteIO = function (filename, sourceFile, node) {
        var _this = this;
        var res;
        if (sourceFile.statements) {
            res = sourceFile.statements.reduce(function (directive, statement) {
                if (RouterParserUtil$1.isVariableRoutes(statement)) {
                    if (statement.pos === node.pos && statement.end === node.end) {
                        return directive.concat(_this.visitEnumDeclarationForRoutes(filename, statement));
                    }
                }
                return directive;
            }, []);
            return res[0] || {};
        }
        else {
            return {};
        }
    };
    AngularDependencies.prototype.getClassIO = function (filename, sourceFile, node, fileBody, astFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (tsMorph.ts.isClassDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile, astFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    AngularDependencies.prototype.getInterfaceIO = function (filename, sourceFile, node, fileBody, astFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (tsMorph.ts.isInterfaceDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile, astFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    return AngularDependencies;
}(FrameworkDependencies));

var AngularJSDependencies = /** @class */ (function (_super) {
    __extends(AngularJSDependencies, _super);
    function AngularJSDependencies(files, options) {
        var _this = _super.call(this, files, options) || this;
        _this.cache = new ComponentCache();
        _this.moduleHelper = new ModuleHelper(_this.cache);
        _this.jsDocHelper = new JsDocHelper();
        _this.symbolHelper = new SymbolHelper();
        return _this;
    }
    AngularJSDependencies.prototype.getDependencies = function () {
        var deps = {
            modules: [],
            modulesForGraph: [],
            components: [],
            injectables: [],
            interceptors: [],
            pipes: [],
            directives: [],
            routes: [],
            classes: [],
            interfaces: [],
            miscellaneous: {
                variables: [],
                functions: [],
                typealiases: [],
                enumerations: []
            },
            routesTree: undefined
        };
        return deps;
    };
    return AngularJSDependencies;
}(FrameworkDependencies));

function promiseSequential(promises) {
    if (!Array.isArray(promises)) {
        throw new Error('First argument need to be an array of Promises');
    }
    return new Promise(function (resolve, reject) {
        var count = 0;
        var results = [];
        var iterateeFunc = function (previousPromise, currentPromise) {
            return previousPromise
                .then(function (result) {
                if (count++ !== 0) {
                    results = results.concat(result);
                }
                return currentPromise(result, results, count);
            })
                .catch(function (err) {
                return reject(err);
            });
        };
        promises = promises.concat(function () { return Promise.resolve(); });
        promises.reduce(iterateeFunc, Promise.resolve(false)).then(function (res) {
            resolve(results);
        });
    });
}

var chokidar = require('chokidar');
var traverse = require('traverse');
var crypto = require('crypto');
var babel = require('@babel/core');
var cwd$1 = process.cwd();
var startTime = new Date();
var generationPromiseResolve;
var generationPromiseReject;
var generationPromise = new Promise(function (resolve, reject) {
    generationPromiseResolve = resolve;
    generationPromiseReject = reject;
});
var Application = /** @class */ (function () {
    /**
     * Create a new compodoc application instance.
     *
     * @param options An object containing the options that should be used.
     */
    function Application(options) {
        var _this = this;
        /**
         * Files changed during watch scanning
         */
        this.watchChangedFiles = [];
        /**
         * Boolean for watching status
         * @type {boolean}
         */
        this.isWatching = false;
        /**
         * Store package.json data
         */
        this.packageJsonData = {};
        this.preparePipes = function (somePipes) {
            logger.info('Prepare pipes');
            Configuration$1.mainData.pipes = somePipes ? somePipes : DependenciesEngine$1.getPipes();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = Configuration$1.mainData.pipes.length;
                var loop = function () {
                    if (i < len) {
                        var pipe = Configuration$1.mainData.pipes[i];
                        if (MarkdownEngine$1.hasNeighbourReadmeFile(pipe.file)) {
                            logger.info(" ".concat(pipe.name, " has a README file, include it"));
                            var readme = MarkdownEngine$1.readNeighbourReadmeFile(pipe.file);
                            pipe.readme = markedAcl(readme);
                        }
                        var page = {
                            path: 'pipes',
                            name: pipe.name,
                            id: pipe.id,
                            navTabs: _this.getNavTabs(pipe),
                            context: 'pipe',
                            pipe: pipe,
                            depth: 1,
                            pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        };
                        if (pipe.isDuplicate) {
                            page.name += '-' + pipe.duplicateId;
                        }
                        Configuration$1.addPage(page);
                        i++;
                        loop();
                    }
                    else {
                        resolve(true);
                    }
                };
                loop();
            });
        };
        this.prepareClasses = function (someClasses) {
            logger.info('Prepare classes');
            Configuration$1.mainData.classes = someClasses
                ? someClasses
                : DependenciesEngine$1.getClasses();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = Configuration$1.mainData.classes.length;
                var loop = function () {
                    if (i < len) {
                        var classe = Configuration$1.mainData.classes[i];
                        if (MarkdownEngine$1.hasNeighbourReadmeFile(classe.file)) {
                            logger.info(" ".concat(classe.name, " has a README file, include it"));
                            var readme = MarkdownEngine$1.readNeighbourReadmeFile(classe.file);
                            classe.readme = markedAcl(readme);
                        }
                        var page = {
                            path: 'classes',
                            name: classe.name,
                            id: classe.id,
                            navTabs: _this.getNavTabs(classe),
                            context: 'class',
                            class: classe,
                            depth: 1,
                            pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        };
                        if (classe.isDuplicate) {
                            page.name += '-' + classe.duplicateId;
                        }
                        Configuration$1.addPage(page);
                        i++;
                        loop();
                    }
                    else {
                        resolve(true);
                    }
                };
                loop();
            });
        };
        for (var option in options) {
            if (typeof Configuration$1.mainData[option] !== 'undefined') {
                Configuration$1.mainData[option] = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'name') {
                Configuration$1.mainData.documentationMainName = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'silent') {
                logger.silent = false;
            }
        }
    }
    /**
     * Start compodoc process
     */
    Application.prototype.generate = function () {
        var _this = this;
        process.on('unhandledRejection', this.unhandledRejectionListener);
        process.on('uncaughtException', this.uncaughtExceptionListener);
        I18nEngine$1.init(Configuration$1.mainData.language);
        if (Configuration$1.mainData.output.charAt(Configuration$1.mainData.output.length - 1) !== '/') {
            Configuration$1.mainData.output += '/';
        }
        if (Configuration$1.mainData.exportFormat !== COMPODOC_DEFAULTS.exportFormat) {
            this.processPackageJson();
        }
        else {
            HtmlEngine$1.init(Configuration$1.mainData.templates).then(function () { return _this.processPackageJson(); });
        }
        return generationPromise;
    };
    Application.prototype.endCallback = function () {
        process.removeListener('unhandledRejection', this.unhandledRejectionListener);
        process.removeListener('uncaughtException', this.uncaughtExceptionListener);
    };
    Application.prototype.unhandledRejectionListener = function (err, p) {
        console.log('Unhandled Rejection at:', p, 'reason:', err);
        logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)'); // tslint:disable-line
        process.exit(1);
    };
    Application.prototype.uncaughtExceptionListener = function (err) {
        logger.error(err);
        logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)'); // tslint:disable-line
        process.exit(1);
    };
    /**
     * Start compodoc documentation coverage
     */
    Application.prototype.testCoverage = function () {
        this.getDependenciesData();
    };
    /**
     * Store files for initial processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setFiles = function (files) {
        this.files = files;
    };
    /**
     * Store files for watch processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setUpdatedFiles = function (files) {
        this.updatedFiles = files;
    };
    /**
     * Return a boolean indicating presence of one TypeScript file in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesTSFiles = function () {
        var result = false;
        ___namespace.forEach(this.updatedFiles, function (file) {
            if (path__namespace.extname(file) === '.ts') {
                result = true;
            }
        });
        return result;
    };
    /**
     * Return a boolean indicating presence of one root markdown files in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesRootMarkdownFiles = function () {
        var result = false;
        ___namespace.forEach(this.updatedFiles, function (file) {
            if (path__namespace.extname(file) === '.md' && path__namespace.dirname(file) === cwd$1) {
                result = true;
            }
        });
        return result;
    };
    /**
     * Clear files for watch processing
     */
    Application.prototype.clearUpdatedFiles = function () {
        this.updatedFiles = [];
        this.watchChangedFiles = [];
    };
    Application.prototype.processPackageJson = function () {
        var _this = this;
        logger.info('Searching package.json file');
        FileEngine$1.get(cwd$1 + path__namespace.sep + 'package.json').then(function (packageData) {
            var parsedData = JSON.parse(packageData);
            _this.packageJsonData = parsedData;
            if (typeof parsedData.name !== 'undefined' &&
                Configuration$1.mainData.documentationMainName === COMPODOC_DEFAULTS.title) {
                Configuration$1.mainData.documentationMainName =
                    parsedData.name + ' documentation';
            }
            if (typeof parsedData.description !== 'undefined') {
                Configuration$1.mainData.documentationMainDescription = parsedData.description;
            }
            Configuration$1.mainData.angularVersion =
                AngularVersionUtil$1.getAngularVersionOfProject(parsedData);
            logger.info('package.json file found');
            if (!Configuration$1.mainData.disableDependencies) {
                if (typeof parsedData.dependencies !== 'undefined') {
                    _this.processPackageDependencies(parsedData.dependencies);
                }
                if (typeof parsedData.peerDependencies !== 'undefined') {
                    _this.processPackagePeerDependencies(parsedData.peerDependencies);
                }
            }
            if (!Configuration$1.mainData.disableProperties) {
                var propertiesToCheck = [
                    'version',
                    'description',
                    'keywords',
                    'homepage',
                    'bugs',
                    'license',
                    'repository',
                    'author'
                ];
                var hasOneOfCheckedProperties_1 = false;
                propertiesToCheck.forEach(function (prop) {
                    if (prop in parsedData) {
                        hasOneOfCheckedProperties_1 = true;
                        Configuration$1.mainData.packageProperties[prop] = parsedData[prop];
                    }
                });
                if (hasOneOfCheckedProperties_1) {
                    Configuration$1.addPage({
                        name: 'properties',
                        id: 'packageProperties',
                        context: 'package-properties',
                        depth: 0,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                    });
                }
            }
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage) {
                logger.error(errorMessage);
                process.exit(1);
            });
        }, function (errorMessage) {
            logger.error(errorMessage);
            logger.error('Continuing without package.json file');
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage1) {
                logger.error(errorMessage1);
                process.exit(1);
            });
        });
    };
    Application.prototype.processPackagePeerDependencies = function (dependencies) {
        logger.info('Processing package.json peerDependencies');
        Configuration$1.mainData.packagePeerDependencies = dependencies;
        if (!Configuration$1.hasPage('dependencies')) {
            Configuration$1.addPage({
                name: 'dependencies',
                id: 'packageDependencies',
                context: 'package-dependencies',
                depth: 0,
                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
        }
    };
    Application.prototype.processPackageDependencies = function (dependencies) {
        logger.info('Processing package.json dependencies');
        Configuration$1.mainData.packageDependencies = dependencies;
        Configuration$1.addPage({
            name: 'dependencies',
            id: 'packageDependencies',
            context: 'package-dependencies',
            depth: 0,
            pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
        });
    };
    Application.prototype.processMarkdowns = function () {
        logger.info('Searching README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md files');
        return new Promise(function (resolve, reject) {
            var i = 0;
            var markdowns = ['readme', 'changelog', 'contributing', 'license', 'todo'];
            var numberOfMarkdowns = 5;
            var loop = function () {
                if (i < numberOfMarkdowns) {
                    MarkdownEngine$1.getTraditionalMarkdown(markdowns[i].toUpperCase()).then(function (readmeData) {
                        Configuration$1.addPage({
                            name: markdowns[i] === 'readme' ? 'index' : markdowns[i],
                            context: 'getting-started',
                            id: 'getting-started',
                            markdown: readmeData.markdown,
                            data: readmeData.rawData,
                            depth: 0,
                            pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                        });
                        if (markdowns[i] === 'readme') {
                            Configuration$1.mainData.readme = true;
                            Configuration$1.addPage({
                                name: 'overview',
                                id: 'overview',
                                context: 'overview',
                                depth: 0,
                                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        else {
                            Configuration$1.mainData.markdowns.push({
                                name: markdowns[i],
                                uppername: markdowns[i].toUpperCase(),
                                depth: 0,
                                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        logger.info("".concat(markdowns[i].toUpperCase(), ".md file found"));
                        i++;
                        loop();
                    }, function (errorMessage) {
                        logger.warn(errorMessage);
                        logger.warn("Continuing without ".concat(markdowns[i].toUpperCase(), ".md file"));
                        if (markdowns[i] === 'readme') {
                            Configuration$1.addPage({
                                name: 'index',
                                id: 'index',
                                context: 'overview',
                                depth: 0,
                                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        i++;
                        loop();
                    });
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.rebuildRootMarkdowns = function () {
        var _this = this;
        logger.info('Regenerating README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md pages');
        var actions = [];
        Configuration$1.resetRootMarkdownPages();
        actions.push(function () {
            return _this.processMarkdowns();
        });
        promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger.error(errorMessage);
        });
    };
    /**
     * Get dependency data for small group of updated files during watch process
     */
    Application.prototype.getMicroDependenciesData = function () {
        logger.info('Get diff dependencies data');
        var dependenciesClass = AngularDependencies;
        Configuration$1.mainData.angularProject = true;
        if (this.detectAngularJSProjects()) {
            logger.info('AngularJS project detected');
            Configuration$1.mainData.angularProject = false;
            Configuration$1.mainData.angularJSProject = true;
            dependenciesClass = AngularJSDependencies;
        }
        var crawler = new dependenciesClass(this.updatedFiles, {
            tsconfigDirectory: path__namespace.dirname(Configuration$1.mainData.tsconfig)
        }, Configuration$1, RouterParserUtil$1);
        var dependenciesData = crawler.getDependencies();
        DependenciesEngine$1.update(dependenciesData);
        this.prepareJustAFewThings(dependenciesData);
    };
    /**
     * Rebuild external documentation during watch process
     */
    Application.prototype.rebuildExternalDocumentation = function () {
        var _this = this;
        logger.info('Rebuild external documentation');
        var actions = [];
        Configuration$1.resetAdditionalPages();
        if (Configuration$1.mainData.includes !== '') {
            actions.push(function () {
                return _this.prepareExternalIncludes();
            });
        }
        promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger.error(errorMessage);
        });
    };
    Application.prototype.detectAngularJSProjects = function () {
        if (typeof this.packageJsonData.dependencies !== 'undefined') {
            if (typeof this.packageJsonData.dependencies.angular !== 'undefined') ;
            else {
                var countJSFiles_1 = 0;
                this.files.forEach(function (file) {
                    if (path__namespace.extname(file) === '.js') {
                        countJSFiles_1 += 1;
                    }
                });
                (countJSFiles_1 * 100) / this.files.length;
            }
        }
        return false;
    };
    Application.prototype.getDependenciesData = function () {
        logger.info('Get dependencies data');
        /**
         * AngularJS detection strategy :
         * - if in package.json
         * - if 75% of scanned files are *.js files
         */
        var dependenciesClass = AngularDependencies;
        Configuration$1.mainData.angularProject = true;
        if (this.detectAngularJSProjects()) {
            logger.info('AngularJS project detected');
            Configuration$1.mainData.angularProject = false;
            Configuration$1.mainData.angularJSProject = true;
            dependenciesClass = AngularJSDependencies;
        }
        var crawler = new dependenciesClass(this.files, {
            tsconfigDirectory: path__namespace.dirname(Configuration$1.mainData.tsconfig)
        }, Configuration$1, RouterParserUtil$1);
        var dependenciesData = crawler.getDependencies();
        DependenciesEngine$1.init(dependenciesData);
        Configuration$1.mainData.routesLength = RouterParserUtil$1.routesLength();
        this.printStatistics();
        this.prepareEverything();
    };
    Application.prototype.prepareJustAFewThings = function (diffCrawledData) {
        var _this = this;
        var actions = [];
        Configuration$1.resetPages();
        if (!Configuration$1.mainData.disableRoutesGraph) {
            actions.push(function () { return _this.prepareRoutes(); });
        }
        if (diffCrawledData.components.length > 0) {
            actions.push(function () { return _this.prepareComponents(); });
        }
        if (diffCrawledData.controllers.length > 0) {
            actions.push(function () { return _this.prepareControllers(); });
        }
        if (diffCrawledData.entities.length > 0) {
            actions.push(function () { return _this.prepareEntities(); });
        }
        if (diffCrawledData.modules.length > 0) {
            actions.push(function () { return _this.prepareModules(); });
        }
        if (diffCrawledData.directives.length > 0) {
            actions.push(function () { return _this.prepareDirectives(); });
        }
        if (diffCrawledData.injectables.length > 0) {
            actions.push(function () { return _this.prepareInjectables(); });
        }
        if (diffCrawledData.interceptors.length > 0) {
            actions.push(function () { return _this.prepareInterceptors(); });
        }
        if (diffCrawledData.guards.length > 0) {
            actions.push(function () { return _this.prepareGuards(); });
        }
        if (diffCrawledData.pipes.length > 0) {
            actions.push(function () { return _this.preparePipes(); });
        }
        if (diffCrawledData.classes.length > 0) {
            actions.push(function () { return _this.prepareClasses(); });
        }
        if (diffCrawledData.interfaces.length > 0) {
            actions.push(function () { return _this.prepareInterfaces(); });
        }
        if (diffCrawledData.miscellaneous.variables.length > 0 ||
            diffCrawledData.miscellaneous.functions.length > 0 ||
            diffCrawledData.miscellaneous.typealiases.length > 0 ||
            diffCrawledData.miscellaneous.enumerations.length > 0) {
            actions.push(function () { return _this.prepareMiscellaneous(); });
        }
        if (!Configuration$1.mainData.disableCoverage) {
            actions.push(function () { return _this.prepareCoverage(); });
        }
        promiseSequential(actions)
            .then(function (res) {
            if (Configuration$1.mainData.exportFormat !== COMPODOC_DEFAULTS.exportFormat) {
                if (COMPODOC_DEFAULTS.exportFormatsSupported.indexOf(Configuration$1.mainData.exportFormat) > -1) {
                    logger.info("Generating documentation in export format ".concat(Configuration$1.mainData.exportFormat));
                    ExportEngine$1.export(Configuration$1.mainData.output, Configuration$1.mainData).then(function () {
                        generationPromiseResolve(true);
                        _this.endCallback();
                        logger.info('Documentation generated in ' +
                            Configuration$1.mainData.output +
                            ' in ' +
                            _this.getElapsedTime() +
                            ' seconds');
                        if (Configuration$1.mainData.serve) {
                            logger.info("Serving documentation from ".concat(Configuration$1.mainData.output, " at http://").concat(Configuration$1.mainData.hostname, ":").concat(Configuration$1.mainData.port));
                            _this.runWebServer(Configuration$1.mainData.output);
                        }
                    });
                }
                else {
                    logger.warn("Exported format not supported");
                }
            }
            else {
                _this.processGraphs();
                _this.clearUpdatedFiles();
            }
        })
            .catch(function (errorMessage) {
            logger.error(errorMessage);
        });
    };
    Application.prototype.printStatistics = function () {
        logger.info('-------------------');
        logger.info('Project statistics ');
        if (DependenciesEngine$1.modules.length > 0) {
            logger.info("- files      : ".concat(this.files.length));
        }
        if (DependenciesEngine$1.modules.length > 0) {
            logger.info("- module     : ".concat(DependenciesEngine$1.modules.length));
        }
        if (DependenciesEngine$1.components.length > 0) {
            logger.info("- component  : ".concat(DependenciesEngine$1.components.length));
        }
        if (DependenciesEngine$1.controllers.length > 0) {
            logger.info("- controller : ".concat(DependenciesEngine$1.controllers.length));
        }
        if (DependenciesEngine$1.entities.length > 0) {
            logger.info("- entity     : ".concat(DependenciesEngine$1.entities.length));
        }
        if (DependenciesEngine$1.directives.length > 0) {
            logger.info("- directive  : ".concat(DependenciesEngine$1.directives.length));
        }
        if (DependenciesEngine$1.injectables.length > 0) {
            logger.info("- injectable : ".concat(DependenciesEngine$1.injectables.length));
        }
        if (DependenciesEngine$1.interceptors.length > 0) {
            logger.info("- injector   : ".concat(DependenciesEngine$1.interceptors.length));
        }
        if (DependenciesEngine$1.guards.length > 0) {
            logger.info("- guard      : ".concat(DependenciesEngine$1.guards.length));
        }
        if (DependenciesEngine$1.pipes.length > 0) {
            logger.info("- pipe       : ".concat(DependenciesEngine$1.pipes.length));
        }
        if (DependenciesEngine$1.classes.length > 0) {
            logger.info("- class      : ".concat(DependenciesEngine$1.classes.length));
        }
        if (DependenciesEngine$1.interfaces.length > 0) {
            logger.info("- interface  : ".concat(DependenciesEngine$1.interfaces.length));
        }
        if (Configuration$1.mainData.routesLength > 0) {
            logger.info("- route      : ".concat(Configuration$1.mainData.routesLength));
        }
        logger.info('-------------------');
    };
    Application.prototype.prepareEverything = function () {
        var _this = this;
        var actions = [];
        actions.push(function () {
            return _this.prepareComponents();
        });
        actions.push(function () {
            return _this.prepareModules();
        });
        if (DependenciesEngine$1.directives.length > 0) {
            actions.push(function () {
                return _this.prepareDirectives();
            });
        }
        if (DependenciesEngine$1.controllers.length > 0) {
            actions.push(function () {
                return _this.prepareControllers();
            });
        }
        if (DependenciesEngine$1.entities.length > 0) {
            actions.push(function () {
                return _this.prepareEntities();
            });
        }
        if (DependenciesEngine$1.injectables.length > 0) {
            actions.push(function () {
                return _this.prepareInjectables();
            });
        }
        if (DependenciesEngine$1.interceptors.length > 0) {
            actions.push(function () {
                return _this.prepareInterceptors();
            });
        }
        if (DependenciesEngine$1.guards.length > 0) {
            actions.push(function () {
                return _this.prepareGuards();
            });
        }
        if (DependenciesEngine$1.routes &&
            DependenciesEngine$1.routes.children.length > 0 &&
            !Configuration$1.mainData.disableRoutesGraph) {
            actions.push(function () {
                return _this.prepareRoutes();
            });
        }
        if (DependenciesEngine$1.pipes.length > 0) {
            actions.push(function () {
                return _this.preparePipes();
            });
        }
        if (DependenciesEngine$1.classes.length > 0) {
            actions.push(function () {
                return _this.prepareClasses();
            });
        }
        if (DependenciesEngine$1.interfaces.length > 0) {
            actions.push(function () {
                return _this.prepareInterfaces();
            });
        }
        if (DependenciesEngine$1.miscellaneous.variables.length > 0 ||
            DependenciesEngine$1.miscellaneous.functions.length > 0 ||
            DependenciesEngine$1.miscellaneous.typealiases.length > 0 ||
            DependenciesEngine$1.miscellaneous.enumerations.length > 0) {
            actions.push(function () {
                return _this.prepareMiscellaneous();
            });
        }
        if (!Configuration$1.mainData.disableCoverage) {
            actions.push(function () {
                return _this.prepareCoverage();
            });
        }
        if (Configuration$1.mainData.unitTestCoverage !== '') {
            actions.push(function () {
                return _this.prepareUnitTestCoverage();
            });
        }
        if (Configuration$1.mainData.includes !== '') {
            actions.push(function () {
                return _this.prepareExternalIncludes();
            });
        }
        promiseSequential(actions)
            .then(function (res) {
            if (Configuration$1.mainData.exportFormat !== COMPODOC_DEFAULTS.exportFormat) {
                if (COMPODOC_DEFAULTS.exportFormatsSupported.indexOf(Configuration$1.mainData.exportFormat) > -1) {
                    logger.info("Generating documentation in export format ".concat(Configuration$1.mainData.exportFormat));
                    ExportEngine$1.export(Configuration$1.mainData.output, Configuration$1.mainData).then(function () {
                        generationPromiseResolve(true);
                        _this.endCallback();
                        logger.info('Documentation generated in ' +
                            Configuration$1.mainData.output +
                            ' in ' +
                            _this.getElapsedTime() +
                            ' seconds');
                        if (Configuration$1.mainData.serve) {
                            logger.info("Serving documentation from ".concat(Configuration$1.mainData.output, " at http://").concat(Configuration$1.mainData.hostname, ":").concat(Configuration$1.mainData.port));
                            _this.runWebServer(Configuration$1.mainData.output);
                        }
                    });
                }
                else {
                    logger.warn("Exported format not supported");
                }
            }
            else {
                _this.processGraphs();
            }
        })
            .catch(function (errorMessage) {
            logger.error(errorMessage);
            process.exit(1);
        });
    };
    Application.prototype.getIncludedPathForFile = function (file) {
        return path__namespace.join(Configuration$1.mainData.includes, file);
    };
    Application.prototype.prepareExternalIncludes = function () {
        var _this = this;
        logger.info('Adding external markdown files');
        // Scan include folder for files detailed in summary.json
        // For each file, add to Configuration.mainData.additionalPages
        // Each file will be converted to html page, inside COMPODOC_DEFAULTS.additionalEntryPath
        return new Promise(function (resolve, reject) {
            FileEngine$1.get(_this.getIncludedPathForFile('summary.json')).then(function (summaryData) {
                logger.info('Additional documentation: summary.json file found');
                var parsedSummaryData = JSON.parse(summaryData);
                var that = _this;
                var lastLevelOnePage = undefined;
                traverse(parsedSummaryData).forEach(function () {
                    // tslint:disable-next-line:no-invalid-this
                    if (this.notRoot && typeof this.node === 'object') {
                        // tslint:disable-next-line:no-invalid-this
                        var rawPath = this.path;
                        // tslint:disable-next-line:no-invalid-this
                        var additionalNode = this.node;
                        var file = additionalNode.file;
                        var title = additionalNode.title;
                        var finalPath_1 = Configuration$1.mainData.includesFolder;
                        var finalDepth = rawPath.filter(function (el) {
                            return !isNaN(parseInt(el, 10));
                        });
                        if (typeof file !== 'undefined' && typeof title !== 'undefined') {
                            var url = cleanNameWithoutSpaceAndToLowerCase(title);
                            /**
                             * Id created with title + file path hash, seems to be hypothetically unique here
                             */
                            var id = crypto
                                .createHash('sha512')
                                .update(title + file)
                                .digest('hex');
                            // tslint:disable-next-line:no-invalid-this
                            this.node.id = id;
                            var lastElementRootTree_1 = undefined;
                            finalDepth.forEach(function (el) {
                                var elementTree = typeof lastElementRootTree_1 === 'undefined'
                                    ? parsedSummaryData
                                    : lastElementRootTree_1;
                                if (typeof elementTree.children !== 'undefined') {
                                    elementTree = elementTree.children[el];
                                }
                                else {
                                    elementTree = elementTree[el];
                                }
                                finalPath_1 +=
                                    '/' +
                                        cleanNameWithoutSpaceAndToLowerCase(elementTree.title);
                                lastElementRootTree_1 = elementTree;
                            });
                            finalPath_1 = finalPath_1.replace('/' + url, '');
                            var markdownFile = MarkdownEngine$1.getTraditionalMarkdownSync(that.getIncludedPathForFile(file));
                            if (finalDepth.length > 5) {
                                logger.error('Only 5 levels of depth are supported');
                            }
                            else {
                                var _page = {
                                    name: title,
                                    id: id,
                                    filename: url,
                                    context: 'additional-page',
                                    path: finalPath_1,
                                    additionalPage: markdownFile,
                                    depth: finalDepth.length,
                                    childrenLength: additionalNode.children
                                        ? additionalNode.children.length
                                        : 0,
                                    children: [],
                                    lastChild: false,
                                    pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                                };
                                if (finalDepth.length === 1) {
                                    lastLevelOnePage = _page;
                                }
                                if (finalDepth.length > 1) {
                                    // store all child pages of the last root level 1 page inside it
                                    lastLevelOnePage.children.push(_page);
                                }
                                else {
                                    Configuration$1.addAdditionalPage(_page);
                                }
                            }
                        }
                    }
                });
                resolve(true);
            }, function (errorMessage) {
                logger.error(errorMessage);
                reject('Error during Additional documentation generation');
            });
        });
    };
    Application.prototype.prepareModules = function (someModules) {
        var _this = this;
        logger.info('Prepare modules');
        var i = 0;
        var _modules = someModules ? someModules : DependenciesEngine$1.getModules();
        return new Promise(function (resolve, reject) {
            Configuration$1.mainData.modules = _modules.map(function (ngModule) {
                ngModule.compodocLinks = {
                    components: [],
                    controllers: [],
                    directives: [],
                    injectables: [],
                    pipes: []
                };
                ['declarations', 'bootstrap', 'imports', 'exports', 'controllers'].forEach(function (metadataType) {
                    ngModule[metadataType] = ngModule[metadataType].filter(function (metaDataItem) {
                        switch (metaDataItem.type) {
                            case 'directive':
                                return DependenciesEngine$1.getDirectives().some(function (directive) {
                                    var selectedDirective;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedDirective =
                                            directive.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedDirective =
                                            directive.name === metaDataItem.name;
                                    }
                                    if (selectedDirective &&
                                        !ngModule.compodocLinks.directives.includes(directive)) {
                                        ngModule.compodocLinks.directives.push(directive);
                                    }
                                    return selectedDirective;
                                });
                            case 'component':
                                return DependenciesEngine$1.getComponents().some(function (component) {
                                    var selectedComponent;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedComponent =
                                            component.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedComponent =
                                            component.name === metaDataItem.name;
                                    }
                                    if (selectedComponent &&
                                        !ngModule.compodocLinks.components.includes(component)) {
                                        if (!component.standalone) {
                                            ngModule.compodocLinks.components.push(component);
                                        }
                                    }
                                    return selectedComponent;
                                });
                            case 'controller':
                                return DependenciesEngine$1.getControllers().some(function (controller) {
                                    var selectedController;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedController =
                                            controller.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedController =
                                            controller.name === metaDataItem.name;
                                    }
                                    if (selectedController &&
                                        !ngModule.compodocLinks.controllers.includes(controller)) {
                                        ngModule.compodocLinks.controllers.push(controller);
                                    }
                                    return selectedController;
                                });
                            case 'module':
                                return DependenciesEngine$1.getModules().some(function (module) { return module.name === metaDataItem.name; });
                            case 'pipe':
                                return DependenciesEngine$1.getPipes().some(function (pipe) {
                                    var selectedPipe;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedPipe = pipe.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedPipe = pipe.name === metaDataItem.name;
                                    }
                                    if (selectedPipe &&
                                        !ngModule.compodocLinks.pipes.includes(pipe)) {
                                        ngModule.compodocLinks.pipes.push(pipe);
                                    }
                                    return selectedPipe;
                                });
                            default:
                                return true;
                        }
                    });
                });
                ngModule.providers = ngModule.providers.filter(function (provider) {
                    return (DependenciesEngine$1.getInjectables().some(function (injectable) {
                        var selectedInjectable = injectable.name === provider.name;
                        if (selectedInjectable &&
                            !ngModule.compodocLinks.injectables.includes(injectable)) {
                            ngModule.compodocLinks.injectables.push(injectable);
                        }
                        return selectedInjectable;
                    }) ||
                        DependenciesEngine$1.getInterceptors().some(function (interceptor) { return interceptor.name === provider.name; }));
                });
                // Try fixing type undefined for each providers
                ___namespace.forEach(ngModule.providers, function (provider) {
                    if (DependenciesEngine$1.getInjectables().find(function (injectable) { return injectable.name === provider.name; })) {
                        provider.type = 'injectable';
                    }
                    if (DependenciesEngine$1.getInterceptors().find(function (interceptor) { return interceptor.name === provider.name; })) {
                        provider.type = 'interceptor';
                    }
                });
                // Order things
                ngModule.compodocLinks.components = ___namespace.sortBy(ngModule.compodocLinks.components, [
                    'name'
                ]);
                ngModule.compodocLinks.controllers = ___namespace.sortBy(ngModule.compodocLinks.controllers, [
                    'name'
                ]);
                ngModule.compodocLinks.directives = ___namespace.sortBy(ngModule.compodocLinks.directives, [
                    'name'
                ]);
                ngModule.compodocLinks.injectables = ___namespace.sortBy(ngModule.compodocLinks.injectables, [
                    'name'
                ]);
                ngModule.compodocLinks.pipes = ___namespace.sortBy(ngModule.compodocLinks.pipes, ['name']);
                ngModule.declarations = ___namespace.sortBy(ngModule.declarations, ['name']);
                ngModule.entryComponents = ___namespace.sortBy(ngModule.entryComponents, ['name']);
                ngModule.providers = ___namespace.sortBy(ngModule.providers, ['name']);
                ngModule.imports = ___namespace.sortBy(ngModule.imports, ['name']);
                ngModule.exports = ___namespace.sortBy(ngModule.exports, ['name']);
                return ngModule;
            });
            Configuration$1.addPage({
                name: 'modules',
                id: 'modules',
                context: 'modules',
                depth: 0,
                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            var len = Configuration$1.mainData.modules.length;
            var loop = function () {
                if (i < len) {
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(Configuration$1.mainData.modules[i].file)) {
                        logger.info(" ".concat(Configuration$1.mainData.modules[i].name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(Configuration$1.mainData.modules[i].file);
                        Configuration$1.mainData.modules[i].readme = markedAcl(readme);
                    }
                    Configuration$1.addPage({
                        path: 'modules',
                        name: Configuration$1.mainData.modules[i].name,
                        id: Configuration$1.mainData.modules[i].id,
                        navTabs: _this.getNavTabs(Configuration$1.mainData.modules[i]),
                        context: 'module',
                        module: Configuration$1.mainData.modules[i],
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterfaces = function (someInterfaces) {
        var _this = this;
        logger.info('Prepare interfaces');
        Configuration$1.mainData.interfaces = someInterfaces
            ? someInterfaces
            : DependenciesEngine$1.getInterfaces();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.interfaces.length;
            var loop = function () {
                if (i < len) {
                    var interf = Configuration$1.mainData.interfaces[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(interf.file)) {
                        logger.info(" ".concat(interf.name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(interf.file);
                        interf.readme = markedAcl(readme);
                    }
                    var page = {
                        path: 'interfaces',
                        name: interf.name,
                        id: interf.id,
                        navTabs: _this.getNavTabs(interf),
                        context: 'interface',
                        interface: interf,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (interf.isDuplicate) {
                        page.name += '-' + interf.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareMiscellaneous = function (someMisc) {
        logger.info('Prepare miscellaneous');
        Configuration$1.mainData.miscellaneous = someMisc
            ? someMisc
            : DependenciesEngine$1.getMiscellaneous();
        return new Promise(function (resolve, reject) {
            if (Configuration$1.mainData.miscellaneous.functions.length > 0) {
                Configuration$1.addPage({
                    path: 'miscellaneous',
                    name: 'functions',
                    id: 'miscellaneous-functions',
                    context: 'miscellaneous-functions',
                    depth: 1,
                    pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (Configuration$1.mainData.miscellaneous.variables.length > 0) {
                Configuration$1.addPage({
                    path: 'miscellaneous',
                    name: 'variables',
                    id: 'miscellaneous-variables',
                    context: 'miscellaneous-variables',
                    depth: 1,
                    pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (Configuration$1.mainData.miscellaneous.typealiases.length > 0) {
                Configuration$1.addPage({
                    path: 'miscellaneous',
                    name: 'typealiases',
                    id: 'miscellaneous-typealiases',
                    context: 'miscellaneous-typealiases',
                    depth: 1,
                    pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (Configuration$1.mainData.miscellaneous.enumerations.length > 0) {
                Configuration$1.addPage({
                    path: 'miscellaneous',
                    name: 'enumerations',
                    id: 'miscellaneous-enumerations',
                    context: 'miscellaneous-enumerations',
                    depth: 1,
                    pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            resolve(true);
        });
    };
    Application.prototype.handleTemplateurl = function (component) {
        var dirname = path__namespace.dirname(component.file);
        var templatePath = path__namespace.resolve(dirname + path__namespace.sep + component.templateUrl);
        if (!FileEngine$1.existsSync(templatePath)) {
            var err = "Cannot read template for ".concat(component.name);
            logger.error(err);
            return new Promise(function (resolve, reject) { });
        }
        return FileEngine$1.get(templatePath).then(function (data) { return (component.templateData = data); }, function (err) {
            logger.error(err);
            return Promise.reject('');
        });
    };
    Application.prototype.handleStyles = function (component) {
        var styles = component.styles;
        component.stylesData = '';
        return new Promise(function (resolveStyles, rejectStyles) {
            styles.forEach(function (style) {
                component.stylesData = component.stylesData + style + '\n';
            });
            resolveStyles(true);
        });
    };
    Application.prototype.handleStyleurls = function (component) {
        var dirname = path__namespace.dirname(component.file);
        var styleDataPromise = component.styleUrls.map(function (styleUrl) {
            var stylePath = path__namespace.resolve(dirname + path__namespace.sep + styleUrl);
            if (!FileEngine$1.existsSync(stylePath)) {
                var err = "Cannot read style url ".concat(stylePath, " for ").concat(component.name);
                logger.error(err);
                return new Promise(function (resolve, reject) { });
            }
            return new Promise(function (resolve, reject) {
                FileEngine$1.get(stylePath).then(function (data) {
                    resolve({
                        data: data,
                        styleUrl: styleUrl
                    });
                });
            });
        });
        return Promise.all(styleDataPromise).then(function (data) { return (component.styleUrlsData = data); }, function (err) {
            logger.error(err);
            return Promise.reject('');
        });
    };
    Application.prototype.getNavTabs = function (dependency) {
        var navTabConfig = Configuration$1.mainData.navTabConfig;
        var hasCustomNavTabConfig = navTabConfig.length !== 0;
        navTabConfig =
            navTabConfig.length === 0
                ? ___namespace.cloneDeep(COMPODOC_CONSTANTS.navTabDefinitions)
                : navTabConfig;
        var matchDepType = function (depType) {
            return depType === 'all' || depType === dependency.type;
        };
        var navTabs = [];
        ___namespace.forEach(navTabConfig, function (customTab) {
            var navTab = ___namespace.find(COMPODOC_CONSTANTS.navTabDefinitions, { id: customTab.id });
            if (!navTab) {
                throw new Error("Invalid tab ID '".concat(customTab.id, "' specified in tab configuration"));
            }
            navTab.label = customTab.label;
            if (hasCustomNavTabConfig) {
                navTab.custom = true;
            }
            // is tab applicable to target dependency?
            if (-1 === ___namespace.findIndex(navTab.depTypes, matchDepType)) {
                return;
            }
            // global config
            if (customTab.id === 'tree' && Configuration$1.mainData.disableDomTree) {
                return;
            }
            if (customTab.id === 'source' && Configuration$1.mainData.disableSourceCode) {
                return;
            }
            if (customTab.id === 'templateData' && Configuration$1.mainData.disableTemplateTab) {
                return;
            }
            if (customTab.id === 'styleData' && Configuration$1.mainData.disableStyleTab) {
                return;
            }
            // per dependency config
            if (customTab.id === 'readme' && !dependency.readme) {
                return;
            }
            if (customTab.id === 'example' && !dependency.exampleUrls) {
                return;
            }
            if (customTab.id === 'templateData' &&
                (!dependency.templateUrl || dependency.templateUrl.length === 0)) {
                return;
            }
            if (customTab.id === 'styleData' &&
                (!dependency.styleUrls || dependency.styleUrls.length === 0) &&
                (!dependency.styles || dependency.styles.length === 0)) {
                return;
            }
            navTabs.push(navTab);
        });
        if (navTabs.length === 0) {
            throw new Error("No valid navigation tabs have been defined for dependency type '".concat(dependency.type, "'. Specify at least one config for the 'info' or 'source' tab in --navTabConfig."));
        }
        return navTabs;
    };
    Application.prototype.prepareControllers = function (someControllers) {
        var _this = this;
        logger.info('Prepare controllers');
        Configuration$1.mainData.controllers = someControllers
            ? someControllers
            : DependenciesEngine$1.getControllers();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.controllers.length;
            var loop = function () {
                if (i < len) {
                    var controller = Configuration$1.mainData.controllers[i];
                    var page = {
                        path: 'controllers',
                        name: controller.name,
                        id: controller.id,
                        navTabs: _this.getNavTabs(controller),
                        context: 'controller',
                        controller: controller,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (controller.isDuplicate) {
                        page.name += '-' + controller.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareEntities = function (someEntities) {
        var _this = this;
        logger.info('Prepare entities');
        Configuration$1.mainData.entities = someEntities
            ? someEntities
            : DependenciesEngine$1.getEntities();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.entities.length;
            var loop = function () {
                if (i < len) {
                    var entity = Configuration$1.mainData.entities[i];
                    var page = {
                        path: 'entities',
                        name: entity.name,
                        id: entity.id,
                        navTabs: _this.getNavTabs(entity),
                        context: 'entity',
                        entity: entity,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (entity.isDuplicate) {
                        page.name += '-' + entity.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareComponents = function (someComponents) {
        var _this = this;
        logger.info('Prepare components');
        Configuration$1.mainData.components = someComponents
            ? someComponents
            : DependenciesEngine$1.getComponents();
        return new Promise(function (mainPrepareComponentResolve, mainPrepareComponentReject) {
            var i = 0;
            var len = Configuration$1.mainData.components.length;
            var loop = function () {
                if (i <= len - 1) {
                    var component_1 = Configuration$1.mainData.components[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(component_1.file)) {
                        logger.info(" ".concat(component_1.name, " has a README file, include it"));
                        var readmeFile = MarkdownEngine$1.readNeighbourReadmeFile(component_1.file);
                        component_1.readme = markedAcl(readmeFile);
                    }
                    var page = {
                        path: 'components',
                        name: component_1.name,
                        id: component_1.id,
                        navTabs: _this.getNavTabs(component_1),
                        context: 'component',
                        component: component_1,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (component_1.isDuplicate) {
                        page.name += '-' + component_1.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    var componentTemplateUrlPromise = new Promise(function (componentTemplateUrlResolve, componentTemplateUrlReject) {
                        if (component_1.templateUrl.length > 0) {
                            logger.info(" ".concat(component_1.name, " has a templateUrl, include it"));
                            _this.handleTemplateurl(component_1).then(function () {
                                componentTemplateUrlResolve(true);
                            }, function (e) {
                                logger.error(e);
                                componentTemplateUrlReject();
                            });
                        }
                        else {
                            componentTemplateUrlResolve(true);
                        }
                    });
                    var componentStyleUrlsPromise = new Promise(function (componentStyleUrlsResolve, componentStyleUrlsReject) {
                        if (component_1.styleUrls.length > 0) {
                            logger.info(" ".concat(component_1.name, " has styleUrls, include them"));
                            _this.handleStyleurls(component_1).then(function () {
                                componentStyleUrlsResolve(true);
                            }, function (e) {
                                logger.error(e);
                                componentStyleUrlsReject();
                            });
                        }
                        else {
                            componentStyleUrlsResolve(true);
                        }
                    });
                    var componentStylesPromise = new Promise(function (componentStylesResolve, componentStylesReject) {
                        if (component_1.styles.length > 0) {
                            logger.info(" ".concat(component_1.name, " has styles, include them"));
                            _this.handleStyles(component_1).then(function () {
                                componentStylesResolve(true);
                            }, function (e) {
                                logger.error(e);
                                componentStylesReject();
                            });
                        }
                        else {
                            componentStylesResolve(true);
                        }
                    });
                    Promise.all([
                        componentTemplateUrlPromise,
                        componentStyleUrlsPromise,
                        componentStylesPromise
                    ]).then(function () {
                        i++;
                        loop();
                    });
                }
                else {
                    mainPrepareComponentResolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareDirectives = function (someDirectives) {
        var _this = this;
        logger.info('Prepare directives');
        Configuration$1.mainData.directives = someDirectives
            ? someDirectives
            : DependenciesEngine$1.getDirectives();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.directives.length;
            var loop = function () {
                if (i < len) {
                    var directive = Configuration$1.mainData.directives[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(directive.file)) {
                        logger.info(" ".concat(directive.name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(directive.file);
                        directive.readme = markedAcl(readme);
                    }
                    var page = {
                        path: 'directives',
                        name: directive.name,
                        id: directive.id,
                        navTabs: _this.getNavTabs(directive),
                        context: 'directive',
                        directive: directive,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (directive.isDuplicate) {
                        page.name += '-' + directive.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve(true);
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInjectables = function (someInjectables) {
        var _this = this;
        logger.info('Prepare injectables');
        Configuration$1.mainData.injectables = someInjectables
            ? someInjectables
            : DependenciesEngine$1.getInjectables();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.injectables.length;
            var loop = function () {
                if (i < len) {
                    var injec = Configuration$1.mainData.injectables[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(injec.file)) {
                        logger.info(" ".concat(injec.name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(injec.file);
                        injec.readme = markedAcl(readme);
                    }
                    var page = {
                        path: 'injectables',
                        name: injec.name,
                        id: injec.id,
                        navTabs: _this.getNavTabs(injec),
                        context: 'injectable',
                        injectable: injec,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (injec.isDuplicate) {
                        page.name += '-' + injec.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterceptors = function (someInterceptors) {
        var _this = this;
        logger.info('Prepare interceptors');
        Configuration$1.mainData.interceptors = someInterceptors
            ? someInterceptors
            : DependenciesEngine$1.getInterceptors();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.interceptors.length;
            var loop = function () {
                if (i < len) {
                    var interceptor = Configuration$1.mainData.interceptors[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(interceptor.file)) {
                        logger.info(" ".concat(interceptor.name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(interceptor.file);
                        interceptor.readme = markedAcl(readme);
                    }
                    var page = {
                        path: 'interceptors',
                        name: interceptor.name,
                        id: interceptor.id,
                        navTabs: _this.getNavTabs(interceptor),
                        context: 'interceptor',
                        injectable: interceptor,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (interceptor.isDuplicate) {
                        page.name += '-' + interceptor.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareGuards = function (someGuards) {
        var _this = this;
        logger.info('Prepare guards');
        Configuration$1.mainData.guards = someGuards ? someGuards : DependenciesEngine$1.getGuards();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = Configuration$1.mainData.guards.length;
            var loop = function () {
                if (i < len) {
                    var guard = Configuration$1.mainData.guards[i];
                    if (MarkdownEngine$1.hasNeighbourReadmeFile(guard.file)) {
                        logger.info(" ".concat(guard.name, " has a README file, include it"));
                        var readme = MarkdownEngine$1.readNeighbourReadmeFile(guard.file);
                        guard.readme = markedAcl(readme);
                    }
                    var page = {
                        path: 'guards',
                        name: guard.name,
                        id: guard.id,
                        navTabs: _this.getNavTabs(guard),
                        context: 'guard',
                        injectable: guard,
                        depth: 1,
                        pageType: COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (guard.isDuplicate) {
                        page.name += '-' + guard.duplicateId;
                    }
                    Configuration$1.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareRoutes = function () {
        logger.info('Process routes');
        Configuration$1.mainData.routes = DependenciesEngine$1.getRoutes();
        return new Promise(function (resolve, reject) {
            Configuration$1.addPage({
                name: 'routes',
                id: 'routes',
                context: 'routes',
                depth: 0,
                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            if (Configuration$1.mainData.exportFormat === COMPODOC_DEFAULTS.exportFormat) {
                RouterParserUtil$1.generateRoutesIndex(Configuration$1.mainData.output, Configuration$1.mainData.routes).then(function () {
                    logger.info(' Routes index generated');
                    resolve();
                }, function (e) {
                    logger.error(e);
                    reject();
                });
            }
            else {
                resolve();
            }
        });
    };
    Application.prototype.prepareCoverage = function () {
        logger.info('Process documentation coverage report');
        return new Promise(function (resolve, reject) {
            /*
             * loop with components, directives, controllers, entities, classes, injectables, interfaces, pipes, guards, misc functions variables
             */
            var files = [];
            var totalProjectStatementDocumented = 0;
            var getStatus = function (percent) {
                var status;
                if (percent <= 25) {
                    status = 'low';
                }
                else if (percent > 25 && percent <= 50) {
                    status = 'medium';
                }
                else if (percent > 50 && percent <= 75) {
                    status = 'good';
                }
                else {
                    status = 'very-good';
                }
                return status;
            };
            var processComponentsAndDirectivesAndControllersAndEntities = function (list) {
                ___namespace.forEach(list, function (el) {
                    var element = Object.assign({}, el);
                    if (!element.propertiesClass) {
                        element.propertiesClass = [];
                    }
                    if (!element.methodsClass) {
                        element.methodsClass = [];
                    }
                    if (!element.hostBindings) {
                        element.hostBindings = [];
                    }
                    if (!element.hostListeners) {
                        element.hostListeners = [];
                    }
                    if (!element.inputsClass) {
                        element.inputsClass = [];
                    }
                    if (!element.outputsClass) {
                        element.outputsClass = [];
                    }
                    var cl = {
                        filePath: element.file,
                        type: element.type,
                        linktype: element.type,
                        name: element.name
                    };
                    var totalStatementDocumented = 0;
                    var totalStatements = element.propertiesClass.length +
                        element.methodsClass.length +
                        element.inputsClass.length +
                        element.hostBindings.length +
                        element.hostListeners.length +
                        element.outputsClass.length +
                        1; // +1 for element decorator comment
                    if (element.constructorObj) {
                        totalStatements += 1;
                        if (element.constructorObj &&
                            element.constructorObj.description &&
                            element.constructorObj.description !== '') {
                            totalStatementDocumented += 1;
                        }
                    }
                    if (element.description && element.description !== '') {
                        totalStatementDocumented += 1;
                    }
                    ___namespace.forEach(element.propertiesClass, function (property) {
                        if (property.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.methodsClass, function (method) {
                        if (method.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.hostBindings, function (property) {
                        if (property.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.hostListeners, function (method) {
                        if (method.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.inputsClass, function (input) {
                        if (input.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (input.description &&
                            input.description !== '' &&
                            input.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.outputsClass, function (output) {
                        if (output.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (output.description &&
                            output.description !== '' &&
                            output.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    if (totalStatements === 0) {
                        cl.coveragePercent = 0;
                    }
                    cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cl.status = getStatus(cl.coveragePercent);
                    totalProjectStatementDocumented += cl.coveragePercent;
                    files.push(cl);
                });
            };
            var processCoveragePerFile = function () {
                logger.info('Process documentation coverage per file');
                logger.info('-------------------');
                var overFiles = files.filter(function (f) {
                    var overTest = f.coveragePercent >= Configuration$1.mainData.coverageMinimumPerFile;
                    if (overTest && !Configuration$1.mainData.coverageTestShowOnlyFailed) {
                        logger.info("".concat(f.coveragePercent, " % for file ").concat(f.filePath, " - ").concat(f.name, " - over minimum per file"));
                    }
                    return overTest;
                });
                var underFiles = files.filter(function (f) {
                    var underTest = f.coveragePercent < Configuration$1.mainData.coverageMinimumPerFile;
                    if (underTest) {
                        logger.error("".concat(f.coveragePercent, " % for file ").concat(f.filePath, " - ").concat(f.name, " - under minimum per file"));
                    }
                    return underTest;
                });
                logger.info('-------------------');
                return {
                    overFiles: overFiles,
                    underFiles: underFiles
                };
            };
            var processFunctionsAndVariables = function (id, type) {
                ___namespace.forEach(id, function (el) {
                    var cl = {
                        filePath: el.file,
                        type: type,
                        linktype: el.type,
                        linksubtype: el.subtype,
                        name: el.name
                    };
                    if (type === 'variable' || type === 'function') {
                        cl.linktype = 'miscellaneous';
                    }
                    var totalStatementDocumented = 0;
                    var totalStatements = 1;
                    if (el.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                        // Doesn't handle private for coverage
                        totalStatements -= 1;
                    }
                    if (el.description &&
                        el.description !== '' &&
                        el.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                    cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cl.status = getStatus(cl.coveragePercent);
                    totalProjectStatementDocumented += cl.coveragePercent;
                    files.push(cl);
                });
            };
            var processClasses = function (list, type, linktype) {
                ___namespace.forEach(list, function (cl) {
                    var element = Object.assign({}, cl);
                    if (!element.properties) {
                        element.properties = [];
                    }
                    if (!element.methods) {
                        element.methods = [];
                    }
                    var cla = {
                        filePath: element.file,
                        type: type,
                        linktype: linktype,
                        name: element.name
                    };
                    var totalStatementDocumented = 0;
                    var totalStatements = element.properties.length + element.methods.length + 1; // +1 for element itself
                    if (element.constructorObj) {
                        totalStatements += 1;
                        if (element.constructorObj &&
                            element.constructorObj.description &&
                            element.constructorObj.description !== '') {
                            totalStatementDocumented += 1;
                        }
                    }
                    if (element.description && element.description !== '') {
                        totalStatementDocumented += 1;
                    }
                    ___namespace.forEach(element.properties, function (property) {
                        if (property.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    ___namespace.forEach(element.methods, function (method) {
                        if (method.modifierKind === tsMorph.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== tsMorph.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    cla.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    if (totalStatements === 0) {
                        cla.coveragePercent = 0;
                    }
                    cla.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cla.status = getStatus(cla.coveragePercent);
                    totalProjectStatementDocumented += cla.coveragePercent;
                    files.push(cla);
                });
            };
            processComponentsAndDirectivesAndControllersAndEntities(Configuration$1.mainData.components);
            processComponentsAndDirectivesAndControllersAndEntities(Configuration$1.mainData.directives);
            processComponentsAndDirectivesAndControllersAndEntities(Configuration$1.mainData.controllers);
            processComponentsAndDirectivesAndControllersAndEntities(Configuration$1.mainData.entities);
            processClasses(Configuration$1.mainData.classes, 'class', 'classe');
            processClasses(Configuration$1.mainData.injectables, 'injectable', 'injectable');
            processClasses(Configuration$1.mainData.interfaces, 'interface', 'interface');
            processClasses(Configuration$1.mainData.guards, 'guard', 'guard');
            processClasses(Configuration$1.mainData.interceptors, 'interceptor', 'interceptor');
            ___namespace.forEach(Configuration$1.mainData.pipes, function (pipe) {
                var cl = {
                    filePath: pipe.file,
                    type: pipe.type,
                    linktype: pipe.type,
                    name: pipe.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = 1;
                if (pipe.description && pipe.description !== '') {
                    totalStatementDocumented += 1;
                }
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            processFunctionsAndVariables(Configuration$1.mainData.miscellaneous.functions, 'function');
            processFunctionsAndVariables(Configuration$1.mainData.miscellaneous.variables, 'variable');
            files = ___namespace.sortBy(files, ['filePath']);
            var coverageData = {
                count: files.length > 0
                    ? Math.floor(totalProjectStatementDocumented / files.length)
                    : 0,
                status: '',
                files: files
            };
            coverageData.status = getStatus(coverageData.count);
            Configuration$1.addPage({
                name: 'coverage',
                id: 'coverage',
                context: 'coverage',
                files: files,
                data: coverageData,
                depth: 0,
                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            coverageData.files = files;
            Configuration$1.mainData.coverageData = coverageData;
            if (Configuration$1.mainData.exportFormat === COMPODOC_DEFAULTS.exportFormat) {
                HtmlEngine$1.generateCoverageBadge(Configuration$1.mainData.output, 'documentation', coverageData);
            }
            files = ___namespace.sortBy(files, ['coveragePercent']);
            var coverageTestPerFileResults;
            if (Configuration$1.mainData.coverageTest &&
                !Configuration$1.mainData.coverageTestPerFile) {
                // Global coverage test and not per file
                if (coverageData.count >= Configuration$1.mainData.coverageTestThreshold) {
                    logger.info("Documentation coverage (".concat(coverageData.count, "%) is over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)"));
                    generationPromiseResolve(true);
                    process.exit(0);
                }
                else {
                    var message = "Documentation coverage (".concat(coverageData.count, "%) is not over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)");
                    generationPromiseReject();
                    if (Configuration$1.mainData.coverageTestThresholdFail) {
                        logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger.warn(message);
                        process.exit(0);
                    }
                }
            }
            else if (!Configuration$1.mainData.coverageTest &&
                Configuration$1.mainData.coverageTestPerFile) {
                coverageTestPerFileResults = processCoveragePerFile();
                // Per file coverage test and not global
                if (coverageTestPerFileResults.underFiles.length > 0) {
                    var message = "Documentation coverage per file is not over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)");
                    generationPromiseReject();
                    if (Configuration$1.mainData.coverageTestThresholdFail) {
                        logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger.warn(message);
                        process.exit(0);
                    }
                }
                else {
                    logger.info("Documentation coverage per file is over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)"));
                    generationPromiseResolve(true);
                    process.exit(0);
                }
            }
            else if (Configuration$1.mainData.coverageTest &&
                Configuration$1.mainData.coverageTestPerFile) {
                // Per file coverage test and global
                coverageTestPerFileResults = processCoveragePerFile();
                if (coverageData.count >= Configuration$1.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length === 0) {
                    logger.info("Documentation coverage (".concat(coverageData.count, "%) is over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)"));
                    logger.info("Documentation coverage per file is over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)"));
                    generationPromiseResolve(true);
                    process.exit(0);
                }
                else if (coverageData.count >= Configuration$1.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    logger.info("Documentation coverage (".concat(coverageData.count, "%) is over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)"));
                    var message = "Documentation coverage per file is not over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)");
                    generationPromiseReject();
                    if (Configuration$1.mainData.coverageTestThresholdFail) {
                        logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger.warn(message);
                        process.exit(0);
                    }
                }
                else if (coverageData.count < Configuration$1.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    var messageGlobal = "Documentation coverage (".concat(coverageData.count, "%) is not over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)"), messagePerFile = "Documentation coverage per file is not over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)");
                    generationPromiseReject();
                    if (Configuration$1.mainData.coverageTestThresholdFail) {
                        logger.error(messageGlobal);
                        logger.error(messagePerFile);
                        process.exit(1);
                    }
                    else {
                        logger.warn(messageGlobal);
                        logger.warn(messagePerFile);
                        process.exit(0);
                    }
                }
                else {
                    var message = "Documentation coverage (".concat(coverageData.count, "%) is not over threshold (").concat(Configuration$1.mainData.coverageTestThreshold, "%)"), messagePerFile = "Documentation coverage per file is over threshold (".concat(Configuration$1.mainData.coverageMinimumPerFile, "%)");
                    generationPromiseReject();
                    if (Configuration$1.mainData.coverageTestThresholdFail) {
                        logger.error(message);
                        logger.info(messagePerFile);
                        process.exit(1);
                    }
                    else {
                        logger.warn(message);
                        logger.info(messagePerFile);
                        process.exit(0);
                    }
                }
            }
            else {
                resolve(true);
            }
        });
    };
    Application.prototype.prepareUnitTestCoverage = function () {
        logger.info('Process unit test coverage report');
        return new Promise(function (resolve, reject) {
            var covDat, covFileNames;
            var coverageData = Configuration$1.mainData.coverageData;
            if (!coverageData.files) {
                logger.warn('Missing documentation coverage data');
            }
            else {
                covDat = {};
                covFileNames = ___namespace.map(coverageData.files, function (el) {
                    var fileName = path__namespace.normalize(el.filePath);
                    covDat[fileName] = {
                        type: el.type,
                        linktype: el.linktype,
                        linksubtype: el.linksubtype,
                        name: el.name
                    };
                    return fileName;
                });
            }
            // read coverage summary file and data
            var unitTestSummary = {};
            var fileDat = FileEngine$1.getSync(Configuration$1.mainData.unitTestCoverage);
            if (fileDat) {
                unitTestSummary = JSON.parse(fileDat);
            }
            else {
                return Promise.reject('Error reading unit test coverage file');
            }
            var getCovStatus = function (percent, totalLines) {
                var status;
                if (totalLines === 0) {
                    status = 'uncovered';
                }
                else if (percent <= 25) {
                    status = 'low';
                }
                else if (percent > 25 && percent <= 50) {
                    status = 'medium';
                }
                else if (percent > 50 && percent <= 75) {
                    status = 'good';
                }
                else {
                    status = 'very-good';
                }
                return status;
            };
            var getCoverageData = function (data, fileName) {
                var out = {};
                if (fileName !== 'total') {
                    if (covDat === undefined) {
                        // need a name to include in output but this isn't visible
                        out = { name: fileName, filePath: fileName };
                    }
                    else {
                        var findMatch = ___namespace.filter(covFileNames, function (el) {
                            // var normalizedFilename = path__namespace.normalize(fileName).replace(/\\/g, '/');

                            var normalizedFilename = path.normalize(fileName).replace(/\\/g, '/');
                            var normalizedEl = path.normalize(el).replace(/\\/g, '/');
                            return normalizedEl.includes(normalizedFilename) || normalizedFilename.includes(normalizedEl);
                        });
                        // console.log("findMatch::", findMatch, covDat);
                        if (findMatch.length > 0) {
                            out = ___namespace.clone(covDat[findMatch[0]]);
                            out['filePath'] = fileName;
                        }
                        // out = { name: fileName, filePath: fileName };
                    }
                }
                var keysToGet = ['statements', 'branches', 'functions', 'lines'];
                ___namespace.forEach(keysToGet, function (key) {
                    if (data[key]) {
                        var t = data[key];
                        out[key] = {
                            coveragePercent: Math.round(t.pct),
                            coverageCount: '' + t.covered + '/' + t.total,
                            status: getCovStatus(t.pct, t.total)
                        };
                    }
                });
                return out;
            };
            var unitTestData = {};
            var files = [];
            for (var file in unitTestSummary) {
                var dat = getCoverageData(unitTestSummary[file], file);
                if (file === 'total') {
                    unitTestData['total'] = dat;
                }
                else {
                    files.push(dat);
                }
            }
            unitTestData['files'] = files;
            unitTestData['idColumn'] = covDat !== undefined; // should we include the id column
            Configuration$1.mainData.unitTestData = unitTestData;
            Configuration$1.addPage({
                name: 'unit-test',
                id: 'unit-test',
                context: 'unit-test',
                files: files,
                data: unitTestData,
                depth: 0,
                pageType: COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            if (Configuration$1.mainData.exportFormat === COMPODOC_DEFAULTS.exportFormat) {
                var keysToGet = ['statements', 'branches', 'functions', 'lines'];
                ___namespace.forEach(keysToGet, function (key) {
                    if (unitTestData['total'][key]) {
                        HtmlEngine$1.generateCoverageBadge(Configuration$1.mainData.output, key, {
                            count: unitTestData['total'][key]['coveragePercent'],
                            status: unitTestData['total'][key]['status']
                        });
                    }
                });
            }
            resolve(true);
        });
    };
    Application.prototype.processPage = function (page) {
        logger.info('Process page', page.name);
        var htmlData = HtmlEngine$1.render(Configuration$1.mainData, page);
        var finalPath = Configuration$1.mainData.output;
        if (Configuration$1.mainData.output.lastIndexOf('/') === -1) {
            finalPath += '/';
        }
        if (page.path) {
            finalPath += page.path + '/';
        }
        if (page.filename) {
            finalPath += page.filename + '.html';
        }
        else {
            finalPath += page.name + '.html';
        }
        if (!Configuration$1.mainData.disableSearch) {
            SearchEngine$1.indexPage({
                infos: page,
                rawData: htmlData,
                url: finalPath
            });
        }
        FileEngine$1.writeSync(finalPath, htmlData);
        return Promise.resolve(true);
    };
    Application.prototype.processPages = function () {
        var _this = this;
        var pages = ___namespace.sortBy(Configuration$1.pages, ['name']);
        logger.info('Process pages');
        Promise.all(pages.map(function (page) { return _this.processPage(page); }))
            .then(function () {
            var callbacksAfterGenerateSearchIndexJson = function () {
                if (Configuration$1.mainData.additionalPages.length > 0) {
                    _this.processAdditionalPages();
                }
                else {
                    if (Configuration$1.mainData.assetsFolder !== '') {
                        _this.processAssetsFolder();
                    }
                    _this.processResources();
                }
            };
            if (!Configuration$1.mainData.disableSearch) {
                SearchEngine$1.generateSearchIndexJson(Configuration$1.mainData.output).then(function () {
                    callbacksAfterGenerateSearchIndexJson();
                }, function (e) {
                    logger.error(e);
                });
            }
            else {
                callbacksAfterGenerateSearchIndexJson();
            }
        })
            .then(function () {
            return _this.processMenu(Configuration$1.mainData);
        })
            .catch(function (e) {
            logger.error(e);
        });
    };
    Application.prototype.transpileMenuWCToES5 = function (es6Code) {
        return babel.transformAsync(es6Code, {
            cwd: __dirname,
            filename: 'menu-wc_es5.js',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            ie: '11'
                        }
                    }
                ]
            ],
            plugins: [
                [
                    '@babel/plugin-proposal-private-methods',
                    {
                        loose: false
                    }
                ]
            ]
        });
    };
    Application.prototype.processMenu = function (mainData) {
        var _this = this;
        logger.info('Process menu...');
        return new Promise(function (resolveProcessMenu, rejectProcessMenu) {
            var output = mainData.output.slice();
            var outputLastCharacter = output.lastIndexOf('/');
            if (outputLastCharacter !== -1) {
                output = output.slice(0, -1);
            }
            var finalPathES6 = "".concat(output, "/js/menu-wc.js");
            var finalPathES5 = "".concat(output, "/js/menu-wc_es5.js");
            HtmlEngine$1.renderMenu(Configuration$1.mainData.templates, mainData)
                .then(function (htmlData) {
                FileEngine$1.write(finalPathES6, htmlData)
                    .then(function () {
                    _this.transpileMenuWCToES5(htmlData)
                        .then(function (es5Data) {
                        FileEngine$1.write(finalPathES5, es5Data.code)
                            .then(function () {
                            resolveProcessMenu();
                        })
                            .catch(function (err) {
                            logger.error('Error during ' + finalPathES5 + ' page generation');
                            logger.error(err);
                            return rejectProcessMenu('');
                        });
                    })
                        .catch(function (err) {
                        logger.error('Error during ' + finalPathES5 + ' page generation');
                        logger.error(err);
                        return rejectProcessMenu('');
                    });
                })
                    .catch(function (err) {
                    logger.error('Error during ' + finalPathES6 + ' page generation');
                    logger.error(err);
                    return rejectProcessMenu('');
                });
            })
                .catch(function (err) {
                logger.error('Error during ' + finalPathES6 + ' page generation');
                logger.error(err);
                return rejectProcessMenu('');
            });
        });
    };
    Application.prototype.processAdditionalPages = function () {
        var _this = this;
        logger.info('Process additional pages');
        var pages = Configuration$1.mainData.additionalPages;
        Promise.all(pages.map(function (page) {
            if (page.children.length > 0) {
                return Promise.all(__spreadArray([
                    _this.processPage(page)
                ], __read(page.children.map(function (childPage) { return _this.processPage(childPage); })), false));
            }
            else {
                return _this.processPage(page);
            }
        }))
            .then(function () {
            SearchEngine$1.generateSearchIndexJson(Configuration$1.mainData.output).then(function () {
                if (Configuration$1.mainData.assetsFolder !== '') {
                    _this.processAssetsFolder();
                }
                _this.processResources();
            });
        })
            .catch(function (e) {
            logger.error(e);
            return Promise.reject(e);
        });
    };
    Application.prototype.processAssetsFolder = function () {
        logger.info('Copy assets folder');
        if (!FileEngine$1.existsSync(Configuration$1.mainData.assetsFolder)) {
            logger.error("Provided assets folder ".concat(Configuration$1.mainData.assetsFolder, " did not exist"));
        }
        else {
            var finalOutput = Configuration$1.mainData.output;
            var testOutputDir = Configuration$1.mainData.output.match(cwd$1);
            if (testOutputDir && testOutputDir.length > 0) {
                finalOutput = Configuration$1.mainData.output.replace(cwd$1 + path__namespace.sep, '');
            }
            var destination = path__namespace.join(finalOutput, path__namespace.basename(Configuration$1.mainData.assetsFolder));
            fs__namespace.copy(path__namespace.resolve(Configuration$1.mainData.assetsFolder), path__namespace.resolve(destination), function (err) {
                if (err) {
                    logger.error('Error during resources copy ', err);
                }
            });
        }
    };
    Application.prototype.processResources = function () {
        var _this = this;
        logger.info('Copy main resources');
        var onComplete = function () {
            logger.info('Documentation generated in ' +
                Configuration$1.mainData.output +
                ' in ' +
                _this.getElapsedTime() +
                ' seconds using ' +
                Configuration$1.mainData.theme +
                ' theme');
            if (Configuration$1.mainData.serve) {
                logger.info("Serving documentation from ".concat(Configuration$1.mainData.output, " at http://").concat(Configuration$1.mainData.hostname, ":").concat(Configuration$1.mainData.port));
                _this.runWebServer(Configuration$1.mainData.output);
            }
            else {
                generationPromiseResolve(true);
                _this.endCallback();
            }
        };
        var finalOutput = Configuration$1.mainData.output;
        var testOutputDir = Configuration$1.mainData.output.match(cwd$1);
        if (testOutputDir && testOutputDir.length > 0) {
            finalOutput = Configuration$1.mainData.output.replace(cwd$1 + path__namespace.sep, '');
        }
        fs__namespace.copy(path__namespace.resolve(__dirname + '/../src/resources/'), path__namespace.resolve(finalOutput), function (errorCopy) {
            if (errorCopy) {
                logger.error('Error during resources copy ', errorCopy);
            }
            else {
                var extThemePromise = new Promise(function (extThemeResolve, extThemeReject) {
                    if (Configuration$1.mainData.extTheme) {
                        fs__namespace.copy(path__namespace.resolve(cwd$1 + path__namespace.sep + Configuration$1.mainData.extTheme), path__namespace.resolve(finalOutput + '/styles/'), function (errorCopyTheme) {
                            if (errorCopyTheme) {
                                logger.error('Error during external styling theme copy ', errorCopyTheme);
                                extThemeReject();
                            }
                            else {
                                logger.info('External styling theme copy succeeded');
                                extThemeResolve(true);
                            }
                        });
                    }
                    else {
                        extThemeResolve(true);
                    }
                });
                var customFaviconPromise = new Promise(function (customFaviconResolve, customFaviconReject) {
                    if (Configuration$1.mainData.customFavicon !== '') {
                        logger.info("Custom favicon supplied");
                        fs__namespace.copy(path__namespace.resolve(cwd$1 + path__namespace.sep + Configuration$1.mainData.customFavicon), path__namespace.resolve(finalOutput + '/images/favicon.ico'), function (errorCopyFavicon) {
                            // tslint:disable-line
                            if (errorCopyFavicon) {
                                logger.error('Error during resources copy of favicon', errorCopyFavicon);
                                customFaviconReject();
                            }
                            else {
                                logger.info('External custom favicon copy succeeded');
                                customFaviconResolve(true);
                            }
                        });
                    }
                    else {
                        customFaviconResolve(true);
                    }
                });
                var customLogoPromise = new Promise(function (customLogoResolve, customLogoReject) {
                    if (Configuration$1.mainData.customLogo !== '') {
                        logger.info("Custom logo supplied");
                        fs__namespace.copy(path__namespace.resolve(cwd$1 + path__namespace.sep + Configuration$1.mainData.customLogo), path__namespace.resolve(finalOutput +
                            '/images/' +
                            Configuration$1.mainData.customLogo.split('/').pop()), function (errorCopyLogo) {
                            // tslint:disable-line
                            if (errorCopyLogo) {
                                logger.error('Error during resources copy of logo', errorCopyLogo);
                                customLogoReject();
                            }
                            else {
                                logger.info('External custom logo copy succeeded');
                                customLogoResolve(true);
                            }
                        });
                    }
                    else {
                        customLogoResolve(true);
                    }
                });
                Promise.all([extThemePromise, customFaviconPromise, customLogoPromise]).then(function () {
                    onComplete();
                });
            }
        });
    };
    /**
     * Calculates the elapsed time since the program was started.
     *
     * @returns {number}
     */
    Application.prototype.getElapsedTime = function () {
        return (new Date().valueOf() - startTime.valueOf()) / 1000;
    };
    Application.prototype.processGraphs = function () {
        var _this = this;
        if (Configuration$1.mainData.disableGraph) {
            logger.info('Graph generation disabled');
            this.processPages();
        }
        else {
            logger.info('Process main graph');
            var modules_1 = Configuration$1.mainData.modules;
            var i_1 = 0;
            var len_1 = modules_1.length;
            var loop_1 = function () {
                if (i_1 <= len_1 - 1) {
                    logger.info('Process module graph ', modules_1[i_1].name);
                    var finalPath_2 = Configuration$1.mainData.output;
                    if (Configuration$1.mainData.output.lastIndexOf('/') === -1) {
                        finalPath_2 += '/';
                    }
                    finalPath_2 += 'modules/' + modules_1[i_1].name;
                    var _rawModule = DependenciesEngine$1.getRawModule(modules_1[i_1].name);
                    if (_rawModule.declarations.length > 0 ||
                        _rawModule.bootstrap.length > 0 ||
                        _rawModule.imports.length > 0 ||
                        _rawModule.exports.length > 0 ||
                        _rawModule.providers.length > 0) {
                        NgdEngine$1.renderGraph(modules_1[i_1].file, finalPath_2, 'f', modules_1[i_1].name).then(function () {
                            NgdEngine$1.readGraph(path__namespace.resolve(finalPath_2 + path__namespace.sep + 'dependencies.svg'), modules_1[i_1].name).then(function (data) {
                                modules_1[i_1].graph = data;
                                i_1++;
                                loop_1();
                            }, function (err) {
                                logger.error('Error during graph read: ', err);
                            });
                        }, function (errorMessage) {
                            logger.error(errorMessage);
                        });
                    }
                    else {
                        i_1++;
                        loop_1();
                    }
                }
                else {
                    _this.processPages();
                }
            };
            var finalMainGraphPath_1 = Configuration$1.mainData.output;
            if (finalMainGraphPath_1.lastIndexOf('/') === -1) {
                finalMainGraphPath_1 += '/';
            }
            finalMainGraphPath_1 += 'graph';
            NgdEngine$1.init(path__namespace.resolve(finalMainGraphPath_1));
            NgdEngine$1.renderGraph(Configuration$1.mainData.tsconfig, path__namespace.resolve(finalMainGraphPath_1), 'p').then(function () {
                NgdEngine$1.readGraph(path__namespace.resolve(finalMainGraphPath_1 + path__namespace.sep + 'dependencies.svg'), 'Main graph').then(function (data) {
                    Configuration$1.mainData.mainGraph = data;
                    loop_1();
                }, function (err) {
                    logger.error('Error during main graph reading : ', err);
                    Configuration$1.mainData.disableMainGraph = true;
                    loop_1();
                });
            }, function (err) {
                logger.error('Ooops error during main graph generation, moving on next part with main graph disabled : ', err);
                Configuration$1.mainData.disableMainGraph = true;
                loop_1();
            });
        }
    };
    Application.prototype.runWebServer = function (folder) {
        if (!this.isWatching) {
            var liveServerConfiguration = {
                root: folder,
                open: Configuration$1.mainData.open,
                quiet: true,
                logLevel: 0,
                wait: 1000,
                port: Configuration$1.mainData.port
            };
            if (Configuration$1.mainData.host !== '') {
                liveServerConfiguration.host = Configuration$1.mainData.host;
            }
            LiveServer__namespace.start(liveServerConfiguration);
        }
        if (Configuration$1.mainData.watch && !this.isWatching) {
            if (typeof this.files === 'undefined') {
                logger.error('No sources files available, please use -p flag');
                generationPromiseReject();
                process.exit(1);
            }
            else {
                this.runWatch();
            }
        }
        else if (Configuration$1.mainData.watch && this.isWatching) {
            var srcFolder = findMainSourceFolder(this.files);
            logger.info("Already watching sources in ".concat(srcFolder, " folder"));
        }
    };
    Application.prototype.runWatch = function () {
        var _this = this;
        var sources = [findMainSourceFolder(this.files)];
        var watcherReady = false;
        this.isWatching = true;
        logger.info("Watching sources in ".concat(findMainSourceFolder(this.files), " folder"));
        if (MarkdownEngine$1.hasRootMarkdowns()) {
            sources = sources.concat(MarkdownEngine$1.listRootMarkdowns());
        }
        if (Configuration$1.mainData.includes !== '') {
            sources = sources.concat(Configuration$1.mainData.includes);
        }
        // Check all elements of sources list exist
        sources = cleanSourcesForWatch(sources);
        var watcher = chokidar.watch(sources, {
            awaitWriteFinish: true,
            ignoreInitial: true,
            ignored: /(spec|\.d)\.ts/
        });
        var timerAddAndRemoveRef;
        var timerChangeRef;
        var runnerAddAndRemove = function () {
            startTime = new Date();
            _this.generate();
        };
        var waiterAddAndRemove = function () {
            clearTimeout(timerAddAndRemoveRef);
            timerAddAndRemoveRef = setTimeout(runnerAddAndRemove, 1000);
        };
        var runnerChange = function () {
            startTime = new Date();
            _this.setUpdatedFiles(_this.watchChangedFiles);
            if (_this.hasWatchedFilesTSFiles()) {
                _this.getMicroDependenciesData();
            }
            else if (_this.hasWatchedFilesRootMarkdownFiles()) {
                _this.rebuildRootMarkdowns();
            }
            else {
                _this.rebuildExternalDocumentation();
            }
        };
        var waiterChange = function () {
            clearTimeout(timerChangeRef);
            timerChangeRef = setTimeout(runnerChange, 1000);
        };
        watcher.on('ready', function () {
            if (!watcherReady) {
                watcherReady = true;
                watcher
                    .on('add', function (file) {
                    logger.debug("File ".concat(file, " has been added"));
                    // Test extension, if ts
                    // rescan everything
                    if (path__namespace.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                })
                    .on('change', function (file) {
                    logger.debug("File ".concat(file, " has been changed"));
                    // Test extension, if ts
                    // rescan only file
                    if (path__namespace.extname(file) === '.ts' ||
                        path__namespace.extname(file) === '.md' ||
                        path__namespace.extname(file) === '.json') {
                        _this.watchChangedFiles.push(path__namespace.join(cwd$1 + path__namespace.sep + file));
                        waiterChange();
                    }
                })
                    .on('unlink', function (file) {
                    logger.debug("File ".concat(file, " has been removed"));
                    // Test extension, if ts
                    // rescan everything
                    if (path__namespace.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                });
            }
        });
    };
    Object.defineProperty(Application.prototype, "application", {
        /**
         * Return the application / root component instance.
         */
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "isCLI", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    return Application;
}());

var fg = require('fast-glob');
var os = require('os');
var osName = require('os-name');
var pkg = require('../package.json');
var program = require('commander');
var cosmiconfigModuleName = 'compodoc';
var scannedFiles = [];
var excludeFiles = EXCLUDE_PATTERNS;
var includeFiles = [];
var cwd = process.cwd();
process.setMaxListeners(0);
var CliApplication = /** @class */ (function (_super) {
    __extends(CliApplication, _super);
    function CliApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Run compodoc from the command line.
     */
    CliApplication.prototype.start = function () {
        var _this = this;
        function list(val) {
            return val.split(',');
        }
        program
            .version(pkg.version)
            .usage('<src> [options]')
            .option('-c, --config [config]', 'A configuration file : .compodocrc, .compodocrc.json, .compodocrc.yaml or compodoc property in package.json')
            .option('-p, --tsconfig [config]', 'A tsconfig.json file')
            .option('-d, --output [folder]', 'Where to store the generated documentation', COMPODOC_DEFAULTS.folder)
            .option('-y, --extTheme [file]', 'External styling theme file')
            .option('-n, --name [name]', 'Title documentation', COMPODOC_DEFAULTS.title)
            .option('-a, --assetsFolder [folder]', 'External assets folder to copy in generated documentation folder')
            .option('-o, --open [value]', 'Open the generated documentation')
            .option('-t, --silent', "In silent mode, log messages aren't logged in the console", false)
            .option('-s, --serve', 'Serve generated documentation (default http://localhost:8080/)', false)
            .option('--host [host]', 'Change default host address')
            .option('-r, --port [port]', 'Change default serving port', COMPODOC_DEFAULTS.port)
            .option('-w, --watch', 'Watch source files after serve and force documentation rebuild', false)
            .option('-e, --exportFormat [format]', 'Export in specified format (json, html)', COMPODOC_DEFAULTS.exportFormat)
            .option('--files [files]', 'Files provided by external tool, used for coverage test')
            .option('--language [language]', 'Language used for the generated documentation (bg-BG, de-DE, en-US, es-ES, fr-FR, hu-HU, it-IT, ja-JP, ka-GE, ko-KR, nl-NL, pl-PL, pt-BR, ru-RU, sk-SK, zh-CN, zh-TW)', COMPODOC_DEFAULTS.language)
            .option('--theme [theme]', "Choose one of available themes, default is 'gitbook' (laravel, original, material, postmark, readthedocs, stripe, vagrant)")
            .option('--hideGenerator', 'Do not print the Compodoc link at the bottom of the page', false)
            .option('--hideDarkModeToggle', 'Do not show dark mode toggle button at the top right position of the page', false)
            .option('--toggleMenuItems <items>', "Close by default items in the menu values : ['all'] or one of these ['modules','components','directives','controllers','entities','classes','injectables','guards','interfaces','interceptors','pipes','miscellaneous','additionalPages']", list, COMPODOC_DEFAULTS.toggleMenuItems)
            .option('--navTabConfig <tab configs>', "List navigation tab objects in the desired order with two string properties (\"id\" and \"label\"). Double-quotes must be escaped with '\\'. Available tab IDs are \"info\", \"readme\", \"source\", \"templateData\", \"styleData\", \"tree\", and \"example\". Note: Certain tabs will only be shown if applicable to a given dependency", list, JSON.stringify(COMPODOC_DEFAULTS.navTabConfig))
            .option('--templates [folder]', 'Path to directory of Handlebars templates to override built-in templates')
            .option('--includes [path]', 'Path of external markdown files to include')
            .option('--includesName [name]', 'Name of item menu of externals markdown files', COMPODOC_DEFAULTS.additionalEntryName)
            .option('--coverageTest [threshold]', 'Test command of documentation coverage with a threshold (default 70)')
            .option('--coverageMinimumPerFile [minimum]', 'Test command of documentation coverage per file with a minimum (default 0)')
            .option('--coverageTestThresholdFail [true|false]', 'Test command of documentation coverage (global or per file) will fail with error or just warn user (true: error, false: warn)', COMPODOC_DEFAULTS.coverageTestThresholdFail)
            .option('--coverageTestShowOnlyFailed', 'Display only failed files for a coverage test')
            .option('--unitTestCoverage [json-summary]', 'To include unit test coverage, specify istanbul JSON coverage summary file')
            .option('--disableSourceCode', 'Do not add source code tab and links to source code', false)
            .option('--disableDomTree', 'Do not add dom tree tab', false)
            .option('--disableTemplateTab', 'Do not add template tab', false)
            .option('--disableStyleTab', 'Do not add style tab', false)
            .option('--disableGraph', 'Do not add the dependency graph', false)
            .option('--disableCoverage', 'Do not add the documentation coverage report', false)
            .option('--disablePrivate', 'Do not show private in generated documentation', false)
            .option('--disableProtected', 'Do not show protected in generated documentation', false)
            .option('--disableInternal', 'Do not show @internal in generated documentation', false)
            .option('--disableLifeCycleHooks', 'Do not show Angular lifecycle hooks in generated documentation', false)
            .option('--disableRoutesGraph', 'Do not add the routes graph', COMPODOC_DEFAULTS.disableRoutesGraph)
            .option('--disableSearch', 'Do not add the search input', false)
            .option('--disableDependencies', 'Do not add the dependencies list', COMPODOC_DEFAULTS.disableDependencies)
            .option('--disableProperties', 'Do not add the properties list', COMPODOC_DEFAULTS.disableProperties)
            .option('--minimal', 'Minimal mode with only documentation. No search, no graph, no coverage.', false)
            .option('--customFavicon [path]', 'Use a custom favicon')
            .option('--customLogo [path]', 'Use a custom logo')
            .option('--gaID [id]', 'Google Analytics tracking ID')
            .option('--gaSite [site]', 'Google Analytics site name', COMPODOC_DEFAULTS.gaSite)
            .option('--maxSearchResults [maxSearchResults]', 'Max search results on the results page. To show all results, set to 0', COMPODOC_DEFAULTS.maxSearchResults)
            .parse(process.argv);
        var outputHelp = function () {
            program.outputHelp();
            process.exit(1);
        };
        var configExplorer = cosmiconfig.cosmiconfigSync(cosmiconfigModuleName);
        var configExplorerResult;
        var configFile = {};
        var programOptions = program.opts();
        if (programOptions.config) {
            var configFilePath = programOptions.config;
            var testConfigFilePath = configFilePath.match(process.cwd());
            if (testConfigFilePath && testConfigFilePath.length > 0) {
                configFilePath = configFilePath.replace(process.cwd() + path__namespace.sep, '');
            }
            configExplorerResult = configExplorer.load(path__namespace.resolve(configFilePath));
        }
        else {
            configExplorerResult = configExplorer.search();
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                configFile = configExplorerResult.config;
            }
        }
        if (configFile.output) {
            Configuration$1.mainData.output = configFile.output;
        }
        if (programOptions.output && programOptions.output !== COMPODOC_DEFAULTS.folder) {
            Configuration$1.mainData.output = programOptions.output;
        }
        if (configFile.extTheme) {
            Configuration$1.mainData.extTheme = configFile.extTheme;
        }
        if (programOptions.extTheme) {
            Configuration$1.mainData.extTheme = programOptions.extTheme;
        }
        if (configFile.language) {
            Configuration$1.mainData.language = configFile.language;
        }
        if (programOptions.language) {
            Configuration$1.mainData.language = programOptions.language;
        }
        if (configFile.theme) {
            Configuration$1.mainData.theme = configFile.theme;
        }
        if (programOptions.theme) {
            Configuration$1.mainData.theme = programOptions.theme;
        }
        if (configFile.name) {
            Configuration$1.mainData.documentationMainName = configFile.name;
        }
        if (programOptions.name && programOptions.name !== COMPODOC_DEFAULTS.title) {
            Configuration$1.mainData.documentationMainName = programOptions.name;
        }
        if (configFile.assetsFolder) {
            Configuration$1.mainData.assetsFolder = configFile.assetsFolder;
        }
        if (programOptions.assetsFolder) {
            Configuration$1.mainData.assetsFolder = programOptions.assetsFolder;
        }
        if (configFile.open) {
            Configuration$1.mainData.open = configFile.open;
        }
        if (programOptions.open) {
            Configuration$1.mainData.open = programOptions.open;
        }
        if (configFile.toggleMenuItems) {
            Configuration$1.mainData.toggleMenuItems = configFile.toggleMenuItems;
        }
        if (programOptions.toggleMenuItems &&
            programOptions.toggleMenuItems !== COMPODOC_DEFAULTS.toggleMenuItems) {
            Configuration$1.mainData.toggleMenuItems = programOptions.toggleMenuItems;
        }
        if (configFile.templates) {
            Configuration$1.mainData.templates = configFile.templates;
        }
        if (programOptions.templates) {
            Configuration$1.mainData.templates = programOptions.templates;
        }
        if (configFile.navTabConfig) {
            Configuration$1.mainData.navTabConfig = configFile.navTabConfig;
        }
        if (programOptions.navTabConfig &&
            JSON.parse(programOptions.navTabConfig).length !== COMPODOC_DEFAULTS.navTabConfig.length) {
            Configuration$1.mainData.navTabConfig = JSON.parse(programOptions.navTabConfig);
        }
        if (configFile.includes) {
            Configuration$1.mainData.includes = configFile.includes;
        }
        if (programOptions.includes) {
            Configuration$1.mainData.includes = programOptions.includes;
        }
        if (configFile.includesName) {
            Configuration$1.mainData.includesName = configFile.includesName;
        }
        if (programOptions.includesName &&
            programOptions.includesName !== COMPODOC_DEFAULTS.additionalEntryName) {
            Configuration$1.mainData.includesName = programOptions.includesName;
        }
        if (configFile.silent) {
            logger.silent = false;
        }
        if (programOptions.silent) {
            logger.silent = false;
        }
        if (configFile.serve) {
            Configuration$1.mainData.serve = configFile.serve;
        }
        if (programOptions.serve) {
            Configuration$1.mainData.serve = programOptions.serve;
        }
        if (configFile.host) {
            Configuration$1.mainData.host = configFile.host;
            Configuration$1.mainData.hostname = configFile.host;
        }
        if (programOptions.host) {
            Configuration$1.mainData.host = programOptions.host;
            Configuration$1.mainData.hostname = programOptions.host;
        }
        if (configFile.port) {
            Configuration$1.mainData.port = configFile.port;
        }
        if (programOptions.port && programOptions.port !== COMPODOC_DEFAULTS.port) {
            Configuration$1.mainData.port = programOptions.port;
        }
        if (configFile.watch) {
            Configuration$1.mainData.watch = configFile.watch;
        }
        if (programOptions.watch) {
            Configuration$1.mainData.watch = programOptions.watch;
        }
        if (configFile.exportFormat) {
            Configuration$1.mainData.exportFormat = configFile.exportFormat;
        }
        if (programOptions.exportFormat &&
            programOptions.exportFormat !== COMPODOC_DEFAULTS.exportFormat) {
            Configuration$1.mainData.exportFormat = programOptions.exportFormat;
        }
        if (configFile.hideGenerator) {
            Configuration$1.mainData.hideGenerator = configFile.hideGenerator;
        }
        if (programOptions.hideGenerator) {
            Configuration$1.mainData.hideGenerator = programOptions.hideGenerator;
        }
        if (configFile.hideDarkModeToggle) {
            Configuration$1.mainData.hideDarkModeToggle = configFile.hideDarkModeToggle;
        }
        if (programOptions.hideDarkModeToggle) {
            Configuration$1.mainData.hideDarkModeToggle = programOptions.hideDarkModeToggle;
        }
        if (configFile.coverageTest) {
            Configuration$1.mainData.coverageTest = true;
            Configuration$1.mainData.coverageTestThreshold =
                typeof configFile.coverageTest === 'string'
                    ? parseInt(configFile.coverageTest, 10)
                    : COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (programOptions.coverageTest) {
            Configuration$1.mainData.coverageTest = true;
            Configuration$1.mainData.coverageTestThreshold =
                typeof programOptions.coverageTest === 'string'
                    ? parseInt(programOptions.coverageTest, 10)
                    : COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (configFile.coverageMinimumPerFile) {
            Configuration$1.mainData.coverageTestPerFile = true;
            Configuration$1.mainData.coverageMinimumPerFile =
                typeof configFile.coverageMinimumPerFile === 'string'
                    ? parseInt(configFile.coverageMinimumPerFile, 10)
                    : COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (programOptions.coverageMinimumPerFile) {
            Configuration$1.mainData.coverageTestPerFile = true;
            Configuration$1.mainData.coverageMinimumPerFile =
                typeof programOptions.coverageMinimumPerFile === 'string'
                    ? parseInt(programOptions.coverageMinimumPerFile, 10)
                    : COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (configFile.coverageTestThresholdFail) {
            Configuration$1.mainData.coverageTestThresholdFail =
                configFile.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (programOptions.coverageTestThresholdFail) {
            Configuration$1.mainData.coverageTestThresholdFail =
                programOptions.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (configFile.coverageTestShowOnlyFailed) {
            Configuration$1.mainData.coverageTestShowOnlyFailed =
                configFile.coverageTestShowOnlyFailed;
        }
        if (programOptions.coverageTestShowOnlyFailed) {
            Configuration$1.mainData.coverageTestShowOnlyFailed =
                programOptions.coverageTestShowOnlyFailed;
        }
        if (configFile.unitTestCoverage) {
            Configuration$1.mainData.unitTestCoverage = configFile.unitTestCoverage;
        }
        if (programOptions.unitTestCoverage) {
            Configuration$1.mainData.unitTestCoverage = programOptions.unitTestCoverage;
        }
        if (configFile.disableSourceCode) {
            Configuration$1.mainData.disableSourceCode = configFile.disableSourceCode;
        }
        if (programOptions.disableSourceCode) {
            Configuration$1.mainData.disableSourceCode = programOptions.disableSourceCode;
        }
        if (configFile.disableDomTree) {
            Configuration$1.mainData.disableDomTree = configFile.disableDomTree;
        }
        if (programOptions.disableDomTree) {
            Configuration$1.mainData.disableDomTree = programOptions.disableDomTree;
        }
        if (configFile.disableTemplateTab) {
            Configuration$1.mainData.disableTemplateTab = configFile.disableTemplateTab;
        }
        if (programOptions.disableTemplateTab) {
            Configuration$1.mainData.disableTemplateTab = programOptions.disableTemplateTab;
        }
        if (configFile.disableStyleTab) {
            Configuration$1.mainData.disableStyleTab = configFile.disableStyleTab;
        }
        if (programOptions.disableStyleTab) {
            Configuration$1.mainData.disableStyleTab = programOptions.disableStyleTab;
        }
        if (configFile.disableGraph) {
            Configuration$1.mainData.disableGraph = configFile.disableGraph;
        }
        if (programOptions.disableGraph) {
            Configuration$1.mainData.disableGraph = programOptions.disableGraph;
        }
        if (configFile.disableCoverage) {
            Configuration$1.mainData.disableCoverage = configFile.disableCoverage;
        }
        if (programOptions.disableCoverage) {
            Configuration$1.mainData.disableCoverage = programOptions.disableCoverage;
        }
        if (configFile.disablePrivate) {
            Configuration$1.mainData.disablePrivate = configFile.disablePrivate;
        }
        if (programOptions.disablePrivate) {
            Configuration$1.mainData.disablePrivate = programOptions.disablePrivate;
        }
        if (configFile.disableProtected) {
            Configuration$1.mainData.disableProtected = configFile.disableProtected;
        }
        if (programOptions.disableProtected) {
            Configuration$1.mainData.disableProtected = programOptions.disableProtected;
        }
        if (configFile.disableInternal) {
            Configuration$1.mainData.disableInternal = configFile.disableInternal;
        }
        if (programOptions.disableInternal) {
            Configuration$1.mainData.disableInternal = programOptions.disableInternal;
        }
        if (configFile.disableLifeCycleHooks) {
            Configuration$1.mainData.disableLifeCycleHooks = configFile.disableLifeCycleHooks;
        }
        if (programOptions.disableLifeCycleHooks) {
            Configuration$1.mainData.disableLifeCycleHooks = programOptions.disableLifeCycleHooks;
        }
        if (configFile.disableRoutesGraph) {
            Configuration$1.mainData.disableRoutesGraph = configFile.disableRoutesGraph;
        }
        if (programOptions.disableRoutesGraph) {
            Configuration$1.mainData.disableRoutesGraph = programOptions.disableRoutesGraph;
        }
        if (configFile.disableSearch) {
            Configuration$1.mainData.disableSearch = configFile.disableSearch;
        }
        if (programOptions.disableSearch) {
            Configuration$1.mainData.disableSearch = programOptions.disableSearch;
        }
        if (configFile.disableDependencies) {
            Configuration$1.mainData.disableDependencies = configFile.disableDependencies;
        }
        if (programOptions.disableDependencies) {
            Configuration$1.mainData.disableDependencies = programOptions.disableDependencies;
        }
        if (configFile.disableProperties) {
            Configuration$1.mainData.disableProperties = configFile.disableProperties;
        }
        if (programOptions.disableProperties) {
            Configuration$1.mainData.disableProperties = programOptions.disableProperties;
        }
        if (configFile.minimal) {
            Configuration$1.mainData.disableSearch = true;
            Configuration$1.mainData.disableRoutesGraph = true;
            Configuration$1.mainData.disableGraph = true;
            Configuration$1.mainData.disableCoverage = true;
        }
        if (programOptions.minimal) {
            Configuration$1.mainData.disableSearch = true;
            Configuration$1.mainData.disableRoutesGraph = true;
            Configuration$1.mainData.disableGraph = true;
            Configuration$1.mainData.disableCoverage = true;
        }
        if (configFile.customFavicon) {
            Configuration$1.mainData.customFavicon = configFile.customFavicon;
        }
        if (programOptions.customFavicon) {
            Configuration$1.mainData.customFavicon = programOptions.customFavicon;
        }
        if (configFile.customLogo) {
            Configuration$1.mainData.customLogo = configFile.customLogo;
        }
        if (programOptions.customLogo) {
            Configuration$1.mainData.customLogo = programOptions.customLogo;
        }
        if (configFile.gaID) {
            Configuration$1.mainData.gaID = configFile.gaID;
        }
        if (programOptions.gaID) {
            Configuration$1.mainData.gaID = programOptions.gaID;
        }
        if (configFile.gaSite) {
            Configuration$1.mainData.gaSite = configFile.gaSite;
        }
        if (programOptions.gaSite && programOptions.gaSite !== COMPODOC_DEFAULTS.gaSite) {
            Configuration$1.mainData.gaSite = programOptions.gaSite;
        }
        if (!this.isWatching) {
            if (!logger.silent) {
                console.log("Compodoc v".concat(pkg.version));
            }
            else {
                console.log(fs__namespace.readFileSync(path__namespace.join(__dirname, '../src/banner')).toString());
                console.log(pkg.version);
                console.log('');
                console.log("TypeScript version used by Compodoc : ".concat(tsMorph.ts.version));
                console.log('');
                if (FileEngine$1.existsSync(cwd + path__namespace.sep + 'package.json')) {
                    var packageData = FileEngine$1.getSync(cwd + path__namespace.sep + 'package.json');
                    if (packageData) {
                        var parsedData = JSON.parse(packageData);
                        var projectDevDependencies = parsedData.devDependencies;
                        if (projectDevDependencies && projectDevDependencies.typescript) {
                            var tsProjectVersion = AngularVersionUtil$1.cleanVersion(projectDevDependencies.typescript);
                            console.log("TypeScript version of current project : ".concat(tsProjectVersion));
                            console.log('');
                        }
                    }
                }
                console.log("Node.js version : ".concat(process.version));
                console.log('');
                console.log("Operating system : ".concat(osName(os.platform(), os.release())));
                console.log('');
            }
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                logger.info("Using configuration file : ".concat(configExplorerResult.filepath));
            }
        }
        if (!configExplorerResult) {
            logger.warn("No configuration file found, switching to CLI flags.");
        }
        if (programOptions.language && !I18nEngine$1.supportLanguage(programOptions.language)) {
            logger.warn("The language ".concat(programOptions.language, " is not available, falling back to ").concat(I18nEngine$1.fallbackLanguage));
        }
        if (programOptions.tsconfig && typeof programOptions.tsconfig === 'boolean') {
            logger.error("Please provide a tsconfig file.");
            process.exit(1);
        }
        if (configFile.tsconfig) {
            Configuration$1.mainData.tsconfig = configFile.tsconfig;
        }
        if (programOptions.tsconfig) {
            Configuration$1.mainData.tsconfig = programOptions.tsconfig;
        }
        if (programOptions.maxSearchResults) {
            Configuration$1.mainData.maxSearchResults = programOptions.maxSearchResults;
        }
        if (configFile.files) {
            scannedFiles = configFile.files;
        }
        if (configFile.exclude) {
            excludeFiles = configFile.exclude;
        }
        if (configFile.include) {
            includeFiles = configFile.include;
        }
        /**
         * Check --files argument call
         */
        var argv = require('minimist')(process.argv.slice(2));
        if (argv && argv.files) {
            Configuration$1.mainData.hasFilesToCoverage = true;
            if (typeof argv.files === 'string') {
                _super.prototype.setFiles.call(this, [argv.files]);
            }
            else {
                _super.prototype.setFiles.call(this, argv.files);
            }
        }
        if (programOptions.serve && !Configuration$1.mainData.tsconfig && programOptions.output) {
            // if -s & -d, serve it
            if (!FileEngine$1.existsSync(Configuration$1.mainData.output)) {
                logger.error("".concat(Configuration$1.mainData.output, " folder doesn't exist"));
                process.exit(1);
            }
            else {
                logger.info("Serving documentation from ".concat(Configuration$1.mainData.output, " at http://").concat(Configuration$1.mainData.hostname, ":").concat(programOptions.port));
                _super.prototype.runWebServer.call(this, Configuration$1.mainData.output);
            }
        }
        else if (programOptions.serve &&
            !Configuration$1.mainData.tsconfig &&
            !programOptions.output) {
            // if only -s find ./documentation, if ok serve, else error provide -d
            if (!FileEngine$1.existsSync(Configuration$1.mainData.output)) {
                logger.error('Provide output generated folder with -d flag');
                process.exit(1);
            }
            else {
                logger.info("Serving documentation from ".concat(Configuration$1.mainData.output, " at http://").concat(Configuration$1.mainData.hostname, ":").concat(programOptions.port));
                _super.prototype.runWebServer.call(this, Configuration$1.mainData.output);
            }
        }
        else if (Configuration$1.mainData.hasFilesToCoverage) {
            if (programOptions.coverageMinimumPerFile) {
                logger.info('Run documentation coverage test for files');
                _super.prototype.testCoverage.call(this);
            }
            else {
                logger.error('Missing coverage configuration');
            }
        }
        else {
            if (programOptions.hideGenerator) {
                Configuration$1.mainData.hideGenerator = true;
            }
            if (Configuration$1.mainData.tsconfig) {
                /**
                 * tsconfig file provided only
                 */
                var testTsConfigPath = Configuration$1.mainData.tsconfig.indexOf(process.cwd());
                if (testTsConfigPath !== -1) {
                    Configuration$1.mainData.tsconfig = Configuration$1.mainData.tsconfig.replace(process.cwd() + path__namespace.sep, '');
                }
                var sourceFolder = void 0;
                if (program.args.length > 0) {
                    /**
                     * tsconfig file provided with source folder in arg
                     */
                    var testTsConfigPath_1 = Configuration$1.mainData.tsconfig.indexOf(process.cwd());
                    if (testTsConfigPath_1 !== -1) {
                        Configuration$1.mainData.tsconfig = Configuration$1.mainData.tsconfig.replace(process.cwd() + path__namespace.sep, '');
                    }
                    sourceFolder = program.args[0];
                    if (!FileEngine$1.existsSync(sourceFolder)) {
                        logger.error("Provided source folder ".concat(sourceFolder, " was not found in the current directory"));
                        process.exit(1);
                    }
                    else {
                        logger.info('Using provided source folder');
                    }
                }
                if (!FileEngine$1.existsSync(Configuration$1.mainData.tsconfig)) {
                    logger.error("\"".concat(Configuration$1.mainData.tsconfig, "\" file was not found in the current directory"));
                    process.exit(1);
                }
                else {
                    var _file = path__namespace.join(path__namespace.join(process.cwd(), path__namespace.dirname(Configuration$1.mainData.tsconfig)), path__namespace.basename(Configuration$1.mainData.tsconfig));
                    // use the current directory of tsconfig.json as a working directory
                    cwd = _file.split(path__namespace.sep).slice(0, -1).join(path__namespace.sep);
                    logger.info('Using tsconfig file ', _file);
                    var tsConfigFile = readConfig(_file);
                    if (tsConfigFile.files) {
                        scannedFiles = tsConfigFile.files;
                        // Normalize path of these files
                        scannedFiles = scannedFiles.map(function (scannedFile) {
                            return cwd + path__namespace.sep + scannedFile;
                        });
                    }
                    // even if files are supplied with "files" attributes, enhance the array with includes
                    excludeFiles = __spreadArray(__spreadArray([], __read(excludeFiles), false), __read((tsConfigFile.exclude || [])), false);
                    includeFiles = __spreadArray(__spreadArray([], __read(includeFiles), false), __read((tsConfigFile.include || [])), false);
                    if (scannedFiles.length > 0) {
                        includeFiles = __spreadArray(__spreadArray([], __read(includeFiles), false), __read(scannedFiles), false);
                    }
                    if (!includeFiles.length) {
                        includeFiles = INCLUDE_PATTERNS;
                    }
                    var stream = fg.stream(includeFiles, {
                        cwd: sourceFolder || cwd,
                        ignore: excludeFiles,
                        absolute: true
                    });
                    stream.on('data', function (file) {
                        if (path__namespace.extname(file) === '.ts' || path__namespace.extname(file) === '.tsx') {
                            logger.debug('Including', file);
                            scannedFiles.push(file);
                        }
                        else {
                            logger.warn('Excluding', file);
                        }
                    });
                    stream.on('end', function () {
                        _super.prototype.setFiles.call(_this, scannedFiles);
                        if (programOptions.coverageTest || programOptions.coverageTestPerFile) {
                            logger.info('Run documentation coverage test');
                            _super.prototype.testCoverage.call(_this);
                        }
                        else {
                            _super.prototype.generate.call(_this);
                        }
                    });
                }
            }
            else {
                logger.error('tsconfig.json file was not found, please use -p flag');
                outputHelp();
            }
        }
    };
    return CliApplication;
}(Application));

exports.Application = Application;
exports.CliApplication = CliApplication;