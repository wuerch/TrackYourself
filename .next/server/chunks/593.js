"use strict";
exports.id = 593;
exports.ids = [593];
exports.modules = {

/***/ 2648:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return _interopRequireDefault;
    }
}));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 9351:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const UserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserContext);


/***/ }),

/***/ 593:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const _interopRequireDefault = (__webpack_require__(2648)/* ["default"] */ .Z);
const _react = __webpack_require__(6689);
const _userContext = /*#__PURE__*/ _interopRequireDefault(__webpack_require__(9351));
const _router = __webpack_require__(1853);
async function handleContext() {
    const { userContext , setUserContext  } = (0, _react.useContext)(_userContext.default);
    const router = (0, _router.useRouter)();
    (0, _react.useEffect)(()=>{
        if (!userContext) {
            fetch("/api/user", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res)=>res.json()).then((res)=>{
                if (res.status == 200) {
                    setUserContext(res.user);
                } else {
                    router.push("/");
                }
            });
        }
    }, []);
}
module.exports = {
    handleContext
};


/***/ })

};
;