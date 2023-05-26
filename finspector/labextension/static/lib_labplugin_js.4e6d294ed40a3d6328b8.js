"use strict";
(self["webpackChunkfinspector_js"] = self["webpackChunkfinspector_js"] || []).push([["lib_labplugin_js"],{

/***/ "./lib/labplugin.js":
/*!**************************!*\
  !*** ./lib/labplugin.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   helloWidgetPlugin: () => (/* binding */ helloWidgetPlugin)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./lib/index.js");
/* harmony import */ var _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyter-widgets/base */ "webpack/sharing/consume/default/@jupyter-widgets/base");
/* harmony import */ var _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_1__);



const helloWidgetPlugin = {
  id: 'finspector_js:plugin',
  requires: [_jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_1__.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'finspector_js',
          version: _index__WEBPACK_IMPORTED_MODULE_0__.version,
          exports: { VisualizationModel: _index__WEBPACK_IMPORTED_MODULE_0__.VisualizationModel, VisualizationView: _index__WEBPACK_IMPORTED_MODULE_0__.VisualizationView }
      });
  },
  autoStart: true
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (helloWidgetPlugin);


/***/ })

}]);
//# sourceMappingURL=lib_labplugin_js.4e6d294ed40a3d6328b8.js.map