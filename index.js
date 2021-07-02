const debug = require('debug')('undo-buffer-angular:main');
const UndoBuffer = require('undo-buffer');

angular
	.module('undo-buffer-angular', [])
	.provider('$undoBuffer', function() {

		const $undoBuffer = function($rootScope) {
			this._undoBuffer;
			this.watching = true;

			this.add = doc => {
				debug('add', doc);
				// New instance tracking each object added.
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
				$rootScope.$watch(scope => doc, (newVal, oldVal, scope) => {
					if (!this.watching) return;

					this._undoBuffer.update(newVal, oldVal);
				}, true);
			};

			this.undo = doc => this._undoBuffer.undo(doc);
			this.redo = doc => this._undoBuffer.redo(doc);
		};

		/**
		* Return a new instance for each controller
		*/
		return {
			$get: function($rootScope) {
				return new $undoBuffer($rootScope);
			},
		};
	});
