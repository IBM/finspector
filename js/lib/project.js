"use strict";

export function Project(this_element, data, screen_width, screen_height, vis_cols, colorCategoryScale, callback1, callback2){
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