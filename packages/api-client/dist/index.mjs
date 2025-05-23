// src/auth/jwt-auth.ts
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
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import axios from "axios";
var jwtAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_HOST_API,
    // YOUR_API_URL HERE
    headers: {
        "Content-Type": "application/json"
    }
});
jwtAxios.interceptors.response.use(function(res) {
    return res;
}, function(err) {
    if (err.response && err.response.data.msg === "Token is not valid") {
        console.log("Need to logout user");
    }
    return Promise.reject(err);
});
jwtAxios.interceptors.request.use(function(config) {
    if (typeof window !== "undefined") {
        config.headers["X-Frontend-host"] = window.location.hostname;
        var affiliateCode = localStorage.getItem("affiliateCode");
        if (affiliateCode) {
            config.headers["X-Affiliate-Code"] = affiliateCode;
        }
    }
    return config;
});
var setAuthToken = function(token) {
    if (token) {
        jwtAxios.defaults.headers.common.Authorization = "Bearer ".concat(token);
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
        }
    } else {
        delete jwtAxios.defaults.headers.common.Authorization;
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
    }
};
var setSystem = function(System) {
    if (System && typeof window !== "undefined") {
        localStorage.setItem("System", System);
    } else if (typeof window !== "undefined") {
        localStorage.removeItem("System");
    }
};
if (typeof window !== "undefined") {
    var token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
}
var jwt_auth_default = jwtAxios;
// src/endpoints/modality.ts
function getActiveModalies() {
    return _async_to_generator(function() {
        var response, error, axiosError;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    console.log("Chamando API de modalidades ativas");
                    return [
                        4,
                        jwt_auth_default.get("modalities/active")
                    ];
                case 1:
                    response = _state.sent();
                    console.log("Resposta recebida:", response.data);
                    return [
                        2,
                        response.data.data
                    ];
                case 2:
                    error = _state.sent();
                    console.error("Erro ao buscar modalidades ativas:", error);
                    if (error && (typeof error === "undefined" ? "undefined" : _type_of(error)) === "object" && "response" in error) {
                        axiosError = error;
                        console.error("Dados da resposta:", axiosError.response.data);
                        console.error("Status do erro:", axiosError.response.status);
                    }
                    throw error;
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function getModalityCoverages(name) {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.get("modalities/".concat(name, "/coverages"))
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
function getActiveModalitiesByLanguage(language) {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.get("/modalities/translations/".concat(language, "/active"))
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
// src/endpoints/coverage.ts
function getTranslatedCoverages() {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.get("/coverages")
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
function getCoverageById(id) {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.get("/coverages/".concat(id))
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
function getCoveragesByModalityName(name) {
    return _async_to_generator(function() {
        var response, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    console.log("Buscando coberturas para modalidade NOME:", name);
                    return [
                        4,
                        jwt_auth_default.get("/modalities/".concat(name, "/coverages"))
                    ];
                case 1:
                    response = _state.sent();
                    console.log("Coberturas encontradas:", response.data.data);
                    return [
                        2,
                        response.data.data
                    ];
                case 2:
                    error = _state.sent();
                    console.error("Erro ao buscar coberturas para modalidade NOME ".concat(name, ":"), error);
                    throw error;
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function getCoveragesByModalityIdAndLanguage(modalityId, language) {
    return _async_to_generator(function() {
        var response, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    console.log("Buscando coberturas para modalidade ID: ".concat(modalityId, ", idioma: ").concat(language));
                    return [
                        4,
                        jwt_auth_default.get("/modalities/".concat(modalityId, "/coverages/").concat(language))
                    ];
                case 1:
                    response = _state.sent();
                    console.log("Coberturas encontradas:", response.data.data);
                    return [
                        2,
                        response.data.data
                    ];
                case 2:
                    error = _state.sent();
                    console.error("Erro ao buscar coberturas para modalidade ID ".concat(modalityId, ", idioma ").concat(language, ":"), error);
                    throw error;
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function disableCoverage(id) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.patch("/coverages/".concat(id, "/disable"))
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
function activeCoverage(id) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.patch("/coverages/".concat(id, "/active"))
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
function createCoverage(request) {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        jwt_auth_default.post("/coverages", request)
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
function editCoverage(request) {
    return _async_to_generator(function() {
        var id, data, response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id = request.id, data = _object_without_properties(request, [
                        "id"
                    ]);
                    return [
                        4,
                        jwt_auth_default.patch("/coverages/".concat(id), data)
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        2,
                        response.data.data
                    ];
            }
        });
    })();
}
// src/query/browser-client.ts
import { QueryClient } from "@tanstack/react-query";
var queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1e3,
            // 5 minutos
            retry: 1
        }
    }
});
// src/query/client.ts
import { QueryClient as QueryClient2 } from "@tanstack/react-query";
var queryClient2 = new QueryClient2({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});
export { activeCoverage, queryClient as browserQueryClient, createCoverage, disableCoverage, editCoverage, getActiveModalies, getActiveModalitiesByLanguage, getCoverageById, getCoveragesByModalityIdAndLanguage, getCoveragesByModalityName, getModalityCoverages, getTranslatedCoverages, jwtAxios, queryClient2 as queryClient, setAuthToken, setSystem };
