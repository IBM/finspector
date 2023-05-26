"use strict";

export function RainCloud(this_element, data, screen_width, screen_height,colorCategoryScale, vis_cols, callback){
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