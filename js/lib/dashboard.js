"use strict";

export function DashBoard(flatData, vis_cols){
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