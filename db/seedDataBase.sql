BEGIN;

-- drop all the tables and start fresh for this demo, in a real app we would want to deal with this through migrations
DROP VIEW IF EXISTS apis_merged, end_points_merged;
DROP TABLE IF EXISTS apis, actions, end_points;

-- Create Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS apis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(40),
    created DATE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS end_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(40),
    http_verb VARCHAR(4),
    path varchar(40),
    api_id UUID NOT NULL REFERENCES apis,
    created DATE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(40),
    action_type VARCHAR(40),
    end_point_id UUID NOT NULL REFERENCES end_points,
    previus_action UUID REFERENCES actions,
    attributes jsonb
);

-- create Views
CREATE VIEW apis_merged AS
    SELECT
        apis.*,
        end_points.id AS end_point_id,
        end_points.name AS end_point_name,
        end_points.http_verb AS end_point_http_verb,
        end_points.path AS end_point_path,
        end_points.created AS end_point_created,
        actions.id AS action_id,
        actions.name AS action_name,
        actions.action_type AS action_type,
        actions.attributes AS action_attributes,
        actions.previus_action AS previus_action_id,
        prevAction.name AS previus_action_name,
        prevAction.action_type AS previus_action_type,
        prevAction.attributes AS previus_action_attributes
    FROM apis
    INNER JOIN end_points
        ON apis.id = end_points.api_id
    LEFT OUTER JOIN actions
        ON end_points.id = actions.end_point_id
    LEFT OUTER JOIN actions AS prevAction
        ON actions.previus_action = prevAction.id;

CREATE VIEW end_points_merged AS
    SELECT
        end_points.id AS end_point_id,
        end_points.name AS end_point_name,
        end_points.http_verb AS end_point_http_verb,
        end_points.path AS end_point_path,
        end_points.created AS end_point_created,
        actions.id AS action_id,
        actions.name AS action_name,
        actions.action_type AS action_type,
        actions.attributes AS action_attributes,
        actions.previus_action AS previus_action_id,
        prevAction.name AS previus_action_name,
        prevAction.action_type AS previus_action_type,
        prevAction.attributes AS previus_action_attributes
    FROM end_points
    INNER JOIN actions
        ON end_points.id = actions.end_point_id
    LEFT OUTER JOIN actions AS prevAction
        ON actions.previus_action = prevAction.id;

-- Insert Test Data
WITH new_api AS (
    INSERT INTO apis (name) VALUES ('super real company assessment api') RETURNING id
), new_end_point AS (
    INSERT INTO end_points (name, http_verb, path, api_id) VALUES('create assessment', 'post', 'assessments', (SELECT id FROM new_api)) RETURNING id
), other_end_point AS(
    INSERT INTO end_points (name, http_verb, path, api_id) VALUES('update assessments', 'put', 'assessment', (SELECT id FROM new_api)) RETURNING id
), start_action AS (
    INSERT INTO actions
        (name, action_type, end_point_id, attributes)
        VALUES(
            'validate input',
            'custom-function',
            (SELECT id FROM new_end_point), 
            '{ "code": "if(!req.params.foo) return airComplete(null, { status: false }) else airComplete(null, { status: true });", "x": 54, "y": 20 }'
        ) RETURNING id
), branch_action AS (
     INSERT INTO actions
     (name, action_type, end_point_id, previus_action, attributes)
     VALUES(
         'branch',
         'branch',
         (SELECT id FROM new_end_point),
         (SELECT id FROM start_action),
         '{ "x": 100, "y": 20 }'
    ) RETURNING id
), db_write_action AS (
    -- right branch
    INSERT INTO actions
        (name, action_type, end_point_id, previus_action, attributes)
        VALUES(
            'store data',
            'db-query',
            (SELECT id FROM new_end_point),
            (SELECT id FROM branch_action),
            '{ "x": 200, "y": 20, "connection": "someID", "table": "assessment", "expects": ["name", "description"], "queryType": "INSERT" }'
        ) RETURNING id
), success_action AS (
    INSERT INTO actions
        (name, action_type, end_point_id, previus_action, attributes)
        VALUES(
            'success function',
            'custom function',
            (SELECT id FROM new_end_point),
            (SELECT id FROM db_write_action),
            '{ "x": 300, "y": 20, "code": "airComplete(null, { status: \"success\"})" }'
        ) RETURNING id
), error_action AS ( 
    -- left branch
    INSERT INTO actions
        (name, action_type, end_point_id, previus_action, attributes)
        VALUES(
            'return validation error',
            'custom-function',
            (SELECT id FROM new_end_point), 
            (SELECT id FROM branch_action),
            '{ "x": 400, "y": 20, "code": "airComplete(\"invalid input\")" }'
        ) RETURNING id
), end_point_get AS (
    INSERT INTO end_points
        (name, http_verb, path, api_id)
        VALUES('get all assessments', 'get', 'assessments', (SELECT id FROM new_api)) RETURNING id
)
INSERT INTO actions
    (name, action_type, end_point_id, previus_action, attributes)
    VALUES(
        'read data',
        'db-query',
        (SELECT id FROM end_point_get),
        null,
        '{ "x": 100, "y": 20, "connection": "someID", "table": "assessment", "expects": [], "queryType": "SELECT" }'
    );
END;
