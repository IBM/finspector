import {VisualizationModel, VisualizationView, version} from './index';
import {IJupyterWidgetRegistry} from '@jupyter-widgets/base';

export const helloWidgetPlugin = {
  id: 'finspector_js:plugin',
  requires: [IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'finspector_js',
          version: version,
          exports: { VisualizationModel, VisualizationView }
      });
  },
  autoStart: true
};

export default helloWidgetPlugin;
