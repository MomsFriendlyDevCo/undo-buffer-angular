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
			/**
			 * Deeply watch variable for changes
			 *
			 * @type {method}
			 * @param {Object} doc Object to observe for changes
			 */
			this.watch = doc => {
				const undoBuffer = new UndoBuffer({
					/*
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
					*/
				});

				// TODO: Is a method needed to destroy and unwatch or will Angular handle it?
				$rootScope.$watch(scope => doc, (newVal, oldVal, scope) => {
					undoBuffer.update(newVal, oldVal);
				}, true);

				return undoBuffer;
			};
		};

		/**
		* Return a new instance for each controller
		*/
		// TODO: This could be a singleton, we're returning new instances from watch() anyway.
		return {
			$get: function($rootScope) {
				return new $undoBuffer($rootScope);
			},
		};
	});
