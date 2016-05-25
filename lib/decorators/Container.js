'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decorateContainer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = Container;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _NoOp = require('../components/utils/NoOp');

var _NoOp2 = _interopRequireDefault(_NoOp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var decorateContainer = exports.decorateContainer = function decorateContainer(DecoratedComponent) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var ConnectedDecoratedComponent = (0, _reactIntl.injectIntl)(DecoratedComponent);

    var EnvelopedContainer = function (_Component) {
        _inherits(EnvelopedContainer, _Component);

        function EnvelopedContainer() {
            _classCallCheck(this, EnvelopedContainer);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(EnvelopedContainer).apply(this, arguments));
        }

        _createClass(EnvelopedContainer, [{
            key: 'createDispatch',
            value: function createDispatch(props) {
                var _this2 = this;

                var _dispatch = this.props.dispatch;


                if (!_dispatch) {
                    _dispatch = function dispatch(action) {
                        if (typeof action === 'function') {
                            action(function (action) {
                                // Unwrap all the thunk layers
                                _dispatch(action);
                            }, function () {
                                return props;
                            });
                        } else {
                            _this2.setState(action.payload || {});
                        }
                    };
                }

                return _dispatch;
            }
        }, {
            key: 'calculateIntlProps',
            value: function calculateIntlProps() {
                var messages = this.props.messages;
                var _props$locale = this.props.locale;
                var locale = _props$locale === undefined ? options.locale || 'en' : _props$locale;


                var props = { locale: locale };

                if (typeof messages !== 'undefined') {
                    props.messages = messages;
                }

                return props;
            }
        }, {
            key: 'createConfigProp',
            value: function createConfigProp() {
                return this.context ? this.context.config || {} : {};
            }
        }, {
            key: 'createRBAProp',
            value: function createRBAProp() {
                return this.context ? {
                    policy: this.context.policy || _NoOp2.default,
                    permissions: this.context.permissions || {}
                } || {} : {};
            }
        }, {
            key: 'mergeProps',
            value: function mergeProps() {
                // TODO: Deep merge? Performance on render?
                var contextConfig = this.createConfigProp();
                var rba = this.createRBAProp();

                var propsConfig = this.props ? this.props.config || {} : {};
                var stateConfig = this.state ? this.state.config || {} : {};

                var config = _extends({}, options.config, contextConfig, propsConfig, stateConfig);

                var props = _extends({}, this.props, this.state, {
                    config: config,
                    rba: rba
                });

                return props;
            }
        }, {
            key: 'render',
            value: function render() {
                var intlProps = this.calculateIntlProps();
                var props = this.mergeProps();
                var dispatch = this.createDispatch(props);

                return _react2.default.createElement(
                    _reactIntl.IntlProvider,
                    intlProps,
                    _react2.default.createElement(ConnectedDecoratedComponent, _extends({}, props, { dispatch: dispatch }))
                );
            }
        }], [{
            key: 'propTypes',
            get: function get() {
                return options.propTypes;
            }
        }, {
            key: 'contextTypes',
            get: function get() {
                return {
                    policy: _react.PropTypes.func,
                    permissions: _react.PropTypes.object,
                    config: _react.PropTypes.object
                };
            }
        }]);

        return EnvelopedContainer;
    }(_react.Component);

    // Object.defineProperty(EnvelopedContainer, 'name', { writable: true });
    // EnvelopedContainer.name = DecoratedComponent.name + 'Container';
    // Object.defineProperty(EnvelopedContainer, 'name', { writable: false });
    EnvelopedContainer.Component = DecoratedComponent;

    return EnvelopedContainer;
};

function Container() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    // `options` is the class being decorated
    var result = void 0;

    if (typeof options !== 'function') {
        result = function result(DecoratedComponent) {
            return decorateContainer(DecoratedComponent, options);
        };
    } else {
        result = decorateContainer(options);
    }

    return result;
}
