// src/auth/AuthProvider.tsx
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { createContext, useContext, useState, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var AuthContext = createContext(void 0);
var AuthProvider = function(param) {
    var children = param.children, _param_showLoginAfterSeconds = param.showLoginAfterSeconds, showLoginAfterSeconds = _param_showLoginAfterSeconds === void 0 ? 30 : _param_showLoginAfterSeconds;
    var _useState = _sliced_to_array(useState(false), 2), showLoginModal = _useState[0], setShowLoginModal = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), showSignupModal = _useState1[0], setShowSignupModal = _useState1[1];
    var _useState2 = _sliced_to_array(useState("BR"), 2), selectedCountry = _useState2[0], setSelectedCountry = _useState2[1];
    var _useState3 = _sliced_to_array(useState({
        companyName: "",
        fullName: "",
        taxId: "",
        email: "",
        phone: "+55"
    }), 2), signupFormData = _useState3[0], setSignupFormData = _useState3[1];
    useEffect(function() {
        var loginTimer = setTimeout(function() {
            setShowLoginModal(true);
        }, showLoginAfterSeconds * 1e3);
        return function() {
            return clearTimeout(loginTimer);
        };
    }, [
        showLoginAfterSeconds
    ]);
    var handleOpenLoginModal = function() {
        return setShowLoginModal(true);
    };
    var handleCloseLoginModal = function() {
        return setShowLoginModal(false);
    };
    var handleOpenSignupModal = function() {
        setShowSignupModal(true);
        setShowLoginModal(false);
    };
    var handleCloseSignupModal = function() {
        return setShowSignupModal(false);
    };
    var handleCountryChange = function(e) {
        var country = e.target.value;
        setSelectedCountry(country);
        setSignupFormData(_object_spread_props(_object_spread({}, signupFormData), {
            taxId: "",
            phone: country === "BR" ? "+55" : "+1"
        }));
    };
    var handleSignupFormChange = function(e) {
        var _e_target = e.target, name = _e_target.name, value2 = _e_target.value;
        setSignupFormData(_object_spread_props(_object_spread({}, signupFormData), _define_property({}, name, value2)));
    };
    var handleSignupSubmit = function(e) {
        e.preventDefault();
        console.log("Signup data:", signupFormData);
        setTimeout(function() {
            handleCloseSignupModal();
        }, 1e3);
    };
    var value = {
        showLoginModal: showLoginModal,
        showSignupModal: showSignupModal,
        signupFormData: signupFormData,
        selectedCountry: selectedCountry,
        handleOpenLoginModal: handleOpenLoginModal,
        handleCloseLoginModal: handleCloseLoginModal,
        handleOpenSignupModal: handleOpenSignupModal,
        handleCloseSignupModal: handleCloseSignupModal,
        handleCountryChange: handleCountryChange,
        handleSignupFormChange: handleSignupFormChange,
        handleSignupSubmit: handleSignupSubmit
    };
    return /* @__PURE__ */ jsx(AuthContext.Provider, {
        value: value,
        children: children
    });
};
var useAuthContext = function() {
    var context = useContext(AuthContext);
    if (context === void 0) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
var AuthProvider_default = AuthProvider;
// src/quotes/QuoteProvider.tsx
import { createContext as createContext2, useContext as useContext2 } from "react";
import { useQuoteStages, useAdvancedForm } from "@ergo-ai/hooks";
import { jsx as jsx2 } from "react/jsx-runtime";
var QuoteContext = createContext2(void 0);
var QuoteProvider = function(param) {
    var children = param.children, resetUpload = param.resetUpload;
    var _useQuoteStages = useQuoteStages(), quoteStage = _useQuoteStages.quoteStage, setQuoteStage = _useQuoteStages.setQuoteStage, quoteData = _useQuoteStages.quoteData, setQuoteData = _useQuoteStages.setQuoteData, activeTab = _useQuoteStages.activeTab, setActiveTab = _useQuoteStages.setActiveTab, baseHandleGenerateQuote = _useQuoteStages.handleGenerateQuote, baseHandleGenerateAdvancedQuote = _useQuoteStages.handleGenerateAdvancedQuote, handleConfirmQuote = _useQuoteStages.handleConfirmQuote, baseHandleNewQuote = _useQuoteStages.handleNewQuote, handleTabChange = _useQuoteStages.handleTabChange;
    var _useAdvancedForm = useAdvancedForm(), formData = _useAdvancedForm.formData, handleFormChange = _useAdvancedForm.handleFormChange;
    var mockPreviousQuotesData = [
        {
            id: "1",
            company: "3S SUPERMERCADO LTDA",
            date: "20/04/2025",
            value: 200050
        },
        {
            id: "2",
            company: "TECH SOLUTIONS SA",
            date: "15/04/2025",
            value: 15e4
        },
        {
            id: "3",
            company: "CONSTRU\xC7\xD5ES SILVA LTDA",
            date: "10/04/2025",
            value: 5e5
        }
    ];
    var handleNewQuote = function() {
        if (resetUpload) {
            resetUpload();
        }
        baseHandleNewQuote();
    };
    var handleSelectQuote = function(quoteId) {
        return _async_to_generator(function() {
            var selectedQuote;
            return _ts_generator(this, function(_state) {
                try {
                    console.log("Selected quote with ID: ".concat(quoteId));
                    selectedQuote = mockPreviousQuotesData.find(function(q) {
                        return q.id === quoteId;
                    });
                    if (selectedQuote) {
                        setQuoteData({
                            borrower: {
                                name: selectedQuote.company,
                                taxId: "46.189.831/0001-54",
                                address: "AVENIDA DOUTOR GENTIL DE MOURA, N.\xBA 370, BOX 03, BAIRRO IPIRANGA",
                                zipCode: "04.208-053",
                                city: "S\xC3O PAULO",
                                state: "SP",
                                email: "contato@exemplo.com"
                            },
                            beneficiary: {
                                name: "DIA BRASIL SOCIEDADE LIMITADA EM RECUPERA\xC7\xC3O JUDICIAL",
                                taxId: "03.476.811/0001-51",
                                address: "AV IBIRAPUERA, N.\xBA 2.332, BLOCO I - TORRES IBIRAPUERA I, 14\xBA ANDAR, INDIAN\xD3POLIS",
                                zipCode: "04028-900",
                                city: "S\xC3O PAULO",
                                state: "SP"
                            },
                            guarantee: {
                                type: "GARANTIA FINANCEIRA",
                                coverage: "GARANTIA DE PAGAMENTO",
                                value: selectedQuote.value,
                                startDate: selectedQuote.date,
                                endDate: "29/04/2026",
                                days: 365,
                                reference: "".concat(quoteId, "032025DBSL3SAL1"),
                                proposal: "ICSMCP".concat(quoteId, "032025"),
                                purpose: "Garantia total as obriga\xE7\xF5es assumidas no Contrato."
                            },
                            premium: selectedQuote.value * 0.05
                        });
                        setQuoteStage("result");
                    } else {
                        console.error("Cota\xE7\xE3o n\xE3o encontrada");
                        alert("N\xE3o foi poss\xEDvel encontrar detalhes da cota\xE7\xE3o. Tente novamente.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar detalhes da cota\xE7\xE3o:", error);
                    alert("Falha ao carregar detalhes da cota\xE7\xE3o. Tente novamente.");
                }
                return [
                    2
                ];
            });
        })();
    };
    var value = {
        quoteStage: quoteStage,
        setQuoteStage: setQuoteStage,
        quoteData: quoteData,
        setQuoteData: setQuoteData,
        activeTab: activeTab,
        setActiveTab: setActiveTab,
        formData: formData,
        handleFormChange: handleFormChange,
        handleNewQuote: handleNewQuote,
        handleGenerateQuote: baseHandleGenerateQuote,
        handleGenerateAdvancedQuote: baseHandleGenerateAdvancedQuote,
        handleConfirmQuote: handleConfirmQuote,
        handleTabChange: handleTabChange,
        mockPreviousQuotesData: mockPreviousQuotesData,
        handleSelectQuote: handleSelectQuote
    };
    return /* @__PURE__ */ jsx2(QuoteContext.Provider, {
        value: value,
        children: children
    });
};
var useQuoteContext = function() {
    var context = useContext2(QuoteContext);
    if (context === void 0) {
        throw new Error("useQuoteContext must be used within a QuoteProvider");
    }
    return context;
};
var QuoteProvider_default = QuoteProvider;
export { AuthProvider_default as AuthProvider, QuoteProvider_default as QuoteProvider, useAuthContext, useQuoteContext };
