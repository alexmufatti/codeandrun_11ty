/**
 * Gutenberg meta fields per Activity custom post type
 * Aggiunge training_types, training_feelings e places nel pannello laterale
 * Con selettori emoji intelligenti
 */

(function (wp) {
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { TextControl, Button, ButtonGroup, PanelRow, BaseControl } = wp.components;
    const { useSelect, useDispatch } = wp.data;
    const { createElement: el, Fragment, useState } = wp.element;

    // Emoji disponibili
    const TRAINING_TYPES = ['🟢', '🔴', '🟡'];
    const TRAINING_FEELINGS = ['😀', '🙂', '😐', '🙁', '😭', '🏁', '🫤', '😞'];

    // Componente per gestire una lista di allenamenti
    const TrainingListManager = function({ label, types, feelings, onUpdate }) {
        // Parse i valori esistenti
        const typesArray = types ? types.split(',').map(s => s.trim()).filter(Boolean) : [];
        const feelingsArray = feelings ? feelings.split(',').map(s => s.trim()).filter(Boolean) : [];

        const maxTrainings = Math.max(typesArray.length, feelingsArray.length, 1);

        const addTraining = function() {
            onUpdate([...typesArray, '🟢'], [...feelingsArray, '😀']);
        };

        const removeTraining = function(index) {
            const newTypes = [...typesArray];
            const newFeelings = [...feelingsArray];
            newTypes.splice(index, 1);
            newFeelings.splice(index, 1);
            onUpdate(newTypes, newFeelings);
        };

        const updateType = function(index, emoji) {
            const newTypes = [...typesArray];
            newTypes[index] = emoji;
            onUpdate(newTypes, feelingsArray);
        };

        const updateFeeling = function(index, emoji) {
            const newFeelings = [...feelingsArray];
            newFeelings[index] = emoji;
            onUpdate(typesArray, newFeelings);
        };

        return el(
            BaseControl,
            { label: label, key: 'training-list' },
            [
                el('div', { key: 'trainings', style: { marginBottom: '10px' } },
                    Array.from({ length: maxTrainings }).map(function(_, index) {
                        const currentType = typesArray[index] || '';
                        const currentFeeling = feelingsArray[index] || '';

                        return el('div', {
                            key: index,
                            style: {
                                marginBottom: '15px',
                                padding: '10px',
                                background: '#f0f0f0',
                                borderRadius: '4px'
                            }
                        }, [
                            el('div', {
                                key: 'header',
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }
                            }, [
                                el('strong', { key: 'label' }, 'Training ' + (index + 1)),
                                el(Button, {
                                    key: 'remove',
                                    isDestructive: true,
                                    isSmall: true,
                                    onClick: function() { removeTraining(index); },
                                }, '✕')
                            ]),

                            el('div', { key: 'type', style: { marginBottom: '8px' } }, [
                                el('label', {
                                    key: 'label',
                                    style: {
                                        display: 'block',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        marginBottom: '4px',
                                        textTransform: 'uppercase'
                                    }
                                }, 'Type'),
                                el(ButtonGroup, { key: 'buttons' },
                                    TRAINING_TYPES.map(function(emoji) {
                                        return el(Button, {
                                            key: emoji,
                                            isPrimary: currentType === emoji,
                                            isSecondary: currentType !== emoji,
                                            style: { fontSize: '18px', padding: '8px 12px' },
                                            onClick: function() { updateType(index, emoji); },
                                        }, emoji);
                                    })
                                )
                            ]),

                            el('div', { key: 'feeling' }, [
                                el('label', {
                                    key: 'label',
                                    style: {
                                        display: 'block',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        marginBottom: '4px',
                                        textTransform: 'uppercase'
                                    }
                                }, 'Feeling'),
                                el('div', { key: 'buttons', style: { display: 'flex', flexWrap: 'wrap', gap: '4px' } },
                                    TRAINING_FEELINGS.map(function(emoji) {
                                        return el(Button, {
                                            key: emoji,
                                            isPrimary: currentFeeling === emoji,
                                            isSecondary: currentFeeling !== emoji,
                                            style: { fontSize: '18px', padding: '8px 12px' },
                                            onClick: function() { updateFeeling(index, emoji); },
                                        }, emoji);
                                    })
                                )
                            ])
                        ]);
                    })
                ),
                el(Button, {
                    key: 'add',
                    isPrimary: true,
                    isSmall: true,
                    onClick: addTraining,
                }, '+ Add Training')
            ]
        );
    };

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

        const handleTrainingsUpdate = function(newTypes, newFeelings) {
            editPost({
                meta: {
                    training_types: newTypes.join(', '),
                    training_feelings: newFeelings.join(', ')
                }
            });
        };

        return el(
            PluginDocumentSettingPanel,
            {
                name: 'activity-training-details',
                title: 'Training Details',
                className: 'activity-training-details-panel',
            },
            [
                el(TrainingListManager, {
                    key: 'trainings',
                    label: 'Trainings',
                    types: trainingTypes,
                    feelings: trainingFeelings,
                    onUpdate: handleTrainingsUpdate
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
