\echo 'Delete and recreate fantasy-assistant db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fantasy_assistant;
CREATE DATABASE fantasy_assistant;
\connect fantasy_assistant

\i fantasy-assistant-schema.sql

\echo 'Delete and recreate fantasy_assistant_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fantasy_assistant_test;
CREATE DATABASE fantasy_assistant_test;
\connect fantasy_assistant_test

\i fantasy-assistant-schema.sql