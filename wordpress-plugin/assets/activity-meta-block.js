/**
 * Blocco Gutenberg per visualizzare Activity Metadata
 * Mostra training types, feelings e places nel contenuto del post
 */

(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { useSelect } = wp.data;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, ToggleControl } = wp.components;

    registerBlockType('codeandrun/activity-meta', {
        title: 'Activity Metadata',
        icon: 'chart-line',
        category: 'widgets',
        attributes: {
            showTypes: {
                type: 'boolean',
                default: true,
            },
            showFeelings: {
                type: 'boolean',
                default: true,
            },
            showPlaces: {
                type: 'boolean',
                default: true,
            },
            styleVariant: {
                type: 'string',
                default: 'default', // 'default', 'minimal', 'dark'
            },
        },
        supports: {
            align: ['wide', 'full'],
        },

        edit: function (props) {
            const { attributes, setAttributes } = props;
            const { showTypes, showFeelings, showPlaces, styleVariant } = attributes;

            // Recupera i metadata dal post corrente (se disponibili)
            const postData = useSelect(function (select) {
                const editor = select('core/editor');
                // Nell'editor del tema, getEditedPostAttribute potrebbe non essere disponibile
                if (!editor || !editor.getEditedPostAttribute) {
                    return { meta: {}, postType: null };
                }
                return {
                    meta: editor.getEditedPostAttribute('meta') || {},
                    postType: editor.getCurrentPostType()
                };
            }, []);

            const trainingTypes = postData.meta.training_types || '';
            const trainingFeelings = postData.meta.training_feelings || '';
            const places = postData.meta.places || '';
            const isInThemeEditor = !postData.postType;

            // Parse emoji
            const typesArray = trainingTypes ? trainingTypes.split(',').map(s => s.trim()) : [];
            const feelingsArray = trainingFeelings ? trainingFeelings.split(',').map(s => s.trim()) : [];

            // Crea coppie type-feeling per ogni allenamento
            const maxTrainings = Math.max(typesArray.length, feelingsArray.length);
            const trainingPairs = [];
            for (let i = 0; i < maxTrainings; i++) {
                trainingPairs.push({
                    type: typesArray[i] || '',
                    feeling: feelingsArray[i] || ''
                });
            }

            // Classe CSS basata sulla variante
            let metaClass = 'activity-meta';
            if (styleVariant === 'minimal') metaClass += ' activity-meta--minimal';
            if (styleVariant === 'dark') metaClass += ' activity-meta--dark';

            return el(
                Fragment,
                {},
                [
                    // Pannello impostazioni nella sidebar
                    el(
                        InspectorControls,
                        { key: 'inspector' },
                        el(
                            PanelBody,
                            { title: 'Display Settings', initialOpen: true },
                            [
                                el(ToggleControl, {
                                    key: 'show-types',
                                    label: 'Show Training Types',
                                    checked: showTypes,
                                    onChange: (value) => setAttributes({ showTypes: value }),
                                }),
                                el(ToggleControl, {
                                    key: 'show-feelings',
                                    label: 'Show Training Feelings',
                                    checked: showFeelings,
                                    onChange: (value) => setAttributes({ showFeelings: value }),
                                }),
                                el(ToggleControl, {
                                    key: 'show-places',
                                    label: 'Show Places',
                                    checked: showPlaces,
                                    onChange: (value) => setAttributes({ showPlaces: value }),
                                }),
                            ]
                        )
                    ),
                    // Anteprima del blocco nell'editor
                    el(
                        'div',
                        {
                            key: 'block-preview',
                            className: metaClass,
                            style: { margin: '20px 0' }
                        },
                        [
                            // Mostra le coppie type-feeling
                            (showTypes || showFeelings) && trainingPairs.length > 0 && el(
                                'div',
                                { key: 'trainings', className: 'activity-meta__item activity-meta__trainings' },
                                [
                                    el('span', { key: 'label', className: 'activity-meta__label' }, 'Trainings'),
                                    el(
                                        'div',
                                        { key: 'value', className: 'activity-meta__value training-pairs' },
                                        trainingPairs.map((pair, i) => {
                                            const hasBoth = pair.type && pair.feeling;
                                            const hasOne = pair.type || pair.feeling;
                                            if (!hasOne) return null;

                                            return el(
                                                'div',
                                                {
                                                    key: i,
                                                    className: 'training-pair',
                                                    style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }
                                                },
                                                [
                                                    showTypes && pair.type && el('span', { key: 'type', className: 'training-type-item' }, pair.type),
                                                    hasBoth && el('span', { key: 'separator', style: { opacity: 0.3, fontSize: '0.8em' } }, '+'),
                                                    showFeelings && pair.feeling && el('span', { key: 'feeling', className: 'training-feeling-item' }, pair.feeling),
                                                ]
                                            );
                                        })
                                    ),
                                ]
                            ),
                            showPlaces && places && el(
                                'div',
                                { key: 'places', className: 'activity-meta__item' },
                                [
                                    el('span', { key: 'label', className: 'activity-meta__label' }, 'Places'),
                                    el('div', { key: 'value', className: 'activity-meta__value places' }, places),
                                ]
                            ),
                            // Messaggio se non ci sono metadata
                            !trainingTypes && !trainingFeelings && !places && el(
                                'div',
                                {
                                    key: 'empty',
                                    style: {
                                        padding: '20px',
                                        background: '#f0f0f0',
                                        borderRadius: '8px',
                                        textAlign: 'center'
                                    }
                                },
                                [
                                    el('p', {
                                        key: 'icon',
                                        style: { fontSize: '48px', margin: '0 0 10px 0' }
                                    }, '📊'),
                                    el('p', {
                                        key: 'msg',
                                        style: { fontStyle: 'italic', color: '#666', margin: 0 }
                                    }, isInThemeEditor
                                        ? '🎨 Activity metadata will be displayed here (when viewing an Activity post)'
                                        : '⚠️ No metadata found. Add training types, feelings or places in the sidebar panel.'
                                    ),
                                ]
                            ),
                        ]
                    ),
                ]
            );
        },

        save: function (props) {
            // Il blocco è dinamico, il rendering viene fatto in PHP
            return null;
        },
    });
})(window.wp);
