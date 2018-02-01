// tells massive js how to decompose our view into a java script object

module.exports = {
    decompose: {
        pk: 'id',
        columns: {
            id: 'id',
            name: 'name',
            create: 'created'
        },
        end_points: {
            pk: 'end_point_id',
            array: true,
            columns: {
                end_point_id: 'id',
                end_point_name: 'name',
                end_point_http_verb: 'http_verb',
                end_point_path: 'path',
                end_point_created: 'created'
            },
            actions: {
                pk: 'action_id',
                columns: {
                    action_id: 'id',
                    action_name: 'name',
                    action_type: 'type',
                    action_attributes: 'attributes',
                    action_previus_action_id: 'previus_action_id'
                },
                previus_action: {
                    pk: 'previus_action_id',
                    columns: {
                        previus_action_id: 'id',
                        previus_action_name: 'name',
                        previus_action_type: 'action_type',
                        previus_action_attributes: 'attributes'
                    },
                    array: true
                },
                array: true
            }
        }
    }
};
