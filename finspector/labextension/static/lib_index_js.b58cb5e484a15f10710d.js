"use strict";
(self["webpackChunkfinspector_js"] = self["webpackChunkfinspector_js"] || []).push([["lib_index_js"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./lib/custom.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./lib/custom.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Safari */\n@-webkit-keyframes spin {\n  0% { -webkit-transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(360deg); }\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}", "",{"version":3,"sources":["webpack://./lib/custom.css"],"names":[],"mappings":"AAAA,WAAW;AACX;EACE,KAAK,+BAA+B,EAAE;EACtC,OAAO,iCAAiC,EAAE;AAC5C;;AAEA;EACE,KAAK,uBAAuB,EAAE;EAC9B,OAAO,yBAAyB,EAAE;AACpC","sourcesContent":["/* Safari */\n@-webkit-keyframes spin {\n  0% { -webkit-transform: rotate(0deg); }\n  100% { -webkit-transform: rotate(360deg); }\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./lib/dashboard.js":
/*!**************************!*\
  !*** ./lib/dashboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashBoard: () => (/* binding */ DashBoard)
/* harmony export */ });


function DashBoard(flatData, vis_cols){
  var _self = this;
  
  var category_dict = {'name': vis_cols['cat_col'], 'value': Array.from(new Set(flatData.map((item) => item[vis_cols['cat_col']]))).sort(d3.ascending)};
  var colorCategoryScale = d3.scaleOrdinal().domain(category_dict['value']).range(d3.schemeTableau10);
  var model_list = vis_cols['model_cols'];

  set_up_div(vis_cols['body_el']);

  var rc_node = d3.select(vis_cols['body_el']).select('#raincloud').node();
  var tb_node = d3.select(vis_cols['body_el']).select('#table').node();
  var se_node = d3.select(vis_cols['body_el']).select('#categoryList').node();
  var eb_node = d3.select(vis_cols['body_el']).select('#embedding').node();

  var rc = new RainCloud(rc_node, flatData, 600, 400, colorCategoryScale, vis_cols, rc_to_tb_filter);
  var tb = new Table(tb_node, flatData, 600, 400, colorCategoryScale, vis_cols, tb_to_rc_highlight);
  var se = new Select(se_node, category_dict, colorCategoryScale, vis_cols, se_to_rc_and_tb_highlight, se_to_rc_augment, se_to_rc_show);
  var eb = new Project(eb_node, vis_cols['embedding'], 1200, 400, vis_cols, colorCategoryScale, eb_to_rc_tb_highlight, eb_to_all_filter);

  function se_to_rc_show(object){
    rc.show_item(object);
  }

  function tb_to_rc_highlight(hovered_index){
    rc.highlight_item_by_index(hovered_index);
    eb.highlight_item_by_index(hovered_index)
  }

  function eb_to_rc_tb_highlight(hovered_index){
    rc.highlight_item_by_index(hovered_index);
    tb.highlight_item_by_index(hovered_index);
  }

  function se_to_rc_and_tb_highlight(filtered_list){
    rc.highlight_category(filtered_list);
    tb.highlight_category(filtered_list);
    eb.highlight_category(filtered_list, flatData);
    // update colorLegend
    updateColorLegend(filtered_list, colorCategoryScale);
  }

  function se_to_rc_augment(cat_spl_dict){
    /* use the array of qi to draw boxes + labels & kernels */
    /* toggle displays for kernels + boxes for all */
    rc.augment_cat_and_spl(cat_spl_dict);
  }

  function rc_to_tb_filter(condition){
    var filtered_data = flatData.slice();

    Object.keys(condition).forEach(function(con){
      filtered_data = filtered_data.filter(d=>( d[con] >= condition[con][0] && d[con] <= condition[con][1]));
    })

    var indices_list = filtered_data.map(d=>flatData.indexOf(d));

    tb.filterBy(filtered_data);
    rc.filterBy(filtered_data);
    eb.adjust_opacity_by_list(indices_list);
  }

  function eb_to_all_filter(filtered_data){
    var fd = flatData.filter((d,i)=>filtered_data.indexOf(i) >= 0);
    rc.filterBy(fd);
    var fd_ = (fd.length > 0)? fd: flatData.slice();
    tb.filterBy(fd_);
    eb.highlight_items_by_list_of_indices(filtered_data);
  }

  function updateColorLegend(filtered_list, colorCategoryScale){

    d3.select("div#colorLegend").selectAll("*").remove();

    var colorSpace = d3.select("div#colorLegend")
      .selectAll("div.colorLegend")
      .data(filtered_list.sort(d3.ascending))
    .join("div")
      .attr("class", "colorLegend")
      .style("width", "200px")
      .style("height", "30px")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "flex-start")
      .style("align-content", "center");

    colorSpace.append("div")
      .style("width", "30px")
      .style("height", "30px")
      .style("background", d=>colorCategoryScale(d));

    colorSpace.append("div")
      .style("position", "left")
      .style("width", "150px")
      .style("height", "30px")
      .style("line-height", "30px")
      .style("vertical-align", "middle")
      .style("text-anchor", "left")
      .style("padding-left", "10px")
      .text(d=>d);

  }

  function set_up_div(element){

    d3.select(element)
          .append('div')
          .attr("id", "categoryList");

    var container = d3.select(element)
      .append("div")
        .attr("class", "vcontainer")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "flex-start")
        .style("align-content", "center");

    container.append("div")
    .attr("id", "colorLegend")
      .style("position", "absolute")
      .style("left", "50px");

    container.append("div")
    .attr("id", "raincloud");

    container.append("div")
    .attr("id", "table");

    var emb_container = d3.select(element)
      .append("div")
        .attr("id", "embedding_container")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "flex-start")
        .style("align-content", "center");

    var emb = emb_container.append("div")
      .attr("id", "embedding");

  }

}

/***/ }),

/***/ "./lib/finspector.js":
/*!***************************!*\
  !*** ./lib/finspector.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationModel: () => (/* binding */ VisualizationModel),
/* harmony export */   VisualizationView: () => (/* binding */ VisualizationView)
/* harmony export */ });
/* harmony import */ var _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyter-widgets/base */ "webpack/sharing/consume/default/@jupyter-widgets/base");
/* harmony import */ var _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "../node_modules/d3/src/index.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "webpack/sharing/consume/default/jquery/jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap */ "webpack/sharing/consume/default/bootstrap/bootstrap");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_3__);



window.jQuery = (jquery__WEBPACK_IMPORTED_MODULE_2___default());
window.$ = (jquery__WEBPACK_IMPORTED_MODULE_2___default());

// import 'jquery_multiselect';


var ls = __webpack_require__(/*! ./lasso.js */ "./lib/lasso.js")
var db = __webpack_require__(/*! ./dashboard.js */ "./lib/dashboard.js")
var rc = __webpack_require__(/*! ./raincloud.js */ "./lib/raincloud.js")
var tb = __webpack_require__(/*! ./table.js */ "./lib/table.js")
var sl = __webpack_require__(/*! ./select.js */ "./lib/select.js")
var eb = __webpack_require__(/*! ./project.js */ "./lib/project.js")
window.d3 = d3__WEBPACK_IMPORTED_MODULE_1__;
window.lasso = ls.lasso;
window.DashBoard = db.DashBoard;
window.RainCloud = rc.RainCloud;
window.Table = tb.Table;
window.Select = sl.Select;
window.Project = eb.Project;

// See example.py for the kernel counterpart to this file.

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be serialized.

class VisualizationModel extends _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_0__.DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'VisualizationModel',
        _view_name : 'VisualizationView',
        _model_module : 'finspector_js',
        _view_module : 'finspector_js',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : '',
        textValue : '',
        data: [],
        embedding: [],
        props: {},
        inputValue: {},
        sent_col: '',
        cat_col: '',
        spl_col: '',
        model_cols: [],
        other_cols: []
      };
    }
  }

class VisualizationView extends _jupyter_widgets_base__WEBPACK_IMPORTED_MODULE_0__.DOMWidgetView {
    render() {
        this.value_changed();

        this._valueInput = document.createElement('input');
        this._valueInput.type = 'text';
        this._valueInput.id = `_hiddenVALUE${this.model.model_id}`;
        this._valueInput.style.display = 'none';
        // this._valueInput.value = this.model.get('value');
        this._valueInput.value = this.model.get('textValue');
        this._valueInput.oninput = this.value_input_changed.bind(this);
        this.el.appendChild(this._valueInput);

        // Observe and act on future changes to the value attribute
        // this.model.on('change:data', this.value_changed, this);
        // this.model.on('change:props', this.props_changed, this);
        this.model.on('change:inputValue', this.iv_changed, this)
        this.inputValue = {'sent': ''}

        // this.iv_change();
    }

    iv_change = async function(){
        // while (Object.keys(this.model.get('inputValue')).length === 0 || this.model.get('inputValue')['sent'] != this.model.get('value'))
        while (Object.keys(this.model.get('inputValue')).length === 0 || this.model.get('inputValue')['sent'] != this.model.get('textValue'))
            await __delay__(1000);

        function __delay__(timer) {
            return new Promise(resolve => {
                timer = timer || 2000;
                setTimeout(function () {
                    resolve();
                }, timer);
            });
        };
    }

    value_changed() {
        // this.el.textContent = this.model.get('value');
        this.el.textContent = this.model.get('textValue');
        var data = this.model.get("data");
        // d3.select(this.el).selectAll("*").remove();
        d3__WEBPACK_IMPORTED_MODULE_1__.select(this.el).selectAll("*:not(#_hiddenVALUE" + this.model.model_id + ")").remove();

        var vis_cols = {
            'body_el': this.el, // element to append vis
            'sent_col': this.model.get("sent_col"), // column header of sentence
            'cat_col': this.model.get("cat_col"), // categorical header for colors
            'spl_col': this.model.get("spl_col"),
            'model_cols': this.model.get("model_cols"), // column headers of log probs
            'other_cols': this.model.get("other_cols"), // other cols to show in table 
            'model_id': this.model.model_id,
            'embedding': this.model.get('embedding'),
            'model': this.model
        }

        var db = new DashBoard(data, vis_cols);

    }

    value_input_changed() {
        // textValue
        // this.model.set('value', this._valueInput.value);
        this.model.set('textValue', this._valueInput.value);
        this.model.save_changes();
        /* run something  and toss it to JS */
    }
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VisualizationModel: () => (/* reexport safe */ _finspector__WEBPACK_IMPORTED_MODULE_0__.VisualizationModel),
/* harmony export */   VisualizationView: () => (/* reexport safe */ _finspector__WEBPACK_IMPORTED_MODULE_0__.VisualizationView),
/* harmony export */   version: () => (/* reexport safe */ _package_json__WEBPACK_IMPORTED_MODULE_1__.version)
/* harmony export */ });
/* harmony import */ var _finspector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./finspector */ "./lib/finspector.js");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../package.json */ "./package.json");
// Export widget models and views, and the npm package version number.





/***/ }),

/***/ "./lib/lasso.js":
/*!**********************!*\
  !*** ./lib/lasso.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lasso: () => (/* binding */ lasso)
/* harmony export */ });

// https://github.com/skokenes/d3-lasso
function polygonToPath(polygon) {
  return ("M" + (polygon.map(function (d) { return d.join(','); }).join('L')));
}

function distance(pt1, pt2) {
  return Math.sqrt(Math.pow( (pt2[0] - pt1[0]), 2 ) + Math.pow( (pt2[1] - pt1[1]), 2 ));
}

// export default function lasso() {
function lasso() {
  var dispatch = d3.dispatch('start', 'end');

  // distance last point has to be to first point before it auto closes when mouse is released
  var closeDistance = 75;

  function lasso(root) {
    // append a <g> with a rect
    var bbox = root.node().getBoundingClientRect();
    var g = root.append('g').attr('class', 'lasso-group');

    var area = g
      .append('rect')
        .attr('width', root.attr("width"))
        .attr('height', root.attr("height"))
        .attr('fill', 'tomato')
        .attr('opacity', 0);

    var drag = d3
      .drag()
      .on('start', handleDragStart)
      .on('drag', handleDrag)
      .on('end', handleDragEnd);

    area.call(drag);

    var lassoPolygon;
    var lassoPath;
    var closePath;

    function handleDragStart(event) {
      var point = [event.x, event.y];
      lassoPolygon = [point];

      if (lassoPath) {
        lassoPath.remove();
      }

      lassoPath = g
        .append('path')
        .attr('fill', '#8cff32') // #0bb
        .attr('fill-opacity', 0.25)
        .attr('stroke', '#8cff32')
        .attr('stroke-dasharray', '3, 3');

      closePath = g
        .append('line')
        .attr('x2', lassoPolygon[0][0])
        .attr('y2', lassoPolygon[0][1])
        .attr('stroke', '#8cff32')
        .attr('stroke-dasharray', '3, 3')
        .attr('opacity', 0);

      dispatch.call('start', lasso, lassoPolygon);
    }

    function handleDrag(event) {
      var point = [event.x, event.y];
      lassoPolygon.push(point);
      lassoPath.attr('d', polygonToPath(lassoPolygon));

      // indicate if we are within closing distance
      if (
        distance(lassoPolygon[0], lassoPolygon[lassoPolygon.length - 1]) <
        closeDistance
      ) {
        closePath
          .attr('x1', point[0])
          .attr('y1', point[1])
          .attr('opacity', 1);
      } else {
        closePath.attr('opacity', 0);
      }
    }

    function handleDragEnd(event) {
      // remove the close path
      closePath.remove();
      closePath = null;

      // succesfully closed
      if (
        distance(lassoPolygon[0], lassoPolygon[lassoPolygon.length - 1]) <
        closeDistance
      ) {
        lassoPath.attr('d', polygonToPath(lassoPolygon) + 'Z');
        dispatch.call('end', lasso, lassoPolygon);

        // otherwise cancel
      } else {
        lassoPath.remove();
        lassoPath = null;
        lassoPolygon = null;
      }
    }

    lasso.reset = function () {
      if (lassoPath) {
        lassoPath.remove();
        lassoPath = null;
      }

      lassoPolygon = null;
      if (closePath) {
        closePath.remove();
        closePath = null;
      }
    };
  }

  lasso.on = function (type, callback) {
    dispatch.on(type, callback);
    return lasso;
  };

  return lasso;
}

/***/ }),

/***/ "./lib/project.js":
/*!************************!*\
  !*** ./lib/project.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Project: () => (/* binding */ Project)
/* harmony export */ });


function Project(this_element, data, screen_width, screen_height, vis_cols, colorCategoryScale, callback1, callback2){
  var _self = this;
  
  /* clean up canvas */
  d3.select(this_element)
    .selectAll("*").remove();
  
  /* initial setup */
  _self.data = data;
  _self.vis_cols = vis_cols;
  _self.colorCategoryScale = colorCategoryScale;
  _self.callback1 = callback1;
  _self.callback2 = callback2;
  _self.embbool = _self.vis_cols['model'].get('embbool');
  _self.lassoFiltered = false;
  _self.filtersApplied = false;

  if(!_self.embbool){
    return;
  }

  /* canvas size */
  _self.screen_width = screen_width;
  _self.screen_height = screen_height;
  _self.margin = {"left": 100, "top": 50, "right": 50, "bottom": 50};
  _self.width = _self.screen_width - _self.margin.left - _self.margin.right;
  _self.height = _self.screen_height - _self.margin.top - _self.margin.bottom;
  _self.radius = 5;
  _self.opacity = .15;
  _self.x = d3.scaleLinear().domain(d3.extent(_self.data, d=>d[0])).range([0, _self.width]);
  _self.y = d3.scaleLinear().domain(d3.extent(_self.data, d=>d[1])).range([_self.height, 0]);
  _self.jsonified_data = _self.data.map((d,i)=>{return {'x': _self.x(d[0]), 'y': _self.y(d[1]), 'index': i}})

  /* title */
  d3.select(this_element)
    .append("div")
      .style("text-align", "center")
      .style("font-weight", "bold")
      .text("Sentences Embedding");

  _self.svg = d3.select(this_element)
        .style("width", _self.screen_width + "px")
        .style("height", _self.screen_height + "px")
      .append('svg')
        .attr("width", _self.screen_width)
        .attr("height", _self.screen_height)
        .style("position", "absolute")
        .style("z-index", 999)
        .on("mousemove", event=>{
          var pointer = d3.pointer(event);
          var index = _self.findClosest(pointer);
          _self.highlight_item_by_index(index);
          _self.callback1(index);
        });

  _self.dot = _self.svg
        .selectAll(".dot")
        .data(_self.data)
      .join("circle")
        .attr("cx", d=>_self.x(d[0]) + _self.margin.left)
        .attr("cy", d=>_self.y(d[1]) + _self.margin.top)
        .attr("r", _self.radius)
        .style("fill", "black")
        .style("opacity", _self.opacity)

  var lassoInstance = lasso()
    .on('end', function(lassoPolygon){

      var filtered = _self.jsonified_data.filter(function(e, i){
        return d3.polygonContains(lassoPolygon, [e['x']+_self.margin.left, e['y']+_self.margin.top]);
      }).map(d=>d['index']);

      _self.callback2(filtered);
      _self.lassoFiltered = (filtered.length > 0)? true: false;

    });

  _self.svg
    .call(lassoInstance);

}

Project.prototype.highlight_items_by_list_of_indices = function(indices_list) {
  var _self = this;
  if(!_self.embbool){
    return;
  }

  _self.dot
    .style("stroke-width", (d,i)=> (indices_list.indexOf(i)>=0)? 2: 0)
    .style("stroke", (d,i)=> (indices_list.indexOf(i)>=0)? "red": "none")
    .style("opacity", (d,i)=> (indices_list.indexOf(i)>=0)? 1: _self.opacity);
};

Project.prototype.adjust_opacity_by_list = function(indices_list){
  var _self = this;
  if(!_self.embbool){
    return;
  }
  if(indices_list.length == _self.data.length){
    indices_list = [];
  }
  
  if(indices_list.length > 0){
    _self.filtersApplied = true;
  }else{
    _self.filtersApplied = false;
  }

  _self.dot
    .style("stroke-width", (d,i)=> (indices_list.indexOf(i)>=0)? 2: 0)
    .style("stroke", (d,i)=> (indices_list.indexOf(i)>=0)? "red": "none")
    .style("opacity", (d,i)=> (indices_list.indexOf(i)>=0)? 1: _self.opacity);
}

Project.prototype.highlight_item_by_index = function(index) {
  var _self = this;
  if(!_self.embbool || _self.lassoFiltered || _self.filtersApplied){
    return;
  }

  _self.dot.each(function(d,i){
    var elem = d3.select(this);

    d3.select(this)
      .style("stroke-width", (index==i)? 2: 0)
      .style("stroke", (index==i)? "red": "none");

    if(!_self.filtersApplied){
      d3.select(this)
        .style("opacity", (index==i)? 1: _self.opacity);
    }
  })

};

Project.prototype.highlight_category = function(filtered_list, flatData) {
  var _self = this;
  var filtered_list = filtered_list.slice();
  if(!_self.embbool){
    return;
  }
  
  _self.dot
    .style("opacity", (_,i)=> filtered_list.indexOf(flatData[i][_self.vis_cols['cat_col']]) >=0 ? .75 : _self.opacity)
    .style("fill", (_,i)=> filtered_list.indexOf(flatData[i][_self.vis_cols['cat_col']]) >=0 ? _self.colorCategoryScale(flatData[i][_self.vis_cols['cat_col']]): "black");
};

Project.prototype.findClosest = function(coords) {
  var _self = this;
  var index = -1;
  var threshold = _self.radius * 2;
  
  _self.data.forEach(function(d,i){

    // data contains the x, y positions in canvas space
    var dist = Math.sqrt(Math.pow(coords[0] -_self.margin.left - _self.x(d[0]), 2) + Math.pow(coords[1] -_self.margin.top - _self.y(d[1]), 2));

    if(dist <= threshold){
      index = i;
      threshold = dist;
    }

  });

  return index;
};

/***/ }),

/***/ "./lib/raincloud.js":
/*!**************************!*\
  !*** ./lib/raincloud.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RainCloud: () => (/* binding */ RainCloud)
/* harmony export */ });


function RainCloud(this_element, data, screen_width, screen_height,colorCategoryScale, vis_cols, callback){
	var _self = this;
	/* clean up canvas */
	d3.select(this_element)
	 	.selectAll("svg").remove();
	
	/* initial setup */
	_self.data = data;
	_self.model_list = vis_cols['model_cols'];
	_self.colorCategoryScale = colorCategoryScale;
	_self.vis_cols = vis_cols;
	_self.callback = callback;
	_self.threshold = 20;
	_self.rectHeight = 20;
	_self.brushed_ranges = {};
	_self.selected_category = [];
	_self.filtersApplied = false;

	/* canvas size */
	_self.screen_width = screen_width;
	_self.screen_height = screen_height;
	_self.margin = {"left": 100, "top": 50, "right": 50, "bottom": 50};
	_self.width = _self.screen_width - _self.margin.left - _self.margin.right;
	_self.height = _self.screen_height - _self.margin.top - _self.margin.bottom;

	/* title */
	d3.select(this_element)
		.append("div")
			.style("text-align", "center")
			.style("font-weight", "bold")
			.text("Distributions of Mean Log Probabilities");

	/* canvas */
	_self.svg = d3.select(this_element)
		.append("svg")
			.attr("width", _self.screen_width)
			.attr("height", _self.screen_height)
		.append("g")
			.attr("transform", "translate(" + _self.margin.left + "," + _self.margin.top + ")");
	
	_self.draw_raincloud();
}

RainCloud.prototype.brushended = function(event, model) {
	var _self = this;
	if (!event.sourceEvent) return; // Only transition after input.
	if (!event.selection){
		delete _self.brushed_ranges[model]
		_self.callback(_self.brushed_ranges);
		return; // Ignore empty selections.
	}

	_self.brushed_ranges[model] = event.selection.map(_self.scale_dict[model].invert);
	_self.callback(_self.brushed_ranges);
};

RainCloud.prototype.draw_raincloud = function() {
	var _self = this;
	_self.svg.selectAll("*").remove();

	/* Model Scale & Axis */
	_self.allScoreMin = Math.floor(d3.min(_self.data, d=> d3.min(_self.model_list.map(m=> d[m]))));
	_self.score_min_dict = {};
	_self.scale_dict = {};
	_self.bin_dict = {};
	_self.freq_max_dict = {};
	_self.q_dict = {};
	_self.brush_dict = {};

	_self.model_list.forEach(function(model){
		
		_self.score_min_dict[model] = d3.min(_self.data, d=>d[model]);
		_self.scale_dict[model] = d3.scaleLinear().domain([_self.allScoreMin, 0]).range([0, _self.width]);
		_self.bin_dict[model] = d3
			.bin()
			.domain([_self.allScoreMin, 0])
			.thresholds(_self.threshold)
			.value(d=>d[model])
			(_self.data);
		_self.freq_max_dict[model] = d3.max(_self.bin_dict[model], d=>d.length);

		/* quantiles */
		_self.q_dict[model] = _self.computeQuantiles(_self.data.map(d=>d[model]));
		_self.q_dict[model][_self.vis_cols['spl_col']] = {}
		_self.q_dict[model][_self.vis_cols['spl_col']][0] = _self.computeQuantiles(_self.data.filter(d=>d["stereo_type"]==0).map(d=>d[model]));
		_self.q_dict[model][_self.vis_cols['spl_col']][1] = _self.computeQuantiles(_self.data.filter(d=>d["stereo_type"]==1).map(d=>d[model]));

		/* quantiles by cat_col */
		_self.colorCategoryScale.domain().forEach(cat=>{

			var filteredData = _self.data.filter(d=>d[_self.vis_cols['cat_col']]==cat).slice();
			_self.q_dict[model][cat] = _self.computeQuantiles(filteredData.map(d=>d[model]));
			_self.q_dict[model][cat][_self.vis_cols['spl_col']] = {}
			_self.q_dict[model][cat][_self.vis_cols['spl_col']][0] = _self.computeQuantiles(filteredData.filter(d=>d["stereo_type"]==0).map(d=>d[model]));
			_self.q_dict[model][cat][_self.vis_cols['spl_col']][1] = _self.computeQuantiles(filteredData.filter(d=>d["stereo_type"]==1).map(d=>d[model]));

		});

		/* brushes */
		_self.brush_dict[model] = d3.brushX()
	        .extent([[0, -10], [_self.width, 10]])
	        .on("end", event=>_self.brushended(event, model));
	});

	_self.allFreqMax = d3.max(Object.values(_self.freq_max_dict));
	_self.scalePoint = d3.scalePoint().range([0, _self.height]).domain(_self.model_list).padding(0.5);
	_self.freqScale = d3.scaleLinear().domain([0, _self.allFreqMax]).range([0, -_self.scalePoint.step()*.5]);

	_self.cloud_area_dict = {};
	_self.rectHeight = _self.scalePoint.step()*.1;

	_self.iqrArea = d3.area()
		.x0(d => _self.scale_dict[d[0]](d[1]))
		.x1(d => _self.scale_dict[d[0]](d[3]))
		.y(d => _self.scalePoint(d[0]));

	_self.iqrLine = d3.line()
		.x(d => _self.scale_dict[d[0]](d[2]))
		.y(d => _self.scalePoint(d[0]));

	_self.areaSpace = _self.svg
		.selectAll("g.areaSpace")
		.data(_self.colorCategoryScale.domain())
	.join("g")
		.attr("class", "areaSpace")
		.each(function(cat, cat_i){
			var bandArray = _self.model_list.map(m=>[m, _self.q_dict[m][cat]['q1'], _self.q_dict[m][cat]['q2'], _self.q_dict[m][cat]['q3']]);

			d3.select(this)
				.append("path")
					.attr("class", "area:" + cat)
					.style("fill", _self.colorCategoryScale(cat))
					.style("stroke", "none")
					.style("opacity", .2)
					.style("display", "none")
					.attr("d", _self.iqrArea(bandArray));

			d3.select(this)
				.append("path")
					.attr("class", "line:" + cat)
					.style("stroke", d3.rgb(_self.colorCategoryScale(cat)).darker())
					.style("fill", "none")
					.style("stroke-dasharray", "2,2")
					.style("opacity", .9)
					.style("display", "none")
					.attr("d", _self.iqrLine(bandArray));

		});

	_self.axisSpace = _self.svg
		.selectAll("g.axisSpace")
		.data(_self.model_list)
	.join("g")
		.attr("class", "axisSpace")
		.attr("transform", function(model){
			var yval = _self.scalePoint(model);
			return "translate(0, " + yval + ")";
		})
		.each(function(model){

			d3.select(this).append("g")
				.call(d3.axisBottom(_self.scale_dict[model]));

			d3.select(this).append("text")
				.attr("x", -_self.margin.left*.1)
				.style("dominant-baseline", "middle")
				.style("text-anchor", "end")
				.style("font-weight", "bold")
				.style("text-transform", "uppercase")
				.text(model);

			_self.cloud_area_dict[model] = d3.area()
				.curve(d3.curveNatural)
				.x(d => _self.scale_dict[model]((d.x0 + d.x1)/2))
				.y0(_self.freqScale(0))
				.y1(d => _self.freqScale(d.length));

			d3.select(this)
				.append("path")
				.attr("class", "histCloud")
				.attr("d", d=>_self.cloud_area_dict[model](_self.bin_dict[model]))
				.style("opacity", .25);

			/* box */

			_self.add_box_plot(d3.select(this), _self.scale_dict[model], 0, _self.q_dict[model]);

			d3.select(this)
				.append("g")
				.attr("class", "brush")
				.call(_self.brush_dict[model]);

		});

	_self.line = d3.line()
	    .x(d => _self.scale_dict[d[0]](d[1]))
	    .y(d => _self.scalePoint(d[0]));

	_self.pcpSpace = _self.svg
		.append("g")
			.attr("class", "pcpSpace");
};


RainCloud.prototype.computeQuantiles = function(data){
	var _self = this;

	var q_dict = {};
	q_dict['q1'] = d3.quantile(data, .25);
	q_dict['q2'] = d3.quantile(data, .5);
	q_dict['q3'] = d3.quantile(data, .75);
	q_dict['iqr'] = q_dict['q3'] - q_dict['q1'];
	q_dict['r0'] = Math.max(d3.min(data), q_dict['q1'] - q_dict['iqr'] * 1.5);
	q_dict['r1'] = Math.min(d3.max(data), q_dict['q3'] + q_dict['iqr'] * 1.5);

	return q_dict;
}

RainCloud.prototype.filterBy = function(filtered_data) {
	var _self = this;

	_self.svg.selectAll("g.pcpSpace")
			.remove();

	/* draw parallel coordinates */
	if(filtered_data.length == _self.data.length || filtered_data.length == 0){
		_self.filtersApplied = false;
	}else {
		_self.filtersApplied = true;
		_self.draw_pcp(filtered_data);
	}
};

RainCloud.prototype.draw_pcp = function(filtered_data) {
	var _self = this;

	_self.svg.selectAll("g.pcpSpace").remove();

	_self.pcpSpace = _self.svg
		.append("g")
			.attr("class", "pcpSpace");

	_self.pcpPath = _self.pcpSpace.selectAll("path.pcp")
		.data(filtered_data)
	.join("path")
		.attr("class", "pcp")
		.style("fill", "none")
		.style("stroke-width", 1)
		.style("stroke", d=>_self.selected_category.indexOf(d[_self.vis_cols['cat_col']]) >=0 ? _self.colorCategoryScale(d[_self.vis_cols['cat_col']]): "grey")
		.style("opacity", .25)
		.attr("d", datum=>{
			return _self.line(_self.model_list.map(m=>[m, datum[m]]));
		});
};

RainCloud.prototype.highlight_item_by_index = function(hovered_index){
	var _self = this;

	if(!_self.filtersApplied && Object.values(_self.brushed_ranges).length == 0){
		_self.draw_pcp(_self.data.filter(d=>d["index"]==hovered_index));
	}
	
	_self.pcpPath = _self.pcpSpace.selectAll("path.pcp")
			.style("opacity", d=>(d["index"]==hovered_index) ? .75: .25)
			.style("stroke-width", d=>(d["index"]==hovered_index) ? 3: 1);
}

RainCloud.prototype.highlight_category = function(filtered_list) {
	var _self = this;
	_self.selected_category = filtered_list.slice();
	
	if(_self.svg.selectAll('path.pcp')._groups[0].length > 0){
		
		_self.pcpPath = _self.pcpSpace.selectAll("path.pcp")
			.style("stroke", d=>_self.selected_category.indexOf(d[_self.vis_cols['cat_col']]) >=0 ? _self.colorCategoryScale(d[_self.vis_cols['cat_col']]): "grey");

	}

	_self.areaSpace.selectAll("path[class*='line:']")
		.style("display", d=>(filtered_list.indexOf(d) >= 0) ? "inline":"none");

	_self.areaSpace.selectAll("path[class*='area:']")
		.style("display", d=>(filtered_list.indexOf(d) >= 0) ? "inline":"none");

};

RainCloud.prototype.show_item = function(item){
	var _self = this;

	_self.pcpSpace.selectAll("path.pcp_temp").remove();

	_self.pcpSpace
		.append("path")
			.attr("class", "pcp_temp")		
			.style("fill", "none")
			.style("stroke-width", 3)
			.style("stroke", "red")
			.style("opacity", .8)
			.attr("d", _self.line(_self.model_list.map(m=>[m, item[m]["score"]])));
}

RainCloud.prototype.augment_cat_and_spl = function(cat_spl_dict){
	var _self = this;
	_self.axisSpace.selectAll("g.csSpace").remove();
	/* */
	var splBool = (cat_spl_dict['spl'].length == 0)? true : false;
	var catLen = cat_spl_dict['cat'].length;
	var opacity = .75;

	if(!splBool){
		_self.axisSpace.selectAll("path.histCloud").style("display", "none");
		_self.areaSpace.style("display", "none");			
		_self.axisSpace.each(function(model, model_i){
			var csSpace = d3.select(this)
				.append("g")
					.attr("class", "csSpace");

			csSpace.selectAll("text.splLabel")
				.data(["base", "stereotype"])
			.join("text")
				.attr("x", 0)
				.attr("y", (d,i)=> (i==0)? -20: 20)
				.style("opacity", .15)
				.style("font-size", "200%")
				.style("text-anchor", 'start')
				.style("dominant-baseline", (d,i)=> (i==0)? "baseline": "hanging")
				.text(d=>d)

			if(model_i < _self.model_list.length-1){
				csSpace.append("line")
					.attr("class", "divider")
					.attr("x1", 0)
					.attr("x2", _self.width)
					.attr("y1", _self.scalePoint.step()/2)
					.attr("y2", _self.scalePoint.step()/2)
					.style("stroke", "grey")
					.style("stroke-width", 1.5)
					.style("stroke-dasharray", "1,1");
			}
			switch(catLen){
				case 0:{
					
					_self.add_box_plot(csSpace, _self.scale_dict[model], -_self.scalePoint.step()/4, _self.q_dict[model][_self.vis_cols['spl_col']][0], "black", opacity, _self.rectHeight/2);

					_self.add_box_plot(csSpace, _self.scale_dict[model], _self.scalePoint.step()/4, _self.q_dict[model][_self.vis_cols['spl_col']][1], "black", opacity, _self.rectHeight/2);

				}
				case 1:{

					
					cat_spl_dict['cat'].forEach(function(cat, cat_i){

						_self.add_box_plot(csSpace, _self.scale_dict[model], -_self.scalePoint.step()/4, _self.q_dict[model][cat][_self.vis_cols['spl_col']][0], _self.colorCategoryScale(cat), opacity, _self.rectHeight/2);

						_self.add_box_plot(csSpace, _self.scale_dict[model], _self.scalePoint.step()/4, _self.q_dict[model][cat][_self.vis_cols['spl_col']][1], _self.colorCategoryScale(cat), opacity, _self.rectHeight/2);

					})

				}
				default:{

					var scalePointZero = d3.scalePoint()
						.domain(d3.range(catLen)).range([.6*_self.scalePoint.step(), .9*_self.scalePoint.step()]);
					var scalePointOne = d3.scalePoint()
						.domain(d3.range(catLen)).range([.1*_self.scalePoint.step(), .4*_self.scalePoint.step()]);
					
					cat_spl_dict['cat'].forEach(function(cat, cat_i){

						_self.add_box_plot(csSpace, _self.scale_dict[model], -_self.scalePoint.step() + scalePointZero(cat_i), _self.q_dict[model][cat][_self.vis_cols['spl_col']][0], _self.colorCategoryScale(cat), opacity, _self.rectHeight/2);

						_self.add_box_plot(csSpace, _self.scale_dict[model], scalePointOne(cat_i), _self.q_dict[model][cat][_self.vis_cols['spl_col']][1], _self.colorCategoryScale(cat), opacity, _self.rectHeight/2);

					})

				}
			}

		})

	}else{

		_self.axisSpace.selectAll("path.histCloud").style("display", "inline");
		_self.areaSpace.style("display", "inline");

	}
}

RainCloud.prototype.add_box_plot = function(d3_selection, scale_x, y, q_dict, color, opacity, rectHeight) {
	var _self = this;

	var color = color || "black";
	var opacity = opacity || .25;
	var rectHeight = rectHeight || _self.rectHeight;

	/* box */
	d3_selection
		.append("rect")
		.attr("x", scale_x(q_dict['q1']))
		.attr("y", y - rectHeight/2)
		.attr("width", (scale_x(q_dict['q3']) - scale_x(q_dict['q1'])))
		.attr("height", rectHeight)
		.style("fill", color)
		.style("opacity", opacity);

	d3_selection
		.append("line")
		.attr("x1", scale_x(q_dict['r0']))
		.attr("x2", scale_x(q_dict['r1']))
		.attr("y1", y)
		.attr("y2", y)
		.style("stroke", color)
		.style("opacity", opacity);

	d3_selection
		.append("circle")
		.attr("cx", scale_x(q_dict['q2']))
		.attr("cy", y)
		.attr("r", rectHeight*.25)
		.style("stroke", "white")
		.style("fill", color)
		.style("opacity", opacity);

};

/***/ }),

/***/ "./lib/select.js":
/*!***********************!*\
  !*** ./lib/select.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Select: () => (/* binding */ Select)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "webpack/sharing/consume/default/jquery/jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap */ "webpack/sharing/consume/default/bootstrap/bootstrap");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _custom_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./custom.css */ "./lib/custom.css");





window.jQuery = (jquery__WEBPACK_IMPORTED_MODULE_0___default());
window.$ = (jquery__WEBPACK_IMPORTED_MODULE_0___default());

function Select(this_element, category_list, colorCategoryScale, vis_cols, callback1, callback2, callback3){
  var _self = this;

  /* initial setup */
  _self.category_list = category_list;
  _self.colorCategoryScale = colorCategoryScale;
  _self.vis_cols = vis_cols;
  _self.callback1 = callback1;
  _self.callback2 = callback2;
  _self.callback3 = callback3;

  _self.select = d3.select(this_element);

  _self.selectOption = _self.select
    .append("div")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "flex-start")
      .style("align-content", "center");

  _self.selectSplit = _self.select
    .append("div")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "flex-start")
      .style("align-content", "center");

  /* highlight */

  _self.selectOption.append("div")
      .attr("class", "titleDiv")
      .style("height", "40px")
      .style("line-height", "40px")
      .style("vertical-align", "middle")
      .style("padding", "2.5px")
      .style("font-weight", "bold")
    .append("label")
      .style("height", "40px")
      .style("line-height", "40px")
      .style("vertical-align", "middle")
      .style("padding", "2.5px")
      .text("Highlight with Colors: ");

  _self.optionSpace = _self.selectOption.selectAll("div.optionSpace")
        .data(_self.category_list['value'])
      .join("div")
        .attr("class", "optionSpace")
        .style("height", "40px")
        .style("line-height", "40px")
        .style("vertical-align", "middle")
        .style("text-anchor", "left")
        .style("padding", "2.5px");
        
  _self.optionSpace.append("input")
    .attr("type", "checkbox")
    .attr("class", "optionSpace")
    .attr("name", d=>d)
    .style("height", "40px")
    .style("line-height", "40px")
    .style("vertical-align", "middle")
    .style("padding", "2.5px")
    .attr("id", d=>"input-" + d);

  _self.optionSpace.append("label")
    .attr("for", d=>"input-" + d)
    .style("height", "40px")
    .style("line-height", "40px")
    .style("vertical-align", "middle")
    .style("padding", "2.5px")
    .text(d=>d);

  _self.optionSpace.on("click", (event, d)=>{
      
      var cat = Array.from(_self.selectOption.selectAll("input[type=checkbox].optionSpace")._groups[0]).filter(d=>d.checked).map(d=>d.name);
      var spl = Array.from(_self.selectSplit.selectAll("input[type=checkbox].splitSpace")._groups[0]).filter(d=>d.checked).map(d=>d.name);

      var cat_spl_dict = {'cat': cat, 'spl': spl};

      _self.callback1(cat);
      _self.callback2(cat_spl_dict);

    });

  /* split */

  _self.selectSplit.append("div")
      .attr("class", "titleDiv")
      .style("height", "40px")
      .style("line-height", "40px")
      .style("vertical-align", "middle")
      .style("padding", "2.5px")
      .style("font-weight", "bold")
    .append("label")
      .style("height", "40px")
      .style("line-height", "40px")
      .style("vertical-align", "middle")
      .style("padding", "2.5px")
      .text("Split Distributions: ");

  _self.splitSpace = _self.selectSplit.selectAll("div.splitSpace")
        .data([_self.vis_cols['spl_col']])
      .join("div")
        .attr("class", "splitSpace")
        .style("height", "40px")
        .style("line-height", "40px")
        .style("vertical-align", "middle")
        .style("text-anchor", "left")
        .style("padding", "2.5px");
        
  _self.splitSpace.append("input")
    .attr("type", "checkbox")
    .attr("class", "splitSpace")
    .attr("name", d=>d)
    .style("height", "40px")
    .style("line-height", "40px")
    .style("vertical-align", "middle")
    .style("padding", "2.5px")
    .attr("id", d=>"input-" + d);

  _self.splitSpace.append("label")
    .attr("for", d=>"input-" + d)
    .style("height", "40px")
    .style("line-height", "40px")
    .style("vertical-align", "middle")
    .style("padding", "2.5px")
    .text(d=>d);

  _self.splitSpace.on("click", (event, d)=>{
      
      var cat = Array.from(_self.selectOption.selectAll("input[type=checkbox].optionSpace")._groups[0]).filter(d=>d.checked).map(d=>d.name);
      var spl = Array.from(_self.selectSplit.selectAll("input[type=checkbox].splitSpace")._groups[0]).filter(d=>d.checked).map(d=>d.name);

      var cat_spl_dict = {'cat': cat, 'spl': spl};
      _self.callback2(cat_spl_dict);

    });

  if(!_self.vis_cols['model'].get('inputelement')){
    console.log(_self.vis_cols['model'].get('inputelement'));
    return;
  }

  _self.textSpace = _self.select
    .append("div")
      .style("height", "40px")
      .style("line-height", "40px")
      .style("padding", "2.5px")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "flex-start")
      .style("align-content", "center");

  _self.textSpace
    .append("label")
      .style("height", "30px")
      .style("line-height", "30px")
      .style("vertical-align", "middle")
      .style("padding", "2.5px")
      .style("font-weight", "bold")
      .text("Type a sentence (Max Chars: 500): ")

  _self.textSpace
    .append("input")
      .style("width", "50%")
      .style("height", "30px")
      .style("line-height", "30px")
      .style("vertical-align", "middle")
      .attr("type", "text")
      .attr("id", "inputText")
      .attr("name", "inputText")
      .attr("maxlength", 1000);

  _self.textSpace
    .append("button")
      .attr("class", "btn btn-default")
      .style("cursor", "pointer")
      .style("width", "60px")
      .style("height", "30px")
      .style("line-height", "30px")
      .style("vertical-align", "middle")
      .text("Submit")
      .on("click", ()=>{

        var text = d3.select("input#inputText").node().value;
        var hiddenValue = d3.select("input#_hiddenVALUE" + _self.vis_cols["model_id"]).node();
        hiddenValue.value = text;
        hiddenValue.dispatchEvent(new Event('input', { 'bubbles': true }));
        _self.broadcastInputValue();
        
      });

  _self.selectSpinner = _self.textSpace
    .append("div") 
      .attr("class", "spinner")
      .style("position", "absolute")
      .style("right", "50px")
      .style("display", "none")
      .style("border", "4px solid #f3f3f3")
      .style("border-top", "4px solid #3498db")
      .style("border-radius", "50%")
      .style("width", "20px")
      .style("height", "20px")
      .style("-webkit-animation", "spin 2s linear infinite")
      .style("animation", "spin 2s linear infinite")
      .style("line-height", "20px")
      .style("padding", "2.5px")
      .style("justify-content", "center")
      .style("align-items", "flex-start")
      .style("align-content", "center");

}

Select.prototype.broadcastInputValue = async function(){
  var _self = this;

  _self.selectSpinner.style("display", "inline");

  if(Object.keys(_self.vis_cols['model'].get('inputValue')).length == 0){
    await __delay__(2000);
  }

  while (Object.keys(_self.vis_cols['model'].get('inputValue')).length === 0 || _self.vis_cols['model'].get('inputValue')['sent'] != _self.vis_cols['model'].get('textValue'))
    await __delay__(1000);

  _self.callback3(_self.vis_cols['model'].get('inputValue'));
  _self.selectSpinner.style("display", "none");

  function __delay__(timer) {
      return new Promise(resolve => {
          timer = timer || 2000;
          setTimeout(function () {
              resolve();
          }, timer);
      });
  };

}


/***/ }),

/***/ "./lib/table.js":
/*!**********************!*\
  !*** ./lib/table.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Table: () => (/* binding */ Table)
/* harmony export */ });


function Table(this_element, data, screen_width, screen_height, colorCategoryScale, vis_cols, callback){
  var _self = this;
  /* clean up canvas */
  d3.select(this_element)
    .selectAll("*").remove();
  
  /* initial setup */
  _self.data = data;
  _self.keys = vis_cols['other_cols'].concat([vis_cols['cat_col'], vis_cols['sent_col']]).concat(vis_cols['model_cols']);
  _self.colorCategoryScale = colorCategoryScale;
  _self.selected_category = [];
  _self.vis_cols = vis_cols;
  _self.callback = callback;

  /* canvas size */
  _self.screen_width = screen_width;
  _self.screen_height = screen_height;
  _self.margin = {"left": 100, "top": 50, "right": 50, "bottom": 50};
  _self.width = _self.screen_width - _self.margin.left - _self.margin.right;
  _self.height = _self.screen_height - _self.margin.top - _self.margin.bottom;

  /* title */
  d3.select(this_element)
    .append("div")
      .style("text-align", "center")
      .style("font-weight", "bold")
      .text("Table of Sentences");

  _self.table = d3.select(this_element)
        .style("width", _self.screen_width + "px")
        .style("height", _self.screen_height + "px")
        .style("overflow", "hidden auto")
      .append('table')
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .on("mouseleave", (event,d)=>{
          _self.callback(-1);
        });

  _self.table.append("thead").append("tr")
    .selectAll("th")
    .data(_self.keys)
  .join("th")
    .text(d=>d)
    .style("border", "1px black solid")
    .style("padding", "5px")
    .style("background-color", "lightgray")
    .style("font-weight", "bold")
    .style("font-size", "80%")
    .style("text-transform", "uppercase");

  _self.rows = _self.table.append("tbody")
    .selectAll("tr").data(_self.data)
  .join("tr")
    .attr("class", "rows")
    .style("background-color", d=>_self.selected_category.indexOf(d[_self.vis_cols['cat_col']]) >=0 ? d3.rgb(_self.colorCategoryScale(d[_self.vis_cols['cat_col']])).copy({opacity: 0.25}): "white")
    .on("mouseenter", (event, d)=>{
      _self.callback(d["index"]);
    });

  _self.rows.selectAll("td")
    .data(d=>_self.keys.map(k=>d[k]))
    .join("td")
    .style("border", "1px black solid")
    .style("padding", "5px")
    .style("font-size", "12px")
    .text(d=>isNaN(d)? d: Number.isInteger(d)? d: parseFloat(d).toFixed(3))
  
}

Table.prototype.filterBy = function(filtered_data) {
  var _self = this;

  _self.rows = _self.table.select("tbody")
    .selectAll("tr.rows").data(filtered_data, d=>d)
  .join(enter=>{
    return enter.append("tr").attr("class", "rows").selectAll("td")
    .data(d=>_self.keys.map(k=>d[k]))
    .join("td")
    .style("border", "1px black solid")
    .style("padding", "5px")
    .style("font-size", "12px")
    .text(d=>isNaN(d)? d: Number.isInteger(d)? d: parseFloat(d).toFixed(3))
  },
    update=>{
      return update.selectAll("td")
    .data(d=>_self.keys.map(k=>d[k]))
    .join("td")
    .style("border", "1px black solid")
    .style("padding", "5px")
    .style("font-size", "12px")
    .text(d=>isNaN(d)? d: Number.isInteger(d)? d: parseFloat(d).toFixed(3))
    },
    exit=>{
      return exit.remove();
    });

  _self.rows = _self.table.selectAll("tr.rows")
    .on("mouseenter", (event,d)=>{
      _self.callback(d["index"]);
    });

  _self.table.selectAll("tr.rows")
    .style("background-color", d=>_self.selected_category.indexOf(d[_self.vis_cols['cat_col']]) >=0 ? d3.rgb(_self.colorCategoryScale(d[_self.vis_cols['cat_col']])).copy({opacity: 0.25}): "white");

};

Table.prototype.highlight_category = function(filtered_list) {
  var _self = this;
  _self.selected_category = filtered_list.slice();
  _self.rows = _self.table.selectAll("tr.rows")
    .style("background-color", d=>_self.selected_category.indexOf(d[_self.vis_cols['cat_col']]) >=0 ? d3.rgb(_self.colorCategoryScale(d[_self.vis_cols['cat_col']])).copy({opacity: 0.25}): "white");
};

Table.prototype.highlight_item_by_index = function(index){
  var _self = this;
  if(index == -1){
    _self.rows.style("background-color", "white");
    return;
  }
  
  var textContent = _self.data[index][_self.vis_cols['sent_col']];
  var firstHit = true;

  _self.rows = _self.table.selectAll("tr.rows")
      .each(function(d){

        var this_elem = d3.select(this);
        this_elem.style("background-color", "white");

        if(d[_self.vis_cols['sent_col']] == textContent){

          this_elem.style("background-color", d3.rgb(_self.colorCategoryScale(d[_self.vis_cols['cat_col']])).copy({opacity: 0.25}));

          if(firstHit){
            this_elem.node().scrollIntoView({block: "nearest", inline: "nearest"}); // doesn't work in IE or Safari
            firstHit = false;
          }

        }

      })

}

/***/ }),

/***/ "./lib/custom.css":
/*!************************!*\
  !*** ./lib/custom.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_custom_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./custom.css */ "./node_modules/css-loader/dist/cjs.js!./lib/custom.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_custom_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_custom_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"finspector_js","version":"0.1.0","description":"Finspector is designed to help users explore the fairness and bias of foundation models using interactive visualizations.","author":"Bum Chul Kwon","license":"MIT","main":"lib/index.js","repository":{"type":"git","url":"https://github.com/IBM/finspector.git"},"keywords":["jupyter","widgets","ipython","ipywidgets","jupyterlab-extension"],"files":["lib/**/*.js","dist/*.js"],"scripts":{"clean":"rimraf dist/ && rimraf ../finspector/labextension/ && rimraf ../finspector/nbextension","prepublish":"yarn run clean && yarn run build:prod","build":"webpack --mode=development && yarn run build:labextension:dev","build:prod":"webpack --mode=production && yarn run build:labextension","build:labextension":"jupyter labextension build .","build:labextension:dev":"jupyter labextension build --development True .","watch":"webpack --watch --mode=development","test":"echo \\"Error: no test specified\\" && exit 1"},"devDependencies":{"@jupyterlab/builder":"^3.6.3","rimraf":"^2.6.1","webpack":"^5.83.1"},"dependencies":{"@jupyter-widgets/base":"^1.1 || ^2 || ^3 || ^4 || ^6","bootstrap":"^5.2.3","builder":"^5.0.0","jquery":"^3.6.3","jquery_multiselect":"^2.3.9"},"jupyterlab":{"extension":"lib/labplugin","outputDir":"../finspector/labextension","sharedPackages":{"@jupyter-widgets/base":{"bundled":false,"singleton":true}}}}');

/***/ })

}]);
//# sourceMappingURL=lib_index_js.b58cb5e484a15f10710d.js.map