import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';
import * as d3 from "d3";
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import 'bootstrap';
// import 'jquery_multiselect';


var ls = require('./lasso.js')
var db = require('./dashboard.js')
var rc = require('./raincloud.js')
var tb = require('./table.js')
var sl = require('./select.js')
var eb = require('./project.js')
window.d3 = d3;
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

export class VisualizationModel extends DOMWidgetModel {
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

export class VisualizationView extends DOMWidgetView {
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
        d3.select(this.el).selectAll("*:not(#_hiddenVALUE" + this.model.model_id + ")").remove();

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
