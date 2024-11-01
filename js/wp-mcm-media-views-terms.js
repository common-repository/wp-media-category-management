window.wp = window.wp || {};

(function($){

	wp.media.view.AttachmentFilters.Taxonomy = wp.media.view.AttachmentFilters.extend({	
	
		tagName:   'select',

		createFilters: function() {
			var filters = {};
			var that = this;

			_.each( that.options.termList || {}, function( term, key ) {
				var term_id = term['term_id'];
				var term_name = $("<div/>").html(term['term_name']).text();
				filters[ term_id ] = {
					text: term_name,
					priority: key+2
				};
				filters[term_id]['props'] = {};
				filters[term_id]['props'][that.options.taxonomy] = term_id;
			});

			filters.all = {
				text: that.options.termListTitle,
				priority: 1
			};
			filters['all']['props'] = {};
			filters['all']['props'][that.options.taxonomy] = null;

			this.filters = filters;
		}
	});


	/**
	 * Extend and override wp.media.view.AttachmentsBrowser to include our new filter
	 */
	var curAttachmentsBrowser = wp.media.view.AttachmentsBrowser;

	wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({

		createToolbar: function() {

			var filters = this.options.filters;

			// Make sure to load the original toolbar
			curAttachmentsBrowser.prototype.createToolbar.call(this);

			var that = this,
			i = 1;

			$.each(mcm_taxonomies, function(taxonomy, values) 
			{
				if ( values.mcm_terms_list && filters )
				{
					that.toolbar.set( taxonomy+'-filter', new wp.media.view.AttachmentFilters.Taxonomy({
						controller: that.controller,
						model: that.collection.props,
						priority: -80 + 10*i++,
						taxonomy: taxonomy, 
						termList: values.mcm_terms_list,
						termListTitle: values.term_list_title,
						className: 'attachment-filters'
					}).render() );
				}
			});
		}
	});

})( jQuery );