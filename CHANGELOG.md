# Changelog

## 0.1.0

### Features
- **Core Engine**: `Seeder` class with Mulberry32 PRNG for deterministic seeding.
- **Primitives**: `float(min, max)`, `int(min, max)`, `bool(probability)`.
- **Collections**: `pick(array)`, `sample(array, count)`, `shuffle(array)`.
- **Identity**: `uuid()`, `id(length)`.
- **Extensibility**: `use(dataset)` to load custom or bundled data.
- **Micro-Seeder Architecture**: Granular JSON data files for independent loading.

### Seeds
Included standard seed datasets organized by category in `seeds/`:

- **Commerce** (`seeds/commerce/`)
  - `products.json`: Products, departments, and marketing adjectives.
  - `companies.json`: Corporate names, suffixes, and buzzwords.

- **Design** (`seeds/design/`)
  - `colors.json`: CSS color names and hex codes.

- **Geo** (`seeds/geo/`)
  - `cities.json`: List of major cities.
  - `countries.json`: List of countries.

- **Nature** (`seeds/nature/`)
  - `animals.json`: Common animals and types.

- **People** (`seeds/people/`)
  - `names.json`: First names and last names.
  - `users.json`: Multi-dimensional complex user objects.

- **Tech** (`seeds/tech/`)
  - `stack.json`: Programming languages, frameworks, and technical terms.
  