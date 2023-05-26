"use strict";

import $ from 'jquery';
import 'bootstrap';
import './custom.css'
window.jQuery = $;
window.$ = $;

export function Select(this_element, category_list, colorCategoryScale, vis_cols, callback1, callback2, callback3){
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
