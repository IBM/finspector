import ipywidgets as widgets
from traitlets import Unicode, Dict, List, Bool, validate, TraitError
from ._version import NPM_PACKAGE_RANGE, __version__
import pandas as pd

# See js/lib/example.js for the frontend counterpart to this file.

@widgets.register
class Visualize(widgets.DOMWidget):
    """An example widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode('VisualizationView').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('VisualizationModel').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('finspector_js').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('finspector_js').tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    value = Unicode('').tag(sync=True)
    inputValue = Dict().tag(sync=True)
    textValue = Unicode('').tag(sync=True)
    inputelement = Bool().tag(sync=True)
    props = Dict().tag(sync=True)
    data = List().tag(sync=True)

    embedding = List().tag(sync=True)
    embbool = Bool().tag(sync=True)
    sent_col = Unicode('sent').tag(sync=True)
    cat_col = Unicode('bias_type').tag(sync=True)
    spl_col = Unicode('stereo_type').tag(sync=True)
    model_cols = List(['bert', 'roberta', 'albert']).tag(sync=True)
    other_cols = List(['sent_index']).tag(sync=True)

    def __init__(self, data, embedding=None, models=None, score_fn=None, sent_col='sent', cat_col='bias_type', spl_col='stereo_type', model_cols=['bert', 'roberta', 'albert'], other_cols=['sent_index'], **kwargs):
        super().__init__()

        self.component = self.__class__.__name__

        try:
            assert(type(data) == pd.core.frame.DataFrame)
        except AssertionError:
            raise TraitError("Invalid data type, expected pandas DataFrame")
            return

        self.data = list(data.T.to_dict().values())
        self.models = models
        self.score_fn = score_fn
        self.inputelement = False

        if embedding == None:
            self.embedding = []
        else:
            self.embedding = embedding

        self.embbool = False
        self.sent_col = sent_col
        self.cat_col = cat_col
        self.spl_col = spl_col
        self.model_cols = model_cols
        self.other_cols = other_cols

        self.inputValue = {}
        self.props = {}
        self.value = ''
        self.textValue = ''

        self.observe(self.on_value_change, names='value')
        if self.models != None and self.score_fn != None:
            self.observe(self.on_value_change, names='textValue')
            self.inputelement = True

        if len(self.embedding) > 0:
            self.embbool = True
        self.observe(self.on_input_value_change, names='inputValue')

        # self.textValue = 'bfa696c7add346a3a56f478c0f3c6d7d'
        # self.on_value_change('bfa696c7add346a3a56f478c0f3c6d7d')



    # def update_prop(self, prop_name, prop_value):
    #     self.props = {**self.props, prop_name: prop_value}

    def on_value_change(self, value):
        self.inputValue = {}
        self.inputValue[self.sent_col] = self.textValue
        for m in self.models:
            self.inputValue[m['name']] = self.score_fn(self.textValue, m)

    def on_input_value_change(self, value):
        # self.props = value.new
        print(value.new)