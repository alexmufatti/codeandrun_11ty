/**
 * Gutenberg meta fields per Activity custom post type
 * Aggiunge training_types, training_feelings e places nel pannello laterale
 */

(function (wp) {
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { TextControl } = wp.components;
    const { useSelect, useDispatch } = wp.data;
    const { createElement: el } = wp.element;

    const ActivityMetaFields = function () {
        const postType = useSelect(function (select) {
            return select('core/editor').getCurrentPostType();
        }, []);

        const trainingTypes = useSelect(function (select) {
            return select('core/editor').getEditedPostAttribute('meta')?.training_types || '';
        }, []);

        const trainingFeelings = useSelect(function (select) {
            return select('core/editor').getEditedPostAttribute('meta')?.training_feelings || '';
        }, []);

        const places = useSelect(function (select) {
            return select('core/editor').getEditedPostAttribute('meta')?.places || '';
        }, []);

        const { editPost } = useDispatch('core/editor');

        // Mostra solo per post type 'activity'
        if (postType !== 'activity') {
            return null;
        }

        return el(
            PluginDocumentSettingPanel,
            {
                name: 'activity-training-details',
                title: 'Training Details',
                className: 'activity-training-details-panel',
            },
            [
                el(TextControl, {
                    key: 'training-types',
                    label: 'Training Types',
                    help: 'Emoji separati da virgola (es: 🟢,🔴,🟢)',
                    value: trainingTypes,
                    onChange: function (value) {
                        editPost({ meta: { training_types: value } });
                    },
                }),
                el(TextControl, {
                    key: 'training-feelings',
                    label: 'Training Feelings',
                    help: 'Emoji separati da virgola (es: 😭,😀,🙂)',
                    value: trainingFeelings,
                    onChange: function (value) {
                        editPost({ meta: { training_feelings: value } });
                    },
                }),
                el(TextControl, {
                    key: 'places',
                    label: 'Places',
                    help: 'Luoghi separati da virgola',
                    value: places,
                    onChange: function (value) {
                        editPost({ meta: { places: value } });
                    },
                }),
            ]
        );
    };

    registerPlugin('codeandrun-activity-meta', {
        render: ActivityMetaFields,
        icon: 'chart-line',
    });
})(window.wp);
