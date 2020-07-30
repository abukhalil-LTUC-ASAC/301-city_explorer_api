DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    country_code VARCHAR(3)
  );

INSERT INTO locations
(search_query, formatted_query, latitude, longitude, country_code)
VALUES ('amman', 'Amman, 11181, Jordan', 31.9515694, 35.9239625, 'JO');
