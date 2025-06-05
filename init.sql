CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO people (name) VALUES
  ('Alice'),
  ('Bob'),
  ('Charlie');

-- Tabela para controle de estoque de canecas personalizadas
CREATE TABLE IF NOT EXISTS mugs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0
);

-- Exemplo de dados iniciais
INSERT INTO mugs (name, description, stock) VALUES
  ('Caneca Azul', 'Caneca personalizada azul', 10),
  ('Caneca Vermelha', 'Caneca personalizada vermelha', 5);
