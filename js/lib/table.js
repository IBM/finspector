"use strict";

export function Table(this_element, data, screen_width, screen_height, colorCategoryScale, vis_cols, callback){
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