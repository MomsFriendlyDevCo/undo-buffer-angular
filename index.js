const debug = require('debug')('undo-buffer-angular:main');
const UndoBuffer = require('undo-buffer');

angular
	.module('undo-buffer-angular', [])
	.provider('$undoBuffer', function() {

		/**
		 * $undoBuffer
		 *
		 * @type {class}
		 * @param {Object} $rootScope Dependancy injection from AngularJS
		 */
		const $undoBuffer = function($rootScope) {
			this._undoBuffer;

			/**
			 * Deeply watch variable for changes
			 *
			 * @type {method}
			 * @param {Object} doc Object to observe for changes
			 */
			this.add = doc => {
				debug('add', doc);
				// New instance tracking each object added {{{
				this._undoBuffer = new UndoBuffer({
					objectHash: function(d, i) {
						// Allow matching for arrays of objects by object key rather than array index.
						if (d && Object.prototype.hasOwnProperty.call(d, '_id')) {
							return d._id;
						} else if (d && Object.prototype.hasOwnProperty.call(d, 'id')) {
							return d.id;
						} else {
							return '$$index:' + i;
						}
					},
				});
				// }}}

				$rootScope.$watch(scope => doc, (newVal, oldVal, scope) => {
					this._undoBuffer.update(newVal, oldVal);
				}, true);
			};

			/**
			 * Execute an undo action
			 *
			 * @type {method}
			 * @param {Object} doc The current state to patch
			 */
			this.undo = doc => this._undoBuffer.undo(doc);

			/**
			 * Execute a redo action
			 *
			 * @type {method}
			 * @param {Object} doc The current state to patch
			 */
			this.redo = doc => this._undoBuffer.redo(doc);
		};

		/**
		 * Execute and undo action
		 * Passes value straight through to underlying instance
		 *
		 * @type {property}
		 * @return {Boolean} Whether or not changes to object will be handled
		 */
		Object.defineProperty($undoBuffer.prototype, 'enabled', {
			get: function() {
				return this._undoBuffer.enabled;
			},
			set: function(val) {
				this._undoBuffer.enabled = val;
			},
		});

		/**
		* Return a new instance for each controller
		*/
		return {
			$get: function($rootScope) {
				return new $undoBuffer($rootScope);
			},
		};
	});
